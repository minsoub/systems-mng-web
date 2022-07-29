import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { Button, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// assets
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import jwt from 'jsonwebtoken';
import useAuthorized from 'apis/auth/auths';

// ============================|| FIREBASE - LOGIN ||============================ //

const TmpUpdatePasswordForm = ({ result }) => {
    const navigate = useNavigate();

    const [checked, setChecked] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [responseData, requestError, loading, { actionPasswordUpdate }] = useAuthorized();

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
        console.log(responseData.transactionId);
        switch (responseData.transactionId) {
            case 'passupdate':
                console.log(responseData);
                if (responseData.data) {
                    alert('패스워드가 변경되었습니다. 변경된 패스워드로 재로그인 하시기 바립니다!!!');
                    //setDataGridRows(responseData.data);
                    // email, otpInfo:encode_key, url
                    // site_id, token
                    console.log('success => ');
                    console.log(responseData.data);
                    navigate('/login');
                }
                break;
            default:
        }
    }, [responseData]);

    return (
        <>
            <Formik
                initialValues={{
                    password: '',
                    password1: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    password: Yup.string().max(255).required('Password is required'),
                    password1: Yup.string().max(255).required('Password is required')
                })}
                // onSubmit={(values) => {
                //     console.log(values);
                //     actionLogin(value.email, value.password);
                // }}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        if (values.password !== values.password1) {
                            alert('패스워드가 다릅니다!!!');
                            return;
                        }
                        setStatus({ success: false });
                        setSubmitting(true);
                        //console.log(values);
                        //console.log(result);
                        let tokenData = jwt.decode(result.access_token);
                        console.log(tokenData);
                        actionPasswordUpdate(tokenData.iss, values.password);
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
                        <Grid item xs={12}>
                            <Stack spacing={2}>
                                <InputLabel>{result.status === 'CHANGE_PASSWORD' ? '비밀번호 변경 후 90일이 경과되었습니다.' : '임시 비밀번호로 접속하였습니다.'}</InputLabel>
                            </Stack>
                            <Grid item xs={12}>
                                <Stack spacing={1}>&nbsp;</Stack>
                            </Grid>
                            <Stack spacing={2}>
                                <InputLabel>개인정보보호를 위하여 비밀번호 변경 후 사용이 가능합니다.</InputLabel>
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack spacing={1}>&nbsp;</Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="password-login">New Password</InputLabel>
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
                                    placeholder="Enter password"
                                />
                                {touched.password && errors.password && (
                                    <FormHelperText error id="standard-weight-helper-text-password-login">
                                        {errors.password}
                                    </FormHelperText>
                                )}
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack spacing={1}>&nbsp;</Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="password-login">Password 확인</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    error={Boolean(touched.password1 && errors.password1)}
                                    id="-password-login"
                                    type={showPassword ? 'text' : 'password'}
                                    value={values.password1}
                                    name="password1"
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
                                    placeholder="Enter password"
                                />
                                {touched.password1 && errors.password1 && (
                                    <FormHelperText error id="standard-weight-helper-text-password-login">
                                        {errors.password1}
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
                            <Stack spacing={1}>&nbsp;</Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack spacing={1}>&nbsp;</Stack>
                        </Grid>
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
                                패스워드 변경
                            </Button>
                        </Grid>
                        <Grid item xs={12}></Grid>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default TmpUpdatePasswordForm;
