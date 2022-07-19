import axios from 'axios';

const siteId = process.env.REACT_APP_DEFAULT_SITE_ID ? process.env.REACT_APP_DEFAULT_SITE_ID : '';

const axiosInstanceAuth = axios.create({
    baseURL: process.env.REACT_APP_DEFAULT_AUTH_URL, // 기본 서버 주소 입력
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        site_id: siteId
    }
});

export default axiosInstanceAuth;
