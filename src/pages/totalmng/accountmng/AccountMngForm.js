import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
    MenuItem
} from '@mui/material';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Input } from 'antd';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import AccountApis from 'apis/account/accountapis';
import SiteApi from 'apis/site/siteapi';
import { DatePicker } from 'antd';
import ErrorScreen from 'components/ErrorScreen';
import HeaderTitle from '../../../components/HeaderTitle';

const AccountMngForm = () => {
    let isSubmitting = false;

    const navigate = useNavigate();
    const { paramId } = useParams();
    const [responseData, requestError, loading, { accountSearch, accountMngInsert, accountMngDetail, accountMngUpdate }] = AccountApis();
    const [resData, reqErr, resLoading, { siteSearch }] = SiteApi();

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);

    // User Search Dialog
    const [openUserSearch, setOpenUserSearch] = useState(false);
    const [selectedValue, setSelectedValue] = useState([]);

    // Alert Dialog
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Form data
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [is_use, setIsUse] = useState(true);
    const [id, setId] = useState('');
    const [status, setStatus] = useState('');

    // Email 작성 여부
    const [emailStatus, setEmailStatus] = useState(false);

    // Email 중복 체크
    const [emailChk, setEmailChk] = useState(false);

    // 중복 체크 버튼 제어
    const [isUpdate, setIsUpdate] = useState(false);

    // transaction error 처리
    useEffect(() => {
        if (requestError || reqErr) {
            let er = requestError ? requestError : reqErr;
            console.log('error requestError');
            console.log(er);
            setErrorTitle('Error Message');
            setErrorMessage(requestError);
            setOpen(true);
        }
    }, [requestError, reqErr]);

    // onload
    useEffect(() => {
        errorClear();
        // detail search - 수정모드이면
        if (paramId) {
            // 수정 데이터 조회
            accountMngDetail(paramId);
        } else {
            setIsUpdate(false);
        }
    }, []);

    // 에러 정보를 클리어 한다.
    const errorClear = () => {
        setOpen(false);
        setErrorTitle('');
        setErrorMessage('');
    };

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        console.log(responseData);
        console.log(responseData.transactionId);
        switch (responseData.transactionId) {
            case 'getList': // Email 중복 체크
                if (responseData.data.data.length > 0) {
                    // 중복이다.
                    alert('이미 등록된 메일 주소입니다!!!');
                    setEmailChk(false);
                } else {
                    // 중복이 아니다.
                    alert('사용 가능한 이메일 주소입니다!!!');
                    setEmailChk(true);
                }
                break;
            case 'insertData':
                alert('등록을 완료하였습니다!!!');
                navigate('/accountmng/list');
                break;
            case 'updateData':
                alert('수정을 완료하였습니다!!!');
                navigate('/accountmng/list');
                break;
            case 'getData': // 수정 모드
                if (responseData.data.data) {
                    let res = responseData.data.data;
                    setId(res.id);
                    setEmail(res.email);
                    setName(res.name);
                    //setPassword(res.password);
                    setIsUse(res.is_use);
                    setStatus(res.status);
                    setEmailStatus(true);
                    setIsUpdate(true);
                    setEmailChk(true);
                }
                break;
            default:
        }
    }, [responseData]);

    const handleChange = (e) => {
        switch (e.target.name) {
            case 'name':
                setName(e.target.value);
                break;
            case 'is_use':
                setIsUse(e.target.checked);
                break;
            case 'email':
                setEmail(e.target.value);
                setEmailChk(false);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
            default:
                break;
        }
    };
    const handleBlur = (e) => {
        console.log(e);
    };

    const handleClose = () => {
        setVisible(false);
    };

    // new
    const newClick = () => {
        navigate('/accountmng/reg');
    };

    // list
    const listClick = () => {
        navigate('/accountmng/list');
    };

    // Email Duplicate Check
    const emailDuplicateCheck = () => {
        // 메일 주소 중복 체크를 한다.
        if (email === '') {
            alert('메일 주소를 입력 후 중복 체크 해주시기 바랍니다!!!');
            return;
        }
        accountSearch(true, email);
    };

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    name: '',
                    password: '',
                    is_use: true,
                    submit: null
                }}
                validationSchema={Yup.object().shape({})}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        // Validation check
                        if (email === '') {
                            setErrorTitle('입력 오류');
                            setErrorMessage('Email주소를 입력하지 않았습니다');
                            setOpen(true);
                            return;
                        }
                        if (name === '') {
                            setErrorTitle('입력 오류');
                            setErrorMessage('Name을 입력하지 않았습니다');
                            setOpen(true);
                            return;
                        }
                        if (password === '') {
                            setErrorTitle('입력 오류');
                            setErrorMessage('Password를 입력하지 않았습니다');
                            setOpen(true);
                            return;
                        }
                        if (!emailChk) {
                            setErrorTitle('입력 오류');
                            setErrorMessage('Email 중복체크를 하지 않았습니다!');
                            setOpen(true);
                            return;
                        }
                        // Data 가공
                        setOpen(true);
                        const requestData = {
                            email: email,
                            name: name,
                            password: password,
                            status: 'INIT_REGISTER',
                            is_use: is_use
                        };
                        console.log(requestData);
                        setSubmitting(true);
                        if (paramId) {
                            requestData.id = id;
                            requestData.status = status;
                            console.log(requestData);
                            accountMngUpdate(id, requestData);
                        } else {
                            accountMngInsert(requestData);
                        }
                        //actionLogin(values.email, values.password);
                    } catch (err) {
                        console.log('here is error called...');
                        console.log(err);
                        setErrorTitle('Error Message');
                        setErrorMessage(err.message);
                        setOpen(true);
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                            <Grid item xs={12} md={7} lg={12}>
                                <HeaderTitle
                                    titleNm="계정 관리"
                                    menuStep01="통합관리 계정관리"
                                    menuStep02="계정 관리"
                                    menuStep03="계정 등록"
                                />

                                <MainCard sx={{ mt: 2 }}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>이메일 주소</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={3}>
                                            <Stack spacing={3}>
                                                <FormControl sx={{ m: 0, maxHeight: 30 }} size="small">
                                                    <TextField
                                                        id="filled-hidden-label-small"
                                                        type="text"
                                                        size="small"
                                                        value={email}
                                                        name="email"
                                                        inputProps={{ readOnly: emailStatus }}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        placeholder="Enter Email ID"
                                                        fullWidth
                                                        error={Boolean(touched.email && errors.email)}
                                                    />
                                                </FormControl>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 0, maxHeight: 30 }} size="small">
                                                <Button
                                                    disableElevation
                                                    size="small"
                                                    type="button"
                                                    disabled={isUpdate}
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={emailDuplicateCheck}
                                                >
                                                    중복체크
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>Name</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={4}>
                                            <FormControl sx={{ m: 0, minWidth: 160, maxHeight: 25 }} size="small">
                                                <TextField
                                                    id="filled-hidden-label-small"
                                                    type="text"
                                                    size="small"
                                                    value={name}
                                                    name="name"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="Input the name"
                                                    fullWidth
                                                    error={Boolean(touched.name && errors.name)}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}> Password</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={4.5}>
                                            <FormControl sx={{ m: 0, minWidth: 100, maxHeight: 25 }} size="small">
                                                <TextField
                                                    id="filled-hidden-label-small"
                                                    type="password"
                                                    size="small"
                                                    value={password}
                                                    name="password"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="Input the password."
                                                    fullWidth
                                                    error={Boolean(touched.password && errors.password)}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>사용여부</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={3}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name="is_use"
                                                        checked={is_use}
                                                        value={is_use}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                }
                                                label="사용함"
                                            />
                                        </Grid>
                                    </Grid>

                                    <Stack direction="row" spacing={3}>
                                        <Button
                                            disableElevation
                                            disabled={isSubmitting}
                                            size="small"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                        >
                                            저장하기
                                        </Button>
                                        <Button
                                            disableElevation
                                            disabled={isSubmitting}
                                            size="small"
                                            type="button"
                                            variant="contained"
                                            color="secondary"
                                            onClick={newClick}
                                        >
                                            신규
                                        </Button>
                                        <Button
                                            disableElevation
                                            disabled={isSubmitting}
                                            size="small"
                                            type="submit"
                                            variant="contained"
                                            color="secondary"
                                            onClick={listClick}
                                        >
                                            리스트
                                        </Button>
                                    </Stack>
                                    {errors.submit && (
                                        <Grid item xs={12}>
                                            <FormHelperText error>{errors.submit}</FormHelperText>
                                        </Grid>
                                    )}
                                </MainCard>
                                <MainCard sx={{ mt: 3 }} content={false}>
                                    <Stack>
                                        {touched.id && errors.id && (
                                            <FormHelperText error id="standard-weight-helper-text-password-login">
                                                <FormControl sx={{ m: 2, minHeight: 20 }} size="small">
                                                    <li>{errors.id}</li>
                                                </FormControl>
                                            </FormHelperText>
                                        )}
                                        {touched.name && errors.name && (
                                            <FormHelperText error id="standard-weight-helper-text-password-login">
                                                <FormControl sx={{ m: 2, minHeight: 20 }} size="small">
                                                    <li>{errors.name}</li>
                                                </FormControl>
                                            </FormHelperText>
                                        )}
                                    </Stack>
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
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AccountMngForm;
