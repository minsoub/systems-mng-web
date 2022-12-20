import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import useAuthorized from 'apis/auth/auths';
import { Formik } from 'formik';
import * as Yup from 'yup';
import base64 from 'base-64';

const ResetPasswordForm = () => {
    const navigate = useNavigate();
    const [
        responseData,
        requestError,
        loading,
        { actionTempPassword, actionTempPasswordInit, actionInit, actionRsaPublicKey }
    ] = useAuthorized();
    const [title, setTitle] = useState();

    const { isLoggined, siteId, accessToken } = useSelector((state) => state.auth);
    const { paramId } = useParams();

    useEffect(() => {
        if (paramId) {
            setTitle('임시 비밀번호 발급');
        } else {
            setTitle('본인 확인');
        }
        // InitData가 없다면.
        if (!localStorage.hasOwnProperty('InitData')) {
            actionInit();
            actionRsaPublicKey();
        }
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

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            console.log('>> requestError <<');
            console.log(requestError);
            alert('임시비밀번호 발급에 오류가 발생하였습니다.');
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
            case 'temp-password':
                console.log(responseData);
                if (responseData.data) {
                    //setDataGridRows(responseData.data);
                    // email, otpInfo:encode_key, url
                    // site_id, token
                    console.log('success => ');
                    console.log(responseData.data);
                    alert('임시 비밀번호가 발송되었습니다. 메일을 확인해 주세요.');
                    navigate('/login');
                }
                break;
            case 'temp-password-init':
                console.log(responseData);
                if (responseData.data) {
                    //setDataGridRows(responseData.data);
                    // email, otpInfo:encode_key, url
                    // site_id, token
                    console.log('success => ');
                    console.log(responseData.data);
                    alert('본인 확인을 위한 메일이 발송되었습니다. 메일을 확인해 주세요.');
                    navigate('/login');
                }
                break;
        }
    }, [responseData]);

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string()
                        .email('올바른 이메일 주소를 입력해 주세요.')
                        .max(255)
                        .required('올바른 이메일 주소를 입력해 주세요.')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        setStatus({ success: false });
                        setSubmitting(true);
                        console.log(values.email);
                        if (paramId) {
                            // 임시 비밀번호 발급 요청
                            actionTempPassword(values.email, paramId);
                        } else {
                            actionTempPasswordInit(values.email); // 본인 확인 요청
                        }
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
                                    {title}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default ResetPasswordForm;
