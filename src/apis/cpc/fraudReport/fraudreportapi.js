import React from 'react';
import axiosInstanceDefault from '../../axiosDefault';
import axiosInstanceDownload from '../../axiosDownload';
import useAxios from '../../useAxios';

const FraudReportApis = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 사기 신고 목록 조회
    const getFraudReports = (request) => {
        const start_date = request.start_date;
        const end_date = request.end_date;
        const staus = request.staus == undefined ? '' : encodeURIComponent(request.staus);
        const keyword = request.keyword == undefined ? '' : encodeURIComponent(request.keyword);
        callApi('getFraudReports', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/cpc/fraud-report?start_date=${start_date}&end_date=${end_date}&staus=${staus}&query=${keyword}`,
            requestConfig: {}
        });
    };

    // 사기 신고 정보 조회
    const getFraudReport = (id) => {
        callApi('getFraudReport', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/cpc/fraud-report/${id}`,
            requestConfig: {}
        });
    };

    // 사기 신고 답변
    const updateFraudReport = (data) => {
        callApi('updateFraudReport', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/mng/cpc/fraud-report/${data.id}`,
            requestConfig: data
        });
    };

    // 엑셀 다운로드
    const getExcelDownload = (request) => {
        const start_date = request.start_date;
        const end_date = request.end_date;
        const staus = request.staus == undefined ? '' : encodeURIComponent(request.staus);
        const keyword = request.keyword == undefined ? '' : encodeURIComponent(request.keyword);
        callApi('getExcelDownload', {
            axiosInstance: axiosInstanceDownload,
            method: 'get',
            url: `/mng/cpc/fraud-report/excel-download?start_date=${start_date}&end_date=${end_date}&staus=${staus}&query=${keyword}`,
            requestConfig: {}
        });
    };

    // 첨부 파일 다운로드
    const getFileDownload = (fileKey) => {
        callApi('getExcelDownload', {
            axiosInstance: axiosInstanceDownload,
            method: 'get',
            url: `/mng/cpc/fraud-report/download/${fileKey}`,
            requestConfig: {}
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            searchFraudReportList: getFraudReports,
            searchFraudReport: getFraudReport,
            updateFraudReport: updateFraudReport,
            getExcelDownload: getExcelDownload,
            getFileDownload: getFileDownload
        }
    ];
};

export default FraudReportApis;
