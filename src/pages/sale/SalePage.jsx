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

  const navigate = useNavigate();

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
      return res.data.costPrice;
    } catch (error) {
      console.error(error);
      return 0;
    }
  };

  // ✅ ADD ITEM WITH DISCOUNT
  const addItem = async () => {
    if (!selectedProduct || quantity < 1) {
      return alert("Select product & quantity");
    }

    const availableQty = inventory[selectedProduct._id] || 0;
    if (availableQty < quantity) {
      return alert("Not enough stock");
    }

    const costPrice = await getCostPriceFIFO(selectedProduct._id, quantity);
    const sellingPrice = selectedProduct.price;

    const newItem = {
      product: selectedProduct,
      quantity,
      sellingPrice,
      costPrice,
      discountPercent: 0,
      discountAmount: 0,
      finalTotal: sellingPrice * quantity,
      profit: (sellingPrice - costPrice) * quantity
    };

    setOrderedItems([...orderedItems, newItem]);
    setQuantity(1);
  };

  // ✅ HANDLE DISCOUNT CHANGE
  const handleItemDiscountChange = (index, value) => {
    const newItems = [...orderedItems];

    let discountPercent = parseFloat(value) || 0;
    discountPercent = Math.max(0, Math.min(100, discountPercent));

    const item = newItems[index];

    const total = item.sellingPrice * item.quantity;
    const discountAmount = (total * discountPercent) / 100;
    const finalTotal = total - discountAmount;
    const profit = finalTotal - (item.costPrice * item.quantity);

    newItems[index] = {
      ...item,
      discountPercent,
      discountAmount,
      finalTotal,
      profit
    };

    setOrderedItems(newItems);
  };

  // ✅ REMOVE ITEM
  const removeItem = (index) => {
    const newItems = orderedItems.filter((_, i) => i !== index);
    setOrderedItems(newItems);
  };

  // ✅ TOTALS
  const subtotal = orderedItems.reduce((sum, item) => sum + item.finalTotal, 0);

  // ✅ SELL
  const handleSell = async () => {
    if (orderedItems.length === 0) {
      return alert("No items");
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
  };

  return (
    <Paper sx={{ p: 4 }}>
      {/* HEADER */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item size={4}>
          <TextField
            fullWidth
            label="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </Grid>

        <Grid item size={4}>
          <Select
            fullWidth
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
            <MenuItem value="Online">Online</MenuItem>
          </Select>
        </Grid>

        <Grid item size={4}>
          <Select
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Free">Free</MenuItem>
          </Select>
        </Grid>
      </Grid>

      {/* PRODUCT SELECT */}
      <Grid container spacing={2}>
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

              // Try to find a product matching the code
              const product = products.find(p => p.code.toLowerCase() === code.toLowerCase());

              setSelectedProduct(product || { code }); // keep code typed even if not found
            }}
          />
        </Grid>

        <Grid item size={1}>
          <TextField
            type="number"
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

      {/* TABLE */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Discount %</TableCell>
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
                    value={item.discountPercent}
                    onChange={(e) =>
                      handleItemDiscountChange(i, e.target.value)
                    }
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

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item size={6}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSell}
                disabled={isLoading}
              >
                Complete Sale
              </Button>
            </Grid>

            <Grid item size={6}>
              <Button fullWidth onClick={handleClear}>
                Clear
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SalesPage;