import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Box,
  Paper
} from '@mui/material';
import axios from '../../api/api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';

const AccountJournalPage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJournalEntries();
  }, []);

  const fetchJournalEntries = async () => {
    try {
      const res = await axios.get('/accounts/journal-list');
      setEntries(res.data);
    } catch (err) {
      console.error('Error fetching journal entries:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const formatted = entries.map(entry => ({
      Date: new Date(entry.date).toLocaleDateString(),
      Description: entry.description,
      'Debit Account': entry.debit.account?.name || '',
      'Debit Amount': entry.debit.amount,
      'Credit Account': entry.credit.account?.name || '',
      'Credit Amount': entry.credit.amount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formatted);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Journal Entries');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, `JournalEntries_${Date.now()}.xlsx`);
  };

  function handleBack(){
    navigate('/accounts')
  } 

  return (
    <Paper sx={{ padding:3 }}>
      <Typography variant="h4" gutterBottom fontWeight={700} textAlign="center" color="primary" mb={4}>
        Journal Entries
      </Typography>

      <Box sx={{textAlign:'end',mb:2}}>
        <Button variant="contained" color="primary" onClick={exportToExcel}>
            Export to Excel
        </Button>
        <Button variant="contained" sx={{width:'200px',ml:2}} onClick={handleBack}>
            Back
        </Button>
      </Box>

      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper variant='outlined'>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Debit Account</strong></TableCell>
                <TableCell><strong>Debit Amount</strong></TableCell>
                <TableCell><strong>Credit Account</strong></TableCell>
                <TableCell><strong>Credit Amount</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry, i) => (
                <TableRow key={i}>
                  <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>{entry.debit.account?.name}</TableCell>
                  <TableCell>{entry.debit.amount.toFixed(2)}</TableCell>
                  <TableCell>{entry.credit.account?.name}</TableCell>
                  <TableCell>{entry.credit.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Paper>
  );
};

export default AccountJournalPage;
