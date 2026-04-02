import { Box, Paper, Stack, Typography } from '@mui/material'
import React from 'react'
import NodataImg from '../assets/nodata.jpg'

const NoDataPage = () => {
    const stackStyle={
        margin:'20px 0',
      }
      return (
        <Stack style={stackStyle} spacing={2}>
        <Paper elevation={0}>
          <Stack spacing={2}>
              <Stack sx={{textAlign:'center'}} spacing={1}>
                  <Typography variant='h5'>No data found!</Typography>
              </Stack>
              <Box sx={{textAlign:'center'}}>
                  <img src={NodataImg} style={{width:'430px'}} alt="accessDenied" />    
              </Box>
              
          </Stack>
        </Paper>
        </Stack>
      )
}

export default NoDataPage