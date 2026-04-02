import React, { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const PaginationComponent = ({ totalItems, itemsPerPage,handleChange, onPageChange }) => {
    const [currentPage, setCurrentPage] = useState(1);
    

    const handlePageChange = (event, page) => {
      setCurrentPage(page);
      onPageChange(page);
    };

    
  
    const totalPages = Math.ceil(totalItems / itemsPerPage);
  return (
    <Stack spacing={2} direction="row" justifyContent="center" >
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
      />
      
      <FormControl sx={{ m: 1, minWidth: 80 }} size="small">
        <InputLabel id="demo-simple-select-label">Items</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={itemsPerPage}
          label="Items"
          onChange={handleChange}
        >
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </FormControl>
    
    </Stack>
  )
}

export default PaginationComponent