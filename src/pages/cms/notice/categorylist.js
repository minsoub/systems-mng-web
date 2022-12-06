/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Button,
    Grid,
    MenuItem,
    InputLabel,
    Select,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    Pagination,
    Radio,
    TableRow,
    Typography,
    TextField,
    Modal
} from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import moment from 'moment';
import MainCard from 'components/Common/MainCard';
import HeaderTitle from 'components/HeaderTitle';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import SearchBar from 'components/ContentManage/SearchBar';
import InputLayout from 'components/Common/InputLayout';
import DropInput from 'components/Common/DropInput';
import ButtonLayout from 'components/Common/ButtonLayout';
import ContentLine from 'components/Common/ContentLine';
import TableHeader from 'components/Table/TableHeader';
import ErrorScreen from 'components/ErrorScreen';
import ScrollX from 'components/Common/ScrollX';
import styles from './styles.module.scss';
import CategoryModal from './popup/CategoryModal';

const CategoryList = () => {
    const columns = [
        {
            field: 'id',
            headerName: 'No.',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 100,
            valueGetter: ({ value }) => {
                if (dataGridRows.length) {
                    return dataGridRows.findIndex((row) => row.id === value) + 1;
                }
                return 0;
            }
        },
        {
            field: 'name',
            headerName: '카테고리명',
            flex: 1,
            headerAlign: 'center',
            align: 'left'
        },
        {
            field: 'is_use',
            headerName: '상태',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 150,
            valueGetter: ({ value }) => {
                if (value === '0') {
                    return '비사용';
                } else {
                    return '사용';
                }
            }
        },
        {
            field: 'create_date',
            headerName: '등록일시',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            minWidth: 200,
            valueGetter: ({ value }) => {
                console.log('-------------------------row의 다른값 체크후 변환 처리');
                let setValue = '고정';
                dataGridRows.map((row) => {
                    if (row.create_date === value) {
                        setValue = row.id;
                    }
                });
                return setValue;
            }
        },
        {
            field: 'create_account_email',
            headerName: '등록담당자',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            minWidth: 150
        },
        {
            field: 'update_date',
            headerName: '업데이트일시',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            minWidth: 200
        },
        {
            field: 'update_account_email',
            headerName: '업데이트 담당자',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            minWidth: 150
        }
    ];
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([
        {
            id: 2,
            name: '카테고리명2',
            is_use: '0',
            create_date: '2022-03-18 12:00:00',
            create_account_email: 'UserID',
            update_date: '2022-03-19 12:00:00',
            update_account_email: 'UserID',
            ad: 'asdf'
        },
        {
            id: 1,
            name: '카테고리명1',
            is_use: '1',
            create_date: '2022-03-15 12:00:00',
            create_account_email: 'UserID',
            update_date: '2022-03-15 12:00:00',
            update_account_email: 'UserID'
        }
    ]);

    const [keyword, setKeyword] = useState(''); //검색 키워드
    const [categoryState, setCategoryState] = useState(0); // 카테고리 사용상태
    const [selectedValue,setSelectedValue] = useState(''); // 선택라인
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
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
        setCategoryState(0);
    };
    const handleChangePage = (event, newPage) => {
        // setPage(newPage);
    };
    // 그리드 클릭
    const handleClick = (rowData) => {};
    // 페이징 변경 이벤트
    const handlePage = (page) => {};
    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};
    //체크박스 선택된 row id 저장
    const handleSelectionChange = (item) => {};
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
                            <DropInput title="상태" titleWidth={40} className={styles.dropdownWrap}>
                                <InputLabel id="category_state">상태</InputLabel>
                                <Select
                                    labelId="category_state"
                                    id="category_state"
                                    name="category_state"
                                    value={categoryState}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="0">전체</MenuItem>
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
                <TableHeader type="category" newAdd={handleOpen} />
                <ContentLine>
                    <DefaultDataGrid
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
            <CategoryModal open={open} onClose={handleClose} />
        </Grid>
    );
};

export default CategoryList;
