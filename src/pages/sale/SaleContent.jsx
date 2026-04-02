import { Box, Card, CardActionArea, CardContent, CardHeader, CardMedia, Grid, LinearProgress, Paper, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SaleProducts from './SaleProducts'
import SaleOrderList from './SaleOrderList'
import axiosInstance from '../../api/api'
import categoryImage from '../category/img/1.jpg'
import { blueGrey } from '@mui/material/colors'

const SaleContent = () => {

    const [isLoading, setIsLoading] = useState(true); 
    const [categories,setCategories] = useState([])
    const [products,setProducts] = useState([])
    const [filteredProducts,setFilteredProducts] = useState([]);
    const [orderedProducts,setOrderedProducts] = useState([])
    const [totalPrice,setTotalPrice] = useState(0)
    const [totalQnty,setTotalQnty] = useState(0)

    useEffect(() => {
        async function load(){
          const allCategory = {
            _id:0,
            name:'All',
            imageURL:'',
            status:true
          }  
          await axiosInstance.get('categories').then((res)=>{
            const activeCategories = res.data.data.filter(item => item.status === true)
            const updatedCategories = [allCategory, ...activeCategories];
            setCategories(updatedCategories)
          }).catch((error)=>{
            console.log(error.response.data.message)
          })

          await axiosInstance.get('/products').then((res)=>{
            const activeProduct = res.data.data.filter(item =>item.status === true).map(item => ({ ...item, quantity: 1 }));
            setProducts(activeProduct)
            setFilteredProducts(activeProduct)
          })
    
          setIsLoading(false)
        }
        try{
          load()
        }catch(e){
          console.log(e.message)
          setIsLoading(false)
        }
    }, [])

    function handleCardClick(data){
      if(data._id !== 0){
        const filteredProducts = products.filter(item => item.category?._id === data._id)
        setFilteredProducts(filteredProducts)
      }else{
        setFilteredProducts(products)
      }
      
      
    }

    const paperStyle={
      padding:'20px',
      background:blueGrey[900]
    }

  return (
    <Stack spacing={2}>
      <Paper style={paperStyle} elevation={0} sx={{ alignItems: 'center',padding:2 ,minHeight:60}}>
        {
          isLoading?
          <Box sx={{textAlign:'center'}}>
            <LinearProgress color="teal" />
          </Box>
          :categories &&
            <Grid container spacing={2}>
            {categories&&categories.map((category,index)=>{
              return(
                <Grid key={index}>
                  <CardActionArea onClick={() => handleCardClick(category)}>
                  <Card variant='outlined' sx={{width:150}} >
                    <CardHeader sx={{height:2,textAlign:'center'}}
                      title={category.name}
                    />                   
                      <Box sx={{display:'flex',justifyContent:'center'}}> 
                        <CardMedia
                          component="img"
                          sx={{ height: 50, objectFit: 'cover',padding:1}}
                          image={category.imageURL?category.imageURL:categoryImage}
                        />          
                      </Box>        
                    <CardContent sx={{height:2}}>
                      <Typography variant="body2" color="text.secondary" sx={{textAlign:'center'}}>
                        product count
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
      {
        !isLoading&&
        <Stack direction='row' spacing={2} justifyContent='start'>
          <Box width="40%">
            <SaleProducts products={filteredProducts} setOrderedProducts={setOrderedProducts} setTotalPrice={setTotalPrice} setTotalQnty={setTotalQnty}/>
          </Box>
          <Box width="60%">
            <SaleOrderList orderedProducts={orderedProducts} setOrderedProducts={setOrderedProducts} setTotalPrice={setTotalPrice} setTotalQnty={setTotalQnty} totalPrice={totalPrice} totalQnty={totalQnty}/>
          </Box>
        </Stack>
      }
    </Stack>
  )
}

export default SaleContent