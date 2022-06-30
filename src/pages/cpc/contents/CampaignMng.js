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
import MainCard from 'components/MainCard';
import CheckBoxDataGrid from '../../../components/DataGrid/CheckBoxDataGrid';
import BoardMasterApi from 'apis/cpc/board/boardmasterapi';
import BoardApi from 'apis/cpc/board/boardapi';
import ErrorScreen from 'components/ErrorScreen';
import moment from 'moment';
import './BoardList.css';

const CampaignMng = () => {
    let isSubmitting = false;
    const getContents = (params) => {
        return (
            <div className="desc_container">
                <h3 className="overflow-wrap">{params.row.title}</h3>
                <p className="overflow-wrap">{params.row.description}</p>
                <p className="overflow-wrap">{params.row.tags && '#'.concat(params.row.tags.join(' #'))}</p>
                <p>{params.row.create_date}</p>
            </div>
        );
    };

    const columns = [
        {
            field: 'id',
            headerName: '번호',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 100
        },
        {
            field: 'thumbnail',
            headerName: '썸네일 이미지',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <div className="div_thumbnail">
                    <img className="img_thumbnail" src={params.value} alt={`${params.row.title} 썸네일 이미지`} />
                </div>
            ),
            maxWidth: 240
        },
        {
            field: 'contents',
            headerName: '콘텐츠',
            flex: 1,
            headerAlign: 'center',
            align: 'left',
            renderCell: getContents
        },
        {
            field: 'create_account_name',
            headerName: '등록자',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            minWidth: 300
        }
    ];
    const navigate = useNavigate();
    const boardMasterId = 'CPC_CAMPAIGN';
    const [resBoardMaster, boardMasterError, loading, { searchBoardMaster }] = BoardMasterApi();
    const [responseData, requestError, resLoading, { searchBoardList, deleteBoardList }] = BoardApi();

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
    const [keyword, setKeyword] = useState('');

    // onload
    useEffect(() => {
        setStartDate(moment().format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));
        searchBoardMaster(boardMasterId);
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
        if (!resBoardMaster) {
            return;
        }
        const request = {
            start_date,
            end_date,
            keyword
        };
        searchBoardList(boardMasterId, request);
    }, [resBoardMaster]);

    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getBoards':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setDataGridRows(responseData.data.data);
                } else {
                    setDataGridRows([]);
                }
                break;
            case 'deleteBoards':
                alert('삭제되었습니다.');
                const request = {
                    start_date,
                    end_date,
                    keyword
                };
                searchBoardList(boardMasterId, request);
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
        if (rowData && rowData.field && rowData.field !== '__check__') {
            navigate(`/cpc/contents/campaign/reg/${rowData.id}`);
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
        setKeyword('');
    };

    // 검색
    const searchClick = () => {
        console.log('searchClick called...');
        const request = {
            start_date,
            end_date,
            keyword
        };
        searchBoardList(boardMasterId, request);
    };

    // 삭제
    const deleteClick = () => {
        console.log('deleteClick called...');
        if (selectedRows.length === 0) {
            alert('삭제 할 콘텐츠를 체크하세요!');
            return;
        }
        console.log(selectedRows);
        if (confirm('삭제 하시겠습니까?')) {
            let deleteIds = '';
            let idx = 0;
            selectedRows.map((data, Index) => {
                if (idx > 0) deleteIds = deleteIds + '::';
                deleteIds = deleteIds + data;
                idx++;
            });
            console.log(deleteIds);
            deleteBoardList(boardMasterId, deleteIds);
        }
    };

    // 등록
    const addClick = () => {
        console.log('addClick called...');
        navigate('/cpc/contents/campaign/reg');
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h3">콘텐츠 관리(안전거래 캠페인)</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">Home &gt; 사이트 운영 &gt; 콘텐츠 관리 &gt; 안전거래 캠페인</Typography>
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
                <MainCard sx={{ mt: 2 }} content={false}>
                    <CheckBoxDataGrid
                        columns={columns}
                        rows={dataGridRows}
                        handlePageChange={handlePage}
                        handleGridClick={handleClick}
                        handleGridDoubleClick={handleDoubleClick}
                        selectionChange={handleSelectionChange}
                    />
                </MainCard>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={8} sm={0.8}>
                        <FormControl sx={{ m: 1 }} size="small">
                            <Button disableElevation size="small" type="submit" variant="contained" color="secondary" onClick={deleteClick}>
                                선택삭제
                            </Button>
                        </FormControl>
                    </Grid>
                    <Grid item xs={8} sm={0.6}>
                        <FormControl sx={{ m: 1 }} size="small">
                            <Button disableElevation size="small" type="submit" variant="contained" color="primary" onClick={addClick}>
                                등록
                            </Button>
                        </FormControl>
                    </Grid>
                </Grid>
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} />
            </Grid>
        </Grid>
    );
};

export default CampaignMng;
