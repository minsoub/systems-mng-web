import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
    OutlinedInput,
    Box,
    Button,
    Grid,
    Stack,
    TextField,
    Collapse,
    Alert,
    AlertTitle,
    Typography,
    FormControl,
    Select,
    MenuItem,
    FormControlLabel,
    Table,
    TableHead,
    TableRow,
    TableBody
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import MainCard from 'components/MainCard';
import { makeStyles, withStyles } from '@mui/styles';
import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Input } from 'antd';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import LogsApi from 'apis/servicelogs/index';
import ErrorScreen from 'components/ErrorScreen';
import HeaderTitle from "../../../components/HeaderTitle";

const useStyles = makeStyles({
    tableRow: {
        height: 36
    },
    tableCell: {
        padding: '0px 16px',
        height: 36
    },
    table: {
        minWidth: 650,
        '& .MuiTableCell-root': {
            borderLeft: '1px solid rgba(224, 224, 224, 1)'
        }
    }
});

const StyledTableCell = withStyles((theme) => ({
    root: {
        padding: '0px 16px'
    },
    [`&.${tableCellClasses.body}`]: {
        backgroundColor: '#e0e0e0', //theme.palette.common.black,
        color: theme.palette.common.black
    }
}))(TableCell);
const ServiceDetail = () => {
    const navigate = useNavigate();
    const { paramId } = useParams();
    const [responseData, requestError, loading, { logLrcDetail }] = LogsApi();
    ////////////////////////////////////////////////////
    // 공통 에러 처리
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const parentErrorClear = () => {
        setOpen(false);
        setErrorTitle('');
        setErrorMessage('');
    };
    ////////////////////////////////////////////////////
    const [logDetail, setLogDetail] = useState({});
    // onload
    useEffect(() => {
        logLrcDetail(paramId);
    }, []);

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            if (requestError.result === 'FAIL') {
                console.log('error requestError');
                console.log(requestError);
                setErrorTitle('Error Message');
                setErrorMessage('[' + requestError.error.code + '] ' + requestError.error.message);
                setOpen(true);
            }
        }
    }, [requestError]);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'logDetail':
                if (responseData.data.data) {
                    setLogDetail(responseData.data.data);
                } else {
                    setLogDetail({});
                }
                break;
            default:
                break;
        }
    }, [responseData]);

    const listClick = () => {
        navigate('/service/list');
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle
                    titleNm="서비스 로그 관리"
                    menuStep01="서비스 로그 관리"
                    menuStep02="사이트 운영"
                    menuStep03="서비스 로그 관리"
                />

                <MainCard sx={{ mt: 1 }} content={false} style={{ width: '100%' }}>
                    <Table fixedHeader={false} style={{ width: '100%', tableLayout: 'auto' }} stickyHeader aria-label="simple table">
                        <TableBody>
                            <TableRow>
                                <StyledTableCell style={{ width: '15%' }} align="right">
                                    발생일시
                                </StyledTableCell>
                                <TableCell style={{ width: '75%' }} align="left">
                                    {logDetail.create_date}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell style={{ width: '15%' }} align="right">
                                    SN
                                </StyledTableCell>
                                <TableCell style={{ width: '75%' }} align="left">
                                    {logDetail.id}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell style={{ width: '15%' }} align="right">
                                    ID
                                </StyledTableCell>
                                <TableCell style={{ width: '75%' }} align="left">
                                    {logDetail.email}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell style={{ width: '15%' }} align="right">
                                    접속 IP
                                </StyledTableCell>
                                <TableCell style={{ width: '75%' }} align="left">
                                    {logDetail.ip}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell style={{ width: '15%' }} align="right">
                                    메뉴
                                </StyledTableCell>
                                <TableCell style={{ width: '75%' }} align="left">
                                    {logDetail.menu_name}&nbsp;
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell style={{ width: '15%' }} align="right">
                                    CRUD
                                </StyledTableCell>
                                <TableCell style={{ width: '75%' }} align="left">
                                    {logDetail.method}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell style={{ width: '15%' }} align="right">
                                    URI
                                </StyledTableCell>
                                <TableCell style={{ width: '75%' }} align="left">
                                    {logDetail.uri}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell style={{ width: '15%' }} align="right">
                                    Parameter
                                </StyledTableCell>
                                <TableCell style={{ width: '75%' }} align="left">
                                    {logDetail.query_params}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell style={{ width: '15%' }} align="right">
                                    Parameter Detail
                                </StyledTableCell>
                                <TableCell style={{ width: '75%' }} align="left">
                                    {logDetail.parameter}&nbsp;
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </MainCard>
                <Table fixedHeader={false} style={{ width: '100%', tableLayout: 'auto' }} stickyHeader aria-label="simple table">
                    <TableBody>
                        <TableRow>
                            <TableCell style={{ width: '100%' }} align="right">
                                <FormControl sx={{ m: 1 }} size="small">
                                    <Button
                                        disableElevation
                                        size="small"
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        onClick={listClick}
                                    >
                                        목록
                                    </Button>
                                </FormControl>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>


            </Grid>
        </Grid>
    );
};

export default ServiceDetail;
