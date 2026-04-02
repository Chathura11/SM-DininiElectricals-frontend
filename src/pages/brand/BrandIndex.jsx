import { Route, Routes } from 'react-router-dom';
import { Stack } from '@mui/material'
import React from 'react'
import MainHeader from '../main/MainHeader'
import BrandList from './BrandList';
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined';
import BrandForm from './BrandForm';

const BrandIndex = ({isLoggedIn,authUser,configure}) => {
    const stackStyle={
        margin:'20px 0',
    }

  return (
    <Stack style={stackStyle} spacing={2}>
        <MainHeader tag={'Brands'} icon={<StyleOutlinedIcon  sx={{width: 40, height: 40}}/>}/>  
            {isLoggedIn&&authUser&&
                <Routes>
                    <Route path='/' element={<BrandList authUser={authUser} configure={configure}/>}></Route>
                    <Route path='/brand/edit/:brandId' element={<BrandForm edit={true}/>}></Route>
                </Routes>
            }
    </Stack>
  )
}

export default BrandIndex