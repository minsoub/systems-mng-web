import React from 'react';
import axiosInstanceDefault from '../axiosDefault';
import useAxios from '../useAxios';

const MenuMngApi = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 검색
    const getSearchData = (site_id, is_use) => {
        //const encodeKeyword = encodeURIComponent(keyword);
        callApi('menuList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/site/${site_id}/menu-list?isUse=${is_use}`,
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

    const getDelete = (id, data) => {
        callApi('deleteData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/site/${id}`,
            requestConfig: data
        });
    };

    // 데이터 등록
    const insertMenu = (data) => {
        callApi('insertData', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: `/site/${data.site_id}/menu`,
            requestConfig: data
        });
    };

    // 데이터 상세 조회
    const getDetailData = (id, site_id) => {
        callApi('detailData', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/site/${site_id}/menu/${id}`,
            requestConfig: {}
        });
    };

    // 데이터 수정
    const updateProgramData = (data) => {
        callApi('updateData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/site/${data.site_id}/menu/${data.id}`,
            requestConfig: data
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            menumngSearch: getSearchData,
            menumngDelete: getDelete,
            menumngInsert: insertMenu,
            menumngDetail: getDetailData,
            menumngUpdate: updateProgramData
        }
    ];
};

export default MenuMngApi;
