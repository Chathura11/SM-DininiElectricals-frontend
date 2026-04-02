import { Box, Button, Paper, Stack,Grid, Card, CardMedia, CardContent, Typography, LinearProgress, CardHeader, IconButton, Chip, CardActionArea } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSidePanel } from '../../context/SidePanelContext';
import CategoryForm from './CategoryForm';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import categoryImage from './img/1.jpg'
import NoDataPage from './../../components/NoDataPage'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/api';
import { green, orange } from '@mui/material/colors';

const CategoryList = ({configure}) => {
  const {openSidePanel} = useSidePanel()
  const [isLoading, setIsLoading] = useState(true); 
  const [products,setProducts] = useState([]);
  const navigate = useNavigate()

  const handleClickCategoryFormOpen = () => {
      openSidePanel("ADD NEW CATEGORY",<CategoryForm/>)
  };

  const handleClickEditCategoryFormOpen = (category) => {
    navigate('/admin-panel/category/edit/'+category._id,{state:category});
  };

  const [categories,SetCategories] = useState([])

  useEffect(() => {
    async function load(){
      await axiosInstance.get('categories').then((res)=>{
        SetCategories(res.data.data)
      }).catch((error)=>{
        console.log(error.response.data.message)
      })

      await axiosInstance.get('/products').then((res)=>{
        setProducts(res.data.data);
      }).catch((error)=>{
        console.log(error.response.data.message)
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
              ?<Button variant='contained' size='small' onClick={handleClickCategoryFormOpen}><AddIcon/>Add New Category</Button>
              :''
            }
        </Box>
        {
          isLoading?
          <Box sx={{textAlign:'center'}}>
            <LinearProgress color="teal" />
          </Box>
          :categories
          ?
            <Grid container spacing={2}>
            {categories&&categories.map((category)=>{
              return(
                !configure ?
                category.status === true &&
                <Grid key={category._id}>
                  <CardActionArea onClick={() => handleCardClick(category)}>
                  <Card variant='outlined' sx={{width:240}} >
                    <CardHeader sx={{height:100}}
                      action={
                        configure?
                          <IconButton aria-label="settings" color='primary' onClick={()=>handleClickEditCategoryFormOpen(category)}>
                          <EditIcon fontSize='small'/>
                        </IconButton>
                        :''
                      }
                      title={category.name}
                      subheader={category.description}
                    />                   
                      <Box sx={{display:'flex',justifyContent:'center'}}> 
                        <CardMedia
                          component="img"
                          sx={{ height: 100, objectFit: 'contain',padding:1}}
                          image={category.imageURL?category.imageURL:categoryImage}
                        />          
                      </Box>        
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" sx={{textAlign:'center'}}>
                        product count : {products.filter(product => product.category?._id === category._id).length}
                      </Typography>
                    </CardContent>
                  </Card>
                  </CardActionArea>
                </Grid>
                :
                <Grid key={category._id}>
                  <Card variant='outlined' sx={{width:240}} >
                    <CardHeader sx={{height:100}}
                      action={
                        configure?
                          <IconButton aria-label="settings" color='primary' onClick={()=>handleClickEditCategoryFormOpen(category)}>
                          <EditIcon fontSize='small'/>
                        </IconButton>
                        :''
                      }
                      title={category.name}
                      subheader={category.description}
                    />                   
                      <Box sx={{display:'flex',justifyContent:'center'}}> 
                        <CardMedia
                          component="img"
                          sx={{ height: 100, objectFit: 'contain',padding:1}}
                          image={category.imageURL?category.imageURL:categoryImage}
                        />          
                      </Box>        
                    <CardContent>
                    <Chip  variant='filled' size='small' sx={{color:'white',background: category.status === true ? green[400] : orange[400],width:'100%'}} label={category.status === true ? 'Active' : 'Inactive'} />
                      <Typography variant="body2" color="text.secondary" sx={{textAlign:'center'}}>
                        product count : {products.filter(product => product.category?._id === category._id).length}
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

export default CategoryList