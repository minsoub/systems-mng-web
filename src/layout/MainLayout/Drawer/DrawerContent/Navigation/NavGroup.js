import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// material-ui
import { Box, List, Typography } from '@mui/material';

// project import
import NavItem from './NavItem';
import NavSub from './NavSub';

// ==============================|| NAVIGATION - LIST GROUP ||============================== //

const NavGroup = ({ item }) => {
    const menu = useSelector((state) => state.menu);
    const { drawerOpen } = menu;

    const navCollapse = item.child_menu_resources?.map((menuItem) => {
        if (menuItem.visible == true) {
            if (menuItem.type === 'ITEM') {
                return <NavItem key={menuItem.id} item={menuItem} level={1} />;
            } else if (menuItem.type === 'GROUP') {
                return <NavSub key={menuItem.id} item={menuItem} level={1} />;
            }
        } else {
            return null;
        }
        // switch (menuItem.type) {
        //     case 'collapse': // 서브 메뉴가 있다.
        //         return <NavSub key={menuItem.id} item={menuItem} level={1} />;
        //     case 'ITEM':
        //         return <NavItem key={menuItem.id} item={menuItem} level={1} />;
        //     default:
        //         return (
        //             <Typography key={menuItem.id} variant="h6" color="error" align="center">
        //                 Fix - Group Collapse or Items
        //             </Typography>
        //         );
        // }
    });

    return (
        <List
            subheader={
                item.name &&
                drawerOpen && (
                    <Box sx={{ pl: 3, mb: 1.5 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                            {item.name}
                        </Typography>
                    </Box>
                )
            }
            sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
        >
            {navCollapse}
        </List>
    );
};

NavGroup.propTypes = {
    item: PropTypes.object
};

export default NavGroup;
