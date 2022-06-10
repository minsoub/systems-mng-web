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
import SiteApi from 'apis/site/siteapi';
import { DatePicker } from 'antd';
import { MenuItem } from '../../../node_modules/@mui/material/index';
import UserSearchDialog from 'pages/popup/UserSearchPopup';
import { values } from 'lodash';

const SiteRegForm = () => {
    let isSubmitting = false;

    const navigate = useNavigate();
    const { paramId } = useParams();
    const [responseData, requestError, loading, { actionInsert, actionDetail }] = SiteApi();

    // Alert Dialog
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // User Search Dialog
    const [openUserSearch, setOpenUserSearch] = useState(false);
    const [selectedValue, setSelectedValue] = useState([]);

    // Form data
    // 담당자ID, 전화번호, 메일주소 상태값
    const [adminId, setAdminId] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [is_use, setIsUse] = useState(true);
    const [valid_start_date, setValidStartDate] = useState('');
    const [valid_end_date, setValidEndDate] = useState('');
    const [adminPhone, setAdminPhone] = useState('');

    const onChagnge = (date, dateString) => {
        console.log(date, dateString);
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

    // onload
    useEffect(() => {
        errorClear();
        if (paramId) {
            actionDetail(paramId);
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
                }
                break;
            case 'deleteData':
                console.log('deleteData');
                //actionList();
                break;
            default:
        }
    }, [responseData]);

    const closePopup = () => {
        // Close Popup
    };

    const handleClose = (returnData) => {
        setOpenUserSearch(false);
        console.log(requestError);
        // 데이터 처리
        if (returnData.length !== 0) {
            // 데이터 처리
            console.log(returnData);
            setAdminId(returnData.row.id);
            setAdminEmail(returnData.row.email);
        }
    };

    // new
    const newClick = () => {
        // data clear
    };

    // delete
    const deleteClick = () => {};

    // list
    const listClick = () => {
        navigate('/site/list');
    };
    // 사용자 검색
    const accountSearch = () => {
        // search
        setOpenUserSearch(true);
    };

    return (
        <>
            <Formik
                initialValues={{
                    id: '',
                    name: '',
                    is_use: true,
                    valid_start_date: '',
                    valid_end_date: '',
                    description: '',
                    admin_account_id: '',
                    admin_account_email: '',
                    admin_account_phone: '',
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
                            setErrorMessage('Site 아이디를 입력하지 않았습니다');
                            setOpen(true);
                            return;
                        }
                        if (values.name === '') {
                            setErrorTitle('입력 오류');
                            setErrorMessage('Site Name을 입력하지 않았습니다');
                            setOpen(true);
                            return;
                        }
                        // Data 가공
                        setOpen(true);
                        const requestData = {
                            id: values.id,
                            name: values.name,
                            is_use: values.is_use,
                            valid_start_date: values.valid_start_date,
                            valid_end_date: values.valid_end_date,
                            description: values.description,
                            admin_account_id: adminId,
                            admin_account_phone: values.admin_account_phone,
                            admin_account_email: adminEmail
                        };
                        console.log('called onSubmit...');
                        console.log(requestData);
                        setStatus({ success: false });
                        setSubmitting(true);
                        console.log(values);
                        actionInsert(requestData);
                    } catch (err) {
                        console.log(err);
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
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
                                        <Typography variant="h3">사이트 등록</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h6">통합 시스템관리 &gt; 사이트 관리 &gt; 사이트 등록</Typography>
                                    </Grid>
                                    <Grid container spacing={2}></Grid>
                                </Grid>
                                <MainCard sx={{ mt: 2 }}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>사이트 ID</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={3}>
                                            <Stack spacing={3}>
                                                <FormControl sx={{ m: 0, maxHeight: 30 }} size="small">
                                                    <TextField
                                                        id="filled-hidden-label-small"
                                                        type="text"
                                                        size="small"
                                                        value={values.id}
                                                        name="id"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        placeholder="사이트 ID를 등록하세요!!!"
                                                        fullWidth
                                                        error={Boolean(touched.id && errors.id)}
                                                    />
                                                </FormControl>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>사이트명</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={2}>
                                            <Stack spacing={3}>
                                                <FormControl sx={{ m: 0, maxHeight: 30 }} size="small">
                                                    <TextField
                                                        id="filled-hidden-label-small"
                                                        type="text"
                                                        size="small"
                                                        value={values.name}
                                                        name="name"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        placeholder="사이트명를 등록하세요!!!"
                                                        fullWidth
                                                        error={Boolean(touched.name && errors.name)}
                                                    />
                                                </FormControl>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3}>
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
                                                label="사용함"
                                            />
                                        </Grid>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>운영기간</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={1.5}>
                                            <TextField
                                                id="valid_start_date"
                                                name="valid_start_date"
                                                //value={values.valid_start_date}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type="date"
                                                defaultValue=""
                                                sx={{ width: 140 }}
                                            />
                                        </Grid>
                                        <Grid item xs={8} sm={0.5}>
                                            ~{' '}
                                        </Grid>
                                        <Grid item xs={8} sm={2}>
                                            <TextField
                                                id="valid_end_date"
                                                name="valid_end_date"
                                                //value={values.valid_end_date}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type="date"
                                                defaultValue=""
                                                sx={{ width: 140 }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>비고</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={8}>
                                            <Stack spacing={3}>
                                                <FormControl sx={{ m: 0, maxHeight: 30 }} size="small">
                                                    <TextField
                                                        id="filled-hidden-label-small"
                                                        type="text"
                                                        size="small"
                                                        value={values.description}
                                                        name="description"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        placeholder="Input the Description"
                                                        fullWidth
                                                    />
                                                </FormControl>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>담당자D</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={2}>
                                            <Stack spacing={3}>
                                                <FormControl sx={{ m: 0, maxHeight: 30 }} size="small">
                                                    <TextField
                                                        id="filled-hidden-label-small"
                                                        type="text"
                                                        size="small"
                                                        value={adminId}
                                                        name="admin_account_name"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        error={Boolean(touched.admin_account_name && errors.admin_account_name)}
                                                    />
                                                </FormControl>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={8} sm={1}>
                                            <FormControl sx={{ m: 0, maxHeight: 30 }} size="small">
                                                <Button
                                                    disableElevation
                                                    size="small"
                                                    type="button"
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={accountSearch}
                                                >
                                                    검색
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>전화번호</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={2}>
                                            <Stack spacing={3}>
                                                <FormControl sx={{ m: 0, maxHeight: 30 }} size="small">
                                                    <TextField
                                                        id="filled-hidden-label-small"
                                                        type="text"
                                                        size="small"
                                                        value={values.admin_account_phone}
                                                        name="admin_account_phone"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        fullWidth
                                                    />
                                                </FormControl>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>메일주소</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={6}>
                                            <TextField
                                                id="filled-hidden-label-small"
                                                type="text"
                                                size="small"
                                                value={adminEmail}
                                                name="admin_account_email"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                fullWidth
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
                        <UserSearchDialog selectedValue={selectedValue} open={openUserSearch} onClose={handleClose} />
                    </form>
                )}
            </Formik>
        </>
    );
};

export default SiteRegForm;
