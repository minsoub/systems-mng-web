/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Grid, MenuItem, InputLabel, Select } from '@mui/material';
import moment from 'moment';
import MainCard from 'components/Common/MainCard';
import HeaderTitle from 'components/HeaderTitle';
import RadioBoxDataGrid from 'components/DataGrid/RadioBoxDataGrid';
import SearchBar from 'components/ContentManage/SearchBar';
import SearchDate from 'components/ContentManage/SearchDate';
import InputLayout from 'components/Common/InputLayout';
import DropInput from 'components/Common/DropInput';
import TableHeader from 'components/Table/TableHeader';
import SearchForm from '../common/SearchForm';
import ButtonLayout from 'components/Common/ButtonLayout';
import ContentLine from 'components/Common/ContentLine';
import ErrorScreen from 'components/ErrorScreen';
import styles from './styles.module.scss';
import BoardApi from 'apis/cms/boardapi';
import { getDateFormat } from 'utils/CommonUtils';
import {
    activeFromDate,
    activeToDate,
    activeCategory,
    activeBannerNoti,
    activeBannerState,
    activeKeyword
} from 'store/reducers/cms/NoticeSearch';

const NoticeList = () => {
    // 데이터 그리드 컬럼
    const columns = [
        {
            field: 'id',
            headerName: 'No.',
            flex: 1,
            headerAlign: 'center',
            maxWidth: 80,
            align: 'left'
        },
        {
            field: 'title',
            headerName: '제목',
            flex: 1,
            headerAlign: 'center',
            align: 'left'
        },
        {
            field: 'is_banner',
            headerName: '배너',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 80,
            valueGetter: ({ value }) => {
                if (value) {
                    return '사용';
                } else {
                    return '미사용';
                }
            }
        },
        {
            field: 'is_show',
            headerName: '상태',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 80,
            valueGetter: ({ value }) => {
                if (value) {
                    return '사용';
                } else {
                    return '미사용';
                }
            }
        },
        {
            field: 'create_date',
            headerName: '등록일시',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 150,
            valueGetter: ({ value }) => `${getDateFormat(value)}`
        },
        {
            field: 'update_date',
            headerName: '업데이트일시',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 150,
            valueGetter: ({ value }) => {
                return value ? `${getDateFormat(value)}` : '-';
            }
        },
        {
            field: 'create_account_email',
            headerName: '등록담당자',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 150
        },
        {
            field: 'read_count',
            headerName: '조회수',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 100
        }
    ];
    const [responseData, requestError, loading, { searchBoardList, getCategory, changeBannerState }] = BoardApi();
    const [dataGridRows, setDataGridRows] = useState([]); // 그리드 목록 데이터
    const [dataTotal, setDataTotal] = useState(0); //데이터 전체 숫자
    const [keyword, setKeyword] = useState(''); //검색 키워드
    const [from_date, setStartDate] = useState(); // 검색 시작일
    const [to_date, setEndDate] = useState(); // 검색 종료일
    const [bannerNotice, setBannerNotice] = useState(0); // 배너 공지 상태
    const [bannerState, setBannerState] = useState(0); // 배너 공개상태
    const [categoryState, setCategoryState] = useState('0'); // 선택한 카테고리
    const [categoryList, setCategoryList] = useState([{}]); // 카테고리 전체 리스트
    const [selectedValue, setSelectedValue] = useState(''); // 선택라인
    const navigate = useNavigate();
    const { reduceFromDate, reduceToDate, reduceCategory, reduceBannerNoti, reduceBannerState, reduceKeyword } = useSelector((state) => state.cmsNotice);
    const dispatch = useDispatch();
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
    // 블러 이벤트
    const handleBlur = (e) => {};
    // 페이징 변경 이벤트
    const handlePage = (page) => {};
    //체크박스 선택된 row id 저장
    const handleSelectionChange = (item) => {
        setSelectedValue(item);
    };

    const handleChange = (e) => {
        switch (e.target.name) {
            case 'keyword': //키워드 변경시
                setKeyword(e.target.value);
                break;
            case 'from_date': // 시작 날자 변경시
                setStartDate(e.target.value);
                break;
            case 'to_date': // 종료날자 변경시
                if (from_date > e.target.value) {
                    alert('기간 검색에서 종료일이 시작일보다 작을 수 없습니다.');
                    return;
                }
                setEndDate(e.target.value);
                break;
            case 'banner_notice': // 배너 공지 변경시
                setBannerNotice(e.target.value);
                break;
            case 'banner_state': // 배너 상태 변경시
                setBannerState(e.target.value);
                break;
            case 'category_state': // 카테고리 변경시
                setCategoryState(e.target.value);
                break;
            default:
                break;
        }
    };
    // 날자 변경 함수
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
    // 날자 검색 타입 초기화 함수
    const resetPeriod = () => {};
    // 검색
    const searchClick = () => {
        console.log('searchClick called...');
        console.log(keyword, '|', from_date, '|', to_date);
        console.log(bannerNotice, '|', bannerState, '|', categoryState);
        // 검색 조건에 대해서 상태를 저장한다.
        dispatch(activeFromDate({ reduceFromDate: from_date }));
        dispatch(activeToDate({ reduceToDate: to_date }));
        dispatch(activeKeyword({ reduceKeyword: keyword }));
        dispatch(activeCategory({ reduceCategory: categoryState }));
        dispatch(activeBannerNoti({ reduceBannerNoti: bannerNotice }));
        dispatch(activeBannerState({ reduceBannerState: bannerState }));

        const request = {
            keyword,
            category_id: categoryState,
            is_banner: bannerNotice,
            is_show: bannerState,
            start_date: from_date,
            end_date: to_date
        };
        searchBoardList('notices', request);
    };
    // 초기화
    const clearClick = () => {
        setKeyword('');
        setStartDate(moment().format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));
        setBannerNotice(0);
        setBannerState(0);
        setCategoryState('0');

        const request = {
            keyword: '',
            category_id: '0',
            is_banner: 0,
            is_show: 0,
            start_date: moment().format('YYYY-MM-DD'),
            end_date: moment().format('YYYY-MM-DD')
        };
        searchBoardList('notices', request);
    };
    // 그리드 클릭
    const handleClick = (e) => {
        const { field } = e;
        console.log(e);
        if (field === '__check__') return;
        navigate(`/cms/notice/reg/${e.id}`);
    };
    //배너 상태 변경
    const bannerStateChange = (state) => {
        const _selNum = dataGridRows.findIndex((row) => row.id === selectedValue);
        // eslint-disable-next-line security/detect-object-injection
        const _isBanner = dataGridRows[_selNum].is_banner;
        if (_isBanner === state) {
            if (state) alert('현재 사용 상태입니다.');
            if (!state) alert('현재 비사용 상태입니다.');
        } else {
            changeBannerState(selectedValue, state);
        }
    };
    // 연동 결과
    useEffect(() => {
        if (!responseData) {
            return;
        }
        console.log('responseData.transactionId', responseData.transactionId);
        switch (responseData.transactionId) {
            case 'getCategory':
                if (responseData.data.data) {
                    setCategoryList(responseData.data.data.contents);
                }
                break;
            case 'getBoards':
                if (responseData.data.data) {
                    console.log(responseData.data.data);
                    setDataTotal(Number(responseData.data.data.total_counts));
                    setDataGridRows(responseData.data.data.contents);
                } else {
                    setDataGridRows([]);
                }
                break;
            case 'changeBannerState':
                setDataGridRows([]);
                if (responseData.data.data) {
                    alert('상태가 변경되었습니다.');
                    searchClick();
                }
                break;
            default:
                return;
        }
    }, [responseData]);

    // 초기 호출 함수
    useEffect(() => {
        // reduce 상태값을 사용하여 검색을 수행한다.
        console.log('reduceFromDate', reduceFromDate);
        if (reduceFromDate) {
            setStartDate(reduceFromDate);
        } else {
            setStartDate(moment().format('YYYY-MM-DD'));
        }
        if (reduceToDate) {
            setEndDate(reduceToDate);
        } else {
            setEndDate(moment().format('YYYY-MM-DD'));
        }
        if (reduceCategory) setCategoryState(reduceCategory);
        if (reduceKeyword) setKeyword(reduceKeyword);
        if (reduceBannerNoti) setBannerNotice(reduceBannerNoti);
        if (reduceBannerState) setBannerState(reduceBannerState);

        getCategory('notices/categories/items');
        searchClick();
    }, []);
    return (
        <Grid container rowSpacing={4} columnSpacing={2.75} className={styles.notceList}>
            <Grid item xs={12}>
                <HeaderTitle titleNm="공지사항 관리" menuStep01="사이트 운영" menuStep02="공지사항 관리" />
                <MainCard>
                    <Grid>
                        <InputLayout gridClass={styles.keywordWrap}>
                            <SearchBar handleBlur={handleBlur} handleChange={handleChange} keyword={keyword} />
                            <DropInput title="카테고리" titleWidth={60}>
                                <InputLabel id="category_state">카테고리</InputLabel>
                                <Select
                                    labelId="category_state"
                                    id="category_state"
                                    name="category_state"
                                    value={categoryState}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="0">전체</MenuItem>
                                    {categoryList.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </DropInput>
                        </InputLayout>
                        <InputLayout gridClass={styles.keywordWrap}>
                            <DropInput title="배너공지" titleWidth={120}>
                                <InputLabel id="banner_notice">배너공지</InputLabel>
                                <Select
                                    labelId="banner_notice"
                                    id="banner_notice"
                                    name="banner_notice"
                                    value={bannerNotice}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="0">전체</MenuItem>
                                    <MenuItem value="1">노출</MenuItem>
                                    <MenuItem value="2">비노출</MenuItem>
                                </Select>
                            </DropInput>

                            <DropInput title="상태" titleWidth={60}>
                                <InputLabel id="banner_state">상태</InputLabel>
                                <Select
                                    labelId="banner_state"
                                    id="banner_state"
                                    name="banner_state"
                                    value={bannerState}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="0">전체</MenuItem>
                                    <MenuItem value="1">공개</MenuItem>
                                    <MenuItem value="2">비공개</MenuItem>
                                </Select>
                            </DropInput>
                        </InputLayout>
                        {/* 기간 검색 */}
                        <SearchDate
                            start_date={from_date}
                            end_date={to_date}
                            period={0}
                            handleBlur={handleBlur}
                            handleChange={handleChange}
                            startName="from_date"
                            endName="to_date"
                            noneChecked="noneChecked"
                            changeDate={changeDate}
                            resetPeriod={resetPeriod}
                        />
                    </Grid>
                </MainCard>
                <ButtonLayout style={{ marginBottom: '0.5rem' }}>
                    <Button disableElevation size="medium" type="submit" variant="outlined_d" color="secondary" onClick={clearClick}>
                        초기화
                    </Button>
                    <Button disableElevation size="medium" type="submit" variant="contained" onClick={searchClick}>
                        검색
                    </Button>
                </ButtonLayout>
                <TableHeader type="notice" dataTotal={dataTotal} bannerStateChange={bannerStateChange} />
                <ContentLine>
                    <RadioBoxDataGrid
                        columns={columns}
                        rows={dataGridRows}
                        pageSize={10}
                        height={660}
                        handlePageChange={handlePage}
                        handleGridClick={handleClick}
                        selectionChange={handleSelectionChange}
                    />
                </ContentLine>
            </Grid>
            {errorMessage && (
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
            )}
        </Grid>
    );
};

export default NoticeList;
