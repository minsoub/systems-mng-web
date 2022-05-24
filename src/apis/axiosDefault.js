import axios, { AxiosInstance } from 'axios';

const axiosInstanceDefault = axios.create({
    baseURL: process.env.REACT_APP_DEFAULT_API_URL, // 기본 서버 주소 입력
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
});

export default axiosInstanceDefault;
