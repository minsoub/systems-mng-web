import React from 'react';
import axiosInstanceDefault from '../axiosDefault';
import useAxios from '../useAxios';

const ProgramApi = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 검색
    const getSearchData = (site_id, is_use) => {
        //const encodeKeyword = encodeURIComponent(keyword);
        callApi('siteList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/site/${site_id}/programs?isUse=${is_use}`,
            requestConfig: {}
        });
    };
    // 검색어를 통한 데이터 검색
    const getTextSearchData = (site_id, is_use, keyword) => {
        const encodeKeyword = encodeURIComponent(keyword);
        callApi('programList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/site/${site_id}/programs?isUse=${is_use}&searchText=${encodeKeyword}`,
            requestConfig: {}
        });
    };

    // 데이터 조회
    const getListData = (is_use) => {
        callApi('siteList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/sites?isUse=${is_use}`,
            requestConfig: {}
        });
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
    const insertProgram = (data) => {
        callApi('insertData', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: `/site/${data.site_id}/program`,
            requestConfig: data
        });
    };

    // 데이터 상세 조회
    const getDetailData = (id, site_id) => {
        callApi('detailData', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/site/${site_id}/program/${id}`,
            requestConfig: {}
        });
    };

    // 데이터 수정
    const updateProgramData = (data) => {
        callApi('updateData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/site/${data.site_id}/program/${data.id}`,
            requestConfig: data
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            programSearch: getSearchData,
            programTextSearch: getTextSearchData,
            programList: getListData,
            programDelete: getDelete,
            programInsert: insertProgram,
            programDetail: getDetailData,
            programUpdate: updateProgramData
        }
    ];
};

export default ProgramApi;
