import { Box, Paper, Stack, Typography } from '@mui/material'
import React from 'react'
import AccessDeniedImg from '../assets/403.svg'

const AccessDeniedPage = () => {
  const stackStyle={
    margin:'20px 0',
  }
  return (
    <Stack style={stackStyle} spacing={2}>
    <Paper elevation={0}>
      <Stack spacing={2}>
          <Stack sx={{textAlign:'center'}} spacing={1}>
              <Typography variant='h3'>403</Typography>
              <Typography variant='h5'>Access Denied</Typography>
              <Typography variant='p' color='GrayText'>Sorry,but you don't have permission to access this page</Typography>
              <Typography variant='p' color='GrayText'>Please contact your system administrator.</Typography>
          </Stack>
          <Box sx={{textAlign:'center'}}>
              <img src={AccessDeniedImg} style={{width:'430px'}} alt="accessDenied" />    
          </Box>
          
      </Stack>
    </Paper>
    </Stack>
  )
}

export default AccessDeniedPage