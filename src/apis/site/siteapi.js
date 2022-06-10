import React from 'react';
import axiosInstanceDefault from '../axiosDefault';
import useAxios from '../useAxios';

const SiteApi = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 검색
    const getSearchData = (keyword) => {
        const encodeKeyword = encodeURIComponent(keyword);
        callApi('getList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/sites?searchText=${encodeKeyword}`,
            requestConfig: {}
        });
    };

    // 데이터 조회
    const getListData = () => {
        callApi('getList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: '/sites',
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
    const insertStite = (data) => {
        callApi('insertData', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: '/site',
            requestConfig: data
        });
    };

    // 데이터 상세 조회
    const getDetailData = (id) => {
        callApi('detailData', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/site/${id}`,
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
            actionInsert: insertStite,
            actionDetail: getDetailData,
            actionUpdate: updateCrudData
        }
    ];
};

export default SiteApi;
