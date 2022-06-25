import React from 'react';
import axiosInstanceDefault from '../../axiosDefault';
import useAxios from '../../useAxios';

const LineApis = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 조회
    const getListData = (lineType) => {
        callApi('getList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/statusmanagment/line-code?type=${lineType}`,
            requestConfig: {}
        });
    };

    // LRC - 등록
    const insertData = (data) => {
        callApi('insertData', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: '/mng/lrc/statusmanagment/line-code',
            requestConfig: data
        });
    };
    // 수정
    const updateData = (data) => {
        callApi('updateData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/mng/lrc/statusmanagment/line-code/${data.id}`,
            requestConfig: data
        });
    };

    // 수정
    const deleteData = (data) => {
        callApi('deleteData', {
            axiosInstance: axiosInstanceDefault,
            method: 'delete',
            url: `/mng/lrc/statusmanagment/line-code/${data.id}`,
            requestConfig: {}
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            lineSearch: getListData,
            lineInsert: insertData,
            lineUpdate: updateData,
            lineDelete: deleteData
        }
    ];
};

export default LineApis;
