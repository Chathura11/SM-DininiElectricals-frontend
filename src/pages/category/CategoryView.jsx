import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, LinearProgress, Box } from '@mui/material';
import axiosInstance from '../../api/api';

const CategoryView = () => {
  const { state } = useLocation(); // category data from CategoryList
  const { id } = useParams();      // category ID from URL
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await axiosInstance.get('/products'); // fetch all products
        const filtered = res.data.data.filter(p => p.category?._id === id);
        setProducts(filtered);
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    }

    loadProducts();
  }, [id]);

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        {state?.name || 'Category'} Products
      </Typography>

      {isLoading ? (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <LinearProgress />
        </Box>
      ) : products.length === 0 ? (
        <Typography>No products found for this category.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.code}</TableCell>
                  <TableCell>{p.brand?.name || '-'}</TableCell>
                  <TableCell>{p.category?.name || '-'}</TableCell>
                  <TableCell>{Number(p.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell>{p.stock || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default CategoryView;