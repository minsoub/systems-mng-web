import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack } from '@mui/material';

import * as Yup from 'yup';
import { Formik } from 'formik';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import useAuthorized from 'apis/auth/auths';
import { useSelector } from 'react-redux';

import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import base64 from 'base-64';

const cx = classNames.bind(styles);

const AuthLogin = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [responseData, requestError, loading, { actionLogin, actionInit, actionRsaPublicKey }] = useAuthorized();

    const { isLoggined, siteId, accessToken } = useSelector((state) => state.auth);

    useEffect(() => {
        actionInit();
        actionRsaPublicKey();
    }, []);

    useEffect(() => {
        if (localStorage.hasOwnProperty('authenticated') && isLoggined === true && siteId && accessToken) {
            if (siteId === '62a15f4ae4129b518b133128') {
                // 투자보호
                navigate('/cpc/dashboard');
            } else if (siteId === '62a15f4ae4129b518b133129') {
                navigate('/main/dashboard');
            } else if (siteId === 'SITE_aa776861f48e455281dd2abd373dd258') {
                navigate('/cms/dashboard');
            } else {
                navigate('/lrc/dashboard');
            }
        }
    }, [isLoggined]);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
        console.log('handleMouseDownPassword');
    };

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            console.log('>> requestError <<');
            console.log(requestError);
            alert('로그인에 실패하였습니다.');
        }
    }, [requestError]);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        console.log(responseData.transactionId);
        switch (responseData.transactionId) {
            case 'initLogin':
                if (responseData.data) {
                    console.log(responseData.data);
                    console.log(base64.decode(responseData.data.init_data));
                    localStorage.setItem('initData', responseData.data.init_data);
                }
                break;
            case 'rsaPublicKey':
                if (responseData.data) {
                    console.log(responseData.data);
                    console.log(base64.decode(responseData.data.public_key));
                    sessionStorage.setItem('rsaPublicKey', responseData.data.public_key);
                }
                break;
            case 'siginin':
                console.log(responseData);
                if (responseData.data) {
                    //setDataGridRows(responseData.data);
                    // email, otpInfo:encode_key, url
                    // site_id, token
                    console.log('success => ');
                    console.log(responseData.data);
                    //if (responseData.data.is_code === true) {
                    navigate('/otpsimplelogin', { state: responseData.data });
                    //} else {
                    //    navigate('/otplogin', { state: responseData.data });
                    //}
                }
                break;
            default:
        }
    }, [responseData]);

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string()
                        .email('올바른 이메일 주소를 입력해 주세요.')
                        .max(255)
                        .required('올바른 이메일 주소를 입력해 주세요.'),
                    password: Yup.string().max(255).required('올바른 비밀번호를 입력해 주세요.')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        setStatus({ success: false });
                        setSubmitting(true);
                        console.log(values);
                        actionLogin(values.email, values.password);
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
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="email-login">이메일</InputLabel>
                                    <OutlinedInput
                                        id="email-login"
                                        type="email"
                                        value={values.email}
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="이메일 주소를 입력해 주세요."
                                        fullWidth
                                        error={Boolean(touched.email && errors.email)}
                                    />
                                    {touched.email && errors.email && (
                                        <FormHelperText error id="standard-weight-helper-text-email-login">
                                            {errors.email}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="password-login">비밀번호</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.password && errors.password)}
                                        id="-password-login"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    size="large"
                                                >
                                                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="비밀번호를 입력해 주세요."
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.password}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>

                            {/* 에러 문구 */}
                            {errors.submit && (
                                <Grid item xs={12}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    로그인
                                </Button>
                            </Grid>

                            <Grid item xs={12} className={cx('blank')}>
                                <div className={cx('label--center')}>
                                    <span>비밀번호를 분실하셨나요?</span>
                                    <a href="/resetpassword" className={cx('label--center--highlight')}>
                                        초기화 요청
                                    </a>
                                </div>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AuthLogin;
