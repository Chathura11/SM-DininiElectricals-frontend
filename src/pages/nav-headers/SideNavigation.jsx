import {Avatar, Badge, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from '@mui/material/Drawer';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import TableViewOutlinedIcon from '@mui/icons-material/TableViewOutlined';
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined';
import logo from '../../assets/ccNew.png'
import PersonIcon from '@mui/icons-material/Person';
import ProfileCard from '../user-profile/ProfileCard';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);


const SideNavigation = ({isLoggedIn,authUser,logOut}) => {
    const theme = useTheme();

    const [open,setOpen] = useState(false);

    // const handleLogout=(e)=>{
    //     e.preventDefault()
    //     navigate('/')
    //     logOut(e)
    // }

    const navigate = useNavigate()

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = ()=>{
        setOpen(false);
    }

    // const navigateToSettings=()=>{
    //   navigate('/organization')
    // }

    const mainListItemButtonsHandle=(index)=>{
      if(index ===0){
        navigate('/sell')
      }
      if(index===1){
        navigate('/dashboard')
      }
      if(index ===2){
        navigate('/categories')
      }
      if(index ===3){
        navigate('/brands')
      }
      if(index ===4){
        navigate('/inventories')
      }
      if(index ===5){
        navigate('/sell/sale-transactions')
      }
      if(index ===6){
        navigate('/sales-return')
      }
      if(index ===7){
        navigate('/sales-return/all')
      }
      if(index ===8){
        navigate('/accounts')
      }
      
    }

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    const profileRef = useRef(null);

    useEffect(() => {
      // Add event listener when the component mounts
      document.addEventListener('click', handleOutsideClick);

      // Clean up the event listener when the component unmounts
      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }, []);
    const handleAvatarClick = () => {
      setIsProfileOpen(!isProfileOpen);
    };

    const handleOutsideClick = (event) => {
      // Check if the click is on the Avatar or inside the profile card
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        !event.target.closest('.MuiAvatar-root')
      ) {
        setIsProfileOpen(false);
      }
    };

    const profileStyle = {
      position: 'fixed',
      top: '55px',
      right: '50px',
      zIndex: 9999,
    }

    const StyledBadge = styled(Badge)(({ theme }) => ({
      '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          animation: 'ripple 1.2s infinite ease-in-out',
          border: '1px solid currentColor',
          content: '""',
        },
      },
      '@keyframes ripple': {
        '0%': {
          transform: 'scale(.8)',
          opacity: 1,
        },
        '100%': {
          transform: 'scale(2.4)',
          opacity: 0,
        },
      },
    }));
  return (   
    <>
        <Stack sx={{ display: "flex" }}  >
            <AppBar position="fixed" open={open}>
                <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{
                    marginRight: 5,
                    ...(open && { display: 'none' }),
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  SalesMaestro
                </Typography>
                {/* <Button color="inherit" variant='outlined' size='small' sx={{marginRight:2}} onClick={handleLogout}>{isLoggedIn&&authUser?"Log Out":"Home"}</Button> */}
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant={isLoggedIn?"dot":'standard'}
                >
                  <Avatar sx={{background:'black'}} onClick={handleAvatarClick}>      
                      <PersonIcon/>
                  </Avatar>
                  {isProfileOpen && 
                    <div ref={profileRef} style={profileStyle}>
                      <ProfileCard authUser={authUser} logOut={logOut}/>
                    </div>
                  }
                </StyledBadge>
                
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                  {/* <img src={Logo} alt="title" style={{ width: "150px" }} /> */}
                    <img src={logo} alt="title" style={{ width: "30px" }} />
                    <Typography color='grey' sx={{marginLeft:2,fontFamily:'cursive'}}>ChathuraCreations</Typography>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                  <List>
                    {['Sell', 'Dashboard', 'Categories', 'Brands', 'Inventory','Sale Transactions','Sales Return','View Sales Returns','Accounts'].map((text, index) => (
                      <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                          sx={{
                            minHeight: 60,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                          }}
                          onClick={() => mainListItemButtonsHandle(index)}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 3 : 'auto',
                              justifyContent: 'center',
                            }}
                          >
                            {index === 0 ? <AddShoppingCartIcon /> 
                            : index === 1 ? <DashboardOutlinedIcon /> 
                            : index === 2 ? <TableViewOutlinedIcon /> 
                            : index === 3 ? <StyleOutlinedIcon />
                            : index === 4 ?<Inventory2OutlinedIcon />
                            : index === 5 ?<PointOfSaleIcon />
                            : index === 6 ?<CompareArrowsOutlinedIcon />
                            : index === 7 ?<AssignmentReturnOutlinedIcon />
                            :<AccountBalanceOutlinedIcon/>
                          }
                          </ListItemIcon>
                          <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
            </Drawer>
        </Stack>

    </>
    
  )
}

export default SideNavigation