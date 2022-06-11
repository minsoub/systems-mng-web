import axios, { AxiosInstance } from 'axios';

const axiosInstanceAuth = axios.create({
    baseURL: process.env.REACT_APP_AUTH_URL, // 기본 서버 주소 입력
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
});

export default axiosInstanceAuth;
