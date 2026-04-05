import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Box, Grid, Button, MenuItem, Select,
  CircularProgress, Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import { blueGrey, teal, red } from '@mui/material/colors';
import axios from '../../api/api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';

const AnalyticsPage = () => {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [year]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/accounts/analytics?year=${year}`);
      setData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalSales = data.reduce((a, b) => a + (b.sales || 0), 0);
  const totalExpenses = data.reduce((a, b) => a + (b.totalExpenses || 0), 0);
  const totalProfit = data.reduce((a, b) => a + (b.profit || 0), 0);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data.map(d => ({
      Month: d.month,
      Sales: d.sales || 0,
      Expenses: d.totalExpenses || 0,
      Profit: d.profit || 0
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Analytics');

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer]), `Analytics_${year}.xlsx`);
  };

  const handleBack = () => {
    navigate('/accounts');
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        fontWeight={700}
        textAlign="center"
        color="primary"
        mb={4}
      >
        Analytics Dashboard
      </Typography>

      {/* Year selector and Export */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Select value={year} onChange={(e) => setYear(e.target.value)}>
          {[2023, 2024, 2025, 2026].map(y => (
            <MenuItem key={y} value={y}>{y}</MenuItem>
          ))}
        </Select>
        <Box sx={{ textAlign: 'end', mb: 2 }}>
            <Button variant="contained" onClick={exportExcel}>
            Download Excel
            </Button>
            <Button variant="contained" sx={{ width: '200px', ml: 2 }} onClick={handleBack}>
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
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 3, borderLeft: `6px solid ${teal[500]}`, boxShadow: 2 }}>
                <Typography variant="subtitle1" color="textSecondary">Sales</Typography>
                <Typography variant="h5" fontWeight={700}>
                  LKR {totalSales.toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 3, borderLeft: `6px solid ${red[700]}`, boxShadow: 2 }}>
                <Typography variant="subtitle1" color="textSecondary">Expenses</Typography>
                <Typography variant="h5" fontWeight={700}>
                  LKR {totalExpenses.toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 3, borderLeft: `6px solid ${teal[800]}`, boxShadow: 2 }}>
                <Typography variant="subtitle1" color="textSecondary">Profit</Typography>
                <Typography variant="h5" fontWeight={700}>
                  LKR {totalProfit.toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Analytics Table */}
          <Paper sx={{ overflowX: 'auto', borderRadius: 2, boxShadow: 2 }}>
            <Table sx={{ borderCollapse: 'collapse', minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: blueGrey[50] }}>
                <TableRow>
                  <TableCell sx={{ border: '1px solid rgba(224,224,224,1)' }}><strong>Month</strong></TableCell>
                  <TableCell align="right" sx={{ border: '1px solid rgba(224,224,224,1)' }}><strong>Sales (LKR)</strong></TableCell>
                  <TableCell align="right" sx={{ border: '1px solid rgba(224,224,224,1)' }}><strong>Expenses (LKR)</strong></TableCell>
                  <TableCell align="right" sx={{ border: '1px solid rgba(224,224,224,1)' }}><strong>Profit (LKR)</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((d, i) => (
                  <TableRow key={i} sx={{ '&:hover': { backgroundColor: blueGrey[50] } }}>
                    <TableCell sx={{ border: '1px solid rgba(224,224,224,1)' }}>{d.month}</TableCell>
                    <TableCell align="right" sx={{ border: '1px solid rgba(224,224,224,1)' }}>{(d.sales || 0).toLocaleString()}</TableCell>
                    <TableCell align="right" sx={{ border: '1px solid rgba(224,224,224,1)' }}>{(d.totalExpenses || 0).toLocaleString()}</TableCell>
                    <TableCell align="right" sx={{ border: '1px solid rgba(224,224,224,1)' }}>{(d.profit || 0).toLocaleString()}</TableCell>
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