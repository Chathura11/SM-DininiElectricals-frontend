import styled from '@emotion/styled';
import { Paper, Typography,Grid, TextField, FormControlLabel, Switch ,Button, Box, Stack, LinearProgress, Alert, AlertTitle} from '@mui/material'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../api/api';


const SystemSettingsForm = () => {
  const [isLoading, setIsLoading] = useState(false); 
  const [response,setResponse] = useState();
  const [serverError, setSeverError] = useState();
  const [data, setData] = useState({
    slevel1_isActive:false,
    slevel1Name:'',
    slevel2_isActive:false,
    slevel2Name:'',
    extension_isActive:false,
    note_isActive:false,
    landNumber_isActive:false,
    mobileNumber_isActive:false,
    email_isActive:false,
    designation_isActive:false,
  });

  const Android12Switch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-track': {
      borderRadius: 22 / 2,
      '&:before, &:after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 16,
        height: 16,
      },
      '&:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main),
        )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
        left: 12,
      },
      '&:after': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main),
        )}" d="M19,13H5V11H19V13Z" /></svg>')`,
        right: 12,
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: 'none',
      width: 16,
      height: 16,
      margin: 2,
    },
  }));

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSwitch = (event) => {
    setData({ ...data, [event.target.name]: event.target.checked });
  };

  useEffect(() => {
    async function load(){
      setIsLoading(true)
      await axiosInstance.get('/api/content-config').then((res)=>{
        setData({
          slevel1_isActive:res.data.content_configuration.slevel1_isActive === 0?false:true,
          slevel1Name:res.data.content_configuration.slevel1Name?res.data.content_configuration.slevel1Name:'',
          slevel2_isActive:res.data.content_configuration.slevel2_isActive === 0?false:true,
          slevel2Name:res.data.content_configuration.slevel2Name?res.data.content_configuration.slevel2Name:'',
          extension_isActive:res.data.content_configuration.extension_isActive === 0?false:true,
          note_isActive:res.data.content_configuration.note_isActive === 0?false:true,
          landNumber_isActive:res.data.content_configuration.landNumber_isActive === 0?false:true,
          mobileNumber_isActive:res.data.content_configuration.mobileNumber_isActive === 0?false:true,
          email_isActive:res.data.content_configuration.email_isActive === 0?false:true,
          designation_isActive:res.data.content_configuration.designation_isActive === 0?false:true,
        })
        setIsLoading(false)
      }).catch((error)=>{
        console.log("Error in data retrieving->"+error.response.data.message)
        setIsLoading(false)
      })
    }
    try{
      load()
    }catch(error){
      console.log(error.message)
    }
  }, [])

  const submitHandle=()=>{
    setResponse()
    setSeverError()
    axiosInstance.post('/api/content-config',data).then((res)=>{
      setResponse(res.data.message);
    }).catch((error)=>{
      setSeverError(error.response.data.message)
    })
  }

  return (
    <Paper elevation={0} sx={{padding:2}}>
      <Typography variant='p' sx={{fontSize:'18px'}}>These settings apply for contacts and configure as needed.</Typography>
      <br/>
      <br/>
      <Box>
        {isLoading&&<LinearProgress color="teal" />}
      </Box>
      <form onSubmit={submitHandle}>
        <Paper variant='outlined' sx={{padding:2}}>
        <Stack spacing={2}>
        <Grid container spacing={2} sx={{alignSelf:'center',maxWidth:900,justifyContent:'center',alignItems:'center'}}>
          <Grid item xs={6}>
            <Typography variant='p'>Sorting Level1</Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Name"
              variant="outlined"
              name="slevel1Name"
              onChange={handleChange}
              value={data.slevel1Name}
              size='small'
              // required
            />
          </Grid>
          <Grid item xs={2}>
            <FormControlLabel
              onChange={handleSwitch}
              control={<Android12Switch />}
              name="slevel1_isActive"
              checked={data.slevel1_isActive}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant='p'>Sorting Level2</Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Name"
              variant="outlined"
              name="slevel2Name"
              onChange={handleChange}
              value={data.slevel2Name}
              size='small'
              // required
            />
          </Grid>
          <Grid item xs={2}>
            <FormControlLabel
              onChange={handleSwitch}
              control={<Android12Switch />}
              name="slevel2_isActive"
              checked={data.slevel2_isActive}
            />
          </Grid>

          <Grid item xs={10}>
            <Typography variant='p'>Extension</Typography>
          </Grid>
          <Grid item xs={2}>
            <FormControlLabel
              onChange={handleSwitch}
              control={<Android12Switch />}
              name="extension_isActive"
              checked={data.extension_isActive}
            />
          </Grid>

          <Grid item xs={10}>
            <Typography variant='p'>Email</Typography>
          </Grid>
          <Grid item xs={2}>
            <FormControlLabel
              onChange={handleSwitch}
              control={<Android12Switch />}
              name="email_isActive"
              checked={data.email_isActive}
            />
          </Grid>

          <Grid item xs={10}>
            <Typography variant='p'>Designation</Typography>
          </Grid>
          <Grid item xs={2}>
            <FormControlLabel
              onChange={handleSwitch}
              control={<Android12Switch />}
              name="designation_isActive"
              checked={data.designation_isActive}
            />
          </Grid>

          <Grid item xs={10}>
            <Typography variant='p'>Mobile Number</Typography>
          </Grid>
          <Grid item xs={2}>
            <FormControlLabel
              onChange={handleSwitch}
              control={<Android12Switch />}
              name="mobileNumber_isActive"
              checked={data.mobileNumber_isActive}
            />
          </Grid>

          <Grid item xs={10}>
            <Typography variant='p'>Land Number</Typography>
          </Grid>
          <Grid item xs={2}>
            <FormControlLabel
              onChange={handleSwitch}
              control={<Android12Switch />}
              name="landNumber_isActive"
              checked={data.landNumber_isActive}
            />
          </Grid>

          <Grid item xs={10}>
            <Typography variant='p'>Note</Typography>
          </Grid>
          <Grid item xs={2}>
            <FormControlLabel
              onChange={handleSwitch}
              control={<Android12Switch />}
              name="note_isActive"
              checked={data.note_isActive}
            />
          </Grid>

        </Grid>
        {serverError && (
          <Alert severity="error">
            <AlertTitle>{serverError}</AlertTitle>
            This is an error alert — <strong>check it out!</strong>
          </Alert>
          )}
          {response && (
            <Alert severity="success">
              <AlertTitle>{response}</AlertTitle>
            </Alert>
          )}
        <Box sx={{textAlign:'end'}}>
          <Button variant='contained' type='submit'>Save</Button>
        </Box>
        </Stack>
        </Paper>
      </form>
    </Paper>
  )
}

export default SystemSettingsForm