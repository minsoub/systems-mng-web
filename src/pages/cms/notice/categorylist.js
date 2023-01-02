/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
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
import styles from './styles.module.scss';
import BoardApi from 'apis/cms/boardapi';
import CategoryModal from './popup/CategoryModal';
import { getDateFormat } from 'utils/CommonUtils';

const CategoryList = () => {
    // 데이터 그리드 컬럼
    const columns = [
        {
            field: 'id',
            headerName: 'No.',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 70,
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
            field: 'create_account_email',
            headerName: '등록담당자',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 200
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
            field: 'update_account_email',
            headerName: '업데이트 담당자',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 200,
            valueGetter: ({ value }) => {
                return value ? value : '-';
            }
        }
    ];

    //통신 데이터
    const [responseData, requestError, loading, { searchBoardList }] = BoardApi();
    const [dataGridRows, setDataGridRows] = useState([]); // 그리드 목록 데이터
    const [dataTotal, setDataTotal] = useState(0); //데이터 전체 숫자
    const [keyword, setKeyword] = useState(''); //검색 키워드
    const [categoryState, setCategoryState] = useState(0); // 카테고리 사용상태
    const [selectRowData, setSelectRowData] = useState(null); // 선택한 데이터
    const handleOpen = () => setOpen(true);
    const handleClose = (loadState) => {
        if (loadState === 'reload') {
            searchClick();
        } else {
            setSelectRowData(null);
        }
        setOpen(false);
    };
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
    // 로딩 체크
    useEffect(() => {
        // console.log(loading);
    }, [loading]);
    ////////////////////////////////////////////////////
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
        const request = {
            keyword,
            is_use: categoryState
        };
        searchBoardList('notices/categories', request);
    };
    // 초기화
    const clearClick = () => {
        setKeyword('');
        setCategoryState(0);
        const request = {
            keyword: '',
            is_use: 0
        };
        searchBoardList('notices/categories', request);
    };

    // 그리드 클릭
    const handleClick = (rowData) => {
        setSelectRowData(rowData.row);
        handleOpen();
    };
    // 페이징 변경 이벤트
    const handlePage = (page) => {};
    //체크박스 선택된 row id 저장
    const handleSelectionChange = (item) => {};
    //초기 호출
    useEffect(() => {
        searchClick();
    }, []);
    //통신 결과 파싱
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getBoards':
                if (responseData.data.data) {
                    // console.log(responseData.data.data);
                    setDataTotal(Number(responseData.data.data.total_counts));
                    setDataGridRows(responseData.data.data.contents);
                } else {
                    setDataGridRows([]);
                }
                break;
            default:
                return;
        }
    }, [responseData]);
    return (
        <Grid container rowSpacing={4} columnSpacing={2.75} className="categoryist">
            <Grid item xs={12}>
                <HeaderTitle titleNm="카테고리 관리" menuStep01="사이트 운영" menuStep02="카테고리 관리" />
                <MainCard>
                    <Grid>
                        <InputLayout>
                            <SearchBar handleChange={handleChange} keyword={keyword}/>
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
                <TableHeader type="category" newAdd={handleOpen} dataTotal={dataTotal} />
                <ContentLine>
                    <DefaultDataGrid
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
            <CategoryModal open={open} onClose={handleClose} selectRowData={selectRowData} />
            {errorMessage && (
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
            )}
        </Grid>
    );
};

export default CategoryList;

/*
valueGetter: (value) => {
    // console.log('-------------------------row의 다른값 체크후 변환 처리', value.row);
    let setValue = '고정';
    // dataGridRows.map((row) => {
    //     if (row.create_date === value) {
    //         setValue = row.id;
    //     }
    // });
    return setValue;
}*/
