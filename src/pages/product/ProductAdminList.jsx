import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useState } from 'react';
import { useEffect } from 'react';
import { Button, LinearProgress, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import axiosInstance from '../../api/api';
import { useSidePanel } from '../../context/SidePanelContext';
import ProductForm from './ProductForm';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';


function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate()
  const handleClickEditFormOpen = (product) => {
    navigate('/admin-panel/product/edit/'+product._id,{state:product});
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.price}</TableCell>
        <TableCell align="right">{row.discount}</TableCell>
        <TableCell align="center">{row.status?"Active":"Inactive"}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() =>handleClickEditFormOpen(row)}
          >
            <EditIcon fontSize='inherit'/>
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="body1" gutterBottom component="div">
                More Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                      <TableCell>{row.code}</TableCell>
                      <TableCell>{row.brand?.name}</TableCell>
                      <TableCell>{row.category?.name}</TableCell>
                      <TableCell>{row.description}</TableCell>
                    </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

const ProductList = ({configure}) => {

  const {openSidePanel} = useSidePanel()
  const [rows,setRows] = useState([])
  const [isLoading, setIsLoading] = useState(true); 


  useEffect(() => {
    async function load(){

      // const productResponse = await axiosInstance.get('/products');
      // const products = productResponse.data.data
      // const categorieResponse = await axiosInstance.get('/categories');
      // const categories = categorieResponse.data.data
      // const brandResponse = await axiosInstance.get('/brands');
      // const brands = brandResponse.data.data
      // const suplierResponse = await axiosInstance.get('/suppliers');
      // const supliers = suplierResponse.data.data

      // const list =products && products.map(product=>{
      //   const category = categories.find(category => category.id === product.category_id);
      //   const brand = brands.find(brand => brand.id === product.brand_id);
      //   const suplier = supliers.find(suplier => suplier.id === product.suplier_id);

      //   return {
      //     ...product,
      //     categoryName: category ? category.name : 'Unknown Category',
      //     brandName: brand ? brand.name : 'Unknown brand',
      //     suplierName: suplier ? suplier.name : 'Unknown suplier',
      //   };
      // })
      // setRows(list)
      // setIsLoading(false)

      await axiosInstance.get('/products').then((res)=>{
        setRows(res.data.data);
      }).catch((error)=>{
        console.log(error.response.data.data);
      })
      setIsLoading(false);
    }
    try{
      load()
    }catch(e){
      console.log(e.message)
      setIsLoading(false)
    } 
  }, [])

  const handleClickFormOpen = () => {
    openSidePanel("ADD NEW PRODUCT",<ProductForm/>)
  };

  return (
    <Paper elevation={0} sx={{padding:2}}>
      <Stack spacing={2}>
      <Box sx={{textAlign:'end'}}>
        {configure
          ?<Button variant='contained' size='small' onClick={handleClickFormOpen}><AddIcon/>Add New Product</Button>
          :''      
        }   
      </Box>
      {
        isLoading
        ?
          <Box sx={{textAlign:'center'}}>
            <LinearProgress color="teal" />
          </Box>
        :
        <TableContainer component={Paper}>
          <Table size='small' aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>ProductID</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell align="right">Price&nbsp;(Rs)</TableCell>
                <TableCell align="right">Discount&nbsp;(%)</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows&&rows.map((row) => (
                <Row key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
    </Stack>
    </Paper>
    
  );
}

export default ProductList