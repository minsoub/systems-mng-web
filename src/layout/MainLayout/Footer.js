// import { Link as RouterLink } from 'react-router-dom';
import footer_logo from 'assets/images/footer_logo.png';

// material-ui
import { Box, Stack, Typography } from '@mui/material';

const Footer = () => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: '17px 81px', mt: 'auto', position: 'fixed', zIndex: '10000', background: '#000', bottom:'0', width: '100%'}}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <img width='152' src={footer_logo} alt='스마트어드민' />
      <Typography sx={{ ml: 2, color: '#888', fontSize: '12px' }}variant="caption" color="divider">스마트어드민</Typography>
    </Box>
    
    <Stack spacing={1.5} direction="row" justifyContent="space-between" alignItems="center">
      <Typography color="divider" sx={{ color: '#888', fontSize: '12px' }}>Copyright&copy; Bithumb. All rights reserved. Made by Bithumb Systems</Typography>
    </Stack>
  </Stack>
);

export default Footer;
