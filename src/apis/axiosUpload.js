import axios, { AxiosInstance } from 'axios';

const siteId = process.env.REACT_APP_DEFAULT_SITE_ID ? process.env.REACT_APP_DEFAULT_SITE_ID : '';

const axiosInstanceUpload = axios.create({
    baseURL: process.env.REACT_APP_DEFAULT_API_URL, // 기본 서버 주소 입력
    timeout: 30000,
    headers: {
        'Content-Type': 'multipart/form-data',
        site_id: siteId
    }
});

export default axiosInstanceUpload;
