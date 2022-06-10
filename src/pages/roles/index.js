import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material-ui
// eslint-disable-next-line prettier/prettier
import {
    OutlinedInput,
    Box,
    Button,
    Grid,
    Stack,
    TextField,
    Collapse,
    Alert,
    AlertTitle,
    Typography
} from '@mui/material';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Input } from 'antd';
import { boolean } from '../../../node_modules/yup/lib/index';
import DefaultDataGrid from '../../components/DataGrid/DefaultDataGrid';
import AccountApis from 'apis/account/accountapis';

const RoleManagementPage = () => {
    let isSubmitting = false;
    const columns = [
        { field: 'id', headerName: 'ID' },
        {
            field: 'order',
            headerName: 'Role ID',
            flex: 1
        },
        {
            field: 'email',
            headerName: 'Role Name',
            flex: 1
        },
        {
            field: 'title',
            headerName: 'Type',
            flex: 1
        },
        {
            field: 'name',
            headerName: '사용여부',
            flex: 1
        },
        {
            field: 'status',
            headerName: '유효기간',
            flex: 1
        },
        {
            field: 'create_date',
            headerName: '등록일자',
            flex: 1
        }
    ];
    const navigate = useNavigate();
    const [responseData, requestError, loading, { actionSearch, actionList }] = AccountApis();

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);

    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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

    // onload
    useEffect(() => {
        errorClear();
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

    // 에러 정보를 클리어 한다.
    const errorClear = () => {
        setOpen(false);
        setErrorTitle('');
        setErrorMessage('');
    };

    const handleClose = () => {
        setVisible(false);
    };

    //체크박스 선택된 row id 저장
    const handleSelectionChange = (item) => {
        if (item) {
            setSeletedRows(item);
        }
    };
    // 페이징 변경 이벤트
    const handlePage = (page) => {};

    // 그리드 클릭
    const handleClick = (rowData) => {
        if (rowData && rowData.field && rowData.field !== '__check__') {
            navigate(`/crud/edit/${rowData.id}`);
        }
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // new
    const newClick = (e) => {
        console.log('called register form');
        navigate('/roles/reg');
    };

    // delete
    const deleteClick = () => {};

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h3">Role 관리</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">통합관리 &gt; Role 관리 &gt; Role 리스트</Typography>
                    </Grid>
                    <Grid container spacing={2}></Grid>
                </Grid>
                <MainCard sx={{ mt: 1 }}>
                    <Stack direction="row" spacing={1}>
                        <Button disableElevation size="small" type="submit" variant="contained" color="secondary" onClick={newClick}>
                            등록
                        </Button>
                    </Stack>
                </MainCard>
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
                <MainCard sx={{ mt: 3 }} content={false}>
                    <Collapse in={open}>
                        <Alert
                            severity="error"
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        errorClear();
                                    }}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            sx={{ mb: 2 }}
                        >
                            <AlertTitle>{errorTitle}</AlertTitle>
                            {errorMessage}
                        </Alert>
                    </Collapse>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default RoleManagementPage;
