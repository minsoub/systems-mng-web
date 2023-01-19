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
import {
    activeFromDate,
    activeToDate,
    activeViewState,
    activeKeyword,
    activeEventType,
    activePageNum
} from 'store/reducers/cms/EventSearch';

//style
import styles from './styles.module.scss';

// =============|| Event - SearchForm ||============= //
const SearchForm = ({ listLoad, listRelooad }) => {
    const dispatch = useDispatch();
    const { reduceFromDate, reduceToDate, reduceKeyword, reduceEventType, reduceViewState } = useSelector((state) => state.cmsEvent);

    const [isInitCall, setIsInitCall] = useState(true); //초기 호출 체크
    const [keyword, setKeyword] = useState(''); //검색 키워드
    const [from_date, setStartDate] = useState(); // 검색 시작일
    const [to_date, setEndDate] = useState(); // 검색 종료일
    const [viewState, setViewState] = useState(0); // 선택한 상태
    const [typeState, setTypeState] = useState(0); // 선택한 유형

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
            case 'type_state': // 유형 변경시
                setTypeState(e.target.value);
                break;
            case 'view_state': // 상태 변경시
                setViewState(e.target.value);
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
        dispatch(activeViewState({ reduceViewState: viewState }));
        dispatch(activeEventType({ reduceEventType: typeState }));

        const request = {
            keyword,
            is_show: viewState,
            event_type: typeState,
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
        setTypeState(0);
        setViewState(0);

        const request = {
            keyword: '',
            is_show: 0,
            event_type: 0,
            start_date: moment().format('YYYY-MM-DD'),
            end_date: moment().format('YYYY-MM-DD')
        };
        listLoad(request);
    };

    useEffect(() => {
        if (!from_date) {
            return;
        }
        if (isInitCall) {
            setIsInitCall(false);
            searchClick();
        }
    }, [from_date]);

    useEffect(() => {
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
        if (reduceViewState) setViewState(reduceViewState);
        if (reduceKeyword) setKeyword(reduceKeyword);
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
                        <SearchBar handleBlur={handleBlur} handleChange={handleChange} keyword={keyword}/>
                        <DropInput title="유형" titleWidth={40} className={styles.dropdownWrap}>
                            <InputLabel id="type_state">유형</InputLabel>
                            <Select labelId="type_state" id="type_state" name="type_state" value={typeState} onChange={handleChange}>
                                <MenuItem value="0">전체</MenuItem>
                                <MenuItem value="1">게시</MenuItem>
                                <MenuItem value="2">참여</MenuItem>
                                <MenuItem value="3">링크</MenuItem>
                            </Select>
                        </DropInput>
                        <DropInput title="상태" titleWidth={40} className={styles.dropdownWrap}>
                            <InputLabel id="view_state">상태</InputLabel>
                            <Select labelId="view_state" id="view_state" name="view_state" value={viewState} onChange={handleChange}>
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

export default SearchForm;
