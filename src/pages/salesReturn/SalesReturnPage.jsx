import React, { useState } from 'react';
import {
  Box, Button, CircularProgress, Paper,
  TextField, Typography, Table, TableBody, TableCell,
  TableHead, TableRow, Grid
} from '@mui/material';
import axiosInstance from '../../api/api';
import { blueGrey } from '@mui/material/colors';

const SalesReturnPage = ({ authUser }) => {
  const [transactionId, setTransactionId] = useState('');
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [returnItems, setReturnItems] = useState([]);
  const [previousReturns, setPreviousReturns] = useState([]);

  const fetchTransactionItems = async () => {
    if (!transactionId.trim()) return alert("Please enter a transaction ID");

    setLoading(true);
    try {
      const [salesRes, returnRes] = await Promise.all([
        axiosInstance.get(`/sales/${transactionId.trim()}`),
        axiosInstance.get(`/sales-return/by-transaction/${transactionId.trim()}`)
      ]);

      const salesItems = salesRes.data.items || [];

      setItems(salesItems);
      setTransactionDetails(salesRes.data.transaction || null);
      setPreviousReturns(returnRes.data.data || []);

      // Initialize return items (NO SIZE)
      setReturnItems(
        salesItems.map(item => ({
          product: item.product._id,
          quantity: 0,
          reason: ''
        }))
      );

    } catch (err) {
      alert(err.response?.data?.message || 'Error fetching transaction');
      clearForm();
    }
    setLoading(false);
  };

  const handleQuantityChange = (index, value) => {
    const qty = Number(value);
    const maxQty = items[index]?.quantity || 0;

    if (qty > maxQty) {
      alert(`Cannot return more than sold quantity (${maxQty})`);
      return;
    }

    const updated = [...returnItems];
    updated[index].quantity = qty;
    setReturnItems(updated);
  };

  const handleReasonChange = (index, value) => {
    const updated = [...returnItems];
    updated[index].reason = value;
    setReturnItems(updated);
  };

  const handleSubmit = async () => {
    const filtered = returnItems.filter(i => i.quantity > 0);

    if (!transactionId.trim() || filtered.length === 0) {
      return alert('Please enter a transaction ID and valid return quantities.');
    }

    try {
      setLoading(true);

      await axiosInstance.post('/sales-return', {
        transactionId: transactionId.trim(),
        items: filtered
      });

      alert('Return processed successfully');
      clearForm();

    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setTransactionId('');
    setTransactionDetails(null);
    setItems([]);
    setReturnItems([]);
    setPreviousReturns([]);
  };

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h4" textAlign="center" color="primary" fontWeight={700} mb={4}>
        Process Sales Return
      </Typography>

      {/* SEARCH */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Enter Transaction ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
        />
        <Button variant="contained" onClick={fetchTransactionItems} sx={{ width: 150 }}>
          Search
        </Button>
        <Button variant="outlined" color="error" onClick={clearForm} sx={{ width: 150 }}>
          Clear
        </Button>
      </Box>

      {/* TRANSACTION DETAILS */}
      {transactionDetails && (
        <Paper variant="outlined" sx={{ p: 2, mb: 3, backgroundColor: blueGrey[50] }}>
          <Typography variant="h6" gutterBottom>Transaction Details</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <strong>Customer:</strong> {transactionDetails.customerName || 'Walk-in'}
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <strong>Date:</strong> {new Date(transactionDetails.createdAt).toLocaleString()}
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <strong>Total:</strong> {transactionDetails.totalAmount?.toFixed(2) || '0.00'} LKR
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <strong>Discount:</strong> {transactionDetails.discount?.toFixed(2) || '0.00'} LKR
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <strong>Status:</strong> {transactionDetails.status}
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* PREVIOUS RETURNS */}
      {previousReturns.length > 0 && (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" color="secondary" gutterBottom>
            Previous Returns
          </Typography>

          {previousReturns.map((ret, idx) => (
            <Box key={ret._id} sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight={600}>
                Return #{idx + 1} - {new Date(ret.createdAt).toLocaleString()}
              </Typography>

              <ul>
                {ret.items.map((itm, i) => (
                  <li key={i}>
                    {itm.product?.name} | {itm.product?.category?.name} | {itm.product?.brand?.name} — {itm.quantity} pcs
                  </li>
                ))}
              </ul>
            </Box>
          ))}
        </Paper>
      )}

      {/* ITEMS TABLE */}
      {loading ? (
        <Box textAlign="center"><CircularProgress /></Box>
      ) : items.length > 0 ? (
        <Paper variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: blueGrey[900] }}>
                <TableCell sx={{ color: 'white' }}>Product</TableCell>
                <TableCell sx={{ color: 'white' }}>Sold Qty</TableCell>
                <TableCell sx={{ color: 'white' }}>Return Qty</TableCell>
                <TableCell sx={{ color: 'white' }}>Reason</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item._id}>
                  <TableCell>
                    {item.product?.name} 
                    <br />
                    <small>
                      {item.product?.category?.name} - {item.product?.brand?.name}
                    </small>
                  </TableCell>

                  <TableCell>{item.quantity}</TableCell>

                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      inputProps={{ min: 0, max: item.quantity }}
                      value={returnItems[index]?.quantity || ''}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Reason (optional)"
                      value={returnItems[index]?.reason || ''}
                      onChange={(e) => handleReasonChange(index, e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : (
        transactionId && !loading && (
          <Typography mt={2}>No items found for this transaction.</Typography>
        )
      )}

      {/* SUBMIT */}
      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!transactionId || loading}
          sx={{ width: '200px' }}
        >
          Submit Return
        </Button>
      </Box>
    </Paper>
  );
};

export default SalesReturnPage;