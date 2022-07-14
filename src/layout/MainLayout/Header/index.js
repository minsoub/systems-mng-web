import PropTypes from 'prop-types';
import './styles.scss';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    AppBar,
    IconButton,
    Toolbar,
    useMediaQuery,
    Stack,
    FormControl,
    Select,
    MenuItem,
    Table,
    TableRow,
    TableCell,
    Typography
} from '@mui/material';

// project import
import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';

// assets
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { makeStyles, withStyles } from '@mui/styles';
import SvgIcon from '@mui/material/SvgIcon';
import RoleApi from 'apis/roles/roleapi';
import jwt from 'jsonwebtoken';
import { activeSite } from 'store/reducers/auth';
// ==============================|| MAIN LAYOUT - HEADER ||============================== //

const useStyles = makeStyles({
    tableRow: {
        height: 25
    },
    tableCell: {
        padding: '0px 16px',
        height: 35
    }
});
const StyledTableCell = withStyles((theme) => ({
    root: {
        padding: '0px 16px',
        height: 35,
        borderBottom: 'none'
    }
}))(TableCell);
function HomeIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </SvgIcon>
    );
}
const Header = ({ open, handleDrawerToggle }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));
    const classes = useStyles();
    const iconBackColor = 'grey.100';
    const iconBackColorOpen = 'grey.200';
    const [mySiteId, setMySiteId] = useState('');
    const [mySiteList, setSiteList] = useState([]);

    const [responseData, requestError, loading, { roleDetail }] = RoleApi();

    // 현재의 디톨트 사이트 아이디
    let authData = null;
    if (localStorage.hasOwnProperty('authenticated')) {
        //console.log(localStorage.getItem('authenticated'));
        authData = JSON.parse(localStorage.getItem('authenticated'));
    }
    let site_id = authData.siteId; // login site id
    useEffect(() => {
        if (!mySiteId) setMySiteId(site_id);
        // 나의 Role에 관련된 사이트 아이디 조회
        let tokenData = jwt.decode(authData.accessToken);
        console.log(tokenData);
        let ROLE = tokenData.ROLE;
        setSiteList([]);
        ROLE.map((item, index) => {
            roleDetail(item);
        });
    }, []);
    useEffect(() => {
        if (!responseData) return;
        console.log(responseData.data);
        console.log(responseData.data.data.site_id);
        console.log(responseData.data.data.name);
        if (responseData.data.data) {
            setSiteList((arr) => [...arr, { site_id: responseData.data.data.site_id, name: responseData.data.data.name }]);
            console.log(mySiteList);
        }
    }, [responseData]);

    // 입력 박스 입력 시 호출
    const handleChange = (e) => {
        setMySiteId(e.target.value);
        // 변경된 사이트를 통해서 다시 메뉴를 리로드해야 한다.
        authData.siteId = e.target.value;
        localStorage.setItem('authenticated', JSON.stringify(authData)); // 토큰 재저장
        // menu reload
        dispatch(activeSite({ siteId: e.target.value }));
        if (authData.siteId === '62a15f4ae4129b518b133128') {
            // 투자보호
            navigate('/cpcdashboard');
        } else {
            navigate('/lrcdashboard');
        }
    };

    // common header
    const mainHeader = (
        <Toolbar>
            <div className="mainHeader">
                <Table style={{ width: '100%', tableLayout: 'auto' }}>
                    <TableRow>
                        <StyledTableCell style={{ height: 25 }}>
                            {/* 왼쪽 메뉴바 열고 닫기 */}
                            <IconButton
                                disableRipple
                                aria-label="open drawer"
                                onClick={handleDrawerToggle}
                                edge="start"
                                color="secondary"
                                sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor, ml: { xs: 0, lg: -2 } }}
                            >
                                {!open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            </IconButton>
                        </StyledTableCell>
                        {/* <StyledTableCell style={{ width: '1', height: 25 }} align="left" component="th" scope="row">
                            <HomeIcon color="primary" />
                        </StyledTableCell> */}
                        <StyledTableCell style={{ height: 25 }} align="left" component="th" scope="row">
                            <Typography variant="h6">관리 권한</Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left" component="th" scope="row">
                            <FormControl sx={{ m: 0, minWidth: 240, maxHeight: 35 }} size="small">
                                <Select name="mySiteId" label="사이트명" size="small" value={mySiteId} onChange={handleChange}>
                                    <MenuItem value="">
                                        <em>Choose a Site Type</em>
                                    </MenuItem>
                                    {mySiteList.length > 0 &&
                                        mySiteList.map((item, index) => (
                                            <MenuItem key={index} value={item.site_id}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </StyledTableCell>
                        <StyledTableCell align="left" style={{ width: '40%', height: 25 }} component="th" scope="row"></StyledTableCell>
                        <StyledTableCell align="right" style={{ width: '22%', height: 25 }} component="th" scope="row">
                            <HeaderContent />
                        </StyledTableCell>
                    </TableRow>
                </Table>
            </div>
        </Toolbar>
    );

    // app-bar params
    const appBar = {
        position: 'fixed',
        color: 'inherit',
        elevation: 0,
        sx: {
            borderBottom: `1px solid ${theme.palette.divider}`
            // boxShadow: theme.customShadows.z1
        }
    };

    return (
        <>
            {!matchDownMD ? (
                <AppBarStyled open={open} {...appBar}>
                    {mainHeader}
                </AppBarStyled>
            ) : (
                <AppBar {...appBar}>{mainHeader}</AppBar>
            )}
        </>
    );
};

Header.propTypes = {
    open: PropTypes.bool,
    handleDrawerToggle: PropTypes.func,
    changeSite: PropTypes.func
};

export default Header;
