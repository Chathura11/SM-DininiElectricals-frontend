import {  Box, Grid, IconButton, LinearProgress, Paper, Stack, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { blueGrey, lightBlue} from '@mui/material/colors';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import axiosInstance from '../../api/api';
import Table from '@mui/material/Table';

const UserView = ({authUser,isLoggedIn,profile}) => {
  const [user,setUser] = useState([])
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();
  const {userId} = useParams()
  useEffect(() => {
   
    async function load(){
      setIsLoading(true)
      let url;
      if(profile){
        url = '/users/edit/'+authUser._id
      }else{
        url = '/users/edit/'+userId
      }
      await axiosInstance.get(url).then((res)=>{
        setUser(res.data.data)
        setIsLoading(false)
      }).catch(error=>{
        console.log(error.response);
        setIsLoading(false)
      })
    }try{
      load()
    }catch(error){
      console.log(error.message)
    }

  }, [userId,authUser,profile])

  const paperStyle={
    padding:'20px',
    backgroundColor: '#FFFFFFED',
  }

  const editButtonHandle=()=>{
    if(profile){
      navigate('/user-profile/edit');
    }else{
      navigate('/admin-panel/user/edit/'+userId);
    }
   
  }

  const handlePermission = (user) =>{
    if(isLoggedIn&&authUser){
      if(authUser._id === user._id){
        return false
      }else if(user._id === 1){
        return true
      }else if(authUser.permissions.includes("manage_users")){
        return false
      }else{
        return true
      }
    }else{
      return true
    }
  }

  return (
    
    <>
      {isLoading?
        <Box sx={{textAlign:'center'}}>
          <LinearProgress color="teal" />
        </Box>
        :
        <Grid container spacing={2}>
          <Grid size={4}>
          <Stack spacing={1} sx={{height:'100%'}}>
            <Paper elevation={0} style={paperStyle} sx={{height:'100%'}}>
              
              <Box sx={{textAlign:'center',padding:2}}>
                <AssignmentIndIcon sx={{fontSize:'200px',color:blueGrey[900]}}/> 
              </Box>
              <Stack spacing={0}>
                <Typography variant='p' sx={{fontSize:'20px',fontFamily:'revert-layer'}}>{user.name}</Typography>
                <Typography variant='p' sx={{fontSize:'15px',color:lightBlue[500]}}>{user.role}</Typography> 
              </Stack>
              <Stack direction='row' spacing={1}>
                <EmailIcon/>
                <Typography variant='p' >{user.email}</Typography>
              </Stack>
            </Paper>
          </Stack>
          </Grid>
          <Grid size={8}>
            <Stack spacing={1} sx={{height:'100%'}}>
              <Paper elevation={0} style={paperStyle} sx={{height:'100%'}}>
                  <Stack spacing={0}>
                    <Box sx={{textAlign:'end'}}>
                      <IconButton size="small" aria-label="edit" color='primary' onClick={editButtonHandle} disabled={handlePermission(user)}>
                        <EditIcon fontSize="inherit"/>
                      </IconButton>
                    </Box>
                  </Stack>
                  <Grid container spacing={2} sx={{textAlign:'center'}}>
                    <Grid size={12}>
                        <Stack spacing={1}>
                        <TableContainer component={Paper}>
                          <Table style={{color:'white',backgroundColor:'#263238'}} sx={{ minWidth: 650}} aria-label="simple table">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{textAlign:'center',color:'white'}}>Permissions</TableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                          {user.permissions&&user.permissions.map((permission)=>{
                            return(
                              <TableRow key={permission} sx={{ '&:last-child td, &:last-child th': { border: 0 }}}>
                                <TableCell sx={{color:'white'}}>{permission}</TableCell>
                              </TableRow>
                            )
                          })}
                          </TableBody>
                          </Table>
                        </TableContainer>
                      </Stack>
                    </Grid>
                  </Grid>
              </Paper>
            </Stack>
          </Grid>
        </Grid>  
      }
    </>
  )
}

export default UserView