import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { Button, Grid, InputLabel, Stack, Typography } from '@mui/material';
import useAuthorized from 'apis/auth/auths';
import { Box } from '../../../../node_modules/@mui/material/index';
import { activeEmail, activeLogin, activeLoginDate, activeSite, activeToken } from 'store/reducers/auth';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import '../styles.scss';

const OtpForm = ({ result }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [otpNumber, setOtpNumber] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const [responseData, requestError, loading, { actionOtp }] = useAuthorized();

    // 로그인 error 처리
    useEffect(() => {
        if (requestError) {
            console.log('requestError', requestError);
            alert('error');
            setErrMsg('OTP 번호를 다시 입력해주세요');
        }
    }, [requestError]);

    // 로그인 성공
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'otplogin':
                console.log('otplogin transaction id => ', responseData);
                if (responseData.data) {
                    // Token 정보 저장
                    const authData = {
                        siteId: result.site_id,
                        email: result.email,
                        accessToken: responseData.data.access_token,
                        isLoggined: true,
                        loginDate: moment().format('YYYY.MM.DD HH:mm:ss')
                    };
                    //dispatch(setAuthData(authData));
                    dispatch(activeSite({ siteId: authData.siteId }));
                    dispatch(activeEmail({ email: authData.email }));
                    dispatch(activeToken({ accessToken: authData.accessToken }));
                    dispatch(activeLogin({ isLoggined: authData.isLoggined }));
                    dispatch(activeLoginDate({ loginDate: authData.loginDate }));
                    localStorage.setItem('authenticated', JSON.stringify(authData));
                    navigate('/dashboard');
                }
                break;
            default:
        }
    }, [responseData]);

    // 취소
    const CancelClick = () => {
        if (confirm('취소하시겠습니까?')) {
            navigate('/login');
        }
    };

    // 입력시 변경
    const handleChange = (otpNumber) => {
        setOtpNumber(otpNumber);
        console.log('otpNumber', otpNumber);
    };

    // 확인 버튼 클릭 시
    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            let data = {
                site_id: result.site_id,
                otp_no: otpNumber,
                token: result.token,
                encode_key: result.otp_info.encode_key
            };
            actionOtp(data);
        } catch (err) {
            console.log(err);
            setErrMsg('OTP 번호를 다시 입력해주세요');
        }
    };

    return (
        <form>
            <Grid container spacing={3}>
                <Stack spacing={1}>
                    <Typography variant="h5">1. OTP 앱을 설치해 주세요</Typography>
                    <InputLabel>App Store, Google Play Store에서 Google Authenticator를 다운로드 합니다.</InputLabel>
                </Stack>
                <Stack spacing={1}>
                    <Typography variant="h5">2. 바코드를 스캔하고 앱에 표시된 6자리 코드를 입력해 주세요.</Typography>
                    <InputLabel>설치된 앱에서 "+" 버튼을 누르고 QR 코드 스캔 메뉴를 통해 바코드를 스캔합니다.</InputLabel>
                </Stack>

                <Grid item xs={12}>
                    <Stack spacing={1}>
                        <Grid container spacing={0} sx={{ mt: 0 }}>
                            <Grid item xs={8} sm={5.0}>
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
                            </Grid>
                        </Grid>
                    </Stack>
                </Grid>

                {/* OTP 번호 입력란 */}
                <div className="otpAction">
                    <OtpInput
                        value={otpNumber}
                        name="otpNumber"
                        isInputNum={true}
                        onChange={handleChange}
                        numInputs={6}
                        className="otpNumber"
                    />
                    {/* 에러 메시지 - OTP 번호가 일치하지 않을 때 */}
                    <span className="errorMsg">{errMsg}</span>
                </div>

                <Grid item xs={12}>
                    <Button
                        disableElevation
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="secondary"
                        onClick={CancelClick}
                    >
                        취소
                    </Button>
                    <Button
                        disableElevation
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!(otpNumber.length === 6)}
                        onClick={onSubmit}
                    >
                        인증하기
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

OtpForm.propTypes = {
    result: PropTypes.any
};

export default OtpForm;
