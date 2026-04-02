import React from 'react';
import { SidePanelProvider } from '../../context/SidePanelContext';
import MainRoutes from './MainRoutes';

const MainWrapped = () => {
  return (
    <div>
        <SidePanelProvider>
            <MainRoutes />
        </SidePanelProvider>
    </div>
  )
}

export default MainWrapped