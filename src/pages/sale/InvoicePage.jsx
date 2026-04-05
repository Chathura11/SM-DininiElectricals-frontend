import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography, Paper, Divider, Stack, Box } from '@mui/material';
import axiosInstance from '../../api/api';
import { useReactToPrint } from 'react-to-print';
import logoName from '../../assets/back3.png';

const InvoicePage = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [items, setItems] = useState([]);
  const componentRef = useRef();

  useEffect(() => {
    axiosInstance.get(`/sales/${id}`)
      .then(res => {
        setTransaction(res.data.transaction);
        setItems(res.data.items);
      })
      .catch(err => {
        console.error("Failed to fetch invoice:", err);
      });
  }, [id]);

  const handlePrint = useReactToPrint({
    documentTitle: `Invoice_${id}`,
    contentRef: componentRef,
  });

  console.log(items)

  if (!transaction) return <Typography>Loading invoice...</Typography>;

  // ✅ CALCULATIONS WITH ITEM DISCOUNT
  const subtotal = items.reduce(
    (sum, item) => sum + (item.quantity * item.sellingPrice),
    0
  );

  const totalItemDiscount = items.reduce(
    (sum, item) => sum + (item.discount || 0),
    0
  );

  const netTotal = subtotal - totalItemDiscount;

  return (
    <Paper sx={{ p: 4, margin: 'auto' }}>
      <div ref={componentRef}>

        {/* HEADER */}
        <Stack alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <img src={logoName} alt="logo name" style={{ width: 180 }} />
          <Typography variant="h5" fontWeight="bold">INVOICE</Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* INFO */}
        <Box sx={{ mb: 2 }}>
          <Typography><strong>ID:</strong> {transaction._id}</Typography>
          <Typography><strong>Invoice No:</strong> {transaction.invoiceNo}</Typography>
          <Typography><strong>Customer:</strong> {transaction.customerName || 'Walk-in'}</Typography>
          <Typography><strong>Cashier:</strong> {transaction.user?.username || 'N/A'}</Typography>
          <Typography><strong>Date:</strong> {new Date(transaction.createdAt).toLocaleString()}</Typography>
          <Typography><strong>Payment:</strong> {transaction.paymentMethod}</Typography>
          <Typography><strong>Status:</strong> {transaction.status}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* TABLE */}
        <table width="100%" border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th>Product</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Discount</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, i) => {
              const total = item.quantity * item.sellingPrice;
              const discount = item.discount || 0;
              const finalTotal = total - discount;

              return (
                <tr key={i}>
                  <td>{item.product?.name || 'N/A'}</td>
                  <td>{item.product?.category?.name || 'N/A'}</td>
                  <td>{item.product?.brand?.name || 'N/A'}</td>
                  <td>{item.quantity}</td>
                  <td>Rs. {item.sellingPrice.toFixed(2)}</td>
                  <td>Rs. {discount.toFixed(2)}</td>
                  <td>Rs. {finalTotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Divider sx={{ my: 2 }} />

        {/* TOTALS */}
        <Box sx={{ textAlign: 'right' }}>
          <Typography><strong>Subtotal:</strong> Rs. {subtotal.toFixed(2)}</Typography>
          <Typography><strong>Item Discount:</strong> Rs. {totalItemDiscount.toFixed(2)}</Typography>

          {/* OPTIONAL: if you still use transaction discount */}
          {transaction.discount > 0 && (
            <Typography>
              <strong>Extra Discount:</strong> Rs. {transaction.discount.toFixed(2)}
            </Typography>
          )}

          <Typography variant="h6" sx={{ mt: 1 }}>
            <strong>Net Total:</strong> Rs. {(netTotal - (transaction.discount || 0)).toFixed(2)}
          </Typography>
        </Box>

        {/* FOOTER */}
        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 4, fontStyle: 'italic' }}
        >
          Thank you for choosing us!
        </Typography>

      </div>

      {/* PRINT BUTTON */}
      <Button
        variant="contained"
        color="primary"
        onClick={handlePrint}
        sx={{ mt: 3 }}
        fullWidth
      >
        Download / Print Invoice
      </Button>
    </Paper>
  );
};

export default InvoicePage;