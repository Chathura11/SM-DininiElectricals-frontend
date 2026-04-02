import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Typography, Paper, Button } from '@mui/material'
import React from 'react'
import { Backspace as BackspaceIcon, WidthFull } from "@mui/icons-material";
import { blueGrey } from '@mui/material/colors';

const SaleOrderList = ({orderedProducts,setOrderedProducts,setTotalPrice,setTotalQnty,totalPrice,totalQnty}) => {

  function backspaceHandle(data){
    setOrderedProducts(prevProducts => {
      const updatedProducts = prevProducts.map(item => 
        item._id === data._id 
          ? { 
              ...item, 
              quantity: item.quantity - 1, 
              quantityPrice: item.price * (item.quantity - 1) * (100 - item.discount) / 100
            } 
          : item
      ).filter(item => item.quantity > 0); // Remove product if quantity becomes 0

      // Calculate total quantity and total price
      const newTotalQnty = updatedProducts.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalPrice = updatedProducts.reduce((sum, item) => sum + item.quantityPrice, 0);

      setTotalQnty(newTotalQnty);
      setTotalPrice(newTotalPrice);

      return updatedProducts;
    });
  }

  function ClearList(){
    setOrderedProducts([]);
    setTotalPrice(0)
    setTotalQnty(0)
  }

  const paperStyle={
    padding:'20px',
    background:"#FFFFFF77"
  }

  return (
    <Paper elevation={0} style={paperStyle} sx={{padding:2,height:'100%'}}>
      <TableContainer>
        <Typography variant="h6" align="center" sx={{ background: 'teal', color: 'white', padding: 1 }}>
          Ordered List
        </Typography>
        <Table>
          <TableHead sx={{ background: blueGrey[900] }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Product</TableCell>
              <TableCell sx={{ color: 'white', textAlign: 'center' }}>Qnty</TableCell>
              <TableCell sx={{ color: 'white', textAlign: 'center' }}>%</TableCell>
              <TableCell sx={{ color: 'white', textAlign: 'center' }}>Price</TableCell>
              <TableCell sx={{ color: 'white', textAlign: 'center' }}>Total</TableCell>
              <TableCell align='right'><Button style={{width:'100%',background:'red'}} variant='contained' onClick={ClearList}>Clear</Button></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow sx={{ background: blueGrey[500] }}>
              <TableCell sx={{ color: 'white' }}>Total</TableCell>
              <TableCell sx={{ color: 'white', textAlign: 'center' }}>{totalQnty}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell sx={{ color: 'white', textAlign: 'center' }}>{totalPrice.toFixed(2)}</TableCell>
              <TableCell align='right'><Button style={{width:'100%'}} variant='contained'>Sell</Button></TableCell>
            </TableRow>
            {orderedProducts && orderedProducts.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.name}</TableCell>
                <TableCell align="center">{product.quantity}</TableCell>
                <TableCell align="center">{product.discount}</TableCell>
                <TableCell align="center">{product.price}</TableCell>
                <TableCell align="center">{product.quantityPrice.toFixed(2)}</TableCell>
                <TableCell align='right'>
                  <IconButton onClick={() => backspaceHandle(product)}>
                    <BackspaceIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}          
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default SaleOrderList