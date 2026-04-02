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
  const [discount, setDiscount] = useState(0);
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
      inventoryMap[item.product._id] = item.quantity; // ✅ changed
    });
    setInventory(inventoryMap);
  };

  // ✅ FIFO without size
  const getCostPriceFIFO = async (productId, qty) => {
    try {
      const res = await axiosInstance.get(`/stocks/fifo-cost`, {
        params: { productId, quantity: qty }
      });
      return res.data.costPrice;
    } catch (error) {
      console.error('Error fetching cost price:', error);
      return 0;
    }
  };

  const addItem = async () => {
    if (!selectedProduct || quantity < 1) {
      alert("Please select product and quantity.");
      return;
    }

    const availableQty = inventory[selectedProduct._id] || 0;

    if (availableQty < quantity) {
      return alert("Not enough stock.");
    }

    const existingIndex = orderedItems.findIndex(
      item => item.product._id === selectedProduct._id
    );

    const costPrice = await getCostPriceFIFO(selectedProduct._id, quantity);
    const sellingPrice = selectedProduct.price;

    const newItem = {
      product: selectedProduct,
      quantity,
      sellingPrice,
      costPrice,
      profit: (sellingPrice - costPrice) * quantity,
    };

    const newOrdered = [...orderedItems];

    if (existingIndex >= 0) {
      newOrdered[existingIndex].quantity += quantity;
      newOrdered[existingIndex].profit += newItem.profit;
    } else {
      newOrdered.push(newItem);
    }

    setOrderedItems(newOrdered);
    setQuantity(1);
  };

  const handleSell = async () => {
    setIsLoading(true);

    if (orderedItems.length === 0) {
      setIsLoading(false);
      return alert("No items to sell.");
    }

    const items = orderedItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      sellingPrice: item.sellingPrice,
      costPrice: item.costPrice
    }));

    try {
      const res = await axiosInstance.post('/sales', {
        userId,
        customerName,
        paymentMethod,
        status,
        items,
        discount
      });

      alert("Sale completed!");
      fetchData();
      handleClear();
      setIsLoading(false);

      navigate(`/sell/invoice/${res.data.transaction._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to complete sale.");
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setOrderedItems([]);
    setCustomerName('');
    setDiscount(0);
    setQuantity(1);
    setSelectedProduct(null);
  };

  const subtotal = orderedItems.reduce(
    (sum, item) => sum + item.sellingPrice * item.quantity,
    0
  );

  const totalPayable = subtotal - discount;

  return (
    <Paper sx={{ p: 4 }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item size={4}>
          <TextField
            fullWidth
            label="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </Grid>

        <Grid item size={2}>
          <TextField
            fullWidth
            label="Discount (Rs.)"
            type="number"
            value={discount}
            onChange={(e) =>
              setDiscount(Math.max(0, parseFloat(e.target.value) || 0))
            }
          />
        </Grid>

        <Grid item size={3}>
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

        <Grid item size={3}>
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

      {/* Product Selection */}
      <Grid container spacing={2}>

        <Grid item size={6}>
          <Autocomplete
            options={products} // array of products
            getOptionLabel={(option) => `${option.name} | ${option.code}`} // show name + code
            value={selectedProduct}
            onChange={(event, newValue) => setSelectedProduct(newValue)}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                fullWidth
                {...params}
                label="Select Product"
                placeholder="Type name or code"
              />
            )}
            isOptionEqualToValue={(option, value) => option._id === value._id}
          />
        </Grid>

        {/* Product Code Input */}
        <Grid item size={4}>
          <TextField
            fullWidth
            label="Product Code"
            value={selectedProduct?.code || ''}
            onChange={(e) => {
              const code = e.target.value;
              const product = products.find(p => p.code === code);
              if (product) setSelectedProduct(product);
              else setSelectedProduct({ code }); // allows typing even if not matched yet
            }}
          />
        </Grid>

        <Grid item size={2}>
          <TextField
            fullWidth
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value)))
            }
            label="Quantity"
          />
        </Grid>

        <Grid item size={2}>
          <Typography>
            Price: Rs. {selectedProduct ? selectedProduct.price.toFixed(2) : '0.00'}
          </Typography>
        </Grid>

        <Grid item size={2}>
          <Typography>
            Stock: {inventory[selectedProduct?._id] || 0}
          </Typography>
        </Grid>

        <Grid item size={2}>
          <Button fullWidth onClick={addItem} variant="contained">
            Add Item
          </Button>
        </Grid>
      </Grid>

      {/* Table */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Total Price</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orderedItems.map((item, i) => (
              <TableRow key={i}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.sellingPrice.toFixed(2)}</TableCell>
                <TableCell>
                  {(item.sellingPrice * item.quantity).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Totals */}
      <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
        <Grid item size={4}>
          <Typography>Subtotal: Rs. {subtotal.toFixed(2)}</Typography>
          <Typography>Discount: Rs. {discount.toFixed(2)}</Typography>
          <Typography variant="h5">
            Total: Rs. {totalPayable.toFixed(2)}
          </Typography>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item size={6}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                onClick={handleSell}
                disabled={isLoading}
              >
                Complete Sale
              </Button>
            </Grid>

            <Grid item size={6}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClear}
              >
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