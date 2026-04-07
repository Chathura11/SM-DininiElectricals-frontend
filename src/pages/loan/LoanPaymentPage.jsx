import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/api';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';

const LoanPaymentPage = ({ authUser }) => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    // Filter loans whenever searchTerm or loans change
    if (!searchTerm) {
      setFilteredLoans(loans);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredLoans(
        loans.filter(
          loan =>
            loan.customerName.toLowerCase().includes(term) ||
            loan.transaction._id.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, loans]);

  const fetchLoans = async () => {
    try {
      const res = await axios.get('/loan');
      setLoans(res.data);
    } catch (err) {
      setAlert({ open: true, message: 'Failed to load loans', severity: 'error' });
    }
  };

  const handlePay = async (loanId) => {
    try {
      setLoadingId(loanId);
      await axios.post('/loan/pay', {
        loanId,
        amount: amounts[loanId],
        paymentMethod: 'Cash'
      });

      setAlert({ open: true, message: 'Payment successful', severity: 'success' });
      fetchLoans();
      setAmounts({ ...amounts, [loanId]: '' });
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Payment failed';
      setAlert({ open: true, message, severity: 'error' });
    } finally {
      setLoadingId(null);
    }
  };

  const handleViewPayments = (loanId) => {
    navigate(`/loan-payments/${loanId}/payments`);
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" mb={2}>Customer Loans</Typography>

      <TextField
        placeholder="Search by Customer Name or Transaction ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        size="small"
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Customer</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Balance</TableCell>
            <TableCell>Pay</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredLoans.map((loan) => (
            <TableRow key={loan._id}>
              <TableCell>{loan.customerName}</TableCell>
              <TableCell>{loan.totalAmount}</TableCell>
              <TableCell>{loan.paidAmount}</TableCell>
              <TableCell>{loan.balanceAmount}</TableCell>

              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={amounts[loan._id] || ''}
                  onChange={(e) =>
                    setAmounts({ ...amounts, [loan._id]: e.target.value })
                  }
                  disabled={loadingId === loan._id}
                />
                <Button
                  variant="contained"
                  sx={{ ml: 1 }}
                  onClick={() => handlePay(loan._id)}
                  disabled={loadingId === loan._id}
                >
                  {loadingId === loan._id ? <CircularProgress size={20} /> : 'Pay'}
                </Button>
              </TableCell>

              <TableCell>
                <Button
                  variant="outlined"
                  onClick={() => handleViewPayments(loan._id)}
                >
                  View Payments
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={alert.severity}
          variant="filled"
          onClose={() => setAlert({ ...alert, open: false })}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default LoanPaymentPage;