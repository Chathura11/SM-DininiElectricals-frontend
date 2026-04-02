import { Stack } from '@mui/material'
import React from 'react'
import SaleHeader from '../sale/SaleHeader'
import DashboardPage from './DashboardPage'
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Route, Routes } from 'react-router-dom';

function DashboardIndex({isLoggedIn,authUser}) {

    const stackStyle={
        margin:'20px 0',
    }

  return (
    <Stack style={stackStyle} spacing={2}>
        <SaleHeader tag={'Dashboard'} icon={<DashboardIcon  sx={{width: 40, height: 40}}/>}/>  
            {isLoggedIn&&authUser&&
                <Routes>
                    <Route path='/' element={<DashboardPage authUser={authUser}/>}></Route>
                </Routes>
            }
    </Stack>
  )
}

export default DashboardIndex