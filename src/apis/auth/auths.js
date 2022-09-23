import axiosInstanceAuth from '../axiosAuth';
import useAxios from '../useAxios';
import { doEncrypt, doEncryptRSA } from 'utils/Crypt';

const useAuthorized = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    const init = () => {
        console.log('init called...');
        callApi('initLogin', {
            axiosInstance: axiosInstanceAuth,
            method: 'get',
            url: `/adm/init`,
            requestConfig: {}
        });
    };

    const rsaPublicKey = () => {
        console.log('rsaPublicKey called...');
        callApi('rsaPublicKey', {
            axiosInstance: axiosInstanceAuth,
            method: 'get',
            url: `/adm/public-key`,
            requestConfig: {}
        });
    };

    // 사용자 로그인 1차
    const siginIn = (email, password) => {
        console.log('signIn called...');
        let e = doEncryptRSA(email);
        let c = doEncryptRSA(password);
        console.log(e);
        console.log(c);
        Promise.all([e, c]).then((values) => {
            callApi('siginin', {
                axiosInstance: axiosInstanceAuth,
                method: 'post',
                url: `/adm/login`,
                requestConfig: {
                    email: values[0], //doEncrypt(email),
                    passwd: values[1], //doEncrypt(password),
                    siteId: '628cfe073d11df86c8933a89'
                }
            });
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
    const passwordUpdate = (email, current_password, password) => {
        const encryptEmail = doEncrypt(email);
        const encryptPasswd = doEncrypt(password);
        const encryptCurrentPasswd = doEncrypt(current_password);
        Promise.all([encryptEmail, encryptPasswd, encryptCurrentPasswd]).then((values) => {
            callApi('passupdate', {
                axiosInstance: axiosInstanceAuth,
                method: 'post',
                url: `/adm/password`,
                requestConfig: {
                    email: values[0],
                    passwd: values[1],
                    current_passwd: values[2],
                    siteId: '628cfe073d11df86c8933a89'
                }
            });
        });
    };
    const tempPassword = (email, validData) => {
        doEncrypt(email).then((encryptedEmail) => {
            callApi('temp-password', {
                axiosInstance: axiosInstanceAuth,
                method: 'post',
                url: `/adm/temp-password`,
                requestConfig: {
                    email: encryptedEmail,
                    valid_data: validData
                }
            });
        });
    };
    const tempPasswordInit = (email) => {
        doEncrypt(email).then((encryptedEmail) => {
            callApi('temp-password-init', {
                axiosInstance: axiosInstanceAuth,
                method: 'post',
                url: `/adm/temp-password-init`,
                requestConfig: {
                    email: encryptedEmail
                }
            });
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
            actionTempPassword: tempPassword,
            actionTempPasswordInit: tempPasswordInit,
            actionInit: init,
            actionRsaPublicKey: rsaPublicKey
        }
    ];
};
export default useAuthorized;
