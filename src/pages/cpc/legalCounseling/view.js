import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, FormControlLabel, Grid, Radio, RadioGroup, Stack } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MainCard from 'components/Common/MainCard';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import LegalCounselingApi from 'apis/cpc/legalCounseling/regalcounselingapi';
import ErrorScreen from 'components/ErrorScreen';
import moment from 'moment';
import HeaderTitle from 'components/HeaderTitle';
import SearchDate from 'components/ContentManage/SearchDate';
import ButtonLayout from 'components/Common/ButtonLayout';
import { setSearchData } from 'store/reducers/cpc/LegalCounselingSearch';
import styles from './styles.module.scss';
import DownloadReason from 'components/Security/DownloadReason';
import classNames from 'classnames/bind';
import ContentLine from 'components/Common/ContentLine';
import { getDateFormat } from 'utils/CommonUtils';
import * as PropTypes from 'prop-types';
const cx = classNames.bind(styles);

const LegalCounselingMng = () => {
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
            field: 'status',
            headerName: '상태',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 100,
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
            field: 'name',
            headerName: '이름',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'email',
            headerName: '이메일주소',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'cell_phone',
            headerName: '전화번호',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
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
            valueGetter: ({ value }) => `${getDateFormat(value)}`
        }
    ];
    const navigate = useNavigate();
    const [responseData, requestError, resLoading, { searchLegalCounselingList, getExcelDownload, getFileDownload }] = LegalCounselingApi();

    const { reduceFromDate, reduceToDate, reducePeriod, reduceKeyword, reduceStatus } = useSelector(
        (state) => state.cpcLegalCounselingSearchReducer
    );
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

    // 개인정보 다운로드 사유 입력
    const [downloadReasonOpen, setDownloadReasonOpen] = useState(false);
    const [downloadReason, setDownloadReason] = useState('');
    const handleDownloadReasonClose = () => {
        setDownloadReasonOpen(false);

        if (downloadReason) {
            const request = {
                start_date,
                end_date,
                status,
                keyword,
                reason: downloadReason
            };
            setDownloadFileName('법률상담신청_다운로드.xlsx');
            getExcelDownload(request);
        }
    };

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
            case 'getLegalCounselings':
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
    const resetPeriod= () => {
        setPeriod(0);
    };
    const changeDate =(type,e)=>{
        switch(type){
            case 'start':
                setStartDate(e);
                break;
            case 'end':
                setEndDate(e);
                break;
            default:
                break;
        }
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
                navigate(`/cpc/legal-counseling/reg/${rowData.id}`);
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
        searchLegalCounselingList(request);

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
        setDownloadReason('');
        setDownloadReasonOpen(true);
    };

    return (
        <Grid container rowSpacing={4} columnSpacing={2.75}>
            <Grid item xs={12}>
                <HeaderTitle titleNm="법률 상담 관리" menuStep01="사이트 운영" menuStep02="법률 상담 관리" />

                <MainCard className="legalLayout">
                    {/* 기간 검색 */}
                    <SearchDate
                        start_date={start_date}
                        end_date={end_date}
                        period={period}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        startName="start_date"
                        endName="end_date"
                        addAll={true}
                        changeDate={changeDate}
                        resetPeriod={resetPeriod}
                    />

                    {/* 카테고리 영역 */}
                    <div className={cx('legalLayoutCategory')}>
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
                </MainCard>

                <ButtonLayout buttonName="bottom--blank__small">
                    <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={clearClick}>
                        초기화
                    </Button>

                    <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={searchClick}>
                        검색
                    </Button>
                </ButtonLayout>

                <ContentLine>
                    <DefaultDataGrid
                        columns={columns}
                        rows={dataGridRows}
                        pageSize={10}
                        height={660}
                        handlePageChange={handlePage}
                        handleGridClick={handleClick}
                        handleGridDoubleClick={handleDoubleClick}
                        selectionChange={handleSelectionChange}
                    />
                </ContentLine>
                <ButtonLayout>
                    <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={excelDownloadClick}>
                        엑셀 다운로드
                    </Button>
                </ButtonLayout>
                <DownloadReason
                    open={downloadReasonOpen}
                    reason={downloadReason}
                    setReason={setDownloadReason}
                    handleClose={handleDownloadReasonClose}
                />

                {errorMessage && (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                )}
            </Grid>
        </Grid>
    );
};

export default LegalCounselingMng;

DownloadReason.propTypes = {
    reason: PropTypes.string,
    setReason: PropTypes.func,
    handleClose: PropTypes.func,
    open: PropTypes.bool
};
