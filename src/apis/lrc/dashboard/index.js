import React from 'react';
import axiosInstanceDefault from 'apis/axiosDefault';
import axiosInstanceUpload from 'apis/axiosUpload';
import axiosInstanceDownload from 'apis/axiosDownload';
import useAxios from '../../useAxios';

const DashboardApi = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 조회
    const getListData = (request) => {
        const { start_date, end_date } = request;
        callApi('getList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url:
                start_date === undefined
                    ? `/mng/lrc/dashboard/status-code`
                    : `/mng/lrc/dashboard/status-code?fromDate=${start_date}&toDate=${end_date}`,
            requestConfig: {}
        });
    };

    // 재단정보
    // 재단정보 조회
    const getLineData = () => {
        callApi('getLineList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/statusmanagment/line-code/tree`,
            requestConfig: {}
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            foundationSearch: getListData,
            lineSearch: getLineData
        }
    ];
};

export default DashboardApi;
