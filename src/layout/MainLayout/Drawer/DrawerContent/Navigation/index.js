// material-ui
import { Box, Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import * as menuapi from 'apis/menu/menuapi';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = (navigation) => {
    // menu item 가져오기
    //const menuItem = menuapi.findmenus({});

    console.log(navigation);
    const navGroups = menuapi.findmenus({}).items.map((item) => {
        //itemList.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Fix - Navigation Group
                    </Typography>
                );
        }
        // });
    });

    return <Box sx={{ pt: 1 }}>{navGroups}</Box>;
};

export default Navigation;
