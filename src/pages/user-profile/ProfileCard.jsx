import { Paper ,Button, Stack, Divider, Typography} from '@mui/material'
import React from 'react'
import SignIn from '../landing/SignIn'
import { useNavigate } from 'react-router-dom'
import { lightBlue } from '@mui/material/colors'

const ProfileCard = ({authUser,logOut}) => {

    const navigate = useNavigate()

    const handleAdminPanel =()=>{
        navigate('/admin-panel')
    }

    const handleClickProfile = ()=>{
        navigate('/user-profile/user')
    }

    const handleLogout=(e)=>{
        e.preventDefault()
        navigate('/')
        logOut(e)
    }

  return (
    <div>
        <Paper elevation={0} sx={{padding:2,background:'#212121FF'}}>
            {
                authUser?
                <Stack sx={{textAlign:'center'}} spacing={1}>
                    <Stack>
                        <Typography color='white' variant='p'>{authUser.name}</Typography>
                        <Typography sx={{fontSize:'10px',color:lightBlue[500]}} variant='p'>{authUser.role}</Typography>
                    </Stack>
                    <Divider sx={{backgroundColor:'white'}}/>
                    <Button variant='text' color='teal' onClick={handleClickProfile}>Profile</Button>
                    {authUser.permissions.includes("configure_settings")&&
                        <Button sx={{color:'white'}}  variant='outlined' onClick={handleAdminPanel}>Admin Panel</Button>
                    }
                    <Button variant='contained' onClick={handleLogout}>Sign Out</Button>
                </Stack>
                :
                <Stack>
                    <SignIn profile={true}/>
                </Stack>
            }
        </Paper>
    </div>
  )
}

export default ProfileCard