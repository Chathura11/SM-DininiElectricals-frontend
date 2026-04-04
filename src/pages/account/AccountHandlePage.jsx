import React, { useEffect, useState } from 'react';
import {
  Box, TextField, MenuItem, Button, Grid, Typography, Paper
} from '@mui/material';
import axiosInstance from '../../api/api'; // Make sure axiosInstance is configured properly
import { blueGrey, teal } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import SupplierPaymentPage from './SupplierPaymentPage';
import MoneyAssetPage from './MoneyAssetPage';
import ExpensePage from './ExpensePage';

const AccountHandlePage = ({authUser}) => {
  const [accounts, setAccounts] = useState([]);
  const [moneyAssetData, setMoneyAssetData] = useState({
    amount: '',
    source: '',
    target: '',
    description: '',
    userId :''
  });
  const [expenseData, setExpenseData] = useState({
    amount: '',
    category: '',
    paidFrom: '',
    description: '',
    userId:''
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
    moneyAssetData.userId = authUser._id;
    try {
      setLoading(true);
      await axiosInstance.post('/accounts/add-asset', moneyAssetData);
      alert('Money asset added successfully!');
      setMoneyAssetData({
        amount: '',
        category: '',
        paidFrom: '',
        description: '',
        userId:''
      })
    } catch (err) {
      alert('Error: ' + err.response?.data?.message || err.message);
    }
    finally{
      setLoading(false);
    }
  };

  const handleExpenseSubmit = async () => {
    expenseData.userId =authUser._id;
    try {
      setLoading(true);
      await axiosInstance.post('/accounts/add-expense', expenseData);
      alert('Expense recorded successfully!');
      setExpenseData({
        amount: '',
        category: '',
        paidFrom: '',
        description: '',
        userId:''
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
        {/* Supplier Payments */}
        <Grid size={12}>
          <Paper variant='outlined' sx={{ p: 3 }}>
            <Box sx={{backgroundColor:blueGrey[900],pl:1}}>
                <Typography sx={{color:'white'}} variant="h6" mb={2}>Supplier Payments</Typography>
            </Box>
            <SupplierPaymentPage authUser={authUser}/>
          </Paper>
        </Grid>
        {/* Add Money Asset */}
        <Grid size={12}>
          <Paper variant='outlined' sx={{ p: 3 }}>
            <Box sx={{backgroundColor:blueGrey[900],pl:1}}>
                <Typography sx={{color:'white'}} variant="h6" mb={2}>Add Money Asset</Typography>
            </Box>
            <MoneyAssetPage authUser={authUser}/>
          </Paper>
        </Grid>

        {/* Add Expense */}
        <Grid size={12}>
          <Paper variant='outlined' sx={{ p: 3 }}>
            <Box sx={{backgroundColor:blueGrey[900],pl:1}}>
                <Typography sx={{color:'white'}} variant="h6" mb={2}>Add Expense</Typography>
            </Box>
            <ExpensePage authUser={authUser}/>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AccountHandlePage;
