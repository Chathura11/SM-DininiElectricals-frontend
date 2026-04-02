import { Route, Routes } from 'react-router-dom';
import { Stack } from '@mui/material';
import React from 'react';
import MainHeader from '../main/MainHeader';
import InventoryList from './InventoryList';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

const InventoryIndex = ({ isLoggedIn, authUser, configure }) => {
  const stackStyle = {
    margin: '20px 0',
  };

  return (
    <Stack style={stackStyle} spacing={2}>
      <MainHeader tag={'Inventory'} icon={<Inventory2OutlinedIcon sx={{ width: 40, height: 40 }} />} />
      {isLoggedIn && authUser &&
        <Routes>
          <Route path='/' element={<InventoryList authUser={authUser} configure={configure} />} />
          {/* Add more routes for inventory detail/edit if needed */}
        </Routes>
      }
    </Stack>
  );
};

export default InventoryIndex;
