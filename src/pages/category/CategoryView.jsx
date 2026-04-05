import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, LinearProgress, Box
} from '@mui/material';
import axiosInstance from '../../api/api';

const CategoryView = () => {
  const { state } = useLocation();
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [inventoryMap, setInventoryMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        // 🔹 Fetch products & inventories together
        const [productRes, inventoryRes] = await Promise.all([
          axiosInstance.get('/products'),
          axiosInstance.get('/inventories')
        ]);

        // 🔹 Filter products by category
        const filteredProducts = productRes.data.data.filter(
          p => p.category?._id === id
        );

        setProducts(filteredProducts);

        // 🔹 Create inventory map: { productId: quantity }
        const inventoryData = inventoryRes.data.data;
        const map = {};

        inventoryData.forEach(item => {
          if (item.product?._id) {
            map[item.product._id] = item.quantity;
          }
        });

        setInventoryMap(map);

      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
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
                  <TableCell>
                    {Number(p.price).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </TableCell>

                  {/* ✅ Correct Stock from Inventory */}
                  <TableCell>
                    {inventoryMap[p._id] ?? 0}
                  </TableCell>

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