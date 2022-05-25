import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material-ui
import { Button, Grid, Typography } from '@mui/material';

import DefaultButton from 'components/button/DefaultButton';
import MainCard from 'components/MainCard';
import DefaultDataGrid from '../../../components/DataGrid/DefaultDataGrid';
import Search from '../../../components/Input/Search';
import useFetchCrud from 'apis/crud/useFetchCrud';

const columns = [
    { field: 'id', headerName: 'ID' },
    {
        field: 'order',
        headerName: '노출순서',
        flex: 1
    },
    {
        field: 'category',
        headerName: '카테고리',
        flex: 1
    },
    {
        field: 'title',
        headerName: '제목',
        flex: 1
    },
    {
        field: 'content',
        headerName: '내용',
        flex: 1
    },
    {
        field: 'costomer',
        headerName: '등록자',
        flex: 1
    },
    {
        field: 'language',
        headerName: '언어',
        flex: 1
    },
    {
        field: 'create_date',
        headerName: '생성날짜',
        flex: 1
    }
];
const TableSamplePage = () => {
    const navgate = useNavigate();
    // axios custom hook
    const [responseData, requestError, loading, { actionSearch, actionList, actionDelete }] = useFetchCrud();
    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            console.log('>> requestError <<');
            alert('error');
        }
    }, [requestError]);

    // onload
    useEffect(() => {
        actionList();
    }, []);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getList':
                if (responseData.data && responseData.data.length > 0) {
                    setDataGridRows(responseData.data);
                } else {
                    setDataGridRows([]);
                }
                break;
            case 'deleteData':
                console.log('deleteData');
                actionList();
                break;
            default:
        }
    }, [responseData]);

    // 페이징 변경 이벤트
    const handlePage = (page) => {};

    // 그리드 클릭
    const handleClick = (rowData) => {
        if (rowData && rowData.field && rowData.field !== '__check__') {
            navgate(`/crud/edit/${rowData.id}`);
        }
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // 검색
    const handleSearch = (keyword) => {
        console.log('search', keyword);
        actionSearch(keyword);
    };

    // 작성 버튼 클릭
    const handleWriteButton = () => {
        navgate('/crud/write');
    };

    // 삭제 버튼 클릭
    const handleDeleteButton = () => {
        actionDelete(selectedRows);
    };

    //체크박스 선택된 row id 저장
    const handleSelectionChange = (item) => {
        if (item) {
            setSeletedRows(item);
        }
    };

    return (
        <Grid container rowSpacing={2} columnSpacing={0.75}>
            <Grid item xs={12} md={12} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Crud Sample - list</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                <Grid container rowSpacing={2} columnSpacing={0.75}>
                    <Grid item xs={6} md={1} lg={1}>
                        <DefaultButton buttonType="primary" onButtonClick={handleWriteButton}>
                            Write
                        </DefaultButton>
                    </Grid>
                    <Grid item xs={6} md={1} lg={1}>
                        <DefaultButton buttonType="primary" onButtonClick={handleDeleteButton}>
                            Delete
                        </DefaultButton>
                    </Grid>
                    <Grid item xs={12} md={10} lg={10} align="right">
                        <Search enterEvent={handleSearch} />
                    </Grid>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <DefaultDataGrid
                        columns={columns}
                        rows={dataGridRows}
                        handlePageChange={handlePage}
                        handleGridClick={handleClick}
                        handleGridDoubleClick={handleDoubleClick}
                        selectionChange={handleSelectionChange}
                    />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default TableSamplePage;
