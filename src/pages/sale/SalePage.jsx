import React, { useEffect, useState } from 'react';
import {
  Typography, Paper, Grid, Button, MenuItem, Select, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Autocomplete
} from '@mui/material';
import axiosInstance from '../../api/api';
import { useNavigate } from 'react-router-dom';

const SalesPage = ({ authUser }) => {
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState({});
  const [orderedItems, setOrderedItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [userId] = useState(authUser);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [status, setStatus] = useState('Completed');
  const [isLoading, setIsLoading] = useState(false);

  const [globalDiscountType, setGlobalDiscountType] = useState('percent');
  const [globalDiscountValue, setGlobalDiscountValue] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0);

  const navigate = useNavigate();

  // ✅ ROUND FUNCTION
  const round2 = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [productsRes, inventoryRes] = await Promise.all([
      axiosInstance.get('/products'),
      axiosInstance.get('/inventories')
    ]);

    setProducts(productsRes.data.data);

    const inventoryMap = {};
    inventoryRes.data.data.forEach(item => {
      inventoryMap[item.product._id] = item.quantity;
    });
    setInventory(inventoryMap);
  };

  const getCostPriceFIFO = async (productId, qty) => {
    try {
      const res = await axiosInstance.get(`/stocks/fifo-cost`, {
        params: { productId, quantity: qty }
      });
      return round2(res.data.costPrice);
    } catch (error) {
      console.error(error);
      return 0;
    }
  };

  // ✅ GLOBAL DISCOUNT APPLY
  const applyGlobalDiscount = (value) => {
    const val = parseFloat(value) || 0;
    setGlobalDiscountValue(val);

    const updatedItems = orderedItems.map(item => {
      const total = item.sellingPrice * item.quantity;

      let discountAmount = 0;
      let discountPercent = 0;

      if (globalDiscountType === "percent") {
        discountPercent = Math.max(0, Math.min(100, val));
        discountAmount = round2((total * discountPercent) / 100);
      } else {
        discountAmount = Math.max(0, val);
        discountPercent = total > 0 ? round2((discountAmount / total) * 100) : 0;
      }

      const finalTotal = round2(total - discountAmount);

      return {
        ...item,
        discountType: globalDiscountType,
        discountValue: val,
        discountPercent,
        discountAmount,
        finalTotal,
        profit: round2(finalTotal - (item.costPrice * item.quantity))
      };
    });

    setOrderedItems(updatedItems);
  };

  // ✅ ADD ITEM
  const addItem = async () => {
    if (!selectedProduct || quantity < 1) return alert("Select product & quantity");

    const availableQty = inventory[selectedProduct._id] || 0;
    if (availableQty < quantity) return alert("Not enough stock");

    const costPrice = await getCostPriceFIFO(selectedProduct._id, quantity);
    const sellingPrice = round2(selectedProduct.price);
    const total = round2(sellingPrice * quantity);

    let discountAmount = 0;
    let discountPercent = 0;

    if (globalDiscountType === "percent") {
      discountPercent = globalDiscountValue;
      discountAmount = round2((total * discountPercent) / 100);
    } else {
      discountAmount = globalDiscountValue;
      discountPercent = total > 0 ? round2((discountAmount / total) * 100) : 0;
    }

    const finalTotal = round2(total - discountAmount);

    const newItem = {
      product: selectedProduct,
      quantity,
      sellingPrice,
      costPrice,
      discountType: globalDiscountType,
      discountValue: globalDiscountValue,
      discountPercent,
      discountAmount,
      finalTotal,
      profit: round2(finalTotal - (costPrice * quantity))
    };

    setOrderedItems([...orderedItems, newItem]);
    setQuantity(1);
  };

  // ✅ ITEM DISCOUNT
  const handleItemDiscountChange = (index, value) => {
    const newItems = [...orderedItems];
    const item = newItems[index];

    const total = item.sellingPrice * item.quantity;
    const val = parseFloat(value) || 0;

    let discountAmount = 0;
    let discountPercent = 0;

    if (item.discountType === "percent") {
      discountPercent = Math.max(0, Math.min(100, val));
      discountAmount = round2((total * discountPercent) / 100);
    } else {
      discountAmount = Math.max(0, val);
      discountPercent = total > 0 ? round2((discountAmount / total) * 100) : 0;
    }

    const finalTotal = round2(total - discountAmount);

    newItems[index] = {
      ...item,
      discountValue: val,
      discountPercent,
      discountAmount,
      finalTotal,
      profit: round2(finalTotal - (item.costPrice * item.quantity))
    };

    setOrderedItems(newItems);
  };

  const removeItem = (index) => {
    setOrderedItems(orderedItems.filter((_, i) => i !== index));
  };

  const subtotal = round2(
    orderedItems.reduce((sum, item) => sum + item.finalTotal, 0)
  );

  const balance = round2(receivedAmount - subtotal);

  const handleSell = async () => {
    if (orderedItems.length === 0) return alert("No items");

    if (paymentMethod === "Cash" && receivedAmount < subtotal && status === "Completed") {
      return alert("Received amount is less than total!");
    }

    setIsLoading(true);

    const items = orderedItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      sellingPrice: item.sellingPrice,
      costPrice: item.costPrice,
      discount: item.discountAmount
    }));

    try {
      const res = await axiosInstance.post('/sales', {
        userId,
        customerName,
        paymentMethod,
        status,
        receivedAmount: round2(receivedAmount),
        items
      });

      alert("Sale completed!");
      handleClear();
      fetchData();
      navigate(`/sell/invoice/${res.data.transaction._id}`);

    } catch (err) {
      console.error(err);
      alert("Sale failed");
    }

    setIsLoading(false);
  };

  const handleClear = () => {
    setOrderedItems([]);
    setCustomerName('');
    setQuantity(1);
    setSelectedProduct(null);
    setGlobalDiscountValue(0);
    setReceivedAmount(0);
  };

  return (
    <Paper sx={{ p: 4 }}>
      {/* HEADER */}
      <Grid container spacing={2}>
        <Grid item size={4}>
          <TextField fullWidth label="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)} />
        </Grid>

        <Grid item size={4}>
          <Select fullWidth value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}>
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
            <MenuItem value="Online">Online</MenuItem>
          </Select>
        </Grid>

        <Grid item size={4}>
          <Select fullWidth value={status}
            onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Free">Free</MenuItem>
          </Select>
        </Grid>
      </Grid>

      {/* PRODUCT SELECT */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item size={6}>
          <Autocomplete
            options={products}
            getOptionLabel={(option) => `${option.name} | ${option.code}`}
            value={selectedProduct}
            onChange={(e, val) => setSelectedProduct(val)}
            renderInput={(params) => (
              <TextField {...params} label="Select Product" />
            )}
          />
        </Grid>

        <Grid item size={3}>
          <TextField
            fullWidth
            label="Product Code"
            value={selectedProduct?.code || ''}
            onChange={(e) => {
              const code = e.target.value;
              const product = products.find(
                p => p.code.toLowerCase() === code.toLowerCase()
              );
              setSelectedProduct(product || null);
            }}
          />
        </Grid>

        <Grid item size={1}>
          <TextField
            type="number"
            fullWidth
            label="Qty"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, +e.target.value))}
          />
        </Grid>

        <Grid item size={2}>
          <Button fullWidth variant="contained" onClick={addItem}>
            Add
          </Button>
        </Grid>
      </Grid>

      {/* GLOBAL DISCOUNT */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item size={4}>
          <Select
            fullWidth
            value={globalDiscountType}
            onChange={(e) => setGlobalDiscountType(e.target.value)}
          >
            <MenuItem value="percent">Discount %</MenuItem>
            <MenuItem value="amount">Discount Rs</MenuItem>
          </Select>
        </Grid>

        <Grid item size={4}>
          <TextField
            fullWidth
            label="Discount Value"
            type="number"
            value={globalDiscountValue}
            onChange={(e) => applyGlobalDiscount(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* TABLE */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orderedItems.map((item, i) => (
              <TableRow key={i}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.sellingPrice.toFixed(2)}</TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={item.discountValue}
                    onChange={(e) => handleItemDiscountChange(i, e.target.value)}
                  />
                </TableCell>

                <TableCell>{item.finalTotal.toFixed(2)}</TableCell>

                <TableCell>
                  <Button color="error" onClick={() => removeItem(i)}>
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* TOTAL */}
      <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
        <Grid item size={4}>
          <Typography variant="h6">
            Total: Rs. {subtotal.toFixed(2)}
          </Typography>

          <TextField
            fullWidth
            label="Received Amount"
            type="number"
            value={receivedAmount}
            onChange={(e) =>
              setReceivedAmount(round2(parseFloat(e.target.value) || 0))
            }
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Balance"
            value={balance.toFixed(2)}
            InputProps={{ readOnly: true }}
            sx={{ mt: 2 }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleSell}
            disabled={isLoading}
          >
            Complete Sale
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SalesPage;