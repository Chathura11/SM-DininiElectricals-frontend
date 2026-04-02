import { Route, Routes } from 'react-router-dom';
import { Stack } from '@mui/material'
import React from 'react'
import MainHeader from '../main/MainHeader'
import CategoryList from './CategoryList';
import TableViewOutlinedIcon from '@mui/icons-material/TableViewOutlined';
import CategoryForm from './CategoryForm';

const CategoryIndex = ({isLoggedIn,authUser,configure}) => {
    const stackStyle={
        margin:'20px 0',
    }

  return (
    <Stack style={stackStyle} spacing={2}>
        <MainHeader tag={'Categories'} icon={<TableViewOutlinedIcon  sx={{width: 40, height: 40}}/>}/>  
            {isLoggedIn&&authUser&&
                <Routes>
                    <Route path='/' element={<CategoryList authUser={authUser} configure={configure}/>}></Route>
                    <Route path='/category/edit/:categoryId' element={<CategoryForm edit={true}/>}></Route>
                </Routes>
            }
    </Stack>
  )
}

export default CategoryIndex