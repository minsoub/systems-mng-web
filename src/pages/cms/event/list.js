/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    Button,
    TextField,
    Pagination,
    Grid,
    MenuItem,
    InputLabel,
    Select,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    Radio,
    TableRow
} from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import moment from 'moment';
import MainCard from 'components/Common/MainCard';
import HeaderTitle from 'components/HeaderTitle';
import SearchBar from 'components/ContentManage/SearchBar';
import SearchDate from 'components/ContentManage/SearchDate';
import InputLayout from 'components/Common/InputLayout';
import DropInput from 'components/Common/DropInput';
import ButtonLayout from 'components/Common/ButtonLayout';
import ContentLine from 'components/Common/ContentLine';
import TableHeader from 'components/Table/TableHeader';
import ErrorScreen from 'components/ErrorScreen';
import ScrollX from 'components/Common/ScrollX';
import {
    activeFromDate,
    activeToDate,
    activeViewState,
    activeKeyword,
    activeEventType,
    activePageNum
} from 'store/reducers/cms/EventSearch';
import styles from './styles.module.scss';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';

const EventList = () => {
    const [keyword, setKeyword] = useState(''); //검색 키워드
    const [from_date, setStartDate] = useState(''); // 검색 시작일
    const [to_date, setEndDate] = useState(''); // 검색 종료일
    // const [period, setPeriod] = useState('1'); // 검색 일 묶음 타입 0:전체, 1:오늘, 2:한달, 3:3달
    const [typeState, setTypeState] = useState(0); // 선택한 유형
    const [viewState, setViewState] = useState(0); // 선택한 상태
    const [selectedValue,setSelectedValue] = useState(''); // 선택라인
    const navigate = useNavigate();
    const StyledTableCell = withStyles((theme) => ({
        root: {
            padding: '0px 16px',
            height: 35
        }
    }))(TableCell);
    const { reduceFromDate, reduceToDate, reduceKeyword, reduceEventType, reduceViewState } = useSelector((state) => state.cmsEvent);
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
            case 'view_state': // 상태 변경시
                setViewState(e.target.value);
                break;
            case 'type_state': // 유형 변경시
                setTypeState(e.target.value);
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
        console.log(viewState, '|', typeState);

        dispatch(activeFromDate({ reduceFromDate: from_date }));
        dispatch(activeToDate({ reduceToDate: to_date }));
        dispatch(activeKeyword({ reduceKeyword: keyword }));
        dispatch(activeViewState({ reduceViewState: viewState }));
        dispatch(activeEventType({ reduceEventType: typeState }));
    };
    // 초기화
    const clearClick = () => {
        setKeyword('');
        setViewState(0);
        setTypeState(0);
        setStartDate(moment().format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));
    };
    const handleChangePage = (event, newPage) => {
        console.log(event, newPage);
        // setPage(newPage);
    };
    // 그리드 클릭
    const handleClick = (e) => {
        // console.log(e);
        navigate(`/cms/event/reg/45464564`);
        //if (rowData && rowData.field && rowData.field !== '__check__') {
        // navigate(`/projects/detail/${rowData.id}`);
        //}
    };
    const checkedItemHandler = (id, isChecked) => {
        // setIsAllChecked(false);
        // if (isChecked) {
        //     checkedBusinessItems.add(id);
        //     setCheckedBusinessItems(checkedBusinessItems);
        // } else if (!isChecked && checkedBusinessItems.has(id)) {
        //     checkedBusinessItems.delete(id);
        //     setCheckedBusinessItems(checkedBusinessItems);
        // }
    };
    useEffect(() => {
        setStartDate(moment().format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));

        // reduce 상태값을 사용하여 검색을 수행한다.
        if (reduceFromDate) setStartDate(reduceFromDate);
        if (reduceToDate) setEndDate(reduceToDate);
        if (reduceKeyword) setKeyword(reduceKeyword);
        if (reduceViewState) setViewState(reduceViewState);
        if (reduceEventType) setTypeState(reduceEventType);
    }, []);
    return (
        <Grid container rowSpacing={4} columnSpacing={2.75} className="eventList">
            <Grid item xs={12}>
                <HeaderTitle titleNm="이벤트 관리" menuStep01="사이트 운영" menuStep02="이벤트 관리" />
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
                <TableHeader type="event" />
                <ContentLine>
                    <ScrollX>
                        <Table style={{ tableLayout: 'auto' }} stickyHeader aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell style={{ width: '5%' }} align="center">
                                        No.
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: '30%' }} align="center">
                                        제목
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
                                    <StyledTableCell style={{ width: '10%' }} align="center">
                                        조회수
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow hover className="link" onClick={handleClick}>
                                    <TableCell align="center" component="td" scope="row">
                                        2
                                    </TableCell>
                                    <TableCell align="left" component="td" scope="row">
                                        제목2
                                    </TableCell>
                                    <TableCell align="center" component="td" scope="row">
                                        공개
                                    </TableCell>
                                    <TableCell align="center" component="td" scope="row">
                                        2022-03-15 12:00:00
                                    </TableCell>
                                    <TableCell align="center" component="td" scope="row">
                                        2022-03-15 12:00:00
                                    </TableCell>
                                    <TableCell align="center" component="td" scope="row">
                                        UserID
                                    </TableCell>
                                    <TableCell align="center" component="td" scope="row">
                                        10,000,000
                                    </TableCell>
                                </TableRow>
                                <TableRow hover className="link" onClick={handleClick}>
                                    <TableCell align="center" component="td" scope="row">
                                        1
                                    </TableCell>
                                    <TableCell align="left" component="td" scope="row">
                                        제목1
                                    </TableCell>
                                    <TableCell align="center" component="td" scope="row">
                                        비공개
                                    </TableCell>
                                    <TableCell align="center" component="td" scope="row">
                                        2022-03-15 12:00:00
                                    </TableCell>
                                    <TableCell align="center" component="td" scope="row">
                                        2022-03-15 12:00:00
                                    </TableCell>
                                    <TableCell align="center" component="td" scope="row">
                                        UserID
                                    </TableCell>
                                    <TableCell align="center" component="td" scope="row">
                                        12,345
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
                    showFirstButton showLastButton
                    count={500} variant="outlined" shape="rounded" onChange={handleChangePage}
                />
                {/* <Pagination
                    count={700}
                    page={1}
                    onChange={handleChangePage}
                    color="primary"
                    variant="combined"
                />
                <TablePagination
                    sx={{
                        border: '1px solid #e6ebf1',
                        borderTop: 'none',
                        boxShadow: 'none',
                        borderRadius: '0 0 2px 2px'
                    }}
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={50}
                    rowsPerPage={10}
                    page={0}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <Pagination count={500} defaultPage={1} page={1} color="primary" onChange={handleChangePage} /> */}
                
                <TextField disabled={true} value='기본 텍스트필드'/>
                {/* <TextField id="outlined-basic" label="Outlined" disabled={true} />
                <TextField id="filled-basic" label="Filled" variant="filled" />
                <TextField id="standard-basic" label="Standard" variant="standard" /> */}
            </Grid>
        </Grid>
    );
};

export default EventList;
