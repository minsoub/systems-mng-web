import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {
    Button,
    FormHelperText,
    Grid,
    InputLabel,
    OutlinedInput,
    Stack
} from '@mui/material';
import useAuthorized from 'apis/auth/auths';
import {Formik} from "formik";
import * as Yup from "yup";

const ResetPasswordForm = () => {
    const navigate = useNavigate();
    const [responseData, requestError, loading, {actionTempPassword}] = useAuthorized();

    const {isLoggined, siteId, accessToken} = useSelector((state) => state.auth);

    useEffect(() => {
        if (localStorage.hasOwnProperty('authenticated') && isLoggined === true && siteId && accessToken) {
            if (siteId === '62a15f4ae4129b518b133128') {
                // 투자보호
                navigate('/cpc/dashboard');
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
            if (requestError.message === 'INVALID_USER') {
                alert('가입되지 않은 사용자 입니다.');
            } else {
                alert(requestError.message);
            }
        }
    }, [requestError]);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        console.log(responseData.transactionId);
        switch (responseData.transactionId) {
            case 'temp-password':
                console.log(responseData);
                if (responseData.data) {
                    //setDataGridRows(responseData.data);
                    // email, otpInfo:encode_key, url
                    // site_id, token
                    console.log('success => ');
                    console.log(responseData.data);
                    alert("임시비밀번호가 메일로 발송되었습니다. 메일을 확인해 주세요.")
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
                    email: Yup.string().email('올바른 이메일 주소를 입력해 주세요.').max(255).required('올바른 이메일 주소를 입력해 주세요.')
                })}
                onSubmit={async (values, {setErrors, setStatus, setSubmitting}) => {
                    try {
                        setStatus({success: false});
                        setSubmitting(true);
                        console.log(values.email);
                        actionTempPassword(values.email);
                    } catch (err) {
                        console.log(err);
                        setStatus({success: false});
                        setErrors({submit: err.message});
                        setSubmitting(false);
                    }
                }}
            >
                {({errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values}) => (
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
                                    임시 비밀번호 발급
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