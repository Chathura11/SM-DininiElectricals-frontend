import { Alert, AlertTitle, Box, Button, FormControl, InputLabel, LinearProgress, MenuItem, Paper, Select, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/api'; 

const UserForm = ({edit,setUsers,profile,authUser}) => {
  const [data, setData] = useState({
    name:'',
    email:'',
    username:'',
    password:'',
    role:'',
  });

  const [error, setError] = useState({
    name:false,
    email:false,
    username:false,
    password:false,
  });

  let errors = {}
  errors.name = "Customer Name is required"
  errors.email = "Email is required"
  errors.username = "Username is required"
  errors.password = "Password is required"
  errors.confirmPassword = "Password is not match!"


  const [serverError, setSeverError] = useState();
  const [response,setResponse] = useState();
  const {userId} = useParams();
  const [confirmPassword,setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleRolesChange = (event) => {
    setData({ ...data, role: event.target.value });
  };

  useEffect(() => {
    async function load(){
      if(edit){
        setIsLoading(true)
        let url;
        if(profile){
          url = '/users/edit/'+authUser._id
        }else{
          url = '/users/edit/'+userId
        }
        await axiosInstance.get(url).then((res)=>{
          setData({
            name:res.data.data.name,
            email:res.data.data.email,
            username:res.data.data.username,
            password:'',
            role:res.data.data.role
          
          });
          setIsLoading(false)
        }).catch(e=>{
          setSeverError(e.response.data);
          
          setIsLoading(false)
        })
      }
    }
    try{
      load()
    }catch(error){
      console.log(error.message)
    }
  }, [userId,edit,authUser,profile])


  const submitHandle =(e)=>{
    let errors={
      name:false,
      email:false,
      username:false,
      password:false,
      confirmPassword:false,
    }

    if (!data.name.trim()) {
      errors={...errors,name:true}
    }
    if (!data.email.trim()) {
      errors={...errors,email:true}
    }
    if (!data.username.trim()) {
      errors={...errors,username:true}
    }
    if (!edit && !data.password.trim()) {
      errors={...errors,password:true}
    }
    if(data.password !== confirmPassword){
      errors={...errors,confirmPassword:true}
    }
    setError(errors)
    e.preventDefault();

    if(!(errors.name||errors.email||errors.username||errors.password || errors.confirmPassword)){
      try {
        if(edit){
          let url;
          if(profile){
            url = '/users/edit/'+authUser._id
          }else{
            url = '/users/edit/'+userId
          }
          //check that allow to edit superAdmin account
          if(!profile&& authUser.role !=='superAdmin' ){
            if(authUser._id !== userId){
              setSeverError('Not Allowed!')
              return
            }
          }
          axiosInstance.put(url,data).then((res)=>{
            setResponse(res.data.success);
          }).catch(e=>{
            setSeverError(e.response.data.data);
          })
        }else{
          axiosInstance.post('/users/register',data).then((res)=>{
            loadUsers()
            setResponse(res.data.data);
            setData({
              name:'',
              email:'',
              role:'',
              username:'',
              password:'',
            })
            setConfirmPassword('')
          }).catch(e=>{
            setSeverError(e.response.data.data);
            // console.log(e.response.data.data);
          })
        }
        
      }catch (error) {
          console.log(error.message);
      }
    }
  }

  const loadUsers =async()=>{
    await axiosInstance.get('/users/all').then((res)=>{
      setUsers(res.data.users)
    }).catch((error)=>{
      console.log(error.message)
    })
  }

  return (
    <Paper elevation={0} sx={{padding:2}} >
      <Stack spacing={2} sx={{margin:1,minWidth:500,textAlign:'center'}}>
        <Box sx={{textAlign:'center'}}>
          {isLoading&&<LinearProgress color="teal" />}
        </Box>
        <form onSubmit={submitHandle}>
          <Stack spacing={2}>
            <TextField
              error={error.name}
              label="Name"
              variant="outlined"
              name="name"
              helperText={error.name && errors.name}
              onChange={handleChange}
              value={data.name}
              size='small'
              // required
            />
            <TextField
              error={error.email}
              label="Email"
              variant="outlined"
              name="email"
              helperText={error.email && errors.email}
              onChange={handleChange}
              value={data.email}
              size='small'
              // required
            />

            {!profile&&
              <Box sx={{ width: 200 }}>
                <FormControl fullWidth disabled={edit&&data&&data.role==="superAdmin"?true:false}>
                  <InputLabel id="demo-simple-select-label">Role</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={data.role}
                    label="Role"
                    onChange={handleRolesChange }
                    size='small'
                  >
                    <MenuItem disabled={true} value={'superAdmin'}>Super Admin</MenuItem>
                    <MenuItem value={'admin'}>Admin</MenuItem>
                    <MenuItem value={'operationsManager'}>Operations Manager</MenuItem>
                    <MenuItem value={'salesPerson'}>Sales Person</MenuItem>
                    <MenuItem value={'manager'}>Manager</MenuItem>
                    <MenuItem value={'inventoryManager'}>Inventory Manager</MenuItem>
                    <MenuItem value={'accountant'}>Accountant</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            
            }

            <TextField
              error={error.username}
              label="User Name"
              variant="outlined"
              name="username"
              helperText={error.username && errors.username}
              onChange={handleChange}
              value={data.username}
              size='small'
              // required
            />
            <TextField
              error={error.password}
              label={edit?"New Password":"Password"}
              variant="outlined"
              name="password"
              helperText={error.password && errors.password}
              onChange={handleChange}
              value={data.password}
              type='password'
              size='small'
              // required
            />
            <TextField
              error={error.confirmPassword}
              label="Confirm Password"
              variant="outlined"
              name="password"
              helperText={error.confirmPassword && errors.confirmPassword}
              onChange={(e)=>{
                setConfirmPassword(e.target.value)
              }}
              value={confirmPassword}
              type='password'
              size='small'
              // required
            />
            {serverError && (
            <Alert severity="error">
              <AlertTitle>{serverError}</AlertTitle>
              This is an error alert — <strong>check it out!</strong>
            </Alert>
            )}
            {response === 1 && (
              <Alert severity="success">
                <AlertTitle>User Updated Successfully!</AlertTitle>
              </Alert>
            )}
            <Box sx={{textAlign:'end'}}>
              <Button type="submit" variant="contained">
                {edit?'Save':'Create'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Stack>
    </Paper>
  )
}

export default UserForm