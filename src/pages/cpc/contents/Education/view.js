import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Button, Grid, Stack, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import MainCard from 'components/Common/MainCard';
import CheckBoxDataGrid from 'components/DataGrid/CheckBoxDataGrid';
import EducationMaskingApi from 'apis/cpc/education/maskingApi';
import EducationUnMaskingApi from 'apis/cpc/education/unMaskingApi';
import ErrorScreen from 'components/ErrorScreen';
import moment from 'moment';
import HeaderTitle from 'components/HeaderTitle';
import SearchDate from 'components/ContentManage/SearchDate';
import SearchBar from 'components/ContentManage/SearchBar';
import cx from 'classnames';
import ButtonLayout from 'components/Common/ButtonLayout';
import { setSearchData } from 'store/reducers/cpc/DamageCaseSearch';
import ContentLine from 'components/Common/ContentLine';
import { getDateFormat } from 'utils/CommonUtils';
import './style.scss';

const View = () => {
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
            headerName: '상태',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 200
        },
        {
            field: 'name',
            headerName: '이름',
            flex: 1,
            headerAlign: 'center',
            align: 'left'
        },
        {
            field: 'email',
            headerName: '이메일 주소',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 200
        },
        {
            field: 'phone',
            headerName: '휴대폰 번호',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 350
        },
        {
            field: 'desireDate',
            headerName: '교육희망일',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 350
        },
        {
            field: 'createDate',
            headerName: '등록일시',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 350
        }
    ];
    const navigate = useNavigate();
    // 마스킹 상태
    const [isMasking, setIsMasking] = useState(true);

    const [responseData, requestError, resLoading, { searchEducationList }] = isMasking ? EducationMaskingApi() : EducationUnMaskingApi();

    const { reduceFromDate, reduceToDate, reducePeriod, reduceCategory, reduceKeyword } = useSelector(
        (state) => state.cpcDamageCaseSearchReducer
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

    // 검색 조건
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [period, setPeriod] = useState('1');
    const [category, setCategory] = useState('');
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
        if (reduceCategory) setCategory(reduceCategory);

        setIsSearch(true);
    }, []);

    useEffect(() => {
        if (isSearch) {
            // searchBoardMaster(boardMasterId);
            const request = {
                start_date,
                end_date,
                keyword,
                category
            };
            searchEducationList(request);
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

    useEffect(() => {
        console.log({ responseData });
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getMaskings':
            case 'getUnMaskings':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setDataGridRows(responseData.data.data);
                } else {
                    setDataGridRows([]);
                }
                break;
            default:
        }
    }, [responseData]);

    useEffect(() => {
        const request = {
            start_date,
            end_date,
            keyword,
            category
        };
        searchEducationList(request);
    }, [isMasking]);

    const handleClose = () => {
        setVisible(false);
    };
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
            navigate(`/cpc/education/reg/${rowData.id}`);
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
        setCategory('');
        setKeyword('');
    };

    // 검색
    const searchClick = () => {
        console.log('searchClick called...');
        const request = {
            start_date,
            end_date,
            keyword,
            category
        };
        searchEducationList(request);
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

    // 마스킹 상태 변경
    const handleMasking = () => {
        setIsMasking((prev) => !prev);
    };

    return (
        <Grid container rowSpacing={4} columnSpacing={2.75} className="cpcContentsDamageList">
            <Grid item xs={12}>
                <HeaderTitle titleNm="신청자 관리" menuStep01="사이트 운영" menuStep02="찾아가는 교육 관리" menuStep03="신청자 관리" />
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
                            <FormControlLabel value={false} control={<Radio />} label={'교육신청'} />
                            <FormControlLabel value={true} control={<Radio />} label={'답변완료'} />
                        </RadioGroup>
                    </div>

                    {/* 검색바 */}
                    <SearchBar keyword={keyword} handleChange={handleChange} handleBlur={handleBlur} />
                </MainCard>

                <ButtonLayout buttonName="bottom--blank__small" style={{ marginBottom: '40px' }}>
                    <div>
                        <Button disableElevation size="medium" type="submit" color="secondary" variant="outlined_d" onClick={clearClick}>
                            초기화
                        </Button>

                        <Button disableElevation size="medium" type="submit" color="secondary" variant="outlined_d" onClick={searchClick}>
                            검색
                        </Button>
                    </div>
                    <Button disableElevation size="medium" type="submit" color="secondary" variant="outlined_d" onClick={handleMasking}>
                        마스킹 해제
                    </Button>
                </ButtonLayout>

                <ContentLine>
                    <CheckBoxDataGrid
                        columns={columns}
                        rows={dataGridRows}
                        pageSize={10}
                        height={650}
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

export default View;
