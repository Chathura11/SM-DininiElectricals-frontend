import React, { useEffect, useState } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Stack,
  Select,
  TextField,
  IconButton,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../api/api';

const StockEntryForm = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    supplier: '',
    invoiceNumber: '',
    location: '',
    items: []
  });

  const [currentItem, setCurrentItem] = useState({
    product: '',
    quantity: '',
    costPrice: ''
  });

  const [response, setResponse] = useState('');
  const [serverError, setServerError] = useState('');

  // Fetch products and suppliers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, supRes] = await Promise.all([
          axiosInstance.get('/products'),
          axiosInstance.get('/suppliers')
        ]);
        setProducts(prodRes.data.data.filter(p => p.status));
        setSuppliers(supRes.data.data.filter(s => s.status));
      } catch (err) {
        console.error('Error fetching products or suppliers', err);
      }
    };
    fetchData();
  }, []);

  const handleEntryChange = ({ target: { name, value } }) => {
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = ({ target: { name, value } }) => {
    setCurrentItem(prev => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    const { product, quantity, costPrice } = currentItem;

    if (!product || !quantity || !costPrice) {
      setServerError('All item fields are required and must be greater than 0.');
      return;
    }

    if (Number(quantity) <= 0 || Number(costPrice) <= 0) {
      setServerError('Quantity and Cost Price must be greater than 0.');
      return;
    }

    setData(prev => ({
      ...prev,
      items: [...prev.items, { ...currentItem, quantity: Number(quantity), costPrice: Number(costPrice) }]
    }));

    setCurrentItem({ product: '', quantity: '', costPrice: '' });
    setServerError('');
  };

  const removeItem = (index) => {
    setData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setResponse('');

    if (!data.supplier || !data.invoiceNumber || !data.location) {
      setServerError('Please fill all required fields.');
      return;
    }

    if (data.items.length === 0) {
      setServerError('Add at least one item.');
      return;
    }

    try {
      setIsLoading(true);
      await axiosInstance.post('/stocks/stock-entries', data);
      setResponse('Stock entry recorded successfully!');
      setData({ supplier: '', invoiceNumber: '', location: '', items: [] });
    } catch (error) {
      setServerError(error.response?.data?.message || 'Server Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>

          {/* Supplier */}
          <FormControl fullWidth required>
            <InputLabel>Supplier</InputLabel>
            <Select name="supplier" value={data.supplier} onChange={handleEntryChange}>
              {suppliers.map(s => (
                <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Invoice & Location */}
          <TextField
            label="Invoice Number"
            name="invoiceNumber"
            value={data.invoiceNumber}
            onChange={handleEntryChange}
            size="small"
            required
          />
          <TextField
            label="Location"
            name="location"
            value={data.location}
            onChange={handleEntryChange}
            size="small"
            required
          />

          {/* Add Item */}
          <Box sx={{ border: '1px solid #ddd', p: 2, borderRadius: 2 }}>
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Product</InputLabel>
                <Select name="product" value={currentItem.product} onChange={handleItemChange}>
                  {products.map(p => (
                    <MenuItem key={p._id} value={p._id}>
                      {p.name} ({p.category?.name || 'No Category'}) {p.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={currentItem.quantity}
                onChange={handleItemChange}
                size="small"
              />
              <TextField
                label="Cost Price"
                name="costPrice"
                type="number"
                value={currentItem.costPrice}
                onChange={handleItemChange}
                size="small"
              />

              <Button variant="outlined" onClick={addItem}>Add Item</Button>
            </Stack>
          </Box>

          {/* Items List */}
          {data.items.length > 0 && (
            <Box>
              <strong>Items:</strong>
              <ul style={{ paddingLeft: '1rem' }}>
                {data.items.map((item, index) => {
                  const product = products.find(p => p._id === item.product);
                  return (
                    <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ flexGrow: 1 }}>
                        {product?.name || 'Unknown'} - {item.quantity} x {item.costPrice}
                      </span>
                      <IconButton color="error" onClick={() => removeItem(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </li>
                  );
                })}
              </ul>
            </Box>
          )}

          {/* Alerts */}
          {serverError && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {serverError}
            </Alert>
          )}
          {response && (
            <Alert severity="success">
              <AlertTitle>{response}</AlertTitle>
            </Alert>
          )}

          {/* Submit Button */}
          <Box sx={{ textAlign: 'end' }}>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : 'Save Stock Entry'}
            </Button>
          </Box>

        </Stack>
      </form>
    </Paper>
  );
};

export default StockEntryForm;