import React from 'react';
import axiosInstanceDefault from '../axiosDefault';
import useAxios from '../useAxios';

const AccountApis = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 검색
    const getSearchData = (is_use, keyword) => {
        if (is_use === null) is_use = '';
        const encodeKeyword = encodeURIComponent(keyword);
        callApi('getList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/accounts?searchText=${encodeKeyword}&isUse=${is_use}`,
            requestConfig: {}
        });
    };

    // 데이터 조회
    const getListData = (is_use) => {
        callApi('getList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/accounts?isUse=${is_use}`,
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
    const insertData = (data) => {
        callApi('insertData', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: '/account',
            requestConfig: data
        });
    };

    // 통합관리 - 계정 데이터 상세 조회
    const getDetailData = (id) => {
        callApi('getData', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/accountmng/${id}`,
            requestConfig: {}
        });
    };

    // 데이터 수정
    const updateMng = (id, data) => {
        callApi('updateData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/accountmng/${id}`,
            requestConfig: data
        });
    };

    // 통합관리 > 계정 등록
    const insertMngAccount = (data) => {
        callApi('insertData', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: '/accountmng',
            requestConfig: data
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            accountSearch: getSearchData,
            accountList: getListData,
            accountDelete: getDeleteData,
            accountInsert: insertData,
            accountDetail: getDetailData,
            accountMngUpdate: updateMng,
            accountMngInsert: insertMngAccount
        }
    ];
};

export default AccountApis;
