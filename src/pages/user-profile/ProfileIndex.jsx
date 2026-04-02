import { Paper, Stack } from '@mui/material'
import React from 'react'
import MainHeader from '../main/MainHeader'
import PersonIcon from '@mui/icons-material/Person';
import { Route, Routes } from 'react-router-dom';
import UserView from '../user/UserView';
import UserForm from '../user/UserForm';

const ProfileIndex = ({authUser,isLoggedIn}) => {
    const stackStyle={
        margin:'20px 0',
    }

    const paperStyle={
        padding:'20px',
        background:"#FFFFFF77"
    }

  return (
    <Stack style={stackStyle} spacing={2}>
        <MainHeader tag={'Profile'} icon={<PersonIcon  sx={{width: 40, height: 40}}/>}/>  
        <Paper style={paperStyle} elevation={0}>
            {isLoggedIn&&authUser&&
                <Routes>
                    <Route path='/user' element={<UserView profile={true} authUser={authUser} isLoggedIn={isLoggedIn}/>}></Route>
                    <Route path='/edit' element={<UserForm profile={true} authUser={authUser} edit={true}/>}></Route>
                </Routes>
            }
        </Paper> 
    </Stack>
  )
}

export default ProfileIndex