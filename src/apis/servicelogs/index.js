import React from 'react';
import axiosInstanceDefault from '../axiosDefault';
import axiosInstanceDownload from 'apis/axiosDownload';
import useAxios from '../useAxios';

const LogsApi = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 검색
    const getLrcLogData = (fromDate, toDate, keyword) => {
        const encodeKeyword = encodeURIComponent(keyword);
        callApi('logList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/service/logs?fromDate=${fromDate}&toDate=${toDate}&keyword=${encodeKeyword}`,
            requestConfig: {}
        });
    };

    // 데이터 조회
    const getLrcDetailLog = (no) => {
        callApi('logDetail', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/service/logs/${no}`,
            requestConfig: {}
        });
    };

    const getLrcLogExcelExport = (fromDate, toDate, keyword) => {
        const encodeKeyword = encodeURIComponent(keyword);
        callApi('logExport', {
            axiosInstance: axiosInstanceDownload,
            method: 'get',
            url: `/mng/lrc/service/logs/excel/export?fromDate=${fromDate}&toDate=${toDate}&keyword=${encodeKeyword}`,
            requestConfig: {}
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            logLrcSearch: getLrcLogData,
            logLrcDetail: getLrcDetailLog,
            logExcelDownload: getLrcLogExcelExport
        }
    ];
};

export default LogsApi;
