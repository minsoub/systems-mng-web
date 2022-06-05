import React from 'react';
import axiosInstanceAuth from '../axiosAuth';
import useAxios from '../useAxios';

const useAuthorized = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 사용자 로그인 1차
    const siginIn = (email, password) => {
        console.log('signIn called...');
        callApi('siginin', {
            axiosInstance: axiosInstanceAuth,
            method: 'post',
            url: `/adm/login`,
            requestConfig: {
                email: email,
                passwd: password,
                site_id: '628cfe073d11df86c8933a89'
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
    return [
        responseData,
        requestError,
        loading,
        {
            actionLogin: siginIn,
            actionOtp: optLogin
        }
    ];
};
export default useAuthorized;
