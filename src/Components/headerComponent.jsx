import React, {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


const SideBarComponent = React.lazy(
    () => import('../Components/sideBarComponent')
);



function HeaderComponent(props){


    
// Configuration of the Side Bar
    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    return(
        <>
        <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        >
            <Toolbar sx={{ flexWrap: 'wrap' }}>
                {props.adminConnected ? (
                    <>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer("left", true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </>
                ):(<></>)}
                
                <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                    Magic Queue
                </Typography>
                <Button href="/view" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                    view Ticket
                </Button>
                {props.adminConnected ? (
                    <>
                        <SideBarComponent state={state} setState={setState} toggleDrawer={toggleDrawer}/>

                        <Button href="/login" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                            Log out
                        </Button>
                    </>
                ): (
                    <>
                        <Button href="/login" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                            Login
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
        </>
    )
}

export default HeaderComponent;