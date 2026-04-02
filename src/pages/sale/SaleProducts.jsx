import { Box, Card, CardActionArea, CardContent,CardMedia, Grid, Paper, Typography } from '@mui/material'
import React from 'react'
import productImage from '../product/img/product.png'
import { teal } from '@mui/material/colors';

const SaleProducts = ({products,setOrderedProducts,setTotalPrice,setTotalQnty}) => {
  
  function handleCardClick(data){
    setOrderedProducts(prevProducts => {
      const existingProduct = prevProducts.find(item => item._id === data._id);
      let updatedProducts;

      if (existingProduct) {
        updatedProducts = prevProducts.map(item =>
          item._id === data._id
            ? { 
                ...item, 
                quantity: item.quantity + 1, 
                quantityPrice: (item.price * (item.quantity + 1)) * (100-item.discount) / 100
              }
            : item
        );
      } else {
        updatedProducts = [...prevProducts, { 
          ...data, 
          quantity: 1, 
          quantityPrice: (data.price) * (100-data.discount) / 100
        }];
      }

      // Calculate total quantity and total price
      const totalQuantity = updatedProducts.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedProducts.reduce((sum, item) => sum + item.quantityPrice, 0);

      // Update state
      setTotalQnty(totalQuantity);
      setTotalPrice(totalPrice);

      return updatedProducts;
    });
  }

  const paperStyle={
    padding:'20px',
    background:"#FFFFFF77"
  }

  return (
    <Paper elevation={0} style={paperStyle} sx={{padding:2,height:'100%'}}>
        {
          products &&
            <Grid container spacing={2}>
            {products&&products.map((product,index)=>{
              return(
                <Grid key={index}>
                  <CardActionArea onClick={() => handleCardClick(product)}>
                  <Card variant='outlined' sx={{width:150}} >
                    <CardContent sx={{height:20}} >
                      <Typography variant="body2" color="text.primary" sx={{textAlign:'center'}}>
                        {product.name}
                      </Typography>
                    </CardContent>                   
                      <Box sx={{display:'flex',justifyContent:'center'}}> 
                        <CardMedia
                          component="img"
                          sx={{ height: 50, objectFit: 'contain',padding:1}}
                          image={product.imageURL?product.imageURL:productImage}
                        />          
                      </Box>        
                    <CardContent sx={{height:60,background:teal[500]}}>
                      <Typography variant="body2" color="white" sx={{textAlign:'center'}}>
                        {product.brand?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{textAlign:'center'}}>
                        code:{product.code}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{textAlign:'center'}}>
                        discount:{product.discount}%
                      </Typography>
                      <Typography variant="body2" color="white" sx={{textAlign:'center'}}>
                        Rs.{product.price}
                      </Typography>
                    </CardContent>
                  </Card>
                  </CardActionArea>
                </Grid>
              )
            })

            }
            </Grid>
          
        }
    </Paper>
  )
}

export default SaleProducts