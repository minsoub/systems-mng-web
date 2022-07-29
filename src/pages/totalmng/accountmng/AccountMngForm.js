import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
    Alert,
    AlertTitle,
    Button,
    Checkbox,
    Collapse,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    Stack,
    TextField
} from '@mui/material';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import MainCard from 'components/Common/MainCard';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AccountApis from 'apis/account/accountapis';
import SiteApi from 'apis/site/siteapi';
import HeaderTitle from '../../../components/HeaderTitle';
import DropInput from '../../../components/Common/DropInput';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import './styles.scss';
import cx from 'classnames';

const AccountMngForm = () => {
    let isSubmitting = false;

    const navigate = useNavigate();
    const { paramId } = useParams();
    const [responseData, requestError, loading, { accountSearch, accountMngInsert, accountMngDetail, accountMngUpdate }] = AccountApis();
    const [resData, reqErr, resLoading, { siteSearch }] = SiteApi();

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
        accountSearch(null, email);
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
                        setOpen(false);
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
                                <HeaderTitle titleNm="계정 관리" menuStep01="통합 관리" menuStep02="계정 관리" />

                                <MainCard sx={{ mt: 2 }}>
                                    <div className="layout--aline account--blank">
                                        <Stack spacing={10} className={cx('borderTitle')}>
                                            이메일 주소
                                        </Stack>
                                        <FormControl sx={{ minWidth: 250 }} size="medium">
                                            <TextField
                                                id="filled-hidden-label-small"
                                                type="text"
                                                size="medium"
                                                value={email}
                                                name="email"
                                                inputProps={{ readOnly: emailStatus }}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Enter Email ID"
                                                error={Boolean(touched.email && errors.email)}
                                            />
                                        </FormControl>

                                        <ButtonLayout>
                                            <Button
                                                disableElevation
                                                size="medium"
                                                type="button"
                                                disabled={isUpdate}
                                                variant="contained"
                                                color="secondary"
                                                onClick={emailDuplicateCheck}
                                            >
                                                중복체크
                                            </Button>
                                        </ButtonLayout>
                                    </div>

                                    <div className="account--blank">
                                        <DropInput title="이름">
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
                                        </DropInput>
                                    </div>

                                    <div className="account--blank">
                                        <DropInput title="비밀번호" className="account--blank">
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
                                        </DropInput>
                                    </div>

                                    <DropInput title="사용여부" className="account--blank">
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
                                    </DropInput>
                                </MainCard>

                                <ButtonLayout>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        size="medium"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        저장
                                    </Button>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        size="medium"
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
                                        size="medium"
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        onClick={listClick}
                                    >
                                        리스트
                                    </Button>
                                </ButtonLayout>
                                {errors.submit && (
                                    <Grid item xs={12}>
                                        <FormHelperText error>{errors.submit}</FormHelperText>
                                    </Grid>
                                )}

                                {errors.submit && (
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
                                )}
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AccountMngForm;
