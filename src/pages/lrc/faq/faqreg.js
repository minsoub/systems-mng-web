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
    FormControlLabel,
    FormHelperText,
    InputLabel,
    Checkbox,
    Select,
    TextField,
    FormControl,
    Alert,
    Collapse,
    AlertTitle,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Radio,
    RadioGroup,
    MenuItem
} from '@mui/material';

import MainCard from 'components/MainCard';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import { StyledTableCell, FontTableCell } from 'components/CustomTableCell';
import ErrorScreen from 'components/ErrorScreen';
import FaqApis from 'apis/lrc/faq/faqapi';
import CategoryApis from 'apis/lrc/faq/categoryapi';

const FaqRegForm = () => {
    let isSubmitting = false;

    const navigate = useNavigate();
    const { paramId, paramNo } = useParams();
    const [responseData, requestError, loading, { faqSearch, faqInsert, faqUpdate, faqDelete, faqDetail }] = FaqApis();
    const [resData, reqError, resLoading, { categorySearch }] = CategoryApis();

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

    // 카테고리 리스트
    const [categorys, setCategoryList] = useState([]);

    // button control
    const [isUpdate, setIsUpdate] = useState(false);

    // Form data
    // 입력 데이터 - Default
    const [inputs, setInputs] = useState({
        id: '',
        order: 1,
        category_code: '',
        title: '',
        use_yn: true,
        content: '',
        language: paramId
    });
    const { id, order, category_code, title, content, use_yn, language } = inputs;

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            if (requestError.result === 'FAIL') {
                console.log('error requestError');
                console.log(requestError);
                setErrorTitle('Error Message');
                setErrorMessage('[' + requestError.error.code + '] ' + requestError.error.message);
                setOpen(true);
            }
        }
    }, [requestError]);

    // onload
    useEffect(() => {
        console.log('paramId');
        console.log(paramId);
        console.log('paramNo');
        console.log(paramNo);
        categorySearch(paramId);
    }, []);

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
                    if (paramNo) {
                        console.log(paramNo);
                        faqDetail(paramNo);
                    }
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
            case 'insertData':
                if (responseData.data) {
                    alert('저장을 완료하였습니다');
                    listClick();
                }
                break;
            case 'detailData':
                if (responseData.data.data) {
                    // 세부 내역을 세팅하고 수정모드로 들어간다.
                    let res = responseData.data.data;
                    setInputs({
                        id: res.id,
                        category_code: res.category_code,
                        use_yn: res.use_yn,
                        title: res.title,
                        content: res.content,
                        order: res.order,
                        language: res.language
                    });
                    setIsUpdate(true);
                }
                break;
            case 'updateData':
                if (responseData.data.data) {
                    alert('수정을 완료하였습니다');
                    listClick();
                }
                break;
            case 'deleteData':
                alert('삭제를 완료하였습니다!!!');
                navigate('/faq/list');
                break;
            default:
        }
    }, [responseData]);

    // 입력 박스 입력 시 호출
    const handleChange = (e) => {
        let { value, name } = e.target;
        if (e.target.type === 'checkbox') {
            value = e.target.checked;
        }
        setInputs({
            ...inputs, // 기존 input 객체 복사
            [name]: value
        });
    };

    const handleBlur = (e) => {
        console.log(e);
    };

    // delete
    const deleteClick = () => {
        if (confirm('삭제를 하시겠습니까')) {
            const requestData = {
                id: id,
                is_use: false
            };
            faqDelete(requestData);
        }
    };

    // list
    const listClick = () => {
        navigate('/faq/list');
    };
    const saveClick = () => {
        if (!category_code) {
            alert('카테고리를 선택하세요!!!');
            return;
        }
        if (!title) {
            alert('제목을 입력하세요!!!');
            return;
        }
        if (!content) {
            alert('내용을 입력하세요!!!');
            return;
        }
        if (!paramNo) {
            faqInsert(inputs);
        } else {
            faqUpdate(inputs);
        }
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h3">콘텐츠 관리 등록 ({paramId})</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">사이트 운영 &gt; FAQ 관리 &gt; 콘텐츠 관리</Typography>
                    </Grid>
                    <Grid container spacing={2}></Grid>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <Grid container spacing={0} sx={{ mt: 1 }}>
                        <Grid item xs={8} sm={0.2}></Grid>
                        <Grid item xs={8} sm={8}>
                            <Table sx={{ width: 1000 }} stickyHeader aria-label="simple table">
                                <TableBody>
                                    <TableRow>
                                        <StyledTableCell component="th" scope="row" style={{ width: 200 }}>
                                            카테고리 선택 <font color="red">*</font>
                                        </StyledTableCell>
                                        <TableCell component="th" scope="row" style={{ width: 300 }}>
                                            <FormControl sx={{ m: 0, minWidth: 180 }} size="small">
                                                <Select
                                                    name="category_code"
                                                    label="카테고리명"
                                                    value={category_code}
                                                    onChange={handleChange}
                                                >
                                                    {categorys.map((item, index) => (
                                                        <MenuItem key={index} value={item.id}>
                                                            {item.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <StyledTableCell component="th" scope="row" style={{ width: 200 }}>
                                            사용 여부 <font color="red">*</font>
                                        </StyledTableCell>
                                        <TableCell component="th" scope="row" style={{ width: 300 }}>
                                            <FormControl sx={{ m: 0 }} fullWidth>
                                                <RadioGroup
                                                    row
                                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                                    name="use_yn"
                                                    value={use_yn}
                                                    onChange={handleChange}
                                                >
                                                    <FormControlLabel value="true" control={<Radio />} label="사용함" />
                                                    <FormControlLabel value="false" control={<Radio />} label="사용안함" />
                                                </RadioGroup>
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <StyledTableCell component="th" scope="row" style={{ width: 200 }}>
                                            제 목 <font color="red">*</font>
                                        </StyledTableCell>
                                        <TableCell component="th" scope="row" colSpan={3} style={{ width: 680 }}>
                                            <FormControl sx={{ m: 0 }} fullWidth>
                                                <TextField
                                                    id="outlined-multiline-static"
                                                    value={title}
                                                    name="title"
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <StyledTableCell component="th" scope="row" style={{ width: 200 }}>
                                            내 용 <font color="red">*</font>
                                        </StyledTableCell>
                                        <TableCell component="th" scope="row" colSpan={3} style={{ height: 200, width: 680 }}>
                                            <FormControl sx={{ m: 0 }} fullWidth>
                                                <TextField
                                                    id="outlined-multiline-static"
                                                    value={content}
                                                    name="content"
                                                    multiline
                                                    rows={6}
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0} sx={{ mt: 1 }}>
                        <Grid item xs={8} sm={0.2}></Grid>
                        <Grid item xs={8} sm={0.1}>
                            <FormControl sx={{ m: 1 }} size="small">
                                <Button
                                    disableElevation
                                    size="small"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    onClick={listClick}
                                >
                                    목록
                                </Button>
                            </FormControl>
                        </Grid>
                        <Grid item xs={8} sm={9.5}></Grid>
                        <Grid item xs={8} sm={0.7}>
                            <FormControl sx={{ m: 1 }} size="small">
                                <Button disableElevation size="small" type="submit" variant="contained" color="primary" onClick={saveClick}>
                                    저장
                                </Button>
                            </FormControl>
                        </Grid>
                        <Grid item xs={8} sm={0.1}></Grid>
                        <Grid item xs={8} sm={0.7}>
                            <FormControl sx={{ m: 1 }} size="small">
                                <Button
                                    disableElevation
                                    disabled={!isUpdate}
                                    size="small"
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    onClick={deleteClick}
                                >
                                    삭제
                                </Button>
                            </FormControl>
                        </Grid>
                    </Grid>
                </MainCard>

                {errorMessage ? (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                ) : null}
            </Grid>
        </Grid>
    );
};

export default FaqRegForm;
