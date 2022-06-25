import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    MenuItem,
    FormControlLabel,
    Checkbox,
    Radio,
    RadioGroup,
    Tab,
    Tabs
} from '@mui/material';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Input } from 'antd';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import ErrorScreen from 'components/ErrorScreen';
import FaqApis from 'apis/lrc/faq/faqapi';
import CategoryApis from 'apis/lrc/faq/categoryapi';
import CategoryContents from './categorycontents';

const FaqContent = (props) => {
    let isSubmitting = false;
    const columns = [
        {
            field: 'no',
            headerName: '번호',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'order',
            headerName: '노출순서',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'category',
            headerName: '카테고리',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'title',
            headerName: '제목',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'use_yn',
            headerName: '사용여부',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'email',
            headerName: '등록자',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'create_date',
            headerName: '등록일시',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        }
    ];
    const navigate = useNavigate();
    const [responseData, requestError, loading, { faqSearch }] = FaqApis();
    const [resData, reqError, resLoading, { categorySearch }] = CategoryApis();

    const { language, children, tabindex, index, ...other } = props;

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);
    const [totalDataGridRows, setTotalDataGridRows] = useState([]);

    // 카테고리 리스트
    const [categorys, setCategoryList] = useState([]);
    ////////////////////////////////////////////////////
    // 공통 에러 처리
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    ////////////////////////////////////////////////////

    // onload
    useEffect(() => {
        // Category 조회
        categorySearch(language);
    }, []);

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

    // Category List
    useEffect(() => {
        if (!resData) {
            return;
        }
        switch (resData.transactionId) {
            case 'getList':
                if (resData.data.data && resData.data.data.length > 0) {
                    let resultData = [];
                    resData.data.data.map((item) => {
                        let data = { id: item.id, name: item.name, count: 0 };
                        resultData.push(data);
                    });
                    setCategoryList(resultData);

                    // 데이터 조회
                    faqSearch(language);
                } else {
                    setCategoryList([]);
                }
                break;
            default:
        }
    }, [resData]);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    //setDataGridRows(responseData.data.data);
                    let result = [];
                    // 받아온 데이터에 대해서 카테고리별로 분류한다.
                    responseData.data.data.map((item, idx) => {
                        let data = {
                            no: idx + 1,
                            id: item.id,
                            user_id: item.user_id,
                            order: item.order,
                            category: item.category,
                            category_code: item.category_code,
                            title: item.title,
                            content: item.content,
                            use_yn: item.use_yn,
                            customer: item.customer,
                            email: item.email,
                            language: item.language,
                            create_date: item.create_date,
                            create_admin_account_id: item.create_admin_account_id,
                            update_date: item.update_date,
                            update_admin_account_id: item.update_admin_account_id
                        };
                        result.push(data);

                        categorys.map((category, index) => {
                            if (item.category_code === category.id) {
                                setCategoryList((current) =>
                                    current.map((obj) => {
                                        if (obj.id === category.id) {
                                            return { ...obj, count: obj.count + 1 };
                                        }
                                        return obj;
                                    })
                                );
                            }
                        });
                    });
                    console.log(categorys);
                    setDataGridRows(result);
                    setTotalDataGridRows(result);
                } else {
                    setDataGridRows([]);
                }
                break;
            case 'deleteData':
                console.log('deleteData');
                roleList();
                break;
            default:
        }
    }, [responseData]);

    const handleClose = () => {
        setVisible(false);
    };
    const handleBlur = (e) => {
        console.log(e);
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
            //let searchCondition = { site_id: site_id, is_use: is_use, type: type };
            //navigate(`/authmng/reg/${rowData.id}`);
        }
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // 등록 화면
    const regClick = () => {
        navigate(`/faq/reg/${language}`);
    };
    const orderClick = () => {};
    // 분류 클릭 시
    const filterClick = (id) => {
        console.log(id);
        let filterGridData = dataGridRows.filter((el) => el.category_code === id);
        setDataGridRows(filterGridData);
    };

    return (
        <div>
            <MainCard sx={{ mt: 1, minHeight: 60 }} content={false}>
                <Grid container spacing={0} sx={{ mt: 2 }}>
                    <Grid item xs={8} sm={0.3}></Grid>
                    {categorys.map((item, index) => (
                        <CategoryContents key={index} id={item.id} content={item.name} count={item.count} filterClick={filterClick} />
                    ))}
                    <Grid item xs={8} sm={0.3}></Grid>
                </Grid>
            </MainCard>
            <MainCard sx={{ mt: 2 }} content={false}>
                <DefaultDataGrid
                    columns={columns}
                    rows={dataGridRows}
                    height={500}
                    handlePageChange={handlePage}
                    handleGridClick={handleClick}
                    handleGridDoubleClick={handleDoubleClick}
                    selectionChange={handleSelectionChange}
                />
            </MainCard>
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <Grid item xs={8} sm={0.1}></Grid>
                <Grid item xs={8} sm={2.5}>
                    <FormControl sx={{ m: 1 }} size="small">
                        <Button disableElevation size="small" type="submit" variant="contained" color="secondary" onClick={orderClick}>
                            노출 순서 저장
                        </Button>
                    </FormControl>
                </Grid>
                <Grid item xs={8} sm={8.0}></Grid>
                <Grid item xs={8} sm={1}>
                    <FormControl sx={{ m: 1 }} size="small">
                        <Button disableElevation size="small" type="submit" variant="contained" color="secondary" onClick={regClick}>
                            등록
                        </Button>
                    </FormControl>
                </Grid>
                <Grid item xs={8} sm={0.1}></Grid>
            </Grid>
            <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} />
        </div>
    );
};

export default FaqContent;
