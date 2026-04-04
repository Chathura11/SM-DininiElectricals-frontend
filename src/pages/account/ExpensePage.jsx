import React, { useEffect, useState } from 'react';
import {
  Typography, Paper, Grid, TextField, Button,
  MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from '@mui/material';
import axios from '../../api/api';

const ExpensePage = ({ authUser }) => {

  const [accounts, setAccounts] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [form, setForm] = useState({
    amount: '',
    category: '',
    paidFrom: '',
    description: '',
    voucherNo: ''
  });

  const generateVoucher = () => {
    const now = new Date();
    const ym = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}`;
    const random = Math.floor(1000 + Math.random() * 9000);
    return `EXP-${ym}-${random}`;
  };

  const loadAccounts = async () => {
    const res = await axios.get('/accounts/all');
    setAccounts(res.data.accounts);
  };

  const loadExpenses = async () => {
    const res = await axios.get('/accounts/expenses');
    setExpenses(res.data);
  };

  useEffect(() => {
    loadAccounts();
    loadExpenses();

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
      await axios.post('/accounts/add-expense', {
        ...form,
        userId: authUser._id
      });

      alert('✅ Expense Added');

      setForm({
        amount: '',
        category: '',
        paidFrom: '',
        description: '',
        voucherNo: generateVoucher()
      });

      loadExpenses();

    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Add Expense</Typography>

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
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {accounts.filter(a => a.type === 'Expense' && a.name !== 'COGS').map(a => (
                <MenuItem key={a._id} value={a.name}>{a.name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item size={3}>
            <TextField
              select
              fullWidth
              label="Paid From"
              name="paidFrom"
              value={form.paidFrom}
              onChange={handleChange}
            >
              {accounts.filter(a => a.name === 'Cash').map(a => (
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
              Save Expense
            </Button>
          </Grid>

        </Grid>
      </Paper>

      {/* TABLE */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Expense History</Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Voucher</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {expenses.map(e => (
                <TableRow key={e._id}>
                  <TableCell>{new Date(e.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{e.voucherNo}</TableCell>
                  <TableCell>{e.category}</TableCell>
                  <TableCell>Rs. {e.amount}</TableCell>
                  <TableCell>{e.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default ExpensePage;