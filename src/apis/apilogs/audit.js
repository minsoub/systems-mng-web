import React from 'react';
import axiosInstanceDefault from '../axiosDefault';
import axiosInstanceDownload from 'apis/axiosDownload';
import useAxios from '../useAxios';

const AuditLogsApi = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 검색
    const getAuditLogData = (fromDate, toDate, keyword) => {
        const encodeKeyword = encodeURIComponent(keyword);
        callApi('logList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/audit/logs?fromDate=${fromDate}&toDate=${toDate}&keyword=${encodeKeyword}`,
            requestConfig: {}
        });
    };

    // 데이터 조회
    const getAuditDetailLog = (no) => {
        callApi('logDetail', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/audit/logs/${no}`,
            requestConfig: {}
        });
    };

    const getAuditLogExcelExport = (fromDate, toDate, keyword, reason) => {
        const encodeKeyword = encodeURIComponent(keyword);
        const encodeReason = encodeURIComponent(reason);
        callApi('logExport', {
            axiosInstance: axiosInstanceDownload,
            method: 'get',
            url: `/audit/logs/excel/export?fromDate=${fromDate}&toDate=${toDate}&keyword=${encodeKeyword}&reason=${encodeReason}`,
            requestConfig: {}
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            auditLogSearch: getAuditLogData,
            auditLogDetail: getAuditDetailLog,
            auditLogExcelDownload: getAuditLogExcelExport
        }
    ];
};

export default AuditLogsApi;
