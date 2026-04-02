import React, { useEffect, useState } from 'react';
import { Paper, Grid, Typography, Box, LinearProgress } from '@mui/material';
import axiosInstance from '../../api/api';
import { ShoppingCart, Cancel, HourglassBottom, MoneyOff,Money } from '@mui/icons-material';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    all: 0,
    pending: 0,
    free: 0,
    cancelled: 0,
    profit:0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await axiosInstance.get('/sales');
      const sales = response.data.data;

      const calculatedStats = {
        all: sales.length,
        pending: sales.filter(tx => tx.status.toLowerCase() === 'pending').length,
        free: sales.filter(tx => tx.status.toLowerCase() === 'free').length,
        cancelled: sales.filter(tx => tx.status.toLowerCase() === 'cancelled').length,
        profit: sales.length - (sales.filter(tx => tx.status.toLowerCase() === 'pending').length +sales.filter(tx => tx.status.toLowerCase() === 'free').length + sales.filter(tx => tx.status.toLowerCase() === 'cancelled').length)
      };

      setStats(calculatedStats);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <Paper
      elevation={4}
      sx={{
        p:3,
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        backgroundColor: '#f9f9f9',
        borderLeft: `6px solid ${color}`,
      }}
    >
      <Icon sx={{ fontSize: 50, color }} />
      <Box>
        <Typography variant="h6" fontWeight={700}>{label}</Typography>
        <Typography variant="h5" fontWeight={600}>{value}</Typography>
      </Box>
    </Paper>
  );

  return (
    <Paper sx={{ p: 3 }}>
      {loading ? (
        <Box sx={{ textAlign: 'center', mb: 3 }}>
            <LinearProgress color="teal" />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid size={6}>
            <StatCard
              icon={ShoppingCart}
              label="Total Sales"
              value={stats.all}
              color="#1976d2"
            />
          </Grid>
          <Grid size={6}> 
            <StatCard
              icon={Money}
              label="Profit Sales"
              value={stats.profit}
              color="#2e7d32"
            />
          </Grid>
          <Grid size={6}>
            <StatCard
              icon={HourglassBottom}
              label="Pending Sales"
              value={stats.pending}
              color="#ed6c02"
            />
          </Grid>
          <Grid size={6}>
            <StatCard
              icon={MoneyOff}
              label="Free Sales"
              value={stats.free}
              color="#ffc107"
            />
          </Grid>
          <Grid size={6}>
            <StatCard
              icon={Cancel}
              label="Cancelled Sales"
              value={stats.cancelled}
              color="#d32f2f"
            />
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

export default DashboardPage;
