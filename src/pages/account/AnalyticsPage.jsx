import React, { useEffect, useState } from 'react';
import {
  Grid, Paper, Typography, Table, TableHead, TableRow,
  TableCell, TableBody, Button, CircularProgress, Box, Select, MenuItem
} from '@mui/material';
import { blueGrey, teal, red, orange } from '@mui/material/colors';
import axios from '../../api/api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';

const AnalyticsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/accounts/analytics?year=${year}`);
      setData(res.data);
    } catch (err) {
      console.error('Error fetching analytics:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [year]);

  // Totals
  const totalSales = data.reduce((a, b) => a + (b.sales || 0), 0);
  const totalExpenses = data.reduce((a, b) => a + (b.totalExpenses || 0), 0);
  const totalProfit = data.reduce((a, b) => a + (b.profit || 0), 0);

  // Excel Export
  const exportToExcel = () => {
    const formatted = data.map(d => ({
      Month: d.month,
      Sales: d.sales.toFixed(2),
      'Salary Expense': d.salaryExp.toFixed(2),
      'Additional Expense': d.additionalExp.toFixed(2),
      'Total Expenses': d.totalExpenses.toFixed(2),
      Profit: d.profit.toFixed(2),
    }));
    const ws = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Analytics');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer]), `Analytics_${year}.xlsx`);
  };

  // Navigation
  const handleBack = () => navigate('/accounts');

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight={700} textAlign="center" color="primary" mb={4}>
        Analytics Dashboard
      </Typography>

      {/* Year selector and buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Select value={year} onChange={(e) => setYear(e.target.value)}>
          {[2023, 2024, 2025, 2026].map(y => (
            <MenuItem key={y} value={y}>{y}</MenuItem>
          ))}
        </Select>
        <Box>
          <Button variant="contained" sx={{ width: 200, mr: 2 }} onClick={exportToExcel}>
            EXPORT TO EXCEL
          </Button>
          <Button variant="contained" sx={{ width: 200, backgroundColor: red[700] }} onClick={handleBack}>
            Back
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper variant='outlined' sx={{ p: 3, borderLeft: `6px solid ${teal[500]}` }}>
                <Typography variant="h6" color="textSecondary">Total Sales</Typography>
                <Typography variant="h4" fontWeight={700}>LKR {totalSales.toFixed(2)}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper variant='outlined' sx={{ p: 3, borderLeft: `6px solid ${orange[500]}` }}>
                <Typography variant="h6" color="textSecondary">Total Expenses</Typography>
                <Typography variant="h4" fontWeight={700}>LKR {totalExpenses.toFixed(2)}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper variant='outlined' sx={{ p: 3, borderLeft: `6px solid ${red[700]}` }}>
                <Typography variant="h6" color="textSecondary">Total Profit</Typography>
                <Typography variant="h4" fontWeight={700}>LKR {totalProfit.toFixed(2)}</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Analytics Table */}
          <Paper variant='outlined'>
            <Table>
              <TableHead sx={{ backgroundColor: blueGrey[100] }}>
                <TableRow>
                  <TableCell><strong>Month</strong></TableCell>
                  <TableCell><strong>Sales</strong></TableCell>
                  <TableCell><strong>Salary Expense</strong></TableCell>
                  <TableCell><strong>Additional Expense</strong></TableCell>
                  <TableCell><strong>Total Expenses</strong></TableCell>
                  <TableCell><strong>Profit</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((d, i) => (
                  <TableRow key={i} hover>
                    <TableCell>{d.month}</TableCell>
                    <TableCell>{d.sales.toFixed(2)}</TableCell>
                    <TableCell>{d.salaryExp.toFixed(2)}</TableCell>
                    <TableCell>{d.additionalExp.toFixed(2)}</TableCell>
                    <TableCell>{d.totalExpenses.toFixed(2)}</TableCell>
                    <TableCell>{d.profit.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}
    </Paper>
  );
};

export default AnalyticsPage;