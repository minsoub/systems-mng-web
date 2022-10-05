import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import './styles.scss';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, ButtonBase, CardContent, ClickAwayListener, Grid, Paper, Popper, Stack, Tab, Tabs, Typography } from '@mui/material';

// project import
import MainCard from 'components/Common/MainCard';
import Transitions from 'components/Common/Transitions';
import ProfileTab from './ProfileTab';
import { useNavigate } from 'react-router-dom';
// assets
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import {
    activeEmail,
    activeName,
    activeLogin,
    activeLoginDate,
    activeRefreshToken,
    activeRole,
    activeSite,
    activeToken
} from '../../../../../store/reducers/auth';
import { dispatch } from '../../../../../store';
import { doDecrypt } from 'utils/Crypt';

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
            {value === index && children}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `profile-tab-${index}`,
        'aria-controls': `profile-tabpanel-${index}`
    };
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(0);
    const iconBackColorOpen = 'grey.300';
    const refEmail = useRef(null);
    const refLoginData = useRef(null);

    const handleLogout = async () => {
        if (confirm('로그아웃 하시겠습니까?')) {
            // logout
            if (localStorage.hasOwnProperty('authenticated')) {
                dispatch(activeSite({ siteId: '' }));
                dispatch(activeRole({ roleId: '' })); // Role Id
                dispatch(activeEmail({ email: '' }));
                dispatch(activeName({ name: '' }));
                dispatch(activeToken({ accessToken: '' }));
                dispatch(activeRefreshToken({ refreshToken: '' }));
                dispatch(activeLoginDate({ loginDate: '' }));
                dispatch(activeLogin({ isLoggined: false }));
            }
            localStorage.clear();
            navigate('/login');
        }
    };
    const handleUpdate = () => {
        navigate('/profile/update');
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (open && localStorage.hasOwnProperty('authenticated')) {
            let authData = null;
            //console.log(localStorage.getItem('authenticated'));
            authData = JSON.parse(localStorage.getItem('authenticated'));
            if(authData.loginDate){
                refLoginData.current.innerText = authData.loginDate;
            }
            doDecrypt(authData.email).then((decEmail) => {
                refEmail.current.innerText = decEmail;
            });
        }
    }, [open]);

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            <ButtonBase
                sx={{
                    p: 0.25,
                    Ïgcolor: open ? iconBackColorOpen : 'transparent',
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'secondary.lighter' }
                }}
                aria-label="open profile"
                ref={anchorRef}
                aria-controls={open ? 'profile-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
                    {/* <Avatar alt="profile user" src={avatar1} sx={{ width: 32, height: 32 }} /> */}
                    <Avatar size="large" icon={<UserOutlined />} />
                    <Typography>홍길동</Typography>
                </Stack>
            </ButtonBase>
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 9]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions type="fade" in={open} {...TransitionProps}>
                        {open && (
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MainCard elevation={0} border={false} content={false}>
                                        <CardContent>
                                            <Grid container justifyContent="space-between" alignItems="center">
                                                <div className="mypage--userInfo">
                                                    <p ref={refEmail} className="email"></p>
                                                    <p className="admin">Smart Admin 관리자</p>
                                                    <span className="time">( 접속일시 : <span ref={refLoginData}></span> )</span>
                                                </div>
                                            </Grid>
                                        </CardContent>
                                        {open && (
                                            <>
                                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                    <Tabs
                                                        variant="fullWidth"
                                                        value={value}
                                                        onChange={handleChange}
                                                        aria-label="profile tabs"
                                                    >
                                                        <Tab
                                                            sx={{
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                textTransform: 'capitalize'
                                                            }}
                                                            icon={<UserOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                                                            label="계정 정보 수정"
                                                            {...a11yProps(0)}
                                                        />
                                                    </Tabs>
                                                </Box>
                                                <TabPanel value={value} index={0} dir={theme.direction}>
                                                    <ProfileTab handleLogout={handleLogout} handleUpdate={handleUpdate} />
                                                </TabPanel>
                                            </>
                                        )}
                                    </MainCard>
                                </ClickAwayListener>
                            </Paper>
                        )}
                    </Transitions>
                )}
            </Popper>
        </Box>
    );
};

export default Profile;
