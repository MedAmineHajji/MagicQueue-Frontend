import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';

import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';



import EditComponent from './modeEdit/editTemplate';
import { useLocation } from 'react-router-dom';
import FooterComponent from '../Components/footerComponent';
import HeaderComponent from '../Components/headerComponent';



const DevComponent = React.lazy(
    () => import('../Components/devComponent')
);
const SideBarComponent = React.lazy(
    () => import('../Components/sideBarComponent')
);





// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();


export default function Pricing() {


    const adminConnected = true;
    



    return (
        <ThemeProvider theme={defaultTheme}>
        <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
        <CssBaseline />
        
        <HeaderComponent adminConnected={adminConnected} />

        { (adminConnected) ? 
        <>
            
            <div className="col-4">
                admin is connected...
            </div>
        </> : <>
            admin is not connected.
        </> }

        <FooterComponent/>


        </ThemeProvider>
        
    );
}