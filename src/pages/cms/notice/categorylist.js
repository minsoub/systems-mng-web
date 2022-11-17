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
import InputLayout from 'components/Common/InputLayout';
import DropInput from 'components/Common/DropInput';
import ButtonLayout from 'components/Common/ButtonLayout';
import ContentLine from 'components/Common/ContentLine';
import TableHeader from 'components/Table/TableHeader';
import ErrorScreen from 'components/ErrorScreen';
import ScrollX from 'components/Common/ScrollX';
import styles from './styles.module.scss';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';

const CategoryList = () => {
    const [keyword, setKeyword] = useState(''); //검색 키워드
    const [categoryState, setCategoryState] = useState(''); // 카테고리 사용상태
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
            case 'category_state': // 상태 변경시
                setCategoryState(e.target.value);
                break;
            default:
                break;
        }
    };
    // 검색
    const searchClick = () => {
        console.log('searchClick called...');
        console.log(keyword, '|', categoryState);
    };
    // 초기화
    const clearClick = () => {
        setKeyword('');
        setCategoryState('');
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
        <Grid container rowSpacing={4} columnSpacing={2.75} className="categoryist">
            <Grid item xs={12}>
                <HeaderTitle titleNm="카테고리 관리" menuStep01="사이트 운영" menuStep02="카테고리 관리" />
                <MainCard>
                    <Grid>
                        <InputLayout>
                            <SearchBar handleBlur={handleBlur} handleChange={handleChange} keyword={keyword}/>
                            <DropInput title="상태" titleWidth={60}>
                                <InputLabel id="category_state">상태</InputLabel>
                                <Select
                                    labelId="category_state"
                                    id="category_state"
                                    name="category_state"
                                    value={categoryState}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">전체</MenuItem>
                                    <MenuItem value="1">사용</MenuItem>
                                    <MenuItem value="2">미사용</MenuItem>
                                </Select>
                            </DropInput>
                        </InputLayout>
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
                                        카테고리명
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: '5%' }} align="center">
                                        상태
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: '12%' }} align="center">
                                        등록일시
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: '12%' }} align="center">
                                        등록담당자
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: '12%' }} align="center">
                                        업데이트일시
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: '12%' }} align="center">
                                        업데이트 담당자
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow hover className="link" onClick={() => handleClick()}>
                                    <TableCell style={{ width: '5%' }} align="center" component="td" scope="row">
                                        2
                                    </TableCell>
                                    <TableCell style={{ width: '7.5%' }} align="left" component="td" scope="row">
                                        카테고리명2
                                    </TableCell>
                                    <TableCell style={{ width: '7.5%' }} align="center" component="td" scope="row">
                                        사용
                                    </TableCell>
                                    <TableCell style={{ width: '8%' }} align="center" component="td" scope="row">
                                        2022-03-15 12:00:00
                                    </TableCell>
                                    <TableCell style={{ width: '8%' }} align="center" component="td" scope="row">
                                        UserID
                                    </TableCell>
                                    <TableCell style={{ width: '10%' }} align="center" component="td" scope="row">
                                        -
                                    </TableCell>
                                    <TableCell style={{ width: '10%' }} align="center" component="td" scope="row">
                                        -
                                    </TableCell>
                                </TableRow>
                                <TableRow hover className="link" onClick={() => handleClick()}>
                                    <TableCell style={{ width: '5%' }} align="center" component="td" scope="row">
                                        1
                                    </TableCell>
                                    <TableCell style={{ width: '7.5%' }} align="left" component="td" scope="row">
                                        카테고리명1
                                    </TableCell>
                                    <TableCell style={{ width: '7.5%' }} align="center" component="td" scope="row">
                                        비사용
                                    </TableCell>
                                    <TableCell style={{ width: '8%' }} align="center" component="td" scope="row">
                                        2022-03-15 12:00:00
                                    </TableCell>
                                    <TableCell style={{ width: '8%' }} align="center" component="td" scope="row">
                                        UserID
                                    </TableCell>
                                    <TableCell style={{ width: '10%' }} align="center" component="td" scope="row">
                                        2022-03-15 12:00:00
                                    </TableCell>
                                    <TableCell style={{ width: '10%' }} align="center" component="td" scope="row">
                                        UserID
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

export default CategoryList;
