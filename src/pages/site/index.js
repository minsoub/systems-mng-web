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
    Typography,
    FormControl,
    Select,
    MenuItem
} from '@mui/material';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Input } from 'antd';
import { boolean } from '../../../node_modules/yup/lib/index';
import DefaultDataGrid from '../../components/DataGrid/DefaultDataGrid';
import SiteApi from 'apis/site/siteapi';
import { bool } from 'prop-types';

const SiteManagementPage = () => {
    let isSubmitting = false;
    const columns = [
        {
            field: 'id',
            headerName: 'Site ID',
            flex: 1,
            headerAlign: 'center',
            headerHeight: 22
        },
        {
            field: 'name',
            headerName: '사이트명',
            flex: 1,
            headerAlign: 'center'
        },
        {
            field: 'admin_account_email',
            headerName: '사이트 관리자',
            flex: 1,
            headerAlign: 'center'
        },
        {
            field: 'is_use',
            headerName: '사용여부',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'create_date',
            headerName: '생성날짜',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        }
    ];

    const navigate = useNavigate();
    const [responseData, requestError, loading, { siteSearch, siteList }] = SiteApi();

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [is_use, setIsUsed] = useState('');
    const [keyword, setKeyword] = useState('');

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
        setIsUsed('true');
        // 리스트 가져오기
        siteList(true);
    }, []);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'siteList':
                if (responseData.data.data) {
                    setDataGridRows(responseData.data.data);
                } else {
                    setDataGridRows([]);
                }
                break;
            case 'deleteData':
                console.log('deleteData');
                siteList();
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
            navigate(`/site/reg/${rowData.id}`);
        }
    };

    const isUseChanged = (e) => {
        setIsUsed(e.target.value);
    };
    const keywordChanged = (e) => {
        setKeyword(e.target.value);
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // list
    const listClick = () => {
        let isUse = 'true';
        setKeyword('');
        console.log('listClick called');
        console.log(is_use);
        siteSearch(is_use, '');
    };
    // search
    const searchClick = () => {
        if (keyword === '') {
            alert('검색 단어를 입력하세요!');
            return;
        }
        siteSearch(is_use, keyword);
    };

    // new
    const newClick = () => {
        console.log('called register form');
        navigate('/site/reg');
    };

    // delete
    const deleteClick = () => {};

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h3">사이트 관리</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">통합 시스템관리 > 사이트 관리</Typography>
                    </Grid>
                    <Grid container spacing={2}></Grid>
                </Grid>
                <MainCard sx={{ mt: 1 }}>
                    <Stack direction="row" spacing={1}>
                        <FormControl sx={{ m: 0, minWidth: 160 }} size="small">
                            <Select name="status" label="계정상태" value={is_use} onChange={isUseChanged}>
                                <MenuItem value="true">사용</MenuItem>
                                <MenuItem value="false">미사용</MenuItem>
                                <MenuItem value="">전체</MenuItem>
                            </Select>
                        </FormControl>
                        <OutlinedInput
                            fullWidth
                            id="word"
                            type="text"
                            value={keyword}
                            name="word"
                            placeholder=""
                            onChange={keywordChanged}
                        />
                        <Button
                            disableElevation
                            disabled={isSubmitting}
                            size="small"
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={searchClick}
                        >
                            검색
                        </Button>
                        <Button disableElevation size="small" type="submit" variant="contained" color="secondary" onClick={newClick}>
                            신규
                        </Button>
                        <Button disableElevation size="small" type="submit" variant="contained" color="secondary" onClick={listClick}>
                            리스트
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
                        sx={{
                            boxShadow: 2,
                            border: 2,
                            borderColor: 'primary.light',
                            '& .MuiDataGrid-cell:hover': {
                                color: 'primary.main'
                            }
                        }}
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

export default SiteManagementPage;
