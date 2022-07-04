import React from 'react';
import axiosInstanceDefault from '../../axiosDefault';
import axiosInstanceDownload from '../../axiosDownload';
import useAxios from '../../useAxios';

const LegalCounselingApis = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 법률 상담 신청 목록 조회
    const getLegalCounselings = (request) => {
        const start_date = request.start_date;
        const end_date = request.end_date;
        const staus = request.staus == undefined ? '' : encodeURIComponent(request.staus);
        const keyword = request.keyword == undefined ? '' : encodeURIComponent(request.keyword);
        callApi('getLegalCounselings', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/cpc/legal-counseling?start_date=${start_date}&end_date=${end_date}&staus=${staus}&query=${keyword}`,
            requestConfig: {}
        });
    };

    // 법률 상담 신청 정보 조회
    const getLegalCounseling = (id) => {
        callApi('getLegalCounseling', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/cpc/legal-counseling/${id}`,
            requestConfig: {}
        });
    };

    // 법률 상담 신청 답변
    const updateLegalCounseling = (data) => {
        callApi('updateLegalCounseling', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/mng/cpc/legal-counseling/${data.id}`,
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
            url: `/mng/cpc/legal-counseling/excel-download?start_date=${start_date}&end_date=${end_date}&staus=${staus}&query=${keyword}`,
            requestConfig: {}
        });
    };

    // 첨부 파일 다운로드
    const getFileDownload = (fileKey) => {
        callApi('getFileDownload', {
            axiosInstance: axiosInstanceDownload,
            method: 'get',
            url: `/mng/cpc/legal-counseling/download/${fileKey}`,
            requestConfig: {}
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            searchLegalCounselingList: getLegalCounselings,
            searchLegalCounseling: getLegalCounseling,
            updateLegalCounseling: updateLegalCounseling,
            getExcelDownload: getExcelDownload,
            getFileDownload: getFileDownload
        }
    ];
};

export default LegalCounselingApis;
