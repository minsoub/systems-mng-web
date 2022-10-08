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
    // const dispatch = useDispatch();
    const navigate = useNavigate();
    const matchDownMD = useMediaQuery(theme.breakpoints.down('xs'));
    const classes = useStyles();
    const iconBackColor = 'grey.100';
    const iconBackColorOpen = 'grey.200';

    // common header
    const mainHeader = (
        <Toolbar>
            <div className="mainHeader">
                <Table style={{ width: '100%', tableLayout: 'auto' }}>
                    <tbody>
                        <TableRow>
                            <StyledTableCell style={{ height: 25 }}>
                                {/* 왼쪽 메뉴바 열고 닫기 */}
                                <IconButton
                                    disableRipple
                                    aria-label="open drawer"
                                    onClick={handleDrawerToggle}
                                    edge="start"
                                    color="secondary"
                                    sx={{ color: 'text.primary', bgcolor: 'grey.0', ml: -2 }}
                                >
                                    {!open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                </IconButton>
                            </StyledTableCell>
                            {/* <StyledTableCell style={{ width: '1', height: 25 }} align="left" component="th" scope="row">
                                <HomeIcon color="primary" />
                            </StyledTableCell> */}
                            <StyledTableCell align="left" style={{ width: '40%', height: 25 }} component="th" scope="row"></StyledTableCell>
                            <StyledTableCell align="right" style={{ width: '22%', height: 25 }} component="th" scope="row">
                                <HeaderContent />
                            </StyledTableCell>
                        </TableRow>
                    </tbody>
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
