import React, { useEffect, useState } from 'react';
import {
  Typography, Paper, Grid, TextField, Button,
  MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from '@mui/material';
import axios from '../../api/api';

const MoneyAssetPage = ({ authUser }) => {

  const [accounts, setAccounts] = useState([]);
  const [records, setRecords] = useState([]);

  const [form, setForm] = useState({
    amount: '',
    source: '',
    target: '',
    description: '',
    voucherNo: ''
  });

  // ✅ Voucher generator (YYYYMM)
  const generateVoucher = () => {
    const now = new Date();
    const ym = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}`;
    const random = Math.floor(1000 + Math.random() * 9000);
    return `CAP-${ym}-${random}`;
  };

  const loadAccounts = async () => {
    const res = await axios.get('/accounts/all');
    setAccounts(res.data.accounts);
  };

  const loadRecords = async () => {
    const res = await axios.get('/accounts/money-assets');
    setRecords(res.data);
  };

  useEffect(() => {
    loadAccounts();
    loadRecords();

    setForm(prev => ({
      ...prev,
      voucherNo: generateVoucher()
    }));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/accounts/add-asset', {
        ...form,
        userId: authUser._id
      });

      alert('✅ Money Added Successfully');

      setForm({
        amount: '',
        source: '',
        target: '',
        description: '',
        voucherNo: generateVoucher()
      });

      loadRecords();

    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Add Money (Capital)</Typography>

        <Grid container spacing={2} mt={1}>

          <Grid item size={6}>
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
            />
          </Grid>

          {/* <Grid item size={6}>
            <TextField
              fullWidth
              label="Voucher No"
              value={form.voucherNo}
              disabled
            />
          </Grid> */}

          <Grid item size={3}>
            <TextField
              select
              fullWidth
              label="Source"
              name="source"
              value={form.source}
              onChange={handleChange}
            >
              {accounts.filter(a => a.name === "Owner's Equity").map(a => (
                <MenuItem key={a._id} value={a.name}>{a.name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item size={3}>
            <TextField
              select
              fullWidth
              label="Target"
              name="target"
              value={form.target}
              onChange={handleChange}
            >
              {accounts.filter(a => a.name === "Cash").map(a => (
                <MenuItem key={a._id} value={a.name}>{a.name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item size={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </Grid>

          <Grid item size={12}>
            <Button variant="contained" onClick={handleSubmit}>
              Save
            </Button>
          </Grid>

        </Grid>
      </Paper>

      {/* TABLE */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">History</Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Voucher</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {records.map(r => (
                <TableRow key={r._id}>
                  <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{r.voucherNo}</TableCell>
                  <TableCell>Rs. {r.amount}</TableCell>
                  <TableCell>{r.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default MoneyAssetPage;