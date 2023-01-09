/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Grid, MenuItem, InputLabel, Select } from '@mui/material';

// library
import moment from 'moment';

// project import
import MainCard from 'components/Common/MainCard';
import SearchBar from 'components/ContentManage/SearchBar';
import SearchDate from 'components/ContentManage/SearchDate';
import InputLayout from 'components/Common/InputLayout';
import DropInput from 'components/Common/DropInput';
import ButtonLayout from 'components/Common/ButtonLayout';

// transition
import BoardApi from 'apis/cms/boardapi';
import {
    activeFromDate,
    activeToDate,
    activeCategory,
    activeBannerNoti,
    activeBannerState,
    activeKeyword
} from 'store/reducers/cms/NoticeSearch';

// style
import styles from './styles.module.scss';

const NoticeSearchForm = ({ listLoad, listRelooad }) => {
    const dispatch = useDispatch();
    const [responseData, requestError, loading, { getCategory }] = BoardApi();
    const { reduceFromDate, reduceToDate, reduceCategory, reduceBannerNoti, reduceBannerState, reduceKeyword } = useSelector((state) => state.cmsNotice);

    const [isInitCall, setIsInitCall] = useState(true); //초기 호출 체크
    const [keyword, setKeyword] = useState(''); //검색 키워드
    const [from_date, setStartDate] = useState(); // 검색 시작일
    const [to_date, setEndDate] = useState(); // 검색 종료일
    const [bannerNotice, setBannerNotice] = useState(0); // 배너 공지 상태
    const [bannerState, setBannerState] = useState(0); // 배너 공개상태
    const [categoryState, setCategoryState] = useState('0'); // 선택한 카테고리
    const [categoryList, setCategoryList] = useState([{}]); // 카테고리 전체 리스트

    ////////////////////////////////////////////////////
    // 블러 이벤트
    const handleBlur = (e) => {};
    // 인풋 체인지 이벤트
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
        // console.log(type, e);
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
        // 검색 조건에 대해서 상태를 저장한다.
        if (from_date === '') {
            setStartDate('1900-01-01');
            dispatch(activeFromDate({ reduceFromDate: '1900-01-01' }));
        } else {
            dispatch(activeFromDate({ reduceFromDate: from_date }));
        }
        if (to_date === '') {
            setEndDate('2300-12-31');
            dispatch(activeToDate({ reduceToDate: '2300-12-31' }));
        } else {
            dispatch(activeToDate({ reduceToDate: to_date }));
        }
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
        if (from_date === '') request.start_date = '1900-01-01';
        if (to_date === '') request.end_date = '2300-12-31';
        listLoad(request);
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
        listLoad(request);
    };
    // 연동결과 파싱
    useEffect(() => {
        if (!responseData) {
            return;
        }
        // console.log('responseData.transactionId', responseData.transactionId);
        switch (responseData.transactionId) {
            case 'getCategory':
                if (responseData.data.data) {
                    setCategoryList(responseData.data.data.contents);
                }
                break;
            default:
                return;
        }
    }, [responseData]);
    useEffect(() => {
        if (!from_date) {
            return;
        }
        if (isInitCall) {
            setIsInitCall(false);
            searchClick();
        }
    }, [from_date]);

    // 초기 호출 함수
    useEffect(() => {
        // reduce 상태값을 사용하여 검색을 수행한다.
        // console.log('reduceFromDate', reduceFromDate);
        // console.log('reduceToDate', reduceToDate);
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
    }, []);
    // reload
    useEffect(() => {
        if (listRelooad) searchClick();
    }, [listRelooad]);

    return (
        <>
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
        </>
    );
};

export default NoticeSearchForm;
