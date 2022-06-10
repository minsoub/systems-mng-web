import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthData } from '../../../store/reducers/auth';

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
import { Box } from '../../../../node_modules/@mui/material/index';

// ============================|| FIREBASE - LOGIN ||============================ //

const OtpForm = ({ result }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [checked, setChecked] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [responseData, requestError, loading, { actionOtp }] = useAuthorized();

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
                        isLoggined: true
                    };
                    dispatch(setAuthData(authData));
                    localStorage.setItem('authenticated', JSON.stringify(authData));
                    // alert("로그인을 완료하였습니다!!!")
                    navigate('/dashboard');
                }
                break;
            default:
        }
    }, [responseData]);

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
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel>1. OTP 앱을 설치해 주세요</InputLabel>
                                    <InputLabel>App Store, Google Play Store에서 Google Authenticator를 다운로드 합니다.</InputLabel>
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel>2. 바코드를 스캔하고 앱에 표시된 6자리 코드를 입력해 주세요.</InputLabel>
                                    <InputLabel>설치된 앱에서 "+" 버튼을 누르고 QR 코드 스캔 메뉴를 통해 바코드를 스캔합니다.</InputLabel>
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <Box
                                        component="img"
                                        sx={{
                                            height: 300,
                                            width: 320,
                                            maxHeight: { xs: 300, md: 320 },
                                            maxWidth: { xs: 300, md: 320 }
                                        }}
                                        alt="QR Code"
                                        src={result.otp_info.url}
                                    />
                                </Stack>
                            </Grid>
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
                                        인증하기
                                    </Button>
                                </AnimateButton>
                            </Grid>
                            <Grid item xs={12}>
                                {/* <Divider>
                                    <Typography variant="caption"> Login with</Typography>
                                </Divider> */}
                                <Divider>
                                    [<a href="/login">처음으로</a>]
                                </Divider>
                            </Grid>
                            {/* <Grid item xs={12}>
                                <FirebaseSocial />
                            </Grid> */}
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
};

OtpForm.propTypes = {
    result: PropTypes.any
};

export default OtpForm;
