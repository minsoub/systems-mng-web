import React from 'react';
import axiosInstanceDefault from '../../axiosDefault';
import useAxios from '../../useAxios';

const StatusApis = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 조회
    const getListData = () => {
        callApi('getList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/statusmanagment/status-code/tree`,
            requestConfig: {}
        });
    };

    // LRC - 상태 값 등록
    const insertData = (data) => {
        callApi('insertData', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: '/mng/lrc/statusmanagment/status-code',
            requestConfig: data
        });
    };
    // 통합시스템 관리 - 계정 수정
    const updateData = (data) => {
        callApi('updateData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: '/mng/lrc/statusmanagment/status-code',
            requestConfig: data
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            statusSearch: getListData,
            statusInsert: insertData,
            statusUpdate: updateData
        }
    ];
};

export default StatusApis;
