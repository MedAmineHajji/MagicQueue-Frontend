import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import axios from 'axios';


const API_url = 'http://localhost:8000/api/';

export default function TemporaryDrawer({state, setState, toggleDrawer}) {


    const [templatesDataArray, setTemplatesDataArray] = React.useState(null);

//Fetching the template List from APIs
    React.useEffect(() => {
        const fetchAllTemplatesData = async () => {
            await axios.get(API_url + 'templates/getFromDB').then(
                (result) => {
                    setTemplatesDataArray(result.data);
                }
            ).catch(
                (error) => {
                    console.log(error);
                }
            )
        };

        fetchAllTemplatesData();
        // console.log(templatesDataArray)
    }, []);
    
  

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            
            {templatesDataArray ? (
                <>
                    <List>
                        {templatesDataArray.map((template, indexTemplate) => (
                        <ListItem key={template.template_name} disablePadding>
                            <ListItemButton href={`/dev?template_id=${template.template_id}`} >
                                <ListItemIcon>
                                    {indexTemplate % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                </ListItemIcon>
                                <ListItemText primary={template.template_name} />
                            </ListItemButton>
                        </ListItem>
                        ))}
                    </List>
                </>
            ): 
            <>
            
            </>}

            <Divider />

            {/* <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                <ListItem key={text} disablePadding>
                    <ListItemButton>
                    <ListItemIcon>
                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                    </ListItemButton>
                </ListItem>
                ))}
            </List> */}
        </Box>
    );

    return (
        <div>
            {['left'].map((anchor) => (
                <React.Fragment key={anchor}>
                <Drawer
                    anchor={anchor}
                    open={state[anchor]}
                    onClose={toggleDrawer(anchor, false)}
                >
                    {list(anchor)}
                </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}