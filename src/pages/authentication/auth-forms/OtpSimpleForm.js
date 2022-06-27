import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthData } from '../../../store/reducers/auth';
import moment from 'moment';

// material-ui
import {
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    FormHelperText,
    Grid,
    Link,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import FirebaseSocial from './FirebaseSocial';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

import useAuthorized from 'apis/auth/auths';

// ============================|| FIREBASE - LOGIN ||============================ //

const OtpSimpleForm = ({ result }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [checked, setChecked] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [responseData, requestError, loading, { actionOtp, actionClear }] = useAuthorized();

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
            alert('error');
        }
    }, [requestError]);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'otplogin':
                console.log('otplogin transaction id => ');
                console.log(responseData);
                if (responseData.data) {
                    // Token 정보 저장
                    const authData = {
                        siteId: result.site_id,
                        email: result.email,
                        accessToken: responseData.data.access_token,
                        isLoggined: true,
                        loginDate: moment().format('YYYY.MM.DD HH:mm:ss')
                    };
                    dispatch(setAuthData(authData));
                    localStorage.setItem('authenticated', JSON.stringify(authData));
                    // alert("로그인을 완료하였습니다!!!")
                    navigate('/dashboard');
                }
                break;
            case 'otpClear':
                if (responseData.data) {
                    alert('OTP 초기화 신청을 완료하였습니다. 다시 로그인 하시기 바랍니다!!!');
                    navigate('/login');
                }
                break;
            default:
        }
    }, [responseData]);

    const CancelClick = () => {
        if (confirm('취소하시겠습니까?')) {
            navigate('/login');
        }
    };
    const clearOtp = (e) => {
        e.preventDefault();
        console.log('called..');
        if (confirm('초기화 요청하시겠습니까?')) {
            let data = {
                site_id: result.site_id,
                email: result.email,
                otp_key: result.opt_key,
                token: result.token
            };
            actionClear(data);
        }
    };

    return (
        <>
            <Formik
                initialValues={{
                    otp1: '',
                    otp2: '',
                    otp3: '',
                    otp4: '',
                    otp5: '',
                    otp6: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    otp1: Yup.number().max(9).required('Otp Number is required'),
                    otp2: Yup.number().max(9).required('Otp Number is required'),
                    otp3: Yup.number().max(9).required('Otp Number is required'),
                    otp4: Yup.number().max(9).required('Otp Number is required'),
                    otp5: Yup.number().max(9).required('Otp Number is required'),
                    otp6: Yup.number().max(9).required('Otp Number is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        setStatus({ success: false });
                        setSubmitting(true);
                        console.log(values);
                        let otpNo = '';
                        let data = {
                            site_id: result.site_id,
                            otp_no: otpNo.concat(values.otp1, values.otp2, values.otp3, values.otp4, values.otp5, values.otp6),
                            token: result.token,
                            encode_key: result.otp_info.encode_key
                        };
                        console.log(data);
                        actionOtp(data);
                        console.log(values);
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
                        <Grid container spacing={3} sx={{ mt: 3 }}>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel>Google Authenticator에 표시된 6자리 코드를 입력해 주세요</InputLabel>
                                </Stack>
                            </Grid>
                            <Grid item xs={12}></Grid>
                            <Grid item xs={12}></Grid>
                            <Grid item xs={12}></Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" spacing={1}>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.otp1 && errors.otp1)}
                                        id="-password-login"
                                        type="password"
                                        value={values.otp1}
                                        name="otp1"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder=""
                                    />
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.otp2 && errors.otp2)}
                                        id="-password-login"
                                        type="password"
                                        value={values.otp2}
                                        name="otp2"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder=""
                                    />
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.otp3 && errors.otp3)}
                                        id="-password-login"
                                        type="password"
                                        value={values.otp3}
                                        name="otp3"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder=""
                                    />
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.otp4 && errors.otp4)}
                                        id="-password-login"
                                        type="password"
                                        value={values.otp4}
                                        name="otp4"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder=""
                                    />
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.otp5 && errors.otp5)}
                                        id="-password-login"
                                        type="password"
                                        value={values.otp5}
                                        name="otp5"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder=""
                                    />
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.otp6 && errors.otp6)}
                                        id="-password-login"
                                        type="password"
                                        value={values.otp6}
                                        name="otp6"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder=""
                                    />
                                </Stack>
                                <Stack>
                                    {touched.otp1 && errors.otp1 && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.otp1}
                                        </FormHelperText>
                                    )}
                                    {touched.otp2 && errors.otp2 && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.otp2}
                                        </FormHelperText>
                                    )}
                                    {touched.otp3 && errors.otp3 && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.otp3}
                                        </FormHelperText>
                                    )}
                                    {touched.otp4 && errors.otp4 && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.otp4}
                                        </FormHelperText>
                                    )}
                                    {touched.otp5 && errors.otp5 && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.otp5}
                                        </FormHelperText>
                                    )}
                                    {touched.otp6 && errors.otp6 && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.otp6}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            {errors.submit && (
                                <Grid item xs={12}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Grid container spacing={0} sx={{ mt: 5 }}>
                                    <Grid item xs={8} sm={4}></Grid>
                                    <Grid item xs={8} sm={6.0}>
                                        <InputLabel>
                                            OTP를 분실했나요?{' '}
                                            <b>
                                                <a href="#" onClick={clearOtp}>
                                                    초기화 요청
                                                </a>
                                            </b>
                                        </InputLabel>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={0} sx={{ mt: 6 }}>
                                    <Grid item xs={8} sm={1.1}></Grid>
                                    <Grid item xs={8} sm={10.0}>
                                        <AnimateButton>
                                            <Button
                                                disableElevation
                                                disabled={isSubmitting}
                                                fullWidth
                                                size="large"
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                            >
                                                확인
                                            </Button>
                                        </AnimateButton>
                                    </Grid>
                                    <Grid item xs={8} sm={1.1}></Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
};

OtpSimpleForm.propTypes = {
    result: PropTypes.any
};

export default OtpSimpleForm;
