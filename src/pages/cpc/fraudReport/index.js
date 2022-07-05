import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material-ui
// eslint-disable-next-line prettier/prettier
import {
    Button,
    Grid,
    Stack,
    TextField,
    Typography,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MainCard from 'components/MainCard';
import DefaultDataGrid from '../../../components/DataGrid/DefaultDataGrid';
import FraudReportApi from 'apis/cpc/fraudReport/fraudreportapi';
import ErrorScreen from 'components/ErrorScreen';
import moment from 'moment';

const FraudReportMng = () => {
    const columns = [
        {
            field: 'id',
            headerName: '번호',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 200
        },
        {
            field: 'status',
            headerName: '상태',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 200,
            valueFormatter: (params) => {
                let statusName = '';
                switch (params.value) {
                    case 'REGISTER':
                        statusName = '접수';
                        break;
                    case 'REQUEST':
                        statusName = '답변요청';
                        break;
                    case 'COMPLETE':
                        statusName = '답변완료';
                        break;
                    default:
                        break;
                }
                return `${statusName}`;
            }
        },
        {
            field: 'title',
            headerName: '제목',
            flex: 1,
            headerAlign: 'center',
            align: 'left'
        },
        {
            field: 'attach_file_id',
            headerName: '첨부파일',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 120,
            renderCell: (params) => {
                return params.value && <AttachFileIcon />;
            }
        },
        {
            field: 'create_date',
            headerName: '등록일시',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 200
        },
        {
            field: 'email',
            headerName: '제보자',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 220
        }
    ];
    const navigate = useNavigate();
    const [responseData, requestError, resLoading, { searchFraudReportList, getExcelDownload, getFileDownload }] = FraudReportApi();

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);

    ////////////////////////////////////////////////////
    // 공통 에러 처리
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    ////////////////////////////////////////////////////

    // 검색 조건
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [period, setPeriod] = useState('1');
    const [status, setStatus] = useState('');
    const [keyword, setKeyword] = useState('');
    const [downloadFileName, setDownloadFileName] = useState('');

    // onload
    useEffect(() => {
        setStartDate(moment().format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));

        const request = {
            start_date: moment().format('YYYY-MM-DD'),
            end_date: moment().format('YYYY-MM-DD'),
            status,
            keyword
        };
        searchFraudReportList(request);
    }, []);

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            console.log('error requestError');
            console.log(requestError);
            setErrorTitle('Error Message');
            setErrorMessage(requestError);
            setOpen(true);
        }
    }, [requestError]);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getFraudReports':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setDataGridRows(responseData.data.data);
                } else {
                    setDataGridRows([]);
                }
                break;
            case 'getExcelDownload':
            case 'getFileDownload':
                if (responseData.data) {
                    let res = responseData;
                    console.log('res data....');
                    console.log(res);
                    console.log(res.fileName);
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${downloadFileName}`);
                    link.style.cssText = 'display:none';
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    setDownloadFileName('');
                }
                break;
            default:
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
            case 'start_date':
                setStartDate(e.target.value);
                setPeriod('');
                break;
            case 'end_date':
                setEndDate(e.target.value);
                setPeriod('');
                break;
            case 'period':
                setPeriod(e.target.value);
                setDateFromToSet(e.target.value);
                break;
            case 'status':
                setStatus(e.target.value);
                break;
            case 'keyword':
                setKeyword(e.target.value);
                break;
            default:
                break;
        }
    };

    // 기간 선택시 날짜 변경
    const setDateFromToSet = (periodIndex) => {
        switch (periodIndex) {
            case '1':
                setStartDate(moment().format('YYYY-MM-DD'));
                setEndDate(moment().format('YYYY-MM-DD'));
                break;
            case '2':
                setStartDate(moment().add(-1, 'days').format('YYYY-MM-DD'));
                setEndDate(moment().add(-1, 'days').format('YYYY-MM-DD'));
                break;
            case '3':
                setStartDate(moment().add(-1, 'months').format('YYYY-MM-DD'));
                setEndDate(moment().format('YYYY-MM-DD'));
                break;
            case '4':
                setStartDate(moment().add(-3, 'months').format('YYYY-MM-DD'));
                setEndDate(moment().format('YYYY-MM-DD'));
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
        if (rowData && rowData.field) {
            if (rowData.field === 'attach_file_id') {
                setDownloadFileName(rowData.row.attach_file_name);
                getFileDownload(rowData.row.attach_file_id);
            } else {
                navigate(`/cpc/fraud-report/reg/${rowData.id}`);
            }
        }
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // 초기화
    const clearClick = () => {
        console.log('clearClick called...');
        setStartDate('');
        setEndDate('');
        setPeriod('1');
        setStatus('');
        setKeyword('');
    };

    // 검색
    const searchClick = () => {
        console.log('searchClick called...');
        const request = {
            start_date,
            end_date,
            status,
            keyword
        };
        searchFraudReportList(request);
    };

    // 엑셀 다운로드
    const excelDownloadClick = () => {
        console.log('excelDownloadClick called...');
        const request = {
            start_date,
            end_date,
            status,
            keyword
        };
        setDownloadFileName('사기신고_다운로드.xlsx');
        getExcelDownload(request);
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h3">사기신고 관리</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">Home &gt; 사이트 운영 &gt; 사기신고 관리</Typography>
                    </Grid>
                    <Grid container spacing={2}></Grid>
                </Grid>
                <MainCard sx={{ mt: 1 }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid container spacing={0} sx={{ mt: 0 }}>
                            <Grid item xs={8} sm={0.7}>
                                <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                    <Stack spacing={0}>기간 검색</Stack>
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
                                <Stack spacing={3}>
                                    <FormControl sx={{ m: 0, height: 25 }} fullWidth>
                                        <RadioGroup
                                            row
                                            aria-labelledby="period-radio-buttons-group-label"
                                            name="period"
                                            value={period}
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel value="1" control={<Radio />} label="오늘" />
                                            <FormControlLabel value="2" control={<Radio />} label="어제" />
                                            <FormControlLabel value="3" control={<Radio />} label="1개월" />
                                            <FormControlLabel value="4" control={<Radio />} label="3개월" />
                                        </RadioGroup>
                                    </FormControl>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} sx={{ mt: 0 }}>
                            <Grid item xs={8} sm={0.7}>
                                <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                    <Stack spacing={0}>상태</Stack>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={7.3}>
                                <Stack spacing={3}>
                                    <FormControl sx={{ m: 0, height: 25 }} fullWidth>
                                        <RadioGroup
                                            row
                                            aria-labelledby="status-radio-buttons-group-label"
                                            name="status"
                                            value={status}
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel value="" control={<Radio />} label="전체" />
                                            <FormControlLabel value="REGISTER" control={<Radio />} label="접수" />
                                            <FormControlLabel value="REQUEST" control={<Radio />} label="답변요청" />
                                            <FormControlLabel value="COMPLETE" control={<Radio />} label="답변완료" />
                                        </RadioGroup>
                                    </FormControl>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} sx={{ mt: 0 }}>
                            <Grid item xs={8} sm={0.7}>
                                <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                    <Stack spacing={0}>검색어</Stack>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={5.3}>
                                <FormControl sx={{ m: 0, minHeight: 25, minWidth: 240 }} size="small" fullWidth>
                                    <TextField
                                        id="filled-hidden-label-small"
                                        type="text"
                                        size="small"
                                        value={keyword}
                                        name="keyword"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder=""
                                        fullWidth
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </MainCard>
                <Grid container alignItems="right" justifyContent="space-between">
                    <Grid container spacing={0} sx={{ mt: 0 }}>
                        <Grid item xs={8} sm={10.5}></Grid>
                        <Grid item xs={8} sm={0.6}>
                            <FormControl sx={{ m: 1 }} size="small">
                                <Button
                                    disableElevation
                                    size="small"
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    onClick={clearClick}
                                >
                                    초기화
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
                                    color="primary"
                                    onClick={searchClick}
                                >
                                    검색
                                </Button>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justifyContent="flex-end">
                    <Grid item xs={8} sm={1.2}>
                        <FormControl sx={{ mt: 1, mb: 1 }} size="small">
                            <Button
                                disableElevation
                                size="small"
                                type="submit"
                                variant="contained"
                                color="secondary"
                                onClick={excelDownloadClick}
                            >
                                엑셀다운로드
                            </Button>
                        </FormControl>
                    </Grid>
                </Grid>
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
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} />
            </Grid>
        </Grid>
    );
};

export default FraudReportMng;
