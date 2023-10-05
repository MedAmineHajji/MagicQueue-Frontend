import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://www.digika.tn/">
          Digika
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
}


function FooterComponent(){


    return(
        <>
        {/* Footer */}
        <Container
            maxWidth="md"
            component="footer"
            sx={{
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            mt: 8,
            py: [3, 6],
            }}
        >
            
            <Copyright sx={{ mt: 5 }} />
        </Container>
        {/* End footer */}
        </>
    )
}

export default FooterComponent;