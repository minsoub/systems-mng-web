import React, { useEffect, useState } from 'react';
import { Button, Grid } from '@mui/material';
import HeaderTitle from 'components/HeaderTitle';
import MainCard from 'components/Common/MainCard';
import SearchDate from 'components/ContentManage/SearchDate';
import SearchBar from 'components/ContentManage/SearchBar';
import ButtonLayout from 'components/Common/ButtonLayout';
import ContentLine from 'components/Common/ContentLine';
import { useNavigate } from 'react-router-dom';
import DefaultDataGrid from '../../../components/DataGrid/DefaultDataGrid';
import { GridToolbar } from '@mui/x-data-grid';
import moment from 'moment';
import MyPrivacyApi from '../../../apis/sitemyprivacy';

const SiteMyPrivacy = () => {
    const navigate = useNavigate();
    const [responseData, requestError, resLoading, { getSearchData }] = MyPrivacyApi();
    // 검색 조건
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [period, setPeriod] = useState('1');
    const [keyword, setKeyword] = useState('');
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);

    const columns = [
        {
            field: 'no',
            headerName: 'No.',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 60,
            renderCell: (index) => index.api.getRowIndex(index.row.id) + 1
        },
        {
            field: 'email',
            headerName: '관리자 ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 240
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
            field: 'action_type',
            headerName: '수행업무',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 100
        },
        {
            field: 'reason',
            headerName: '사유',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 200
        },
        {
            field: 'description',
            headerName: '설명',
            flex: 1,
            headerAlign: 'center',
            align: 'left'
        },
        {
            field: 'create_date',
            headerName: '입력시간',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 140
        }
    ];

    // 그리드 클릭
    const handleClick = (rowData) => {
        //navigate(`/sitemyprivacy/${rowData.row.id}`);
    };

    //체크박스 선택된 row id 저장
    const handleSelectionChange = (item) => {
        if (item) {
            setSeletedRows(item);
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

    // 페이징 변경 이벤트
    const handlePage = (page) => {};
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
            case 'keyword':
                setKeyword(e.target.value);
                break;
            default:
                break;
        }
    };

    // 검색
    const searchClick = () => {
        getSearchData(start_date, end_date, keyword);
    };
    useEffect(() => {
        setStartDate(moment().format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));
        getSearchData(moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), '');
    }, []);

    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'siteMyPrivacyList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setDataGridRows(responseData.data.data);
                } else {
                    setDataGridRows([]);
                }
                break;
            default:
                break;
        }
    }, [responseData]);

    return (
        <Grid container rowSpacing={4} columnSpacing={2.75}>
            <Grid item xs={12}>
                <HeaderTitle titleNm="개인정보 취급이력" menuStep01="사이트 관리" menuStep02="개인정보 취급이력" />
                <MainCard>
                    {/* 기간 검색 */}
                    <SearchDate
                        start_date={start_date}
                        end_date={end_date}
                        period={period}
                        handleChange={handleChange}
                        startName="start_date"
                        endName="end_date"
                        addAll={true}
                        changeDate={changeDate}
                        resetPeriod={resetPeriod}
                    />

                    {/* 검색바 */}
                    <SearchBar keyword={keyword} handleChange={handleChange} />
                </MainCard>

                <ButtonLayout buttonName="bottom--blank__small">
                    <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={searchClick}>
                        조회
                    </Button>
                </ButtonLayout>

                <ContentLine>
                    <DefaultDataGrid
                        columns={columns}
                        rows={dataGridRows}
                        handleGridClick={handleClick}
                        components={{ Toolbar: GridToolbar }}
                        height={650}
                        selectionChange={handleSelectionChange}
                        handlePageChange={handlePage}
                    />
                </ContentLine>
            </Grid>
        </Grid>
    );
};

export default SiteMyPrivacy;
