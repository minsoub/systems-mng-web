import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// material-ui
// eslint-disable-next-line prettier/prettier
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
    Checkbox
} from '@mui/material';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Input } from 'antd';
import DefaultDataGrid from '../../../components/DataGrid/DefaultDataGrid';
import LogsApi from 'apis/servicelogs/index';
import ErrorScreen from 'components/ErrorScreen';
import moment from 'moment';

const SiteLogPage = () => {
    let isSubmitting = false;
    const columns = [
        {
            field: 'id',
            headerName: 'SN',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'email',
            headerName: 'ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'ip',
            headerName: '접속 IP',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'menu_name',
            headerName: '메뉴',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'method',
            headerName: 'CRUD',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            width: 60
        },
        {
            field: 'uri',
            headerName: 'URI',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            width: 200
        },
        // {
        //     field: 'parameter',
        //     headerName: 'Parameter',
        //     flex: 1,
        //     headerAlign: 'center',
        //     align: 'center'
        // },
        {
            field: 'create_date',
            headerName: '발생일시',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        }
    ];
    const navigate = useNavigate();
    const { siteId } = useSelector((state) => state.auth);
    const [responseData, requestError, loading, { logLrcSearch, logExcelDownload }] = LogsApi();

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);

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

    // 검색 조건
    const [keyword, setKeyword] = useState('');
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');

    // onload
    useEffect(() => {
        //siteSearch(true, '');
        //roleList();
        // 기본 날자 입력
        setStartDate(moment().format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));
        searchClick();
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
            case 'logList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setDataGridRows(responseData.data.data);
                } else {
                    setDataGridRows([]);
                }
                break;
            case 'logExport':
                if (responseData.data) {
                    let res = responseData;
                    console.log('res data....');
                    console.log(res);
                    console.log(res.fileName);
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', '서비스로그.xlsx');
                    link.style.cssText = 'display:none';
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                }
                break;
            default:
                break;
        }
    }, [responseData]);

    const handleClose = () => {
        setVisible(false);
    };
    const handleBlur = (e) => {
        console.log(e);
    };
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'keyword':
                setKeyword(e.target.value);
                break;
            case 'start_date':
                setStartDate(e.target.value);
                break;
            case 'end_date':
                setEndDate(e.target.value);
                break;
            default:
                break;
        }
    };

    //체크박스 선택된 row id 저장
    const handleSelectionChange = (item) => {
        if (item) {
            setSeletedRows(item);
        }
    };
    // 페이징 변경 이벤트
    const handlePage = (page) => {};

    // 그리드 클릭
    const handleClick = (rowData) => {
        if (rowData && rowData.field && rowData.field !== '__check__') {
            //let searchCondition = { site_id: site_id, is_use: is_use, type: type };
            //navigate(`/authmng/reg/${rowData.id}`);
        }
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // search
    const searchClick = () => {
        console.log('searchClick called...');
        //roleComboSearch(is_use, type, site_id);
        logLrcSearch(start_date, end_date, keyword);
    };
    const excelClick = () => {
        logExcelDownload(start_date, end_date, keyword);
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h3">감사로그 조회</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">사이트 관리 &gt; 감사로그 조회</Typography>
                    </Grid>
                    <Grid container spacing={2}></Grid>
                </Grid>
                <MainCard sx={{ mt: 1 }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid container spacing={0} sx={{ mt: 0 }}>
                            <Grid item xs={8} sm={0.7}>
                                <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                    <Stack spacing={0}>일시</Stack>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={1.5}>
                                <FormControl sx={{ m: 0, minHeight: 25 }} size="small">
                                    <TextField
                                        id="start_date"
                                        name="start_date"
                                        value={start_date}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="date"
                                        defaultValue=""
                                        sx={{ width: 140 }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={0.3}>
                                ~{' '}
                            </Grid>
                            <Grid item xs={8} sm={1.5}>
                                <FormControl sx={{ m: 0, minHeight: 25 }} size="small">
                                    <TextField
                                        id="end_date"
                                        name="end_date"
                                        value={end_date}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="date"
                                        defaultValue=""
                                        sx={{ width: 140 }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={4}>
                                <FormControl sx={{ m: 0, minHeight: 25, minWidth: 240 }} size="small">
                                    <TextField
                                        id="filled-hidden-label-small"
                                        type="text"
                                        size="small"
                                        value={keyword}
                                        name="keyword"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter Keyword Name"
                                        fullWidth
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={2.7}></Grid>
                            <Grid item xs={8} sm={0.6}>
                                <FormControl sx={{ m: 1 }} size="small">
                                    <Button
                                        disableElevation
                                        size="small"
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        onClick={searchClick}
                                    >
                                        검색
                                    </Button>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={0.1}></Grid>
                            <Grid item xs={8} sm={0.6}>
                                <FormControl sx={{ m: 1 }} size="small">
                                    <Button
                                        disableElevation
                                        size="small"
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        onClick={excelClick}
                                    >
                                        Excel
                                    </Button>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </MainCard>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <DefaultDataGrid
                        columns={columns}
                        rows={dataGridRows}
                        handlePageChange={handlePage}
                        handleGridClick={handleClick}
                        handleGridDoubleClick={handleDoubleClick}
                        selectionChange={handleSelectionChange}
                    />
                </MainCard>
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
            </Grid>
        </Grid>
    );
};

export default SiteLogPage;
