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
import OtpQrCode from 'components/AuthLogin/OtpQrCode';

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
                    if (authData.siteId === '62a15f4ae4129b518b133128') {
                        // 투자보호
                        navigate('/cpcdashboard');
                    } else {
                        navigate('/lrcdashboard');
                    }
                }
                break;
            default:
        }
    }, [responseData]);

    // 취소
    const CancelClick = () => {
        e.preventDefault();
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

    const keyPress = (e) => {
        console.log(e);
        console.log(otpNumber.length);
        if (e.key === 'Enter' && otpNumber.length === 6) {
            onSubmit();
        }
    };

    return (
        <Grid container spacing={3}>
            <OtpQrCode />

            <div className="qrcodeBox">
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
            </div>

            {/* OTP 번호 입력란 */}
            <div className="otpAction">
                <OtpInput
                    value={otpNumber}
                    name="otpNumber"
                    isInputNum={true}
                    onChange={handleChange}
                    numInputs={6}
                    className="otpNumber"
                    onKeyPress={keyPress}
                />
                {/* 에러 메시지 - OTP 번호가 일치하지 않을 때 */}
                <span className="errorMsg">{errMsg}</span>
            </div>

            <Grid item xs={12}>
                <Button disableElevation fullWidth size="large" type="submit" variant="contained" color="secondary" onClick={CancelClick}>
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
    );
};

OtpForm.propTypes = {
    result: PropTypes.any
};

export default OtpForm;
