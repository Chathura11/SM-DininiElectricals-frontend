import { TextField,Stack, Box,Button, Typography, Alert, AlertTitle} from '@mui/material'
import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const SignIn = () => {
  const navigate = useNavigate()

  const [values,setValues]=useState({
    username:'',
    password:''
  })
  const handleTextFields =(e)=>{
    const {name,value} = e.target;
    setValues({
      ...values,
      [name]:value
    });
  }

  const {authUser,
    login,
    logout,
    errors,
    isLoggedIn} =useAuth()
 

  const logIn =(e)=>{
    e.preventDefault()
    login(values)
  }

  const logOut =(e)=>{
    e.preventDefault()
    logout()
  }
  const clickHandlle=()=>{
    navigate('/sell')
}
  return (
    <Stack spacing={2}>
        {isLoggedIn
          ?
            <Typography>{authUser.name}</Typography>
          :
           <>
              <TextField  
                label="Enter your username" 
                variant="outlined" 
                name="username"
                onChange={handleTextFields}
                value={values.username}
              />
              <TextField  
                label="Password" 
                variant="outlined"  
                type="password"
                name="password"
                onChange={handleTextFields}
                value={values.password}
              />
              {errors.data&&
                <Alert severity="error">
                  <AlertTitle>{errors.data}</AlertTitle>
                </Alert>
              }
           </> 
        }
        {
          isLoggedIn
          ? 
            <Box sx={{textAlign:'end'}}>
              <Button onClick={clickHandlle} sx={{marginRight:2,color:'red'}} variant='outlined'>Get Start</Button>
              <Button variant='contained' onClick={(e)=>{logOut(e)}}>Sign Out</Button>
            </Box>
          :
            <Box sx={{textAlign:'end'}}>
              <Button variant='contained' sx={{marginRight:2}} onClick={(e)=>{logIn(e)}}>Sign In</Button>
              {/* {registerAvailable&&<Button variant='outlined' onClick={()=>handleChange("register")}>Register</Button>} */}
            </Box>
        }
    </Stack>
  )
}

export default SignIn