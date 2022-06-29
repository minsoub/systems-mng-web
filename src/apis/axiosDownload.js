import axios, { AxiosInstance } from 'axios';

const siteId = process.env.REACT_APP_DEFAULT_SITE_ID ? process.env.REACT_APP_DEFAULT_SITE_ID : '';

const axiosInstanceDownload = axios.create({
    baseURL: process.env.REACT_APP_DEFAULT_API_URL, // 기본 서버 주소 입력
    timeout: 30000,
    headers: {
        'Content-Type': 'application/octet-stream',
        site_id: siteId
    },
    responseType: 'blob'
});

export default axiosInstanceDownload;
