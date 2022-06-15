import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// material-ui
// eslint-disable-next-line prettier/prettier
import {
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
import RoleApi from 'apis/roles/roleapi';
import SiteApi from 'apis/site/siteapi';
import { DatePicker } from 'antd';
import { MenuItem } from '../../../node_modules/@mui/material/index';

const RoleRegForm = () => {
    let isSubmitting = false;

    const navigate = useNavigate();
    const { paramId, search_site_id, search_is_use } = useParams();
    const [responseData, requestError, loading, { roleCheck, roleDetail, roleInsert, roleUpdate, roleDelete }] = RoleApi();
    const [resData, reqErr, resLoading, { siteSearch }] = SiteApi();

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);

    // const [visible, setVisible] = useState(true);
    // const [errors, setErrors] = useState('');

    // 사이트 콤보박스 입력 항목
    const [siteList, setSiteList] = useState([]);
    const [idStatus, setIdStatus] = useState(false);

    // 중복 체크
    const [idChk, setIdChk] = useState(false); // 중보 체크 여부
    // 중복 체크 버튼 제어
    const [isUpdate, setIsUpdate] = useState(false);
    // 삭제 버튼 제어
    const [isDisabled, setIsDisabled] = useState(true);

    // 데이터 입력 항목
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [valid_start_date, setValidStartDate] = useState('');
    const [valid_end_date, setValidEndDate] = useState('');
    const [is_use, setIsUse] = useState(true);
    const [site_id, setSiteId] = useState('');
    const [type, setType] = useState('');

    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const siteChanged = (event) => {
        console.log(event.target.value);
        setSiteId(event.target.value);
    };

    const typeChanged = (event) => {
        console.log(event.target.value);
        setType(event.target.value);
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
        console.log('props data => ');
        console.log(search_site_id);
        console.log(search_is_use);
        errorClear();
        // 사이트 구분 리스트 가져오기
        siteSearch(true, '');
        if (paramId) {
            // 수정 데이터 조회
            roleDetail(paramId);
            setIsDisabled(false);
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

    // Email Duplicate Check
    const idDuplicateCheck = () => {
        // ID 중복 체크를 한다.
        if (id === '') {
            alert('ID를 입력 후 중복 체크 해주시기 바랍니다!!!');
            return;
        }
        roleCheck(id);
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
                    let list = [];
                    siteData.map((site, index) => {
                        const s = { id: site.id, name: site.name };
                        console.log(s);
                        list.push(s);
                    });
                    setSiteList(list);
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
                if (responseData.data && responseData.data.length > 0) {
                    setDataGridRows(responseData.data);
                } else {
                    setDataGridRows([]);
                }
                break;
            case 'detailData':
                if (responseData.data.data) {
                    let res = responseData.data.data;
                    setId(res.id);
                    setName(res.name);
                    setValidStartDate(res.valid_start_date);
                    setValidEndDate(res.valid_end_date);
                    setIsUse(res.is_use);
                    setSiteId(res.site_id);
                    setType(res.type);

                    setIsUpdate(true);
                    setIdStatus(true);
                    setIdChk(true);
                    // 수정모드이면 운영권한 콤보박스 데이터를 조회한다.
                    //setRoleList([]);
                    //roleComboSearch(true, 'ADMIN', res.site_id);
                }
                break;
            case 'duplicateData':
                if (responseData.data.data) {
                    alert('이미 등록된 아이디입니다!!!');
                    setIdChk(false);
                } else {
                    alert('사용 가능한 아이디입니다!!!');
                    setIdChk(true);
                }
                break;
            case 'insertData':
                alert('등록을 완료하였습니다!!!');
                navigate('/roles/list');
                break;
            case 'updateData':
                alert('수정을 완료하였습니다!!!');
                break;
            case 'deleteeData':
                console.log('deleteData');
                alert('삭제를 완료하였습니다!!!');
                navigate('/roles/list');
                break;
            default:
        }
    }, [responseData]);

    const handleChange = (e) => {
        switch (e.target.name) {
            case 'id':
                setId(e.target.value);
                break;
            case 'name':
                setName(e.target.value);
                break;
            case 'valid_start_date':
                setValidStartDate(e.target.value);
                break;
            case 'valid_end_date':
                setValidEndDate(e.target.value);
                break;
            case 'is_use':
                setIsUse(e.target.checked);
                break;
            case 'site_id':
                setSiteId(e.target.checked);
                break;
            case 'type':
                setType(e.target.value);
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

    // List
    const listClick = () => {
        if (search_site_id) {
            navigate(`/roles/list/${search_site_id}/${search_is_use}`);
        } else {
            navigate(`/roles/list`);
        }
    };

    // delete
    const deleteClick = () => {
        if (confirm('삭제를 하시겠습니까')) {
            const requestData = {
                id: id,
                name: name,
                valid_start_date: valid_start_date,
                valid_end_date: valid_end_date,
                site_id: site_id,
                is_use: false,
                type: type
            };
            roleDelete(id, requestData);
        }
    };

    return (
        <>
            <Formik
                initialValues={{
                    id: '',
                    name: '',
                    type: '',
                    is_use: true,
                    valid_start_date: '',
                    valid_end_date: '',
                    site_id: '',
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
                        if (name === '') {
                            setErrorTitle('입력 오류');
                            setErrorMessage('Role Name을 입력하지 않았습니다');
                            setOpen(true);
                            return;
                        }
                        if (valid_start_date === '') {
                            setErrorTitle('입력 오류');
                            setErrorMessage('유효기간을 입력하지 않았습니다');
                            setOpen(true);
                            return;
                        }
                        if (valid_end_date === '') {
                            setErrorTitle('입력 오류');
                            setErrorMessage('유효기간을 입력하지 않았습니다');
                            setOpen(true);
                            return;
                        }
                        if (site_id === '') {
                            setErrorTitle('입력 오류');
                            setErrorMessage('사이트 구분을 선택하지 않았습니다!!!');
                            setOpen(true);
                            return;
                        }
                        if (type === '') {
                            setErrorTitle('입력 오류');
                            setErrorMessage('운영구분을 선택하지 않았습니다!!!');
                            setOpen(true);
                            return;
                        }
                        if (!idChk) {
                            setErrorTitle('입력 오류');
                            setErrorMessage('ID 중복 체크를 하지 않았습니다!!!');
                            setOpen(true);
                            return;
                        }
                        // Data 가공
                        setOpen(true);
                        const requestData = {
                            id: id,
                            name: name,
                            valid_start_date: valid_start_date,
                            valid_end_date: valid_end_date,
                            site_id: site_id,
                            is_use: is_use,
                            type: type
                        };
                        console.log('called onSubmit...');
                        console.log(requestData);
                        setStatus({ success: false });
                        setSubmitting(true);
                        //console.log(values);
                        if (paramId) {
                            roleUpdate(id, requestData);
                        } else {
                            roleInsert(requestData);
                        }
                    } catch (err) {
                        console.log(err);
                        setStatus({ success: false });
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
                                        <Typography variant="h3">Role 등록</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h6">통합관리 &gt; Role 관리 &gt; Role 등록</Typography>
                                    </Grid>
                                    <Grid container spacing={2}></Grid>
                                </Grid>
                                <MainCard sx={{ mt: 2 }}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>Role ID</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={2}>
                                            <Stack spacing={5}>
                                                <FormControl sx={{ m: 0, maxHeight: 30, maxWidth: 220 }} size="small">
                                                    <TextField
                                                        id="filled-hidden-label-small"
                                                        type="text"
                                                        size="small"
                                                        value={id}
                                                        name="id"
                                                        inputProps={{ readOnly: idStatus }}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        placeholder="Role ID"
                                                        fullWidth
                                                        error={Boolean(touched.id && errors.id)}
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
                                                    onClick={idDuplicateCheck}
                                                >
                                                    중복체크
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>Role Name</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={2}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <TextField
                                                    id="filled-hidden-label-small"
                                                    type="text"
                                                    size="small"
                                                    value={name}
                                                    name="name"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="Enter Role Name"
                                                    fullWidth
                                                    error={Boolean(touched.name && errors.name)}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>유효기간</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={1.5}>
                                            <TextField
                                                id="valid_start_date"
                                                name="valid_start_date"
                                                value={valid_start_date}
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
                                                value={valid_end_date}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type="date"
                                                defaultValue=""
                                                sx={{ width: 140 }}
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
                                                        checked={is_use}
                                                        name="is_use"
                                                        value={is_use}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                }
                                                label="사용함"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>사이트 구분</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={4}>
                                            <FormControl sx={{ m: 0, minWidth: 180, maxHeight: 25 }} size="small">
                                                <Select name="site_id" label="사이트명" value={site_id} onChange={siteChanged}>
                                                    <MenuItem value="">
                                                        <em>Choose a Site Type</em>
                                                    </MenuItem>
                                                    {siteList.map((item, index) => (
                                                        <MenuItem key={index} value={item.id}>
                                                            {item.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={1.5}>
                                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                <Stack spacing={0}>운영구분</Stack>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={3}>
                                            <FormControl sx={{ m: 0, minWidth: 140 }} size="small">
                                                <Select name="type" label="구분" value={type} onChange={typeChanged}>
                                                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                                                    <MenuItem value="USER">USER</MenuItem>
                                                </Select>
                                            </FormControl>
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
                                            disabled={isDisabled}
                                            size="small"
                                            type="button"
                                            variant="contained"
                                            color="secondary"
                                            onClick={deleteClick}
                                        >
                                            삭제
                                        </Button>
                                        <Button
                                            disableElevation
                                            disabled={isSubmitting}
                                            size="small"
                                            type="button"
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

export default RoleRegForm;
