import React from 'react'
import SideNavigation from '../nav-headers/SideNavigation'
import { Routes, Route } from 'react-router-dom'
import { Box, Container, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material'
import { useSidePanel } from '../../context/SidePanelContext'
import { Cancel } from '@mui/icons-material'
import styled from '@emotion/styled'
import { useAuth } from '../../context/AuthContext'
import AdminPanelIndex from '../admin/AdminPanelIndex'
import ProfileIndex from '../user-profile/ProfileIndex'
import BrandIndex from '../brand/BrandIndex'
import CategoryIndex from '../category/CategoryIndex'
import SaleIndex from '../sale/SaleIndex'
import InventoryIndex from '../inventory/InventoryIndex'
import SalesPage from '../sale/SalePage'
import DashboardIndex from '../dashboard/DashboardIndex'
import AccountIndex from '../account/AccountIndex'
import SalesReturnIndex from '../salesReturn/SalesReturnIndex'


const drawerWidth = 500

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: 1,
        }),
    }),
);

const DashboardRoutes = () => {

    const headerStyles = {
        backgroundPosition: 'center',
        minHeight:'100vh',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        minWidth:'700px'
    }

    const {authUser,
        logout,
        isLoggedIn} =useAuth()

    const logOut =(e)=>{
        e.preventDefault()
        logout()
    }

    const { sidePanelOpen, sidePanelContent, sidePanelTitle, closeSidePanel } = useSidePanel()

    return (
        <div id="background-div-main" style={headerStyles}>
            
            <Box sx={{ display: 'flex', position: 'relative' }}>

                <SideNavigation isLoggedIn={isLoggedIn} authUser={authUser} logOut={logOut}/>
                <Main sx={{ postion: 'relative' }} >
                    <Container fixed style={{ paddingTop: '50px' ,maxWidth:'1500px'}}>

                        <Stack spacing={2} >
                            {/* routings */}
                            <Routes>
                                <Route path='/admin-panel/*' element={<AdminPanelIndex isLoggedIn={isLoggedIn} authUser={authUser}/>} />
                                <Route path='/user-profile/*' element={<ProfileIndex isLoggedIn={isLoggedIn} authUser={authUser}/>} />
                                <Route path='/brands/*' element={<BrandIndex isLoggedIn={isLoggedIn} authUser={authUser}/>} />
                                <Route path='/categories/*' element={<CategoryIndex isLoggedIn={isLoggedIn} authUser={authUser}/>} />
                                <Route path='/sell/*' element={<SaleIndex isLoggedIn={isLoggedIn} authUser={authUser}/>} />
                                <Route path='/sales-return/*' element={<SalesReturnIndex isLoggedIn={isLoggedIn} authUser={authUser}/>} />
                                <Route path='/dashboard/*' element={<DashboardIndex isLoggedIn={isLoggedIn} authUser={authUser}/>} />
                                <Route path='/inventories/*' element={<InventoryIndex isLoggedIn={isLoggedIn} authUser={authUser}/>} />
                                <Route path='/accounts/*' element={<AccountIndex isLoggedIn={isLoggedIn} authUser={authUser}/>} />
                                {/* <Route path='/sale-test/*' element={<SalesPage isLoggedIn={isLoggedIn} authUser={authUser}/>} /> */}
                                {/* <Route path='/barcode/*' element={<BarcodeReader/>} /> */}
                                {/* <Route path='/contact/*' element={<ContactIndex/>} /> */}
                            </Routes>
                        </Stack>
                    </Container>
                </Main>

                {/* RIGHT SIDE PANEL */}
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                        },
                    }}
                    variant="persistent"
                    anchor="right"
                    open={sidePanelOpen}
                >
                    <Stack spacing={2}>
                        <div style={{ height: "80px" }} />
                        <Stack spacing={2} direction="row" style={{ margin: "0px 32px" }} alignItems="center">
                            <Typography variant="h5" style={{ width: "100%" }}>{sidePanelTitle}</Typography>
                            <IconButton onClick={closeSidePanel}><Cancel /></IconButton>
                        </Stack>

                        <Divider />
                        <div style={{ padding: "16px 32px" }}>{sidePanelContent}</div>
                    </Stack>
                </Drawer>
            </Box>
        </div>
    )
}

export default DashboardRoutes