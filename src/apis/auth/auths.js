import axiosInstanceAuth from '../axiosAuth';
import useAxios from '../useAxios';
import { doEncrypt } from 'utils/Crypt';

const useAuthorized = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 사용자 로그인 1차
    const siginIn = (email, password) => {
        console.log('signIn called...');
        let e = doEncrypt(email);
        let c = doEncrypt(password);
        console.log(e);
        console.log(c);
        callApi('siginin', {
            axiosInstance: axiosInstanceAuth,
            method: 'post',
            url: `/adm/login`,
            requestConfig: {
                email: e, //doEncrypt(email),
                passwd: c, //doEncrypt(password),
                siteId: '628cfe073d11df86c8933a89'
            }
        });
    };
    // 사용자 OTP 로그인 2차
    const optLogin = (data) => {
        console.log('otpLogin called...');
        console.log(data);
        callApi('otplogin', {
            axiosInstance: axiosInstanceAuth,
            method: 'post',
            url: `/adm/otp`,
            requestConfig: data
        });
    };
    // 사용자 OTP 초기화 요청
    const otpClear = (data) => {
        console.log('otpClear called...');
        console.log(data);
        callApi('otpClear', {
            axiosInstance: axiosInstanceAuth,
            method: 'post',
            url: `/adm/otp/clear`,
            requestConfig: data
        });
    };
    // 사용자 패스워드 수정
    const passwordUpdate = (email, password) => {
        callApi('passupdate', {
            axiosInstance: axiosInstanceAuth,
            method: 'post',
            url: `/adm/password`,
            requestConfig: {
                email: doEncrypt(email),
                passwd: doEncrypt(password),
                siteId: '628cfe073d11df86c8933a89'
            }
        });
    };
    const tempPassword = (email) => {
        callApi('temp-password', {
            axiosInstance: axiosInstanceAuth,
            method: 'post',
            url: `/adm/temp-password`,
            requestConfig: {
                email: doEncrypt(email)
            }
        });
    };
    return [
        responseData,
        requestError,
        loading,
        {
            actionLogin: siginIn,
            actionOtp: optLogin,
            actionClear: otpClear,
            actionPasswordUpdate: passwordUpdate,
            actionTempPassword: tempPassword
        }
    ];
};
export default useAuthorized;
