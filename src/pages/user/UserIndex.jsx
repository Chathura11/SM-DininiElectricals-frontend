import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UsersList from './UsersList'
import UserView from './UserView'
import UserForm from './UserForm'
import MainHeader from '../main/MainHeader';
import { Stack } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const UserIndex = ({authUser,isLoggedIn}) => {

  const stackStyle = {
    margin: '20px 0',
  };

  return (
    <Stack style={stackStyle} spacing={2}>
      <MainHeader tag={'User Accounts'} icon={<AccountCircleIcon sx={{ width: 40, height: 40 }} />} />
      {isLoggedIn&&authUser&&
        <Routes>
          <Route path="/" element={<UsersList authUser={authUser} isLoggedIn={isLoggedIn}/>}></Route>
          <Route path='/user/:userId' element={<UserView profile={false} authUser={authUser} isLoggedIn={isLoggedIn}/>}></Route>
          <Route path='/user/edit/:userId' element={<UserForm authUser={authUser} profile={false} edit={true}/>}></Route>
        </Routes>
      }
    </Stack>
  )
}

export default UserIndex