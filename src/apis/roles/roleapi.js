import React from 'react';
import axiosInstanceDefault from '../axiosDefault';
import useAxios from '../useAxios';

const RoleApi = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 검색
    const getSearchData = (is_use, site_id) => {
        //const encodeKeyword = encodeURIComponent(keyword);
        callApi('roleList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/roles?isUse=${is_use}&siteId=${site_id}`,
            requestConfig: {}
        });
    };

    // 데이터 조회
    const getListData = (is_use) => {
        callApi('roleList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/roles?isUse=${is_use}`,
            requestConfig: {}
        });
    };

    // 데이터 조회
    const getListComboData = (is_use, type, site_id) => {
        callApi('roleList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/roles?siteId=${site_id}&isUse=${is_use}&type=${type}`,
            requestConfig: {}
        });
    };

    const getDelete = (id, data) => {
        callApi('deleteData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/role/${id}`,
            requestConfig: data
        });
    };

    // 데이터 등록
    const insertRole = (data) => {
        callApi('insertData', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: '/role',
            requestConfig: data
        });
    };

    // 데이터 상세 조회
    const getDetailData = (id) => {
        callApi('detailData', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/role/${id}`,
            requestConfig: {}
        });
    };

    // 중복 조회
    const getDuplicateCheck = (id) => {
        callApi('duplicateData', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/role/${id}`,
            requestConfig: {}
        });
    };

    // 데이터 수정
    const updateRoleData = (id, data) => {
        callApi('updateData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/role/${id}`,
            requestConfig: data
        });
    };

    // 데이터 삭제
    const deleteRoleData = (id, data) => {
        callApi('deleteeData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/role/${id}`,
            requestConfig: data
        });
    };

    // role에 등록된 사용자 리스트 조회
    const roleRegisterSearch = (id, site_id, type) => {
        callApi('registerList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/role/${id}/accounts`, // s?siteId=${site_id}&isUse=${is_use}&type=${type}`,
            requestConfig: {}
        });
    };

    // 사용자 맵핑 저장
    const roleRegisterSave = (id, data) => {
        console.log(id);
        console.log(data);
        callApi('registerData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/role/${id}/accounts`,
            requestConfig: data
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            roleSearch: getSearchData,
            roleList: getListData,
            roleComboSearch: getListComboData,
            roleDelete: deleteRoleData,
            roleInsert: insertRole,
            roleDetail: getDetailData,
            roleCheck: getDuplicateCheck,
            roleUpdate: updateRoleData,
            roleRegisterSearch: roleRegisterSearch,
            roleRegisterSave: roleRegisterSave
        }
    ];
};

export default RoleApi;
