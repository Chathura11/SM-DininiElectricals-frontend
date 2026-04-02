import { Avatar, Button, Dialog, DialogActions,LinearProgress, DialogContent, DialogContentText, DialogTitle, Divider, Grid, ListItemButton, Paper, Stack, Typography} from '@mui/material'
import { Box} from '@mui/system'
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import {  blueGrey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UserForm from './UserForm';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import axiosInstance from '../../api/api';
import toast from 'react-hot-toast';

const UsersList = ({authUser,isLoggedIn}) => {
  const [users,setUsers] = useState([])
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true); 
  const [open,setOpen] = useState(false)
  const [openUserForm, setOpenUserForm] = useState(false);
  const [deleteId,setDeleteId] = useState()

  useEffect(() => {
    setIsLoading(true)
    async function load(){
      axiosInstance.get('/users/all').then((res)=>{
        setUsers(res.data.data)
        setIsLoading(false)
      }).catch((error)=>{
        console.log(error.message)
        setIsLoading(false)
      })


      
    }
    try {
      load()
      
    } catch (error) {
      console.log(error.message)
    }
  }, [])
    
  const clickHandle =(data)=>{
    navigate("/admin-panel/user/"+data._id)
  }

  const editButtonHandle=(id)=>{
    navigate('/admin-panel/user/edit/'+id);
  }

  const deleteButtonHandle=(e,id)=>{
    e.preventDefault();
    axiosInstance.delete('/users/delete/'+id).then((res)=>{
      toast.success(res.data.message);
      setIsLoading(false)
      setOpen(false)
      let newUsers=[]
          newUsers = users&&users.filter(function(item) {
              return item._id !== id
          })
          setUsers(newUsers)           
    }).catch(error=>{
      console.log(error.response.data.message)
      setIsLoading(false)
    })
  }

  const handleClickOpen = (id) => {
    setOpen(true);
    setDeleteId(id)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickUserFormOpen = () => {
    setOpenUserForm(true);
  };

  const handleUserFormClose = () => {
    setOpenUserForm(false);
  };

  const handlePermission = (det) =>{
    if(isLoggedIn&&authUser){
      if(authUser._id === det._id){
        return false
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

      <Paper elevation={0} sx={{padding:2}}>
        <Box sx={{textAlign:'end'}}>
            <Button variant='contained' size='small' onClick={handleClickUserFormOpen}><AddIcon/>Add New User</Button>
        </Box>

        <Box variant='outlined' sx={{marginTop:2}}>
          <Grid container spacing={0} >

            <Grid container spacing={2} size={12} sx={{backgroundColor:'#E5F3FD',height:'50px'}}>
              <Grid size={2}>

              </Grid>
              <Grid size={3}  sx={{alignSelf:'center'}}>
                <Typography variant='body2'>Name</Typography>
              </Grid>
              <Grid size={3}  sx={{alignSelf:'center'}}>
                <Typography  variant='body2'>Email</Typography>
              </Grid>
              <Grid size={3} sx={{alignSelf:'center'}}>
                <Typography  variant='body2'> User Name</Typography>
              </Grid>
              <Grid size={1} sx={{alignSelf:'center'}}>
                <Typography  variant='body2'>Actions</Typography>
              </Grid>
            </Grid>

            {users&&users.map((det,index)=>{
              return(
                  <Grid size={12} key={det._id}>
                    <Divider />
                    <Stack direction="row">
                      <Paper variant='elevation' sx={{width:20,height:20,alignSelf:'center',textAlign:'center',color:'white',bgcolor:'ButtonText'}}>
                        {index+1}
                      </Paper>
                      <ListItemButton onClick={()=>clickHandle(det)}>
                        
                        <Grid container size={12}>
                          <Grid size={1} >
                            <Avatar sx={{bgcolor:'#9ABDDC',alignSelf:'center'}} ><AssignmentIndIcon/></Avatar>
                          </Grid>
                          <Grid size={4} sx={{alignSelf:'center'}}>
                            {/* <Typography variant='p' sx={{color:blueGrey[900]}}>{det.name.toUpperCase()}</Typography> */}
                            <Typography variant='p' sx={{color:blueGrey[900]}}>{det.name}</Typography>
                          </Grid>
                          <Grid size={4} sx={{alignSelf:'center'}}>
                            <Typography variant='p' sx={{color:blueGrey[900]}}>{det.email}</Typography>
                          </Grid>
                          <Grid size={3} sx={{alignSelf:'center'}}>
                          <Typography variant='p' sx={{color:blueGrey[900]}}>{det.username}</Typography>
                          </Grid>
                        </Grid>
                      
                      </ListItemButton>

                      <Box sx={{textAlign:'end',alignSelf:'center'}}>
                        <Button sx={{marginRight:2}} color="blueGray1" variant='text' onClick={()=>editButtonHandle(det._id)} disabled={handlePermission(det)}><EditIcon fontSize="inherit"/></Button>
                        {det.id===1
                          ?<Button variant='text' color='inherit' >
                            <LockPersonIcon fontSize="inherit"/>
                          </Button>
                          :<Button variant='text' color="error" onClick={()=>handleClickOpen(det._id)} disabled={handlePermission(det)}>
                            <DeleteIcon fontSize="inherit" />
                          </Button>
                        }
                      </Box>

                    </Stack>
                    <Divider />
                  </Grid>
              )
            })} 
          </Grid>
        </Box>
        <Box sx={{textAlign:'center'}}>
          {isLoading&&<LinearProgress color="teal" />}
        </Box>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to delete this"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              The customer will be deleted permenantly.You cannot recover details of this customer again.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>no</Button>
            <Button color="error" onClick={(e)=>deleteButtonHandle(e,deleteId)} autoFocus>
              yes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Send Requirement form Dialog */}
        <Dialog open={openUserForm} onClose={handleUserFormClose}>
          <DialogTitle>Add New User</DialogTitle>
          <DialogContent>
            
            <UserForm edit={false} setUsers={setUsers}/>
            
          </DialogContent>
          <DialogActions>
            <Button variant='outlined' onClick={handleUserFormClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Paper>

    </>
  )
}

export default UsersList