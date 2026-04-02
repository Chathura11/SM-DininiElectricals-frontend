import React from 'react';
import { Box, Divider, List, ListItem, ListItemText, Typography } from '@mui/material';

function StockEntryDetails({ data }) {
  return (
    <Box sx={{ width: 400, p: 3 }}>
      {data ? (
        <>
          <Typography>
            <strong>Invoice:</strong> {data.invoiceNumber || 'N/A'}
          </Typography>
          <Typography>
            <strong>Supplier:</strong> {data.supplier?.name || '-'}
          </Typography>
          <Typography>
            <strong>Date:</strong>{' '}
            {data.date ? new Date(data.date).toLocaleDateString() : '-'}
          </Typography>
          <Typography>
            <strong>Location:</strong> {data.location || '-'}
          </Typography>

          <Typography sx={{ mt: 2, mb: 1 }} variant="subtitle1">
            Items:
          </Typography>
          <Divider />

          <List dense>
            {data.items && data.items.length > 0 ? (
              data.items.map((item) => {
                const quantity = item.quantity || 0;
                const costPrice = item.costPrice || 0;
                const total = quantity * costPrice;

                return (
                  <ListItem key={item._id}>
                    <ListItemText
                      primary={item.product?.name || 'Product'}
                      secondary={`Quantity: ${quantity} | Cost Price: Rs. ${costPrice.toFixed(
                        2
                      )} | Total: Rs. ${total.toFixed(2)}`}
                    />
                  </ListItem>
                );
              })
            ) : (
              <Typography sx={{ mt: 1 }}>No items found for this entry.</Typography>
            )}
          </List>
        </>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Box>
  );
}

export default StockEntryDetails;