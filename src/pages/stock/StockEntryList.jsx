import {
  Paper,
  Stack,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Button,
  Box,
  LinearProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import axiosInstance from '../../api/api';
import StockEntryForm from './StockEntryForm';
import { useSidePanel } from '../../context/SidePanelContext';
import StockEntryDetails from './StockEntryDetails';

const StockEntryList = () => {
  const [stockEntries, setStockEntries] = useState([]);
  const { openSidePanel } = useSidePanel();
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    fetchStockEntries();
  }, []);

  const fetchStockEntries = async () => {
    try {
      const res = await axiosInstance.get('/stocks/stock-entries-detailed');
      setStockEntries(res.data.data);
      console.log(res.data.data)
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching stock entries:', err);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this stock entry?')) {
      try {
        await axiosInstance.delete(`/stock-entries/${id}`);
        setStockEntries((prev) => prev.filter((entry) => entry._id !== id));
      } catch (err) {
        console.error('Error deleting stock entry:', err);
      }
    }
  };

  const handleOpenForm = () => {
    openSidePanel('Add New Stock Entry', <StockEntryForm />);
  };

  const handleOpenView =(data)=>{
    openSidePanel('Stock Entry Details', <StockEntryDetails data={data}/>);
  }

  return (
    <>
      <Paper elevation={1} sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="end">
            <Button variant="contained" size='small' startIcon={<AddIcon />} onClick={handleOpenForm}>
              New Entry
            </Button>
          </Stack>
          {
            isLoading
            &&
              <Box sx={{textAlign:'center'}}>
                <LinearProgress color="teal" />
              </Box>
          }
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Total</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockEntries.map((entry) => (
                <TableRow key={entry._id}>
                  <TableCell>{entry.invoiceNumber || 'N/A'}</TableCell>
                  <TableCell>{entry.supplier?.name || '-'}</TableCell>
                  <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell>{entry.location || '-'}</TableCell>
                  <TableCell>{entry.totalAmount?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View">
                      <IconButton color="primary" onClick={()=>handleOpenView(entry)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    {/* <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDelete(entry._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Stack>
      </Paper>
    </>
  );
};

export default StockEntryList;
