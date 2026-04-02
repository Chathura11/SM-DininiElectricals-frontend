import { Avatar, Paper, Typography } from '@mui/material'
import React from 'react'

import { blueGrey } from '@mui/material/colors';

function DashboardHeader({tag,icon}) {
  return (
    <div>
        <Paper elevation={0} sx={{ height: 100, display: 'flex', alignItems: 'center',paddingLeft:2 }}>
            <Avatar sx={{ bgcolor: blueGrey[900] ,width: 56, height: 56}} variant="rounded">
              {icon}
            </Avatar>
            <Typography sx={{ fontWeight: 'bold', fontSize: 30, margin: '0 50px',color:blueGrey[600] }}>{tag}</Typography>  
        </Paper>
    </div>
  )
}

export default DashboardHeader