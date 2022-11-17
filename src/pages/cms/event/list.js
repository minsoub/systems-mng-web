/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Button,
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
import styles from './styles.module.scss';

const EventList = () => {
    const [keyword, setKeyword] = useState(''); //검색 키워드
    const [from_date, setStartDate] = useState(''); // 검색 시작일
    const [to_date, setEndDate] = useState(''); // 검색 종료일
    // const [period, setPeriod] = useState('1'); // 검색 일 묶음 타입 0:전체, 1:오늘, 2:한달, 3:3달
    const [viewState, setViewState] = useState(''); // 선택한 카테고리
    const [typeState, setTypeState] = useState(''); // 선택한 카테고리
    const [selectedValue,setSelectedValue] = useState(''); // 선택라인
    const StyledTableCell = withStyles((theme) => ({
        root: {
            padding: '0px 16px',
            height: 35
        }
    }))(TableCell);
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
    };
    // 초기화
    const clearClick = () => {
        setKeyword('');
        setViewState('');
        setTypeState('');
        setStartDate(moment().format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));
    };
    const handleChangePage = (event, newPage) => {
        // setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        // setRowsPerPage(+event.target.value);
        // setPage(0);
    };
    // 그리드 클릭
    const handleClick = (rowData) => {
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
        
    }, []);
    return (
        <Grid container rowSpacing={4} columnSpacing={2.75} className="eventList">
            <Grid item xs={12}>
                <HeaderTitle titleNm="이벤트 관리" menuStep01="사이트 운영" menuStep02="이벤트 관리" />
                <MainCard>
                    <Grid>
                        <InputLayout gridClass={styles.keywordWrap}>
                            <SearchBar handleBlur={handleBlur} handleChange={handleChange} keyword={keyword}/>
                            <DropInput title="유형" titleWidth={60}>
                                <InputLabel id="type_state">유형</InputLabel>
                                <Select labelId="type_state" id="type_state" name="type_state" value={typeState} onChange={handleChange}>
                                    <MenuItem value="">전체</MenuItem>
                                    <MenuItem value="1">게시</MenuItem>
                                    <MenuItem value="2">참여</MenuItem>
                                    <MenuItem value="3">링크</MenuItem>
                                </Select>
                            </DropInput>
                            <DropInput title="상태" titleWidth={60}>
                                <InputLabel id="view_state">상태</InputLabel>
                                <Select labelId="view_state" id="view_state" name="view_state" value={viewState} onChange={handleChange}>
                                    <MenuItem value="">전체</MenuItem>
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
                <TableHeader />
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
                                    <StyledTableCell style={{ width: '5%' }} align="center">
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
                                <TableRow hover className="link" onClick={() => handleClick()}>
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
                                <TableRow hover className="link" onClick={() => handleClick()}>
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
                <TablePagination
                    sx={{
                        border: '1px solid #e6ebf1',
                        borderTop: 'none',
                        boxShadow: 'none',
                        borderRadius: '0 0 2px 2px'
                    }}
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={0}
                    rowsPerPage={10}
                    page={0}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Grid>
        </Grid>
    );
};

export default EventList;
