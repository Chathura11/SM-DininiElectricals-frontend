import React, { useEffect, useState } from 'react';
import {
  Box, TextField, MenuItem, Button, Grid, Typography, Paper
} from '@mui/material';
import axiosInstance from '../../api/api'; // Make sure axiosInstance is configured properly
import { blueGrey, teal } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

const AccountHandlePage = () => {
  const [accounts, setAccounts] = useState([]);
  const [moneyAssetData, setMoneyAssetData] = useState({
    amount: '',
    source: '',
    target: '',
    description: ''
  });
  const [expenseData, setExpenseData] = useState({
    amount: '',
    category: '',
    paidFrom: '',
    description: ''
  });
  const navigate = useNavigate();
  const[loading,setLoading] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      const res = await axiosInstance.get('/accounts/all');
      setAccounts(res.data.accounts);
    };
    fetchAccounts();
  }, []);

  const handleMoneyAssetChange = (e) => {
    setMoneyAssetData({ ...moneyAssetData, [e.target.name]: e.target.value });
  };

  const handleExpenseChange = (e) => {
    setExpenseData({ ...expenseData, [e.target.name]: e.target.value });
  };

  const handleMoneyAssetSubmit = async () => {
    try {
      setLoading(true);
      await axiosInstance.post('/accounts/add-asset', moneyAssetData);
      alert('Money asset added successfully!');
      setMoneyAssetData({
        amount: '',
        category: '',
        paidFrom: '',
        description: ''
      })
    } catch (err) {
      alert('Error: ' + err.response?.data?.message || err.message);
    }
    finally{
      setLoading(false);
    }
  };

  const handleExpenseSubmit = async () => {
    try {
      setLoading(true);
      await axiosInstance.post('/accounts/add-expense', expenseData);
      alert('Expense recorded successfully!');
      setExpenseData({
        amount: '',
        category: '',
        paidFrom: '',
        description: ''
      })
    } catch (err) {
      alert('Error: ' + err.response?.data?.message || err.message);
    }
    finally{
      setLoading(false);
    }
  };

  function handleBack(){
    navigate('/accounts')
  } 

  return (
    <Paper sx={{padding:3}}>
      <Typography variant="h4" gutterBottom fontWeight={700} textAlign="center" color="primary" mb={4}>
        Manage Accounts
      </Typography>
      <Box sx={{textAlign:'end',mb:2}}>
        <Button variant="contained" sx={{width:'200px'}} onClick={handleBack}>
            Back
        </Button>
      </Box>
      <Grid container spacing={4}>
        {/* Add Money Asset */}
        <Grid size={12}>
          <Paper variant='outlined' sx={{ p: 3 }}>
            <Box sx={{backgroundColor:blueGrey[900],pl:1}}>
                <Typography sx={{color:'white'}} variant="h6" mb={2}>Add Money Asset</Typography>
            </Box>
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              value={moneyAssetData.amount}
              onChange={handleMoneyAssetChange}
              type="number"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Source Account"
              name="source"
              value={moneyAssetData.source}
              onChange={handleMoneyAssetChange}
              sx={{ mb: 2 }}
            >
              {accounts.filter(acc => acc.name === "Owner's Equity").map(acc => (
                <MenuItem key={acc._id} value={acc.name}>{acc.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="Target Account"
              name="target"
              value={moneyAssetData.target}
              onChange={handleMoneyAssetChange}
              sx={{ mb: 2 }}
            >
              {accounts.filter(acc => acc.name === "Cash").map(acc => (
                <MenuItem key={acc._id} value={acc.name}>{acc.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={moneyAssetData.description}
              onChange={handleMoneyAssetChange}
              sx={{ mb: 2 }}
            />
            <Box sx={{textAlign:'end'}}>
                <Button variant="contained" sx={{width:'200px'}} onClick={handleMoneyAssetSubmit} disabled={loading}>
                    Submit Money Asset
                </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Add Expense */}
        <Grid size={12}>
          <Paper variant='outlined' sx={{ p: 3 }}>
            <Box sx={{backgroundColor:blueGrey[900],pl:1}}>
                <Typography sx={{color:'white'}} variant="h6" mb={2}>Add Expense</Typography>
            </Box>
            
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              value={expenseData.amount}
              onChange={handleExpenseChange}
              type="number"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Expense Category"
              name="category"
              value={expenseData.category}
              onChange={handleExpenseChange}
              sx={{ mb: 2 }}
            >
              {accounts.filter(acc => acc.type === 'Expense' && acc.name !== 'COGS').map(acc => (
                <MenuItem key={acc._id} value={acc.name}>{acc.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="Paid From"
              name="paidFrom"
              value={expenseData.paidFrom}
              onChange={handleExpenseChange}
              sx={{ mb: 2 }}
            >
              {accounts.filter(acc => acc.name === 'Cash').map(acc => (
                <MenuItem key={acc._id} value={acc.name}>{acc.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={expenseData.description}
              onChange={handleExpenseChange}
              sx={{ mb: 2 }}
            />
            <Box sx={{textAlign:'end'}}>
                <Button variant="contained" sx={{width:'200px'}} onClick={handleExpenseSubmit} disabled={loading}>
                    Submit Expense
                </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AccountHandlePage;
