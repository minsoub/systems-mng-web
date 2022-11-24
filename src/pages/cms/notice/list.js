/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    Button,
    Grid,
    Pagination,
    MenuItem,
    InputLabel,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    Radio,
    TableRow
} from '@mui/material';
import { withStyles } from '@mui/styles';
import moment from 'moment';
import MainCard from 'components/Common/MainCard';
import HeaderTitle from 'components/HeaderTitle';
import SearchBar from 'components/ContentManage/SearchBar';
import SearchDate from 'components/ContentManage/SearchDate';
import InputLayout from 'components/Common/InputLayout';
import DropInput from 'components/Common/DropInput';
import TableHeader from 'components/Table/TableHeader';
import ButtonLayout from 'components/Common/ButtonLayout';
import ContentLine from 'components/Common/ContentLine';
import ErrorScreen from 'components/ErrorScreen';
import ScrollX from 'components/Common/ScrollX';
import styles from './styles.module.scss';
import {
    activeFromDate,
    activeToDate,
    activeCategory,
    activeBannerNoti,
    activeBannerState,
    activeKeyword,
    activePageNum
} from 'store/reducers/cms/NoticeSearch';

const NoticeList = () => {
    const [keyword, setKeyword] = useState(''); //검색 키워드
    const [from_date, setStartDate] = useState(''); // 검색 시작일
    const [to_date, setEndDate] = useState(''); // 검색 종료일
    // const [period, setPeriod] = useState('1'); // 검색 일 묶음 타입 0:전체, 1:오늘, 2:한달, 3:3달
    const [bannerNotice, setBannerNotice] = useState(0); // 배너 공지 상태
    const [bannerState, setBannerState] = useState(0); // 배너 공개상태
    const [categoryState, setCategoryState] = useState(''); // 선택한 카테고리
    const [categoryList, setCategoryList] = useState([]); // 카테고리 전체 리스트
    const [selectedValue,setSelectedValue] = useState(''); // 선택라인
    const navigate = useNavigate();
    const StyledTableCell = withStyles((theme) => ({
        root: {
            padding: '0px 16px',
            height: 35
        }
    }))(TableCell);
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

    const handleBlur = (e) => {
        // console.log(e);
    };
    const handleChange = (e /*, name */) => {
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
            case 'selectRadio':
                setSelectedValue(e.target.value);
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
    };
    // 초기화
    const clearClick = () => {
        setKeyword('');
        setStartDate(moment().format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));
        setBannerNotice(0);
        setBannerState(0);
        setCategoryState('');
    };
    const handleChangePage = (event, newPage) => {
        // setPage(newPage);
    };
    // 그리드 클릭
    const handleClick = (e) => {
        if (e.target.name === 'selectRadio') return;
        navigate(`/cms/notice/reg/123456789`);
        //if (rowData && rowData.field && rowData.field !== '__check__') {
        // navigate(`/projects/detail/${rowData.id}`);
        //}
    };
    const newListAdd = () => {
        navigate(`/cms/notice/reg`);
    };
    useEffect(() => {
        setStartDate(moment().format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));

        // reduce 상태값을 사용하여 검색을 수행한다.
        if (reduceFromDate) setStartDate(reduceFromDate);
        if (reduceToDate) setEndDate(reduceToDate);
        if (reduceCategory) setCategoryState(reduceCategory);
        if (reduceKeyword) setKeyword(reduceKeyword);
        if (reduceBannerNoti) setBannerNotice(reduceBannerNoti);
        if (reduceBannerState) setBannerState(reduceBannerState);
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
                                    <MenuItem value="">전체</MenuItem>
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
                                    <MenuItem value="1">비노출</MenuItem>
                                    <MenuItem value="2">노출</MenuItem>
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
                <TableHeader type="notice" />
                <ContentLine>
                    <ScrollX>
                        <Table style={{ tableLayout: 'auto' }} stickyHeader aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell style={{ width: '1%' }} align="center">
                                        -
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: '5%' }} align="center">
                                        No.
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: '30%' }} align="center">
                                        제목
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: '5%' }} align="center">
                                        배너
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: '8%' }} align="center">
                                        상태
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: '12%' }} align="center">
                                        등록일시
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: '12%' }} align="center">
                                        업데이트일시
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: '10%' }} align="center">
                                        작성자
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: '12%' }} align="center">
                                        조회수
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow hover className="link" onClick={handleClick}>
                                    <TableCell style={{ width: '7%' }} align="center" component="td" scope="row">
                                        <Radio
                                            checked={selectedValue === 'a'}
                                            onChange={handleChange}
                                            value="a"
                                            name="selectRadio"
                                            inputProps={{ 'aria-label': 'A' }}
                                        />
                                    </TableCell>
                                    <TableCell style={{ width: '5%' }} align="center" component="td" scope="row">
                                        고정
                                    </TableCell>
                                    <TableCell style={{ width: '7.5%' }} align="left" component="td" scope="row">
                                        제목이여라1
                                    </TableCell>
                                    <TableCell style={{ width: '7.5%' }} align="center" component="td" scope="row">
                                        비노출
                                    </TableCell>
                                    <TableCell style={{ width: '8%' }} align="center" component="td" scope="row">
                                        공개
                                    </TableCell>
                                    <TableCell style={{ width: '8%' }} align="center" component="td" scope="row">
                                        2022-03-15 12:00:00
                                    </TableCell>
                                    <TableCell style={{ width: '10%' }} align="center" component="td" scope="row">
                                        2022-03-15 12:00:00
                                    </TableCell>
                                    <TableCell style={{ width: '10%' }} align="center" component="td" scope="row">
                                        UserID
                                    </TableCell>
                                    <TableCell style={{ width: '15%' }} align="center" component="td" scope="row">
                                        1,000,000
                                    </TableCell>
                                </TableRow>
                                <TableRow hover className="link" onClick={handleClick}>
                                    <TableCell style={{ width: '7%' }} align="center" component="td" scope="row">
                                        <Radio
                                            checked={selectedValue === 'b'}
                                            onChange={handleChange}
                                            value="b"
                                            name="selectRadio"
                                            inputProps={{ 'aria-label': 'B' }}
                                        />
                                    </TableCell>
                                    <TableCell style={{ width: '5%' }} align="center" component="td" scope="row">
                                        고정
                                    </TableCell>
                                    <TableCell style={{ width: '7.5%' }} align="left" component="td" scope="row">
                                        제목이여라2
                                    </TableCell>
                                    <TableCell style={{ width: '7.5%' }} align="center" component="td" scope="row">
                                        비노출
                                    </TableCell>
                                    <TableCell style={{ width: '8%' }} align="center" component="td" scope="row">
                                        공개
                                    </TableCell>
                                    <TableCell style={{ width: '8%' }} align="center" component="td" scope="row">
                                        2022-03-15 12:00:00
                                    </TableCell>
                                    <TableCell style={{ width: '10%' }} align="center" component="td" scope="row">
                                        2022-03-15 12:00:00
                                    </TableCell>
                                    <TableCell style={{ width: '10%' }} align="center" component="td" scope="row">
                                        UserID
                                    </TableCell>
                                    <TableCell style={{ width: '15%' }} align="center" component="td" scope="row">
                                        1,000,000
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </ScrollX>
                </ContentLine>
                <Pagination
                    sx={{
                        background: '#fff',
                        padding: '10px 0',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                    showFirstButton
                    showLastButton
                    count={500}
                    variant="outlined"
                    shape="rounded"
                    onChange={handleChangePage}
                />
            </Grid>
        </Grid>
    );
};

export default NoticeList;
