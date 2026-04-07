import { Stack } from '@mui/material'
import React from 'react'
import SaleHeader from '../sale/SaleHeader'
import { Route, Routes } from 'react-router-dom';
import LoanPaymentPage from './LoanPaymentPage';
import CustomerPaymentDetails from './CustomerPaymentDetails';
import { RealEstateAgent } from '@mui/icons-material';

function LoanPaymentIndex({isLoggedIn,authUser}) {
    const stackStyle={
        margin:'20px 0',
    }

  return (
    <Stack style={stackStyle} spacing={2}>
        <SaleHeader tag={'Loan Payments'} icon={<RealEstateAgent sx={{width: 40, height: 40}}/>}/>  
            {isLoggedIn&&authUser&&
                <Routes>
                    <Route path='/' element={<LoanPaymentPage authUser={authUser}/>}></Route>
                    <Route path='/:loanId/payments' element={<CustomerPaymentDetails authUser={authUser}/>}></Route>
                </Routes>
            }
    </Stack>
  )
}

export default LoanPaymentIndex