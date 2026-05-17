import {
    Paper,
    Stack,
    Typography,
    TextField,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
  } from '@mui/material';
  
  import { useEffect, useState } from 'react';
  
  import axiosInstance from '../../api/api';
  
  const PurchaseReturnForm = ({ stockEntry }) => {
  
    const [items, setItems] = useState([]);
  
    const [reason, setReason] = useState('');
  
    useEffect(() => {
      loadItems();
    }, [stockEntry]);
  
    const loadItems = async () => {

      const res = await axiosInstance.get(
        `/purchase-returns/stock-entry/${stockEntry._id}`
      );
    
      const returnedItems = res.data.data;
    
      const updated = stockEntry.items.map((item) => {
    
        const returned = returnedItems.find(
          (x) => x._id === item._id
        );
    
        const returnedQty = returned?.totalReturned || 0;
    
        return {
          ...item,
          returnQty: 0,
          availableQty: item.quantity - returnedQty
        };
      });
    
      setItems(updated);
    };
  
    const handleQtyChange = (
      index,
      value
    ) => {
  
      const updated = [...items];
  
      updated[index].returnQty =
        Number(value);
  
      setItems(updated);
    };
  
    const handleSubmit = async () => {
      try {
        const payload = {
          stockEntry: stockEntry._id,
          reason,
          items: items
            .filter((x) => x.returnQty > 0)
            .map((x) => ({
              stockEntryItemId: x._id,
              quantity: x.returnQty
            }))
        };
    
        const res = await axiosInstance.post(
          '/purchase-returns',
          payload
        );
    
        alert(res.data?.message || 'Return completed successfully');
    
        // 🔥 REFRESH DATA AFTER SUBMIT
        await loadItems();
    
        // optional: reset input fields
        setReason('');
    
      } catch (error) {
        console.error('Purchase return error:', error);
    
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Something went wrong';
    
        alert(message);
      }
    };
  
    return (
      <Paper sx={{ p: 3 }}>
  
        <Stack spacing={2}>
  
          <Typography variant="h6">
            Purchase Return
          </Typography>
  
          <TextField
            label="Reason"
            fullWidth
            value={reason}
            onChange={(e) =>
              setReason(e.target.value)
            }
          />
  
          <Table>
  
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Purchased</TableCell>
                <TableCell>Available</TableCell>
                <TableCell>Return Qty</TableCell>
              </TableRow>
            </TableHead>
  
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item._id}>
  
                  <TableCell>
                    {item.product.name}
                  </TableCell>
  
                  <TableCell>
                    {item.quantity}
                  </TableCell>
  
                  <TableCell>
                    {item.availableQty}
                  </TableCell>
  
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={item.returnQty}
                      inputProps={{
                        min: 0,
                        max: item.availableQty
                      }}
                      onChange={(e) =>
                        handleQtyChange(
                          index,
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
  
                </TableRow>
              ))}
            </TableBody>
  
          </Table>
  
          <Button
            variant="contained"
            onClick={handleSubmit}
          >
            Save Return
          </Button>
  
        </Stack>
  
      </Paper>
    );
  };
  
  export default PurchaseReturnForm;