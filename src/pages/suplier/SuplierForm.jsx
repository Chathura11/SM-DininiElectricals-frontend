import { Alert, AlertTitle, Box, Button, FormControl, FormControlLabel, Input, InputLabel, LinearProgress, MenuItem, Paper, Select, Stack, Switch, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useLocation, useParams } from 'react-router-dom';
import axiosInstance from '../../api/api';
import MediaUpload from "../../utils/MediaUpload";

const SuplierForm = ({edit}) => {

  const location = useLocation();

  const [data, setData] = useState({
    name:'',
    contactName:'',
    nic:'',
    email:'',
    phone:'',
    address:'',
    paymentTerm:'',
    creditLimit:'',
    status:true,
    imageURL:''
  });
  
  const {suplierId} = useParams();
  const [response,setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [serverError,setServerError] = useState('')
  const [payterms,setPayterms] = useState([]);
  const [imageFile,setImageFile] = useState(null);
  const [imageUploading,setImageUploading] = useState(false);

  const handleChange = ({ currentTarget: input }) => {
      setData({ ...data, [input.name]: input.value });
  };

  useEffect(() => {
      async function load(){
        setIsLoading(true);
        await axiosInstance.get('/payterms').then((res)=>{
          setPayterms(res.data.data)
        }) 

        if(edit){
          setData({
            name:location.state.name,
            contactName:location.state.contactName,
            nic:location.state.nic,
            email:location.state.email,
            phone:location.state.phone,
            address:location.state.address,
            paymentTerm:location.state.paymentTerm?._id?location.state.paymentTerm?._id:'',
            creditLimit:location.state.creditLimit,
            status:location.state.status,
            imageURL:location.state.imageURL
          })
        }
      }
      try{
          load().then(()=>{
            setIsLoading(false)
          })      
      }catch(e){
          console.log(e.message)
          setIsLoading(false)
      }
  
  }, [suplierId,edit,location.state])

  const handlePayTermChange = (event) => {
    setData({ ...data, paymentTerm: event.target.value });
  };


  const submitHandle =(e)=>{
      e.preventDefault()
      setServerError('')
      setResponse('')
      if(edit){
          try{
              axiosInstance.put('/suppliers/'+suplierId,data).then((res)=>{
                  setResponse("Supplier updated successfully!")
              }).catch(e=>{
                  setServerError(e.response.data.data)
              })
          }catch(e){
            console.log(e.response)
          }
      }else{
          try{
                axiosInstance.post('/suppliers',data).then((res)=>{
                  setResponse("Supplier added successfully!");
                  setData({
                    name:'',
                    contactName:'',
                    nic:'',
                    email:'',
                    phone:'',
                    address:'',
                    paymentTerm:'',
                    creditLimit:'',
                    status:true,
                    imageURL:''
                  })
              }).catch((e)=>{
                  setServerError(e.response.data.data)
              })
          }catch(e){
              console.log(e.response)
          }
      }
  }

  const HandleUploadImage=(e)=>{
    setImageUploading(true)
    e.preventDefault();
    MediaUpload(imageFile).then((url)=>{
      setData({...data,imageURL:url})
      setImageUploading(false);
    }).catch((error)=>{
      setServerError(error);
      setImageUploading(false);
    });
  }

  return (
      <Paper elevation={0} sx={{padding:2}} >
        <Stack spacing={2} sx={{margin:1}}>
          <Box sx={{textAlign:'center'}}>
            {isLoading&&<LinearProgress color="teal" />}
          </Box>
          <form onSubmit={submitHandle}>
            <Stack spacing={2}>
              <TextField
                label="Name"
                variant="outlined"
                name="name"
                onChange={handleChange}
                value={data.name || ''}
                size='small'
                // required
              />
              <TextField
                label="Contact Name"
                variant="outlined"
                name="contactName"
                onChange={handleChange}
                value={data.contactName || ''}
                size='small'
                // required
              />
              <TextField
                label="NIC"
                variant="outlined"
                name="nic"
                onChange={handleChange}
                value={data.nic || ''}
                size='small'
                // required
              />
              <TextField
                label="Email"
                variant="outlined"
                name="email"
                onChange={handleChange}
                value={data.email || ''}
                size='small'
                // required
              />
              <TextField
                label="Phone"
                variant="outlined"
                name="phone"
                onChange={handleChange}
                value={data.phone || ''}
                size='small'
                // required
              />
              <TextField
                label="Address"
                variant="outlined"
                name="address"
                onChange={handleChange}
                value={data.address || ''}
                size='small'
                // required
              />
              <Box sx={{ width: 200 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Payment Term</InputLabel>
                    <Select
                      value={data.paymentTerm}
                      label="paymentTerm"
                      onChange={handlePayTermChange}
                      size='small'
                    >
                      {payterms&& payterms.map((payterm)=>{
                        return(
                          <MenuItem key={payterm._id} value={payterm._id}>{payterm.description}</MenuItem>
                        )
                      })}
                      
                      
                    </Select>
                  </FormControl>
                </Box>
              <TextField
                label="Credit Limit"
                variant="outlined"
                name="creditLimit"
                onChange={handleChange}
                value={data.creditLimit || ''}
                size='small'
                // required
              />
              <FormControlLabel
                sx={{justifyContent:'start'}}
                onChange={(event)=>setData({...data,status:event.target.checked})}
                control={<Switch color="primary" />}
                label="Status"
                labelPlacement="start"
                checked={data.status}
              />
              <Stack direction='row' spacing={2}>            
                <label htmlFor="contained-button-file">
                    <Input hidden accept="image/*" id="contained-button-file" type="file" name="file_uploaded" onChange={(e)=>setImageFile(e.target.files[0])} />
                    <Button variant="outlined" component="span">
                        SELECT
                    </Button>
                </label>
              </Stack>
              <Button disabled={imageUploading?true:false} variant="outlined" component="span" startIcon={<CloudUploadIcon/>} onClick={HandleUploadImage}>
                Upload Image
              </Button>
              <TextField size='small' onChange={(e)=>setData({...data,imageURL:e.target.value})} style={{ "width": "100%" }} label="Image" value={data.imageURL ? data.imageURL : ""} helperText={"Select image and press upload"} />
              {serverError&&<Alert severity="error">
                <AlertTitle>{serverError}</AlertTitle>
                This is an error alert — <strong>check it out!</strong>
              </Alert>}

              {response&&<Alert severity="success">
                  <AlertTitle>{response || ''}</AlertTitle>
              </Alert>}

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

export default SuplierForm