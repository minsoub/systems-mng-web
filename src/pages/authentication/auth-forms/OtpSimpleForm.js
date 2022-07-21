import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import OtpInput from 'react-otp-input';
import { Button, Grid, InputLabel, Stack } from '@mui/material';

import useAuthorized from 'apis/auth/auths';
import { activeSite, activeEmail, activeToken, activeLogin, activeLoginDate } from 'store/reducers/auth';
import '../styles.module.scss';
// ============================|| FIREBASE - LOGIN ||============================ //

const OtpSimpleForm = ({ result }) => {
    const [responseData, requestError, loading, { actionOtp, actionClear }] = useAuthorized();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [otpNumber, setOtpNumber] = useState('');
    const [errMsg, setErrMsg] = useState('');

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            console.log('>> requestError <<');
            console.log(requestError);
            if (requestError.message === 'INVALID_OTP_NUMER') {
                alert('OTP Number가 잘 못되었습니다!!!');
                return;
            }
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
                    // 임시 패스워드 접근
                    if (responseData.data.status === 'INIT_COMPLETE') {
                        console.log('임시 패스워드로 인한 변경 작업 화면 호출');
                        navigate('/tmppassword', { state: responseData.data });
                        return;
                    }
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
                    // alert("로그인을 완료하였습니다!!!")
                    if (authData.siteId === '62a15f4ae4129b518b133128') {
                        // 투자보호
                        navigate('/cpc/dashboard');
                    } else {
                        navigate('/lrc/dashboard');
                    }
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

    // const CancelClick = () => {
    //     if (confirm('취소하시겠습니까?')) {
    //         navigate('/login');
    //     }
    // };
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

    // 입력시 변경
    const handleChange = (otpNumber) => {
        setOtpNumber(otpNumber);
        console.log('otpNumber', otpNumber);
    };

    // 확인 버튼 클릭 시
    const onSubmit = async (e) => {
        e.preventDefault();

        // 로그인 성공시
        try {
            let data = {
                site_id: result.site_id,
                otp_no: otpNumber,
                token: result.token,
                encode_key: result.otp_info.encode_key,
                status: result.status
            };
            actionOtp(data);
            // 로그인 실패시
        } catch (err) {
            console.log('err', err);
            setErrMsg('OTP 번호를 다시 입력해주세요');
        }
    };

    return (
        <>
            <form>
                <Grid item xs={12}>
                    <Stack spacing={1}>
                        <InputLabel>Google Authenticator에 표시된 6자리 코드를 입력해 주세요</InputLabel>
                    </Stack>
                </Grid>

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
                    <div className="label--center">
                        <span>OTP를 분실했나요?</span>
                        <a href="#" onClick={clearOtp}>
                            초기화 요청
                        </a>
                    </div>

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
                        확인
                    </Button>
                </Grid>
            </form>
        </>
    );
};

OtpSimpleForm.propTypes = {
    result: PropTypes.any
};

export default OtpSimpleForm;
