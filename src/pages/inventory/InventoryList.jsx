import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  LinearProgress,
  TextField
} from '@mui/material';
import axiosInstance from '../../api/api';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/inventories');
        setInventory(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load inventory');
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // ✅ Filter
  const filteredInventory = inventory.filter(item => {
    const name = item.product?.name?.toLowerCase() || '';
    const code = item.product?.code?.toString() || '';
    const query = searchQuery.toLowerCase();
    return name.includes(query) || code.includes(query);
  });

  return (
    <Paper elevation={0} sx={{ padding: 2 }}>
      <TextField
        label="Filter by Product Name or Code"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {loading && (
        <Box sx={{ textAlign: 'center' }}>
          <LinearProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Code</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell align="right">Quantity</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No matching products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredInventory.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.product?.code || 'N/A'}</TableCell>
                    <TableCell>{item.product?.name || 'N/A'}</TableCell>
                    <TableCell>{item.product?.category?.name || 'N/A'}</TableCell>
                    <TableCell>{item.product?.brand?.name || 'N/A'}</TableCell>
                    <TableCell align="right">
                      {item.quantity ?? 0}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default InventoryList;