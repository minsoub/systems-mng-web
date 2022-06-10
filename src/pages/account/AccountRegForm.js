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
    Typography
} from '@mui/material';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Input } from 'antd';
import { boolean } from '../../../node_modules/yup/lib/index';
import DefaultDataGrid from '../../components/DataGrid/DefaultDataGrid';
import AccountApis from 'apis/account/accountapis';
import { DatePicker } from 'antd';
import { MenuItem } from '../../../node_modules/@mui/material/index';

const AccountRegForm = () => {
    let isSubmitting = false;

    const navigate = useNavigate();
    const [responseData, requestError, loading, { actionSearch, actionList }] = AccountApis();

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);
    const [visible, setVisible] = useState(true);
    const [errors, setErrors] = useState('');
    const [itemList, setItemList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [role_id, setRoleId] = useState('');
    const [site_id, setSiteId] = useState('');
    const [status, setStatus] = useState('');

    // Alert Dialog
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const onChagnge = (date, dateString) => {
        console.log(date, dateString);
    };

    const siteChanged = (event) => {
        console.log(event.target.value);
        setSiteId(event.target.value);
    };

    const roleChanged = (event) => {
        console.log(event.target.value);
        setRoleId(event.target.value);
    };

    const statusChanged = (event) => {
        console.log(event.target.value);
        setStatus(event.target.value);
    };

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            console.log('error requestError');
            console.log(requestError);
            setErrors(requestError);
            setVisible(true);
        }
    }, [requestError]);

    // onload
    useEffect(() => {
        errorClear();
        //actionList();
        // 사이트 구분 리스트 가져오기
        const dd = [
            { id: 'xxxx1', name: '거래지원사이트' },
            { id: 'xxxx2', name: '투자보호센터' }
        ];
        setItemList(dd);

        const cc = [
            { id: '0', name: '통합시스템 관리자' },
            { id: '1', name: '통합계정 관리자' },
            { id: '2', name: '사이트 관리자' },
            { id: '3', name: '사이트 운영관리자' }
        ];
        setRoleList(cc);
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

    const handleClose = () => {
        setVisible(false);
    };

    // new
    const newClick = () => {
        navigate('/roles/reg');
    };

    // delete
    const deleteClick = () => {};

    // list
    const listClick = () => {
        navigate('/account/list');
    };

    return (
        <>
            <Formik
                initialValues={{
                    site_id: '',
                    email: '',
                    name: '',
                    password: '',
                    role_id: '',
                    status: '',
                    send_chk: false,
                    is_use: true,
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    //id: Yup.string().max(36).required('Role ID is required'),
                    //name: Yup.string().max(50).required('Role Name is required')
                    // site_id: Yup.object().shape({
                    //     value: Yup.string().required('Site ID is not selected')
                    // })
                    //valid_start_date: Yup.string().required('유효기간을 입력해야 합니다'),
                    //valid_end_date: Yup.string().required('유효기간을 입력해야 합니다')
                    //site_id: Yup.string().required('SITE ID is required'),
                    //type: Yup.string().required('Type is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        // Validation check
                        if (values.id === '') {
                            setErrorTitle('입력 오류');
                            setErrorMessage('Role 아이디를 입력하지 않았습니다');
                            setOpen(true);
                        }
                        if (values.name === '') {
                            setErrorTitle('입력 오류');
                            setErrorMessage('Role Name을 입력하지 않았습니다');
                            setOpen(true);
                        }
                        // Data 가공
                        setOpen(true);
                        const requestData = {
                            id: values.id,
                            name: values.name,
                            valid_start_date: values.valid_start_date,
                            valid_end_date: values.valid_end_date,
                            site_id: site_id,
                            type: type
                        };
                        console.log('called onSubmit...');
                        console.log(requestData);
                        setStatus({ success: false });
                        setSubmitting(true);
                        console.log(values);
                        //actionLogin(values.email, values.password);
                    } catch (err) {
                        console.log(err);
                        setStatus({ success: false });
                        //setErrors({ submit: err.message });
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                            <Grid item xs={12} md={7} lg={12}>
                                <Grid container alignItems="center" justifyContent="space-between">
                                    <Grid item>
                                        <Typography variant="h3">계정 관리</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h6">통합 시스템관리 &gt; 계정 관리 &gt; 계정 등록</Typography>
                                    </Grid>
                                    <Grid container spacing={2}></Grid>
                                </Grid>
                                <MainCard sx={{ mt: 2 }}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>사이트명</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={3}>
                                            <FormControl sx={{ m: 0, minWidth: 160, maxHeight: 25 }} size="small">
                                                <Select name="site_id" label="사이트명" value={site_id} onChange={siteChanged}>
                                                    <MenuItem value="">
                                                        <em>Choose a Site Type</em>
                                                    </MenuItem>
                                                    {itemList.map((item, index) => (
                                                        <MenuItem key={index} value={item.id}>
                                                            {item.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>이메일 주소</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={2}>
                                            <Stack spacing={3}>
                                                <FormControl sx={{ m: 0, maxHeight: 30 }} size="small">
                                                    <TextField
                                                        id="filled-hidden-label-small"
                                                        type="text"
                                                        size="small"
                                                        value={values.email}
                                                        name="email"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        placeholder="Enter Email ID"
                                                        fullWidth
                                                        error={Boolean(touched.email && errors.email)}
                                                    />
                                                </FormControl>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={8} sm={2}>
                                            <FormControl sx={{ m: 0, maxHeight: 30 }} size="small">
                                                <Button
                                                    disableElevation
                                                    size="small"
                                                    type="submit"
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={newClick}
                                                >
                                                    중복체크
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>Name</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={3}>
                                            <TextField
                                                id="filled-hidden-label-small"
                                                type="text"
                                                size="small"
                                                value={values.name}
                                                name="name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Input the name"
                                                fullWidth
                                                error={Boolean(touched.name && errors.name)}
                                            />
                                        </Grid>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}> Password</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={2}>
                                            <TextField
                                                id="filled-hidden-label-small"
                                                type="password"
                                                size="small"
                                                value={values.password}
                                                name="password"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Input the password."
                                                fullWidth
                                                error={Boolean(touched.password && errors.password)}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>운영권한</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={3}>
                                            <FormControl sx={{ m: 0, minWidth: 160 }} size="small">
                                                <Select name="role_id" label="운영권한" value={role_id} onChange={roleChanged}>
                                                    <MenuItem value="">
                                                        <em>Choose a Role Type</em>
                                                    </MenuItem>
                                                    {roleList.map((item, index) => (
                                                        <MenuItem key={index} value={item.id}>
                                                            {item.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>계정상태</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={3}>
                                            <FormControl sx={{ m: 0, minWidth: 160 }} size="small">
                                                <Select name="status" label="계정상태" value={status} onChange={statusChanged}>
                                                    <MenuItem value="0">정상</MenuItem>
                                                    <MenuItem value="1">초기화요청</MenuItem>
                                                    <MenuItem value="2">초기화확인</MenuItem>
                                                    <MenuItem value="3">초기화완료</MenuItem>
                                                    <MenuItem value="9">중지상태</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>전송여부</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={3}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        defaultChecked
                                                        name="send_chk"
                                                        value={values.send_chk}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                }
                                                label="체크시 패스워드 초기화 메일 전송됨."
                                            />
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
                                                        defaultChecked
                                                        name="is_use"
                                                        value={values.is_use}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                }
                                                label="사용하지 않음"
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
                                            type="submit"
                                            variant="contained"
                                            color="secondary"
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

export default AccountRegForm;
