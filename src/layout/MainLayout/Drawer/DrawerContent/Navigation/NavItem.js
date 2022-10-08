import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { useTheme } from '@mui/material/styles';
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

// project import
import { activeItem } from 'store/reducers/menu';

// ==============================|| NAVIGATION - LIST ITEM ||============================== //
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
    // 통합회원
    'MENU_c12f329fb2624ff2a0ed780e196d16e2': icons.AppstoreOutlined,    // 대시보드
    '62aaaf6622252d51722db8ed': icons.FundOutlined,                     // 거래지원 관리
    '62aab01622252d51722db8f2': icons.FileOutlined,                     // 서비스 로그 조회
    '62aaaeb522252d51722db8e9': icons.UserSwitchOutlined,               // 사용자 접근 관리
    '62aaaf1922252d51722db8ec': icons.CodeOutlined,                     // 감사로그 조회
    '62aaae9c22252d51722db8e8': icons.SettingOutlined,                  // 계정 관리
    '62aaa4a622252d51722db8e1': icons.SettingOutlined,                  // 사이트 관리
    '62aaac0922252d51722db8e2': icons.SettingOutlined,                  // 계정 관리
    'MENU_43013b73429b45e4b2816614f3ddaa39': icons.UserSwitchOutlined,  // 업로드 파일 관리
    'MENU_36ef0396eac745fbbe214fd181fc5b0e': icons.SettingOutlined,     // 관리자  로그인
    'MENU_082d2f78cddd4be2a575304454d8091e': icons.SettingOutlined,     // 비밀번호 재설정
    'MENU_07d47b14c4e34a38a2e09ba1719597f1': icons.SettingOutlined,     // OTP Simple 로그인
    'MENU_c273015241ee4538aa2c468b95fc3de0': icons.SettingOutlined,     // OTP 로그인
    'MENU_3339b8d52d36470fae3a3a18ea6ab109': icons.SettingOutlined,     // 사용자 로그인
    // 고객지원 사이트관리자
    'MENU_45716f5dcd124320a7b529f6f1e7fdcd': icons.FileOutlined,        // 서비스 로그 관리
    'MENU_5470548fd755406aa31e327a2d39970a': icons.UserSwitchOutlined,  // 사용자 접근 관리
    'MENU_9e53557059ec4e1f843fdb674dfba70e': icons.SettingOutlined,     // 계정 관리
    // 거래지원 사이트 소유자
    'MENU_3b21a24593f54bb6a531d4d73d840baf': icons.AppstoreOutlined,    // 대시보드
    'MENU_39b075b1f55d4eabbc48778fd53f1775': icons.FundOutlined,        // 거래지원 관리
    'MENU_dfb5f1aa691e4ab9ad5edb7bd85ffdb9': icons.FileOutlined,        // 서비스 로그 관리
    'MENU_5c468030abdc4e0ca21839ab7c07919d': icons.UserSwitchOutlined,  // 사용자 접근관리
    'MENU_d6a6c286798f4891828a92ea24c694fd': icons.SettingOutlined,     // 계정 관리
};
const NavItem = ({ item, level }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const menu = useSelector((state) => state.menu);
    const { drawerOpen, openItem } = menu;

    let itemTarget = '_self';
    if (item.target) {
        itemTarget = '_blank';
    }

    let listItemProps = { component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />) };
    if (item?.external) {
        listItemProps = { component: 'a', href: item.url, target: itemTarget };
    }

    const itemHandler = (id) => {
        dispatch(activeItem({ openItem: [id] }));
    };
    //console.log('item.id', item.id, item.name);
    item.icon = menuIcon[item.id]; // icons.AppstoreOutlined;
    const Icon = item.icon;
    const itemIcon = item.icon ? <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} /> : false;
    const isSelected = openItem.findIndex((id) => id === item.id) > -1;

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

    return (
        <ListItemButton
            {...listItemProps}
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
            {itemIcon && level === 1 && (
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
            {(drawerOpen || (!drawerOpen && level !== 1)) && (
                <ListItemText
                    primary={
                        <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor }}>
                            {item.name}
                        </Typography>
                    }
                />
            )}
            {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
                <Chip
                    color={item.chip.color}
                    variant={item.chip.variant}
                    size={item.chip.size}
                    label={item.chip.label}
                    avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
                />
            )}
        </ListItemButton>
    );
};

NavItem.propTypes = {
    item: PropTypes.object,
    level: PropTypes.number
};

export default NavItem;
