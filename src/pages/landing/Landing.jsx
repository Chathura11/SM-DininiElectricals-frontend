import { AppBar,Grid,Paper,Slide, Toolbar, Typography} from '@mui/material'
import { Box, Container, Stack } from '@mui/system'
import '../../css/app.css'
import logo from '../../assets/ccNew.png'
import SignIn from './SignIn'
import companylogo from '../../assets/logo2.png'


export default function Landing(){

  return (
    <Stack>
        <TopAppBar/>
        <Content/>
        <Footer/>
    </Stack>
  )
}

function TopAppBar() {
    return (
        <Slide direction="down" in mountOnEnter unmountOnExit >
            <AppBar elevation={0} position="fixed" style={{
                background: 'white',
                backdropFilter: `blur(8px)`,
                borderBottom: '0.5px solid #00968822'
            }}  >
                <Toolbar>
                    <img src={logo} alt="title" style={{ width: "30px" }} />
                    <Typography color='grey' sx={{marginLeft:2,fontFamily:'cursive'}}>ChathuraCreations</Typography>
                </Toolbar>
            </AppBar>
        </Slide>
    )
}

function Content(){
    const headerStyles = {
        backgroundPosition: 'center',
        height: '100vh',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed'
    }
    const colorOverlay = {
        backgroundImage: 'linear-gradient(45deg,rgba(0, 0, 0, 0.75),rgba(6, 0, 54, 0.75),rgba(74, 0, 2, 0.71))',
        height: '100vh',
    }
    return(
            <div id="background-div" style={headerStyles}>
                <div style={colorOverlay}>
                <Container>
                    <Stack spacing={2} alignItems='flex-start' style={{ paddingTop: '42px' }}>
                        <Grid container style={{ marginTop: '72px' }}>
                            <Grid sx={{ mt: '32px' }}>
                                <Box>
                                    {/* <Typography sx={{color:'white',fontSize:'50px'}}>SalesMaestro</Typography> */}
                                    <img src={companylogo} style={{ width: "400px",marginLeft:-100,marginBottom:-50}}/>
                                    <Typography sx={{color:'white',marginBottom:0,marginTop:0,fontSize:'25px'}}>SalesMaestro Point of sales system</Typography>
                                    <Typography sx={{color:'white',marginBottom:4,fontSize:'15px'}}>Make your sales properly</Typography>
                                    <Stack direction='row' spacing={2} sx={{alignItems:'center'}}>
                                        
                                    </Stack>
                                </Box>
                            </Grid>
                        </Grid>
                        
                    </Stack>
                </Container>
                <Container>
                    <Paper elevation={0} sx={{maxWidth:'600px',padding:'30px'}}>
                        <SignIn/>
                    </Paper>     
                </Container>                       
                
                </div>        
            </div>
    )
}

function Footer() {
    return (
        <Stack sx={{ backgroundColor: 'black', color: 'white', textAlign: 'center',padding:2,alignContent:'center',alignItems:'center',p: '10px 32px 32px 10px'}}>
            <Typography variant='p'>Copyright © chathuracreations 2025. All right reserved</Typography>

            <img src={logo} alt="logo" style={{ width: "30px" }} />
        </Stack>
    )
}