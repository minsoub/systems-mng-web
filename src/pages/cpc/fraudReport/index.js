import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// material-ui
// eslint-disable-next-line prettier/prettier
import {
    Button,
    Grid,
    Stack,
    FormControlLabel,
    Radio,
    RadioGroup
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MainCard from 'components/MainCard';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import FraudReportApi from 'apis/cpc/fraudReport/fraudreportapi';
import ErrorScreen from 'components/ErrorScreen';
import moment from 'moment';
import HeaderTitle from 'components/HeaderTitle';
import SearchDate from 'components/ContentManage/SearchDate';
import SearchBar from 'components/ContentManage/SearchBar';
import cx from 'classnames';
import ButtonLayout from 'components/Common/ButtonLayout';
import { setSearchData } from 'store/reducers/cpc/FraudReportSearch';

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

    const { reduceFromDate, reduceToDate, reducePeriod, reduceKeyword, reduceStatus } = useSelector((state) => state.cpcFraudReportSearchReducer);
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
    ////////////////////////////////////////////////////

    // 검색 조건
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [period, setPeriod] = useState('1');
    const [status, setStatus] = useState('');
    const [keyword, setKeyword] = useState('');
    const [downloadFileName, setDownloadFileName] = useState('');

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
        if (reduceStatus) setStatus(reduceStatus);

        setIsSearch(true);
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
                if (rowData.row.attach_file_id) {
                    setDownloadFileName(rowData.row.attach_file_name);
                    getFileDownload(rowData.row.attach_file_id);
                }
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
        setStartDate(moment().format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));
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

        // 검색 조건에 대해서 상태를 저장한다.
        const searchData = {
            reduceFromDate: start_date,
            reduceToDate: end_date,
            reducePeriod: period,
            reduceKeyword: keyword,
            reduceStatus: status
        };
        dispatch(setSearchData(searchData));
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
                <HeaderTitle titleNm="사기신고 관리" menuStep01="사이트 운영" menuStep02="사기신고 관리" />
                <MainCard>
                    {/* 기간 검색 */}
                    <SearchDate
                        start_date={start_date}
                        end_date={end_date}
                        period={period}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                    />

                    {/* 카테고리 영역 */}
                    <div className={cx('category')}>
                        <Stack spacing={10} className={cx('borderTitle')}>
                            상태
                        </Stack>

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
                    </div>

                    {/* 검색바 */}
                    <SearchBar keyword={keyword} handleChange={handleChange} handleBlur={handleBlur} />
                </MainCard>

                <Grid className={cx('outButtons searchPointColor')}>
                    <ButtonLayout>
                        <Button disableElevation size="medium" type="submit" variant="contained" onClick={clearClick}>
                            초기화
                        </Button>

                        <Button disableElevation size="medium" type="submit" variant="contained" onClick={searchClick}>
                            검색
                        </Button>
                    </ButtonLayout>
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
                <Grid className={cx('outButtons searchPointColor')}>
                    <ButtonLayout>
                        <Button
                            disableElevation
                            size="medium"
                            type="submit"
                            variant="contained"
                            color="secondary"
                            onClick={excelDownloadClick}
                        >
                            엑셀 다운로드
                        </Button>
                    </ButtonLayout>
                </Grid>
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} />
            </Grid>
        </Grid>
    );
};

export default FraudReportMng;
