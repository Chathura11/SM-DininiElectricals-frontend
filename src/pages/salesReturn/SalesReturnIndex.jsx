import { Stack } from '@mui/material'
import React from 'react'
import SaleHeader from '../sale/SaleHeader'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SalesReturnPage from './SalesReturnPage';
import { Route, Routes } from 'react-router-dom';
import SalesReturnListPage from './SalesReturnListPage';

const SalesReturnIndex = ({isLoggedIn,authUser}) => {
    const stackStyle={
        margin:'20px 0',
    }

  return (
    <Stack style={stackStyle} spacing={2}>
        <SaleHeader tag={'Sales Return'} icon={<CompareArrowsIcon  sx={{width: 40, height: 40}}/>}/>  
            {isLoggedIn&&authUser&&
                <Routes>
                    {/* <Route path='/' element={<SaleContent authUser={authUser}/>}></Route> */}
                    <Route path='/' element={<SalesReturnPage authUser={authUser}/>}></Route>
                    <Route path='/all' element={<SalesReturnListPage authUser={authUser}/>}></Route>
                </Routes>
            }
    </Stack>
  )
}

export default SalesReturnIndex