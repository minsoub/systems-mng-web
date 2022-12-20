import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cx from 'classnames';
import moment from 'moment';
import { Button, Grid, Stack, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { getDateFormat } from 'utils/CommonUtils';
import HeaderTitle from 'components/HeaderTitle';
import MainCard from 'components/Common/MainCard';
import SearchDate from 'components/ContentManage/SearchDate';
import SearchBar from 'components/ContentManage/SearchBar';
import ButtonLayout from 'components/Common/ButtonLayout';
import ContentLine from 'components/Common/ContentLine';
import CheckBoxDataGrid from 'components/DataGrid/CheckBoxDataGrid';
import ErrorScreen from 'components/ErrorScreen';
import { setSearchData } from '../../../store/reducers/cpc/NoticeSearch';

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
        field: 'title',
        headerName: '제목',
        flex: 1,
        headerAlign: 'center',
        align: 'left'
    },
    {
        field: 'title1',
        headerName: '점검시간',
        flex: 1,
        headerAlign: 'center',
        align: 'left'
    },
    {
        field: 'title2',
        headerName: '사용여부',
        flex: 1,
        headerAlign: 'center',
        align: 'left'
    },
    {
        field: 'title3',
        headerName: '등록자',
        flex: 1,
        headerAlign: 'center',
        align: 'left'
    },
    {
        field: 'create_date',
        headerName: '등록일시',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        maxWidth: 200,
        valueGetter: ({ value }) => `${getDateFormat(value)}`
    }
];

const SystemCheckMngPage = () => {
    const { reduceFromDate, reduceToDate, reducePeriod, reduceCategory, reduceKeyword } = useSelector(
        (state) => state.lrcSystemCheckMngSearchReducer
    );

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);

    // 검색 조건
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [period, setPeriod] = useState('1');
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');

    // 상태 값
    const [isSearch, setIsSearch] = useState(false);

    const handleBlur = (e) => {
        console.log(e);
    };
    const resetPeriod = () => {
        setPeriod(0);
    };
    const changeDate = (type, e) => {
        switch (type) {
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
            case 'category':
                setCategory(e.target.value);
                break;
            case 'keyword':
                setKeyword(e.target.value);
                break;
            default:
                break;
        }
    };

    // 초기화
    const clearClick = () => {
        console.log('clearClick called...');
        setStartDate(moment().format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));
        setPeriod('1');
        setCategory('');
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

        // 검색 조건에 대해서 상태를 저장한다.
        const searchData = {
            reduceFromDate: start_date,
            reduceToDate: end_date,
            reducePeriod: period,
            reduceKeyword: keyword,
            reduceCategory: category
        };
        dispatch(setSearchData(searchData));
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
            navigate(`/cpc/contents/notice/reg/${rowData.id}`);
        }
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

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
        if (reduceCategory) setCategory(reduceCategory);

        setIsSearch(true);
    }, []);

    return (
        <Grid container rowSpacing={4} columnSpacing={2.75}>
            <Grid item xs={12}>
                <HeaderTitle titleNm="서비스 점검 관리" menuStep01="Home" menuStep02="사이트 운영" menuStep03="서비스 점검 관리" />
                <MainCard>
                    {/* 기간 검색 */}
                    <SearchDate
                        start_date={start_date}
                        end_date={end_date}
                        period={period}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        startName="start_date"
                        endName="end_date"
                        changeDate={changeDate}
                        resetPeriod={resetPeriod}
                    />

                    {/* 검색바 */}
                    <SearchBar keyword={keyword} handleChange={handleChange} handleBlur={handleBlur} />
                </MainCard>
                <ButtonLayout buttonName="bottom--blank__small" style={{ marginBottom: '20px', justifyContent: 'flex-end' }}>
                    <Button disableElevation size="medium" type="submit" color="secondary" variant="outlined_d" onClick={clearClick}>
                        초기화
                    </Button>

                    <Button disableElevation size="medium" type="submit" color="secondary" variant="outlined_d" onClick={searchClick}>
                        검색
                    </Button>
                </ButtonLayout>
                <ButtonLayout buttonName="bottom--blank__small" style={{ marginBottom: '20px' }}>
                    <div>
                        <Button disableElevation size="medium" type="submit" color="secondary" variant="contained" onClick={clearClick}>
                            사용 선택
                        </Button>

                        <Button disableElevation size="medium" type="submit" color="secondary" variant="contained" onClick={searchClick}>
                            사용 선택 해제
                        </Button>
                    </div>
                </ButtonLayout>
                <ContentLine>
                    <CheckBoxDataGrid
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
            </Grid>
        </Grid>
    );
};

export default SystemCheckMngPage;
