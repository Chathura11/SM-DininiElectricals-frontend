import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useState } from 'react';
import { useEffect } from 'react';
import { LinearProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SuplierForm from './SuplierForm';
import { useSidePanel } from '../../context/SidePanelContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/api';


function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate()
  const handleClickEditFormOpen = (supplier) => {
    navigate('/admin-panel/suplier/edit/'+supplier._id,{state:supplier});
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{row.name}</TableCell>
        <TableCell component="th" scope="row">{row.contactName}</TableCell>
        <TableCell align="right">{row.phone}</TableCell>
        <TableCell align="right">{row.nic}</TableCell>
        <TableCell align="center">{row.status?"Active":"Inactive"}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={()=>handleClickEditFormOpen(row)}
          >
            <EditIcon fontSize='inherit'/>
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="body1" gutterBottom component="div">
                More Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Payment Term</TableCell>
                    <TableCell>Credit Limit</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Address</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                      <TableCell>{row.paymentTerm?.description || ''}</TableCell>
                      <TableCell>{row.creditLimit}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.address}</TableCell>
                    </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    nic: PropTypes.string.isRequired,
  }).isRequired,
};

const SuplierList = ({configure}) => {
    const [rows,setRows] = useState([])
    const {openSidePanel} = useSidePanel()
    const [isLoading, setIsLoading] = useState(true); 

    const handleClickFormOpen = () => {
      openSidePanel("ADD NEW SUPLIER",<SuplierForm/>)
    };
  
    useEffect(() => {
      async function load(){
  
        await axiosInstance.get('/suppliers').then((res)=>{
            setRows(res.data.data)
          }).catch((error)=>{
            console.log(error.response.data.data)
          })
        setIsLoading(false)
      }
      try{
        load()
      }catch(e){
        console.log(e.message)
        setIsLoading(false)
      } 
    }, [])
  
    return (
      <Paper elevation={0} sx={{padding:2}}>
        <Stack spacing={2}>
          <Box sx={{textAlign:'end'}}>
            {configure
              ?<Button variant='contained' size='small' onClick={handleClickFormOpen}><AddIcon/>Add New Suplier</Button>
              :''
            }
          </Box>
          {
            isLoading
            ?
              <Box sx={{textAlign:'center'}}>
                <LinearProgress color="teal" />
              </Box>
            :
            <TableContainer component={Paper}>
              <Table size='small' aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Suplier Name</TableCell>
                    <TableCell>Contact Name</TableCell>
                    <TableCell align="right">Phone</TableCell>
                    <TableCell align="right">NIC</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <Row key={row.name} row={row} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          }
        </Stack>
      </Paper>
      
    );
}

export default SuplierList