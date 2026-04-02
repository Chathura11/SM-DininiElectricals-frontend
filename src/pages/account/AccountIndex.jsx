import { Stack } from '@mui/material'
import React from 'react'
import SaleHeader from '../sale/SaleHeader'
import { Route, Routes } from 'react-router-dom'
import AccountPage from './AccountPage'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountHandlePage from './AccountHandlePage'
import AccountJournalPage from './AccountJournalPage'

function AccountIndex({isLoggedIn,authUser}) {
  
    const stackStyle={
        margin:'20px 0',
    }

  return (
    <Stack style={stackStyle} spacing={2}>
        <SaleHeader tag={'Accounts'} icon={<AccountBalanceIcon  sx={{width: 40, height: 40}}/>}/>  
            {isLoggedIn&&authUser&&
                <Routes>     
                    <Route path='/manage' element={<AccountHandlePage authUser={authUser}/>}></Route>               
                    <Route path='/journal' element={<AccountJournalPage authUser={authUser}/>}></Route>               
                    <Route path='/' element={<AccountPage authUser={authUser}/>}></Route>                   
                </Routes>
            }
    </Stack>
  )
}

export default AccountIndex