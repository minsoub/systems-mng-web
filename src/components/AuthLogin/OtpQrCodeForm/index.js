import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { Button, Grid } from '@mui/material';
import useAuthorized from 'apis/auth/auths';
import { Box } from '@mui/material';
import { activeEmail, activeLogin, activeLoginDate, activeSite, activeToken, activeRefreshToken } from 'store/reducers/auth';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import OtpQrCode from '../OtpQrCodeText';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const OtpQrCodeForm = ({ result }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [otpNumber, setOtpNumber] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const [responseData, requestError, loading, { actionOtp }] = useAuthorized();

    // 로그인 error 처리
    useEffect(() => {
        if (requestError) {
            console.log('requestError', requestError);
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
                    // 임시 패스워드 접근
                    if (responseData.data.status === 'INIT_COMPLETE' || responseData.data.status === 'CHANGE_PASSWORD' ) {
                        console.log('임시 패스워드로 인한 변경 작업 화면 호출');
                        navigate('/tmppassword', { state: responseData.data });
                        return;
                    }
                    // Token 정보 저장
                    const authData = {
                        siteId: result.site_id,
                        email: result.email,
                        accessToken: responseData.data.access_token,
                        refreshToken: responseData.data.refresh_token,
                        isLoggined: true,
                        loginDate: moment().format('YYYY.MM.DD HH:mm:ss')
                    };
                    //dispatch(setAuthData(authData));
                    dispatch(activeSite({ siteId: authData.siteId }));
                    dispatch(activeEmail({ email: authData.email }));
                    dispatch(activeToken({ accessToken: authData.accessToken }));
                    dispatch(activeRefreshToken({ refreshToken: authData.refreshToken }));
                    dispatch(activeLogin({ isLoggined: authData.isLoggined }));
                    dispatch(activeLoginDate({ loginDate: authData.loginDate }));
                    localStorage.setItem('authenticated', JSON.stringify(authData));
                    if (authData.siteId === '62a15f4ae4129b518b133128') {
                        // 투자보호
                        navigate('/cpc/dashboard');
                    } else {
                        navigate('/lrc/dashboard');
                    }
                }
                break;
            default:
        }
    }, [responseData]);

    // 취소
    const CancelClick = (e) => {
        e.preventDefault();

        if (confirm('취소하시겠습니까?')) {
            navigate('/login');
        }
    };

    // 입력시 변경
    const handleChange = (otpNumber) => {
        setOtpNumber(otpNumber);
    };

    // 확인 버튼 클릭 시
    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            let data = {
                site_id: result.site_id,
                otp_no: otpNumber,
                token: result.token,
                encode_key: result.otp_info.encode_key,
                status: result.status
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

            <div className={cx('qrcodeBox')}>
                <Box component="img" alt="QR Code" src={result.otp_info.url} />
            </div>

            {/* OTP 번호 입력란 */}
            <div className={cx('otpAction')}>
                <OtpInput
                    value={otpNumber}
                    name="otpNumber"
                    isInputNum={true}
                    onChange={handleChange}
                    numInputs={6}
                    className={cx('otpNumber')}
                    onKeyPress={keyPress}
                />
                {/* 에러 메시지 - OTP 번호가 일치하지 않을 때 */}
                <span className={cx('errorMsg')}>{errMsg}</span>
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
                    className={cx('blank')}
                >
                    취소
                </Button>
                <Button
                    disableElevation
                    fullWidth
                    size="large"
                    type="supUpdatePasswordForm.jsbmit"
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

OtpQrCodeForm.propTypes = {
    result: PropTypes.any
};

export default OtpQrCodeForm;
