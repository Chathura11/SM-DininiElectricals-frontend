import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/api';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';

const CustomerPaymentDetailsPage = () => {
  const { loanId } = useParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'error' });

  useEffect(() => {
    fetchPayments();
  }, [loanId]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/loan/${loanId}/payments`);
      setPayments(res.data);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to load payments';
      setAlert({ open: true, message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" mb={2}>Customer Payment Details</Typography>

      {loading ? (
        <CircularProgress />
      ) : payments.length === 0 ? (
        <Typography>No payments found</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Receipt No</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {payments.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.receiptNo}</TableCell>
                <TableCell>{p.amount}</TableCell>
                <TableCell>{p.paymentMethod}</TableCell>
                <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

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

export default CustomerPaymentDetailsPage;