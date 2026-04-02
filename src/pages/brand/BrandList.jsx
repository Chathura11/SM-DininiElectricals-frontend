import { Box, Button, Paper, Stack,Grid, Card, CardMedia, CardContent, LinearProgress, CardHeader, IconButton, Chip, CardActionArea, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSidePanel } from '../../context/SidePanelContext';
import BrandForm from './BrandForm';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import brandImage from './img/1.jpeg'
import NoDataPage from './../../components/NoDataPage'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/api';
import { green, orange } from '@mui/material/colors';

const BrandList = ({configure}) => {
    const {openSidePanel} = useSidePanel()
    const [isLoading, setIsLoading] = useState(true); 
    const [products,setProducts] = useState([]);
    const handleClickBrandFormOpen = () => {
        openSidePanel("ADD NEW BRAND",<BrandForm/>)
    };
    const navigate = useNavigate()

    const handleClickEditBrandFormOpen = (brand) => {
      navigate('/admin-panel/brand/edit/'+brand._id,{state:brand});
    };

    const [brands,setBrands] = useState([])

    useEffect(() => {
      async function load(){
        await axiosInstance.get('brands').then((res)=>{
          setBrands(res.data.data)
        }).catch((error)=>{
          console.log(error.response.data.message)
        })

        await axiosInstance.get('/products').then((res)=>{
          setProducts(res.data.data);
        }).catch((error)=>{
          console.log(error.response.data.message);
        })

        setIsLoading(false)
      }
      try{
        load()
      }catch(e){
        console.log(e.message)
      }
    }, [])

    function handleCardClick(data){
      console.log(data);
    }
    
  return (
    <Paper elevation={0} sx={{padding:2}}>
        <Stack spacing={2}>
          <Box sx={{textAlign:'end'}}>
              {configure
                ?<Button variant='contained' size='small' onClick={handleClickBrandFormOpen}><AddIcon/>Add New Brand</Button>
                :''
              }
          </Box>
          {
            isLoading?
            <Box sx={{textAlign:'center'}}>
              <LinearProgress color="teal" />
            </Box>
            :brands
            ?
              <Grid container spacing={2}>
              {brands&&brands.map((brand)=>{
                return(
                  !configure ?
                  brand.status === true &&
                  <Grid key={brand._id}>
                    <CardActionArea onClick={() => handleCardClick(brand)}>
                    <Card variant='outlined' sx={{width:240}}>
                      <CardHeader sx={{height:100}}
                        action={
                          configure?
                            <IconButton aria-label="settings" color='primary' onClick={()=>handleClickEditBrandFormOpen(brand)}>
                              <EditIcon fontSize='small'/>
                            </IconButton>
                          :''
                        }
                        title={brand.name}
                        subheader={brand.description}
                      />                   
                        <Box sx={{display:'flex',justifyContent:'center'}}> 
                          <CardMedia
                            component="img"
                            sx={{ height: 100, objectFit: 'contain',padding:1}}
                            image={brand.imageURL?brand.imageURL:brandImage}
                          />          
                        </Box>        
                      <CardContent>
                        <Typography variant="body2" color="text.secondary" sx={{textAlign:'center'}}>
                          product count : {products.filter(product => product.brand?._id === brand._id).length}
                        </Typography>
                      </CardContent>
                    </Card>
                    </CardActionArea>
                  </Grid>
                  :
                  <Grid key={brand._id}>
                    <Card variant='outlined' sx={{width:240}}>
                      <CardHeader sx={{height:100}}
                        action={
                          configure?
                            <IconButton aria-label="settings" color='primary' onClick={()=>handleClickEditBrandFormOpen(brand)}>
                              <EditIcon fontSize='small'/>
                            </IconButton>
                          :''
                        }
                        title={brand.name}
                        subheader={brand.description}
                      />                   
                        <Box sx={{display:'flex',justifyContent:'center'}}> 
                          <CardMedia
                            component="img"
                            sx={{ height: 100, objectFit: 'contain',padding:1}}
                            image={brand.imageURL?brand.imageURL:brandImage}
                          />          
                        </Box>        
                      <CardContent>
                        <Chip size='small' sx={{color:'white',background: brand.status === true ? green[400] : orange[400],width:'100%'}} label={brand.status === true ? 'Active' : 'Inactive'} />
                        <Typography variant="body2" color="text.secondary" sx={{textAlign:'center'}}>
                          product count : {products.filter(product => product.brand?._id === brand._id).length}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })

              }
              </Grid>
            :<NoDataPage/>
          }
        </Stack>
    </Paper>
  )
}

export default BrandList