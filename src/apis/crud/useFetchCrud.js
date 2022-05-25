import React from 'react';
import axiosInstanceDefault from '../axiosDefault';
import useAxios from '../useAxios';

const useFetchCrud = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 검색
    const getSearchData = (keyword) => {
        const encodeKeyword = encodeURIComponent(keyword);
        callApi('getList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/faq/content/search?keyword=${encodeKeyword}`,
            requestConfig: {}
        });
    };

    // 데이터 조회
    const getListData = () => {
        callApi('getList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: '/faq/content',
            requestConfig: {}
        });
    };

    // 선택된 그리드 데이터 삭제
    const getDeleteData = (selectedRows) => {
        if (selectedRows && selectedRows.length > 0) {
            let paramIds = selectedRows.join('&ids=');
            callApi('deleteData', {
                axiosInstance: axiosInstanceDefault,
                method: 'delete',
                url: `/faq/content?ids=${paramIds}`,
                requestConfig: {}
            });
        }
    };

    // 데이터 등록
    const insertCrudData = (data) => {
        callApi('insertData', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: '/faq/content',
            requestConfig: data
        });
    };

    // 데이터 상세 조회
    const getCrudData = (id) => {
        callApi('getData', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/faq/content/${id}`,
            requestConfig: {}
        });
    };

    // 데이터 수정
    const updateCrudData = (data) => {
        callApi('updateData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: '/faq/content',
            requestConfig: data
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            actionSearch: getSearchData,
            actionList: getListData,
            actionDelete: getDeleteData,
            actionInsert: insertCrudData,
            actionDetail: getCrudData,
            actionUpdate: updateCrudData
        }
    ];
};

export default useFetchCrud;
