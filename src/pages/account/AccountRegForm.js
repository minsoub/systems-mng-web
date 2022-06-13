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
import AccountApis from 'apis/account/accountapis';
import SiteApi from 'apis/site/siteapi';
import RoleApi from 'apis/roles/roleapi';
import { DatePicker } from 'antd';
import { MenuItem } from '../../../node_modules/@mui/material/index';

const AccountRegForm = () => {
    let isSubmitting = false;

    const navigate = useNavigate();
    const { paramId } = useParams();
    const [responseData, requestError, loading, { accountDetail, accountSearch, accountUpdate, accountInsert }] = AccountApis();
    const [resData, reqErr, resLoading, { siteSearch }] = SiteApi();
    const [resRoleData, resRoleError, resRoleLoading, { roleComboSearch }] = RoleApi();

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);

    const [itemList, setItemList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [role_id, setRoleId] = useState('');
    const [site_id, setSiteId] = useState('');

    // User Search Dialog
    const [openUserSearch, setOpenUserSearch] = useState(false);
    const [selectedValue, setSelectedValue] = useState([]);

    // Alert Dialog
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Form data
    const [id, setId] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [is_use, setIsUse] = useState(true);
    const [status, setStatus] = useState('');
    const [send_chk, setSendChk] = useState(false);

    // Email 작성 여부
    const [emailStatus, setEmailStatus] = useState(false);
    // Email 중복 체크
    const [emailChk, setEmailChk] = useState(false);
    // 중복 체크 버튼 제어
    const [isUpdate, setIsUpdate] = useState(false);

    // site가 변경되었을 때 호출된다.
    const siteChanged = (e) => {
        console.log('siteChanged called..');
        console.log(e.target.value);
        setSiteId(e.target.value);
        console.log(site_id);
        setRoleList([]);
        roleComboSearch(true, 'ADMIN', e.target.value);
    };

    const roleChanged = (e) => {
        console.log(e.target.value);
        setRoleId(e.target.value);
    };

    const statusChanged = (e) => {
        console.log(e.target.value);
        setStatus(e.target.value);
    };

    // transaction error 처리
    useEffect(() => {
        if (requestError || reqErr || resRoleError) {
            let err = requestError ? requestError : reqErr;
            if (resRoleError) err = resRoleError;

            console.log('error requestError');
            console.log(err);
            setErrorTitle('Error Message');
            setErrorMessage(err);
            setOpen(true);
        }
    }, [requestError, reqErr, resRoleError]);

    // onload
    useEffect(() => {
        errorClear();
        // 사이트 구분 리스트 가져오기
        siteSearch(true, '');

        if (paramId) {
            // 수정 데이터 조회
            accountDetail(paramId);
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

    // Combobox data transaction
    // 사이트
    useEffect(() => {
        if (!resData) {
            return;
        }
        switch (resData.transactionId) {
            case 'siteList':
                if (resData.data.data) {
                    let siteData = resData.data.data;
                    let siteList = [];
                    siteData.map((site, index) => {
                        const s = { id: site.id, name: site.name };
                        console.log(s);
                        siteList.push(s);
                    });
                    setItemList(siteList);
                }
                break;
            default:
        }
    }, [resData]);

    // 운영권한(Role)
    useEffect(() => {
        if (!resRoleData) {
            return;
        }
        switch (resRoleData.transactionId) {
            case 'roleList':
                if (resRoleData.data.data) {
                    let roleData = resRoleData.data.data;
                    let roleList = [];
                    //roleList.push({ id: 'ALL', name: '통합시스템 관리자' });
                    roleData.map((role, index) => {
                        const s = { id: role.id, name: role.name };
                        console.log(s);
                        roleList.push(s);
                    });
                    setRoleList(roleList);
                    if (paramId) {
                        console.log('수정모드에서의 운영권한 멥핑');
                        console.log(role_id);
                        setRoleId(role_id);
                    }
                }
                break;
            default:
        }
    }, [resRoleData]);

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
            case 'getData':
                if (responseData.data.data) {
                    let res = responseData.data.data;
                    setId(res.id);
                    setEmail(res.email);
                    setName(res.name);
                    setSiteId(res.site_id);
                    setRoleId(res.role_id);
                    //setPassword(res.password);
                    setIsUse(res.is_use);
                    setStatus(res.status);
                    setIsUpdate(true);
                    setEmailStatus(true);
                    setEmailChk(true);
                    // 수정모드이면 운영권한 콤보박스 데이터를 조회한다.
                    setRoleList([]);
                    roleComboSearch(true, 'ADMIN', res.site_id);
                }
                break;
            case 'insertData':
                alert('등록을 완료하였습니다!!!');
                navigate('/account/list');
            case 'updateData':
                alert('수정을 완료하였습니다!!!');
                navigate('/account/list');
            case 'deleteDatas':
                console.log('deleteData');
                alert('삭제 처리를 완료하였습니다');
                //actionList();
                break;
            default:
        }
    }, [responseData]);

    const handleChange = (e) => {
        switch (e.target.name) {
            case 'id':
                setId(e.target.value);
                break;
            case 'email':
                setEmail(e.target.value);
                setEmailChk(false);
                break;
            case 'name':
                setName(e.target.value);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
            case 'is_use':
                setIsUse(e.target.checked);
                break;
            case 'send_chk':
                setSendChk(e.target.checked);
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
        navigate('/roles/reg');
    };

    // delete
    const deleteClick = () => {};

    // list
    const listClick = () => {
        navigate('/account/list');
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
                    site_id: '',
                    email: '',
                    name: '',
                    password: '',
                    role_id: '',
                    status: '',
                    send_chk: false,
                    is_use: false,
                    submit: null
                }}
                validationSchema={Yup.object().shape({})}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        // Validation check
                        if (site_id === '') {
                            setErrorTitle('입력 오류');
                            setErrorMessage('Site명을 선택하지 않았습니다');
                            setOpen(true);
                            return;
                        }
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
                        if (role_id === '') {
                            setErrorTitle('입력 오류');
                            setErrorMessage('운영권한을 입력하지 않았습니다');
                            setOpen(true);
                            return;
                        }
                        if (status === '') {
                            setErrorTitle('입력 오류');
                            setErrorMessage('계정상태를 입력하지 않았습니다');
                            setOpen(true);
                            return;
                        }
                        // Data 가공
                        setOpen(true);
                        const requestData = {
                            site_id: site_id,
                            admin_account_id: id,
                            email: email,
                            name: name,
                            password: password,
                            role_management_id: role_id,
                            status: status,
                            is_use: is_use,
                            is_send_mail: send_chk
                        };
                        console.log(requestData);
                        if (paramId) {
                            accountUpdate(id, requestData);
                        } else {
                            accountInsert(requestData);
                        }
                        //setStatus({ success: false });
                        setSubmitting(true);
                        //actionLogin(values.email, values.password);
                    } catch (err) {
                        console.log(err);
                        //setStatus({ success: false });
                        //setErrors({ submit: err.message });
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleSubmit, isSubmitting, touched }) => (
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
                                        <Grid item xs={8} sm={4}>
                                            <FormControl sx={{ m: 0, minWidth: 180, maxHeight: 25 }} size="small">
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
                                        <Grid item xs={8} sm={3}>
                                            <Stack spacing={3}>
                                                <FormControl sx={{ m: 0, minWidth: 180, maxHeight: 30 }} size="small">
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
                                        <Grid item xs={8} sm={2}>
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
                                    </Grid>
                                    <Grid container spacing={4}>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>Name</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={4}>
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
                                        </Grid>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}> Password</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={4}>
                                            <FormControl sx={{ m: 0, minWidth: 100, maxHeight: 30 }} size="small">
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
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>운영권한</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={4}>
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
                                                    <MenuItem value="NORMAL">정상</MenuItem>
                                                    <MenuItem value="INIT_REQUEST">초기화요청</MenuItem>
                                                    <MenuItem value="INIT_CONFIRM">초기화확인</MenuItem>
                                                    <MenuItem value="INIT_COMPLETE">초기화완료</MenuItem>
                                                    <MenuItem value="INIT_REGISTER">신규등록</MenuItem>
                                                    <MenuItem value="DENY_ACCESS">중지상태</MenuItem>
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
                                        <Grid item xs={8} sm={4}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name="send_chk"
                                                        value={send_chk}
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
