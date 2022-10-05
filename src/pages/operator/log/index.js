import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Button, Grid } from '@mui/material';
import MainCard from 'components/Common/MainCard';
import DefaultDataGrid from '../../../components/DataGrid/DefaultDataGrid';
import LogsApi from 'apis/apilogs/audit';
import ErrorScreen from 'components/ErrorScreen';
import moment from 'moment';
import HeaderTitle from '../../../components/HeaderTitle';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import SearchBar from '../../../components/ContentManage/SearchBar';
import SearchDate from '../../../components/ContentManage/SearchDate';
import ContentLine from '../../../components/Common/ContentLine';
import { getDateFormat } from 'utils/CommonUtils';
import ReasonDialog from 'pages/popup/ReasonPopup';
const SiteLogPage = () => {
    let isSubmitting = false;
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
            maxWidth: 140,
            valueGetter: ({ value }) => `${getDateFormat(value)}`
        }
    ];
    const navigate = useNavigate();
    const { siteId } = useSelector((state) => state.auth);
    const [responseData, requestError, loading, { auditLogSearch, auditLogExcelDownload }] = LogsApi();

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

    // Log reason Dialog
    const [openReason, setOpenReason] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');

    // onload
    useEffect(() => {
        setStartDate(moment().format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));
        //searchClick();
        auditLogSearch(moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), '');
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
                    link.setAttribute('download', '감사로그.xlsx');
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
            navigate(`/sitelog/log/${rowData.row.id}`);
        }
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // search
    const searchClick = () => {
        console.log('searchClick called...');
        //roleComboSearch(is_use, type, site_id);
        auditLogSearch(start_date, end_date, keyword);
    };

    // Excel Download
    const excelClick = () => {
        setOpenReason(true);
    };

    const handlePopupClose = (returnData) => {
        setOpenReason(false);
        // 데이터 처리
        if (returnData.length !== 0) {
            // 데이터 처리
            console.log(returnData);
            let reason = returnData;
            auditLogExcelDownload(start_date, end_date, keyword, reason);
        }
    };

    return (
        <Grid container rowSpacing={4} columnSpacing={2.75}>
            <Grid item xs={12}>
                <HeaderTitle titleNm="감사로그 조회" menuStep01="사이트 관리" menuStep02="감사로그 조회" />

                <MainCard>
                    {/* 기간 검색 */}
                    <SearchDate
                        start_date={start_date}
                        end_date={end_date}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        noneChecked="noneChecked"
                        startName="start_date"
                        endName="end_date"
                    />

                    {/* 검색바 */}
                    <SearchBar keyword={keyword} handleChange={handleChange} handleBlur={handleBlur} />
                </MainCard>

                <ButtonLayout buttonName="bottom--blank__small">
                    <Button disableElevation size="medium" type="submit" variant="contained" onClick={searchClick}>
                        검색
                    </Button>
                    <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={excelClick}>
                        Excel
                    </Button>
                </ButtonLayout>

                <ContentLine>
                    <DefaultDataGrid
                        columns={columns}
                        rows={dataGridRows}
                        handlePageChange={handlePage}
                        handleGridClick={handleClick}
                        handleGridDoubleClick={handleDoubleClick}
                        selectionChange={handleSelectionChange}
                        height={750}
                    />
                </ContentLine>

                {errorMessage && (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                )}
            </Grid>
            <ReasonDialog selectedValue={selectedValue} open={openReason} onClose={handlePopupClose} />
        </Grid>
    );
};

export default SiteLogPage;
