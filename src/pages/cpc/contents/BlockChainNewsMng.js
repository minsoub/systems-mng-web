import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Button, Grid } from '@mui/material';
import MainCard from 'components/MainCard';
import CheckBoxDataGrid from 'components/DataGrid/CheckBoxDataGrid';
import BlockChainNewsApi from 'apis/cpc/board/newsapi';
import ErrorScreen from 'components/ErrorScreen';
import moment from 'moment';
import HeaderTitle from 'components/HeaderTitle';
import SearchDate from 'components/ContentManage/SearchDate';
import SearchBar from 'components/ContentManage/SearchBar';
import cx from 'classnames';
import ButtonLayout from 'components/Common/ButtonLayout';
import { setSearchData } from 'store/reducers/cpc/BlockChainNewsSearch';

const BlockChainNewsMng = () => {
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
            field: 'newspaper',
            headerName: '언론사',
            flex: 1,
            headerAlign: 'center',
            align: 'left',
            maxWidth: 100
        },
        {
            field: 'title',
            headerName: '뉴스 제목',
            flex: 1,
            headerAlign: 'center',
            align: 'left'
        },
        {
            field: 'link_url',
            headerName: '뉴스 링크',
            flex: 1,
            headerAlign: 'center',
            align: 'left'
        },
        {
            field: 'posting_date',
            headerName: '뉴스 게시일',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 100
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
            field: 'create_account_name',
            headerName: '등록자',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        }
    ];
    const navigate = useNavigate();
    const [responseData, requestError, resLoading, { searchNewsList, deleteNewsList }] = BlockChainNewsApi();

    const { reduceFromDate, reduceToDate, reducePeriod, reduceKeyword } = useSelector((state) => state.cpcBlockChainNewsSearchReducer);
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
    const [keyword, setKeyword] = useState('');

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
            case 'getNewss':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setDataGridRows(responseData.data.data);
                } else {
                    setDataGridRows([]);
                }
                break;
            case 'deleteNewss':
                alert('삭제되었습니다.');
                const request = {
                    start_date,
                    end_date,
                    keyword
                };
                searchNewsList(request);
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
            navigate(`/cpc/contents/blockchain-news/reg/${rowData.id}`);
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
        searchNewsList(request);

        // 검색 조건에 대해서 상태를 저장한다.
        const searchData = {
            reduceFromDate: start_date,
            reduceToDate: end_date,
            reducePeriod: period,
            reduceKeyword: keyword
        };
        dispatch(setSearchData(searchData));
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
            deleteNewsList(deleteIds);
        }
    };

    // 등록
    const addClick = () => {
        console.log('addClick called...');
        navigate('/cpc/contents/blockchain-news/reg');
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle titleNm="블록체인 뉴스" menuStep01="사이트 운영" menuStep02="콘텐츠 관리" menuStep03="블록체인 뉴스" />
                <MainCard>
                    {/* 기간 검색 */}
                    <SearchDate
                        start_date={start_date}
                        end_date={end_date}
                        period={period}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                    />

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
                    <CheckBoxDataGrid
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
                        <Button disableElevation size="medium" type="submit" variant="contained" onClick={deleteClick}>
                            선택 삭제
                        </Button>
                        <Button disableElevation size="medium" type="submit" variant="contained" onClick={addClick}>
                            등록
                        </Button>
                    </ButtonLayout>
                </Grid>

                {errorMessage ? (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                ) : null}
            </Grid>
        </Grid>
    );
};

export default BlockChainNewsMng;
