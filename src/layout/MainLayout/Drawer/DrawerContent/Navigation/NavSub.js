import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
    AppstoreOutlined, // 대시보드
    FundOutlined, // 거래지원 관리
    QuestionCircleOutlined, //FAQ 관리
    DiffOutlined, // 상태값 관리
    FileOutlined, // 서비스로그조회
    DesktopOutlined, // 메인관리
    FileAddOutlined, // 컨텐츠관리
    UserSwitchOutlined, // 사용자접근관리
    UsergroupAddOutlined, // Role관리
    BarsOutlined, // 메뉴관리
    AuditOutlined, // 권한관리
    CodeOutlined, // 감사로그 조회
    SettingOutlined // 나머지 통합관리 메뉴들 (피그마참조)
} from '@ant-design/icons';
// material-ui
import {
    Avatar,
    Chip,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    List,
    Typography,
    Collapse,
    Paper,
    Popper,
    ClickAwayListener
} from '@mui/material';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { forwardRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
// project import
import { activeItem } from 'store/reducers/menu';

// project import
import NavItem from './NavItem';
import Transitions from 'components/Common/Transitions';

//lib import
import {getSwapLink} from './SwapLinkURL';
// ==============================|| NAVIGATION - LIST Sub GROUP ||============================== //
// icons
const icons = {
    AppstoreOutlined, // 대시보드
    FundOutlined, // 거래지원 관리
    QuestionCircleOutlined, //FAQ 관리
    DiffOutlined, // 상태값 관리
    FileOutlined, // 서비스로그조회
    DesktopOutlined, // 메인관리
    FileAddOutlined, // 컨텐츠관리
    UserSwitchOutlined, // 사용자접근관리
    UsergroupAddOutlined, // Role관리
    BarsOutlined, // 메뉴관리
    AuditOutlined, // 권한관리
    CodeOutlined, // 감사로그 조회
    SettingOutlined // 나머지 통합관리 메뉴들 (피그마참조)
};
const menuIcon = {
    '62aaafe022252d51722db8f0': icons.QuestionCircleOutlined,               // FAQ 관리
    '62aaaf7b22252d51722db8ee': icons.DiffOutlined,                         // 상태값 관리
    'MENU_a576d06485eb442dadd56ae19dc1e70c': icons.DesktopOutlined,         // 메인 관리
    'MENU_534746312d434de5b911f14b3b14cdf7': icons.FileAddOutlined,         // 컨텐츠 관리
    'MENU_fd04e3a3416948c296f974e60e5e8b32': icons.UsergroupAddOutlined,    // Role 관리
    '62aaaedd22252d51722db8ea': icons.BarsOutlined,                         // 메뉴 관리
    '62aaaef222252d51722db8eb': icons.AuditOutlined,                        // 권한 관리
    '62aaadba22252d51722db8e3': icons.UsergroupAddOutlined,                 // Role 관리
    '62aaadd822252d51722db8e4': icons.BarsOutlined,                         // 메뉴 관리
    '62aaadf122252d51722db8e5': icons.SettingOutlined,                      // 프로그램 관리
    '62aaae4e22252d51722db8e6': icons.AuditOutlined,                        // 권한 관리
    '62aaae7b22252d51722db8e7': icons.SettingOutlined,                      // 통합게시판 관리
    // 고객지원 사이트관리자
    'MENU_3c36442e601448b7a701c8df651e39d7': icons.DesktopOutlined,         // 메인 관리
    'MENU_80aee08e7c8240518df173f97be54c78': icons.FileAddOutlined,         // 컨텐츠 관리
    'MENU_3a0d00a2baf644a8a7a8e56fa29d2359': icons.AuditOutlined,           // 권한 관리
    // 거래지원 사이트 소유자
    'MENU_cfda4ccd3dd64f368500e4c29a7805a7': icons.QuestionCircleOutlined,  // FAQ 관리
    'MENU_1d9ba27ba00143fca4cf4888a0224bdf': icons.DiffOutlined,            // 상태값 관리
    'MENU_5c3d549a94b84ce886e095aa5e692aea': icons.AuditOutlined,           // 권한 관리
};
// mini-menu - wrapper
const PopperStyled = styled(Popper)(({ theme }) => ({
    overflow: 'visible',
    zIndex: 1202,
    minWidth: 180,
    '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 38,
        left: -5,
        width: 10,
        height: 10,
        backgroundColor: theme.palette.background.paper,
        transform: 'translateY(-50%) rotate(45deg)',
        zIndex: 120,
        borderLeft: `1px solid ${theme.palette.grey.A800}`,
        borderBottom: `1px solid ${theme.palette.grey.A800}`
    }
}));
const NavSub = ({ item, level }) => {
    const [open, setOpen] = useState(false);

    const theme = useTheme();
    const dispatch = useDispatch();
    const menu = useSelector((state) => state.menu);
    const { drawerOpen, openItem } = menu;

    const [selected, setSelected] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const location = useLocation();

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

    const handleClick = (event) => {
        setAnchorEl(null);
        if (drawerOpen) {
            setOpen(!open);
            setSelected(!selected ? item.id : null);
        } else {
            setAnchorEl(event?.currentTarget);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        //console.log('sub', location.pathname, item);
        item.child_menu_resources.map((child) => {
            // console.log(getSwapLink(location.pathname).toString());
            const currentIndex = getSwapLink(location.pathname).toString().indexOf(child.url);
            // console.log('sub', location.pathname, child.url, currentIndex);
            // if (location.pathname === child.url) {
            if (currentIndex > -1) {
                //dispatch(activeItem({ openItem: [item.id] }));
                setOpen(true);
            }
        });
        // eslint-disable-next-line
    }, [location]);

    const textColor = 'text.primary';
    const iconSelectedColor = 'primary.main';

    //console.log('item.id', item.id, item.name);
    item.icon = menuIcon[item.id]; //icons.AppstoreOutlined;
    const Icon = item.icon;
    const itemIcon = item.icon ? <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} /> : false;

    const isSelected = openItem.findIndex((id) => id === item.id) > -1;

    const openMini = Boolean(anchorEl);

    const navCollapse = item.child_menu_resources?.map((menuItem) => {
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
                {...(!drawerOpen && { onMouseEnter: handleClick, onMouseLeave: handleClose })}
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
                {drawerOpen && (open ? <ExpandLess /> : <ExpandMore />)}
                {!drawerOpen && (
                    <PopperStyled
                        open={openMini}
                        anchorEl={anchorEl}
                        placement="right-start"
                        style={{
                        zIndex: 2001
                        }}
                        popperOptions={{
                            modifiers: [{ name: 'offset', options: { offset: [-12, 1] } }]
                        }}
                    >
                        {({ TransitionProps }) => (
                            <Transitions in={openMini} {...TransitionProps}>
                                <Paper
                                    sx={{
                                        overflow: 'hidden',
                                        mt: 1.5,
                                        boxShadow: theme.customShadows.z1,
                                        backgroundImage: 'none',
                                        border: `1px solid ${theme.palette.divider}`
                                    }}
                                >
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <Box>{navCollapse}</Box>
                                    </ClickAwayListener>
                                </Paper>
                            </Transitions>
                        )}
                    </PopperStyled>
                )}
            </ListItemButton>
            {drawerOpen && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    {navCollapse}
                </Collapse>
            )}
        </div>
    );
};

NavSub.propTypes = {
    item: PropTypes.object
};

export default NavSub;
