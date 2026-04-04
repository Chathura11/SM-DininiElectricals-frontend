import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Grid, TextField, Button,
  MenuItem, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow
} from '@mui/material';
import axios from '../../api/api';

const SupplierPaymentPage = () => {

  const [suppliers, setSuppliers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [dueAmount, setDueAmount] = useState(0);

  const [form, setForm] = useState({
    supplier: '',
    voucherNo: '',
    amount: '',
    paymentMethod: 'Cash',
    note: ''
  });

  // ✅ Load suppliers
  const loadSuppliers = async () => {
    const res = await axios.get('/suppliers');
    setSuppliers(res.data.data);
  };

  // ✅ Load payments
  const loadPayments = async () => {
    const res = await axios.get('/supplier-payments');
    setPayments(res.data);
  };

  // ✅ Auto voucher generator
  const generateVoucher = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `PAY-${random}`;
  };

  useEffect(() => {
    loadSuppliers();
    loadPayments();

    setForm(prev => ({
      ...prev,
      voucherNo: generateVoucher()
    }));
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ✅ When supplier changes → fetch due
  const handleSupplierChange = async (supplierId) => {
    setForm(prev => ({ ...prev, supplier: supplierId }));

    try {
      const res = await axios.get(`/supplier-payments/due/${supplierId}`);
      const due = res.data.due;

      console.log(due);

      setDueAmount(due);

      // ✅ Auto-fill amount
      setForm(prev => ({
        ...prev,
        supplier: supplierId,
        amount: due
      }));

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Submit payment
  const handleSubmit = async () => {
    try {
      await axios.post('/supplier-payments', form);

      alert('✅ Payment Added Successfully');

      // Reset form
      setForm({
        supplier: '',
        voucherNo: generateVoucher(),
        amount: '',
        paymentMethod: 'Cash',
        note: ''
      });

      setDueAmount(0);
      loadPayments();

    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <>
      {/* ================= FORM ================= */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>

          {/* Supplier */}
          <Grid item size={6} md={4}>
            <TextField
              select
              fullWidth
              label="Supplier"
              value={form.supplier}
              onChange={(e) => handleSupplierChange(e.target.value)}
            >
              {suppliers.map(s => (
                <MenuItem key={s._id} value={s._id}>
                  {s.name}
                </MenuItem>
              ))}
            </TextField>

            {/* ✅ Due display */}
            {form.supplier && (
              <Typography color="error" mt={1}>
                Outstanding Due: Rs. {dueAmount}
              </Typography>
            )}
          </Grid>

          {/* Voucher */}
          {/* <Grid item size={12} md={4}>
            <TextField
              fullWidth
              label="Voucher No"
              name="voucherNo"
              value={form.voucherNo}
              onChange={handleChange}
            />
          </Grid> */}

          {/* Amount */}
          <Grid item size={3} md={4}>
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
            />
          </Grid>

          {/* Payment Method */}
          <Grid item size={3} md={4}>
            <TextField
              select
              fullWidth
              label="Payment Method"
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Bank">Bank</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
            </TextField>
          </Grid>

          {/* Note */}
          <Grid item size={12} md={8}>
            <TextField
              fullWidth
              label="Note"
              name="note"
              value={form.note}
              onChange={handleChange}
            />
          </Grid>

          {/* Button */}
          <Grid item size={12}>
            <Button variant="contained" onClick={handleSubmit}>
              Save Payment
            </Button>
          </Grid>

        </Grid>
      </Paper>

      {/* ================= TABLE ================= */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Payment History</Typography>

        <TableContainer>
          <Table>

            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Voucher No</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Note</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {payments.map(p => (
                <TableRow key={p._id}>
                  <TableCell>
                    {new Date(p.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{p.voucherNo}</TableCell>
                  <TableCell>{p.supplier?.name}</TableCell>
                  <TableCell>Rs. {p.amount}</TableCell>
                  <TableCell>{p.paymentMethod}</TableCell>
                  <TableCell>{p.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>
      </Paper>

    </>
  );
};

export default SupplierPaymentPage;