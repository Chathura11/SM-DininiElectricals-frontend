import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  Paper, Grid, Typography, List, ListItem, ListItemText, Box,
  Divider, LinearProgress, TextField, Button, FormControlLabel, Checkbox
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const SalesReturnListPage = () => {
  const [returns, setReturns] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showAll, setShowAll] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadReturns();
  }, []);

  const loadReturns = async () => {
    try {
      const response = await axiosInstance.get('/sales-return');
      const data = response.data || [];
      setReturns(data);
      filterReturns(data, selectedDate, showAll, searchText);
    } catch (error) {
      console.error('Error fetching returns:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReturns = (data, date, all = false, search = '') => {
    const formatted = dayjs(date).format('YYYY-MM-DD');
    const lowerSearch = search.toLowerCase().trim();

    const filteredData = data.filter((ret) => {
      const dateMatch =
        all ||
        dayjs(ret.createdAt).format('YYYY-MM-DD') === formatted;

      const searchMatch =
        !lowerSearch ||
        ret.transaction?._id?.toLowerCase().includes(lowerSearch) ||
        ret.transaction?.customerName?.toLowerCase().includes(lowerSearch);

      return dateMatch && searchMatch;
    });

    setFiltered(filteredData);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    filterReturns(returns, date, showAll, searchText);
  };

  const handleShowAllToggle = (event) => {
    const all = event.target.checked;
    setShowAll(all);
    filterReturns(returns, selectedDate, all, searchText);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchText(value);
    filterReturns(returns, selectedDate, showAll, value);
  };

  const exportToExcel = () => {
    const exportData = showAll ? returns : filtered;
    const returnSheet = [];

    exportData.forEach(ret => {
      ret.items?.forEach(item => {
        returnSheet.push({
          Date: new Date(ret.createdAt).toLocaleString(),
          TransactionID: ret.transaction?._id || ret.transaction,
          ReturnedBy: ret.returnedBy?.name || 'N/A',
          Product: item.product?.name || 'N/A',
          Category: item.product?.category?.name || 'N/A',
          Brand: item.product?.brand?.name || 'N/A',
          Quantity: item.quantity,
          Reason: item.reason || 'N/A'
        });
      });
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(returnSheet),
      'Returns'
    );

    const filename = showAll
      ? `sales_returns_all_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`
      : `sales_returns_${dayjs(selectedDate).format('YYYYMMDD')}.xlsx`;

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    saveAs(blob, filename);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        fontWeight={700}
        textAlign="center"
        color="primary"
        mb={4}
      >
        Sales Returns
      </Typography>

      {/* FILTERS */}
      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={handleDateChange}
              disabled={showAll}
            />
          </LocalizationProvider>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Search by TransactionID or Name"
            value={searchText}
            onChange={handleSearchChange}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={showAll}
                onChange={handleShowAllToggle}
              />
            }
            label="Show All"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4, md: 2 }}>
          <Button fullWidth variant="contained" onClick={exportToExcel}>
            Download Excel
          </Button>
        </Grid>
      </Grid>

      {/* CONTENT */}
      {loading ? (
        <LinearProgress sx={{ my: 4 }} />
      ) : filtered.length === 0 ? (
        <Typography textAlign="center" mt={4}>
          No sales returns found.
        </Typography>
      ) : (
        <Grid container direction="column" spacing={4}>
          {filtered.map((ret) => (
            <Grid
              item
              key={ret._id}
              sx={{
                border: '1px solid #ddd',
                borderRadius: 2,
                backgroundColor: '#fff',
                p: 3
              }}
            >
              {/* HEADER */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography>
                    <strong>Date:</strong>{" "}
                    {new Date(ret.createdAt).toLocaleString()}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <Typography>
                    <strong>Customer:</strong>{" "}
                    {ret.transaction?.customerName || 'Walk-in'}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography>
                    <strong>Transaction:</strong>{" "}
                    {ret.transaction?._id || ret.transaction}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography>
                    <strong>Returned By:</strong>{" "}
                    {ret.returnedBy?.name || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* ITEMS */}
              <Box>
                <Typography fontWeight={700} mb={1}>
                  Returned Items:
                </Typography>

                <List dense disablePadding>
                  {ret.items?.map((item, idx) => (
                    <ListItem key={idx} sx={{ pl: 0 }}>
                      <ListItemText
                        primary={`${item.product?.name || 'N/A'} 
                        [${item.product?.category?.name || 'N/A'} - ${item.product?.brand?.name || 'N/A'}]`}
                        secondary={`${item.quantity} pcs | Reason: ${item.reason || 'N/A'}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
};

export default SalesReturnListPage;