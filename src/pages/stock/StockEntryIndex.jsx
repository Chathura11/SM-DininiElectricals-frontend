import { Route, Routes } from 'react-router-dom';
import { Stack } from '@mui/material';
import React from 'react';
import MainHeader from '../main/MainHeader';
import StockEntryForm from './StockEntryForm';
import StockEntryList from './StockEntryList';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

const StockEntryIndex = ({ isLoggedIn, authUser, configure }) => {
  const stackStyle = {
    margin: '20px 0',
  };

  return (
    <Stack style={stackStyle} spacing={2}>
      <MainHeader tag={'Stock Entries'} icon={<Inventory2OutlinedIcon sx={{ width: 40, height: 40 }} />} />
      {isLoggedIn && authUser &&
        <Routes>
          <Route path='/' element={<StockEntryList authUser={authUser} configure={configure} />} />
          <Route path='/entry/edit/:entryId' element={<StockEntryForm edit={true} />} />
        </Routes>
      }
    </Stack>
  );
};

export default StockEntryIndex;
