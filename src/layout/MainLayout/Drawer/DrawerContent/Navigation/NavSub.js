import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
    LoginOutlined,
    ProfileOutlined,
    ChromeOutlined,
    QuestionOutlined,
    DashboardOutlined,
    AppstoreAddOutlined,
    AntDesignOutlined,
    BarcodeOutlined,
    BgColorsOutlined,
    FontSizeOutlined,
    LoadingOutlined
} from '@ant-design/icons';
// material-ui
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Box, List, Typography, Collapse } from '@mui/material';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { forwardRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
// project import
import { activeItem } from 'store/reducers/menu';

// project import
import NavItem from './NavItem';

// ==============================|| NAVIGATION - LIST Sub GROUP ||============================== //
// icons
const icons = {
    LoginOutlined,
    ProfileOutlined,
    ChromeOutlined,
    QuestionOutlined,
    DashboardOutlined,
    AppstoreAddOutlined,
    AntDesignOutlined,
    BarcodeOutlined,
    BgColorsOutlined,
    FontSizeOutlined,
    LoadingOutlined
};

const NavSub = ({ item, level }) => {
    const [open, setOpen] = useState(false);

    const theme = useTheme();
    const dispatch = useDispatch();
    const menu = useSelector((state) => state.menu);
    const { drawerOpen, openItem } = menu;

    let itemTarget = '_self';
    if (item.target) {
        itemTarget = '_blank';
    }

    //let listItemProps = { component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />) };
    //if (item?.external) {
    //    listItemProps = { component: 'a', href: item.url, target: itemTarget };
    //}

    const itemHandler = (id) => {
        dispatch(activeItem({ openItem: [id] }));
        setOpen(!open);
    };

    // active menu item on page load
    useEffect(() => {
        const currentIndex = document.location.pathname
            .toString()
            .split('/')
            .findIndex((id) => id === item.id);
        if (currentIndex > -1) {
            dispatch(activeItem({ openItem: [item.id] }));
        }
        // eslint-disable-next-line
    }, []);
    const textColor = 'text.primary';
    const iconSelectedColor = 'primary.main';

    item.icon = icons.ChromeOutlined;
    const Icon = item.icon;
    const itemIcon = item.icon ? <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} /> : false;

    const isSelected = openItem.findIndex((id) => id === item.id) > -1;

    const navCollapse = item.child_menu?.map((menuItem) => {
        switch (menuItem.type) {
            case 'ITEM':
                return <NavItem key={menuItem.id} item={menuItem} level={2} />;
            default:
                return (
                    <Typography key={menuItem.id} variant="h6" color="error" align="center">
                        Fix - Group Collapse or Items
                    </Typography>
                );
        }
    });
    //console.log('drawerOpen => ');
    //console.log(drawerOpen);

    return (
        <div>
            <ListItemButton
                //{...listItemProps}
                disabled={item.disabled}
                onClick={() => itemHandler(item.id)}
                selected={isSelected}
                sx={{
                    zIndex: 1201,
                    pl: drawerOpen ? `${level * 28}px` : 1.5,
                    py: !drawerOpen && level === 1 ? 1.25 : 1,
                    ...(drawerOpen && {
                        '&:hover': {
                            bgcolor: 'primary.lighter'
                        },
                        '&.Mui-selected': {
                            bgcolor: 'primary.lighter',
                            borderRight: `2px solid ${theme.palette.primary.main}`,
                            color: iconSelectedColor,
                            '&:hover': {
                                color: iconSelectedColor,
                                bgcolor: 'primary.lighter'
                            }
                        }
                    }),
                    ...(!drawerOpen && {
                        '&:hover': {
                            bgcolor: 'transparent'
                        },
                        '&.Mui-selected': {
                            '&:hover': {
                                bgcolor: 'transparent'
                            },
                            bgcolor: 'transparent'
                        }
                    })
                }}
            >
                {itemIcon && (
                    <ListItemIcon
                        sx={{
                            minWidth: 28,
                            color: isSelected ? iconSelectedColor : textColor,
                            ...(!drawerOpen && {
                                borderRadius: 1.5,
                                width: 36,
                                height: 36,
                                alignItems: 'center',
                                justifyContent: 'center',
                                '&:hover': {
                                    bgcolor: 'secondary.lighter'
                                }
                            }),
                            ...(!drawerOpen &&
                                isSelected && {
                                    bgcolor: 'primary.lighter',
                                    '&:hover': {
                                        bgcolor: 'primary.lighter'
                                    }
                                })
                        }}
                    >
                        {itemIcon}
                    </ListItemIcon>
                )}
                {drawerOpen && (
                    <ListItemText
                        primary={
                            <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor }}>
                                {item.name}
                            </Typography>
                        }
                    />
                )}
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {navCollapse}
            </Collapse>
        </div>
    );
};

NavSub.propTypes = {
    item: PropTypes.object
};

export default NavSub;
