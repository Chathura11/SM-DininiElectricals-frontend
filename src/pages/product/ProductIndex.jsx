import { Route, Routes } from 'react-router-dom';
import { Stack } from '@mui/material'
import React from 'react'
import MainHeader from '../main/MainHeader'
import ProductForm from './ProductForm';
import ProductAdminList from './ProductAdminList';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';

const ProductIndex = ({isLoggedIn,authUser,configure}) => {
    const stackStyle={
        margin:'20px 0',
    }
  return (
    <Stack style={stackStyle} spacing={2}>
        <MainHeader tag={'Products'} icon={<ListAltOutlinedIcon  sx={{width: 40, height: 40}}/>}/>  
            {isLoggedIn&&authUser&&
                <Routes>
                    <Route path='/' element={<ProductAdminList authUser={authUser} configure={configure}/>}></Route>
                    <Route path='/product/edit/:productId' element={<ProductForm edit={true}/>}></Route>
                </Routes>
            }
    </Stack>
  )
}

export default ProductIndex