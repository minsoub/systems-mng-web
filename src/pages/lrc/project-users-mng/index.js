import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cx from 'classnames';
import moment from 'moment';
import { Button, Grid, Stack, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { getDateFormat } from 'utils/CommonUtils';
import ProjectUserMngApi from 'apis/lrc/projectUsersMng/projectUserMngApi';

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
        field: 'category',
        headerName: '계정 ID',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        maxWidth: 150
    },
    {
        field: 'title',
        headerName: '생성 프로젝트',
        flex: 1,
        headerAlign: 'center',
        align: 'left'
    },
    {
        field: 'title1',
        headerName: '참여 프로젝트',
        flex: 1,
        headerAlign: 'center',
        align: 'left'
    },
    {
        field: 'title2',
        headerName: '계정 상태',
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
    },
    {
        field: 'create_date3',
        headerName: '최근 접속일시',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        maxWidth: 200,
        valueGetter: ({ value }) => `${getDateFormat(value)}`
    }
];

// ==============================|| ProjectUsersMngPage - DEFAULT ||============================== //

const ProjectUsersMngPage = () => {
    const [responseData, requestError, Loading, { projectUserMngSearch }] = ProjectUserMngApi();

    const { reduceFromDate, reduceToDate, reducePeriod, reduceCategory, reduceKeyword } = useSelector(
        (state) => state.lrcProjectUserMngSearchReducer
    );

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);

    // 검색 조건
    const [start_date, setStartDate] = useState(undefined);
    const [end_date, setEndDate] = useState(undefined);
    const [period, setPeriod] = useState('5');
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

    // 기간 선택시 날짜 변경
    const setDateFromToSet = (periodIndex) => {
        switch (periodIndex) {
            case '1':
                setStartDate(moment().format('YYYY-MM-DD'));
                setEndDate(moment().format('YYYY-MM-DD'));
                break;
            case '2':
                setStartDate(moment().add(-1, 'weeks').format('YYYY-MM-DD'));
                setEndDate(moment().format('YYYY-MM-DD'));
                break;
            case '3':
                setStartDate(moment().add(-1, 'months').format('YYYY-MM-DD'));
                setEndDate(moment().format('YYYY-MM-DD'));
                break;
            case '4':
                setStartDate(moment().add(-1, 'months').format('YYYY-MM-DD'));
                setEndDate(moment().format('YYYY-MM-DD'));
                break;
            case '5':
                setStartDate(undefined);
                setEndDate(undefined);
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
        projectUserMngSearch(request);
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
            // navigate(`/cpc/contents/notice/reg/${rowData.id}`);
        }
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // onload
    useEffect(() => {
        const request = {
            start_date,
            end_date
        };
        projectUserMngSearch(request);
        setIsSearch(true);
    }, []);

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            if (requestError.result === 'FAIL') {
                console.log('error requestError');
                console.log(requestError);
            }
        }
    }, [requestError]);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setDataGridRows(responseData.data.data);
                } else {
                    setDataGridRows([]);
                }
                break;
            default:
        }
    }, [responseData]);

    return (
        <Grid container rowSpacing={4} columnSpacing={2.75}>
            <Grid item xs={12}>
                <HeaderTitle titleNm="재단 사용자 관리" menuStep01="Home" menuStep02="사이트 운영" menuStep03="재단 사용자 관리" />
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
                        addAll={true}
                    />
                    {/* 카테고리 영역 */}
                    <div className={cx('category')}>
                        <Stack sx={{ minWidth: '120px' }} spacing={10} className={cx('borderTitle')}>
                            카테고리
                        </Stack>

                        {/* 전체 */}
                        <RadioGroup
                            row
                            aria-labelledby="category-radio-buttons-group-label"
                            name="category"
                            value={category}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="" control={<Radio />} label="전체" />
                        </RadioGroup>
                    </div>
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
                <ButtonLayout buttonName="bottom--blank__small" style={{ marginBottom: '20px', justifyContent: 'space-between' }}>
                    <div>
                        <Button disableElevation size="medium" type="submit" color="secondary" variant="contained" onClick={clearClick}>
                            선택 로그인 제한
                        </Button>

                        <Button disableElevation size="medium" type="submit" color="secondary" variant="contained" onClick={searchClick}>
                            선택 로그인 제한 해제
                        </Button>
                    </div>
                    <Button
                        disableElevation
                        size="medium"
                        type="submit"
                        variant="contained"
                        color="secondary"
                        style={{ width: 144 }}
                        onClick={() => {}}
                    >
                        마스킹 해제
                    </Button>
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

export default ProjectUsersMngPage;
