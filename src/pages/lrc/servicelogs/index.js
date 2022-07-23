import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Table, TableRow } from '@mui/material';
import MainCard from 'components/Common/MainCard';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import { GridToolbar } from '@mui/x-data-grid';
import LogsApi from 'apis/servicelogs/index';
import ErrorScreen from 'components/ErrorScreen';
import moment from 'moment';
import { setSearchData } from 'store/reducers/logsearch';
import HeaderTitle from 'components/HeaderTitle';
import ButtonLayout from 'components/Common/ButtonLayout';
import SearchBar from 'components/ContentManage/SearchBar';
import cx from 'classnames';
import SearchDate from 'components/ContentManage/SearchDate';
import ContentLine from '../../../components/Common/ContentLine';

// Log
const ServiceLog = () => {
    const columns = [
        {
            field: 'no',
            headerName: 'SN',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 60
        },
        {
            field: 'email',
            headerName: 'ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 200
        },
        {
            field: 'ip',
            headerName: '접속 IP',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 100
        },
        {
            field: 'menu_name',
            headerName: '메뉴',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 200
        },
        {
            field: 'method',
            headerName: 'CRUD',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 60
        },
        {
            field: 'uri',
            headerName: 'URI',
            flex: 1,
            headerAlign: 'center',
            align: 'left'
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
            align: 'center',
            maxWidth: 140
        }
    ];
    const navigate = useNavigate();
    const [responseData, requestError, loading, { logLrcSearch, logExcelDownload }] = LogsApi();

    const { reduceFromDate, reduceToDate, reducePeriod, reduceKeyword } = useSelector((state) => state.logSearchReducer);
    const dispatch = useDispatch();

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
    const [from_date, setStartDate] = useState('');
    const [to_date, setEndDate] = useState('');
    const [period, setPeriod] = useState('');

    // 상태 값
    const [isSearch, setIsSearch] = useState(false);

    // onload
    useEffect(() => {
        setStartDate(moment().format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));
        setPeriod(1);

        // reduce 상태값을 사용하여 검색을 수행한다.
        if (reduceFromDate) setStartDate(reduceFromDate);
        if (reduceToDate) setEndDate(reduceToDate);
        if (reduceKeyword) setKeyword(reduceKeyword);
        if (reducePeriod) setPeriod(reducePeriod);

        // 사업계열, 네트워크 계열
        if (reduceFromDate && reduceToDate) setIsSearch(true);
        else setIsSearch(true);
    }, []);

    useEffect(() => {
        if (isSearch) {
            searchClick();
            setIsSearch(false);
        }
    }, [isSearch]);

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
                    let listData = [];
                    responseData.data.data.map((item, index) => {
                        let d = {
                            no: index + 1,
                            id: item.id,
                            email: item.email,
                            ip: item.ip,
                            menu_name: item.menu_name,
                            method: item.method,
                            uri: item.uri,
                            create_date: item.create_date
                        };
                        listData.push(d);
                    });
                    setDataGridRows(listData); // responseData.data.data);
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
            case 'from_date':
                setStartDate(e.target.value);
                break;
            case 'to_date':
                setEndDate(e.target.value);
                break;
            case 'period':
                setPeriod(e.target.value);
                setDateFromToSet(e.target.value);
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
                setStartDate(moment().add(-30, 'days').format('YYYY-MM-DD'));
                setEndDate(moment().format('YYYY-MM-DD'));
                break;
            case '4':
                setStartDate(moment().add(-90, 'days').format('YYYY-MM-DD'));
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
        navigate(`/service/log/${rowData.row.id}`);
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // search
    const searchClick = () => {
        console.log('searchClick called...');
        logLrcSearch(from_date, to_date, keyword);
        // 검색 조건에 대해서 상태를 저장한다.
        const searchData = {
            reduceFromDate: from_date,
            reduceToDate: to_date,
            reducePeriod: period,
            reduceKeyword: keyword
        };
        dispatch(setSearchData(searchData));
    };

    const clearClick = () => {
        setStartDate(moment().format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));
        setKeyword('');
        setPeriod(1);
    };
    // Excel Download
    const excelClick = () => {
        logExcelDownload(from_date, to_date, keyword);
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle titleNm="서비스 로그 관리" menuStep01="사이트 운영" menuStep02="서비스 로그 관리" />
                <MainCard>
                    {/* 기간 검색 */}
                    <SearchDate
                        start_date={from_date}
                        end_date={to_date}
                        period={period}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        startName="from_date"
                        endName="to_date"
                    />

                    {/* 검색바 */}
                    <SearchBar keyword={keyword} handleChange={handleChange} handleBlur={handleBlur} />
                </MainCard>
                <Grid className={cx('layout--button__bottom')}>
                    <ButtonLayout>
                        <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={searchClick}>
                            검색
                        </Button>
                        <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={clearClick}>
                            초기화
                        </Button>
                        <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={excelClick}>
                            Excel
                        </Button>
                    </ButtonLayout>
                </Grid>

                <ContentLine>
                    <DefaultDataGrid
                        columns={columns}
                        rows={dataGridRows}
                        handlePageChange={handlePage}
                        handleGridClick={handleClick}
                        handleGridDoubleClick={handleDoubleClick}
                        selectionChange={handleSelectionChange}
                        components={{ Toolbar: GridToolbar }}
                        height={650}
                    />
                </ContentLine>
                {errorMessage && (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                )}
            </Grid>
        </Grid>
    );
};

export default ServiceLog;
