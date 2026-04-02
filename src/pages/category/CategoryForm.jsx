import { Alert, AlertTitle, Box, Button, FormControlLabel, Input, LinearProgress, Paper, Stack, Switch, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useLocation, useParams } from 'react-router-dom';
import axiosInstance from '../../api/api';
import MediaUpload from "../../utils/MediaUpload";

const CategoryForm = ({edit}) => {
  const location = useLocation();
  const [data, setData] = useState({
    name:'',
    description:'',
    imageURL:'',
    status:true,
    remark:''
  });

const [error,setError] = useState('')
const [response,setResponse] = useState('')
const [isLoading, setIsLoading] = useState(false);
const [serverError,setServerError] = useState('')
const {categoryId} = useParams();
const [imageFile,setImageFile] = useState(null);
const [imageUploading,setImageUploading] = useState(false);

const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
};

useEffect(() => {
    async function load(){
      setIsLoading(true)
      if(edit){
            
        setData({
          name:location.state.name,
          description:location.state.description,
          imageURL:location.state.imageURL,
          status:location.state.status,
          remark:location.state.remark
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
 
}, [categoryId,edit,location.state])


const submitHandle =(e)=>{
    e.preventDefault()
    setError('')
    setServerError('')
    setResponse('')
    if(edit){
        try{
            axiosInstance.put('/categories/'+categoryId,data).then((res)=>{
                setResponse("Category Updated Successfully!")
            }).catch(e=>{
                setError(e.response.data)
            })
        }catch(e){
            setServerError(e.response.data)
        }
    }else{
        try{
              axiosInstance.post('/categories',data).then((res)=>{
                setResponse("Category created Successfully!")
                setData({
                  name:'',
                  description:'',
                  imageURL:'',
                  status:true,
                  remark:''
                })
            }).catch((e)=>{
                setError(e.response.data.message)
            })
        }catch(e){
            setServerError(e.message)
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
          error={error.name ? true : false}
          label="Name"
          variant="outlined"
          name="name"
          helperText={error.name || ''}
          onChange={handleChange}
          value={data.name || ''}
          size='small'
          // required
        />
        <TextField
          label="Description"
          variant="outlined"
          name="description"
          onChange={handleChange}
          value={data.description || ''}
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

export default CategoryForm