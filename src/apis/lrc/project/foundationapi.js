import React from 'react';
import axiosInstanceDefault from '../../axiosDefault';
import useAxios from '../../useAxios';

const FoundationApi = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 조회
    const getListData = (data) => {
        var parameter = '';
        var networklist = '';
        var businesslist = '';
        if (data.business_list && data.business_list.length > 0) {
            let found = 0;
            data.map((item) => {
                if (found === 1) businesslist += ';';
                businesslist += item;
                found++;
            });
        }
        if (data.network_list && data.network_list.length > 0) {
            let found = 0;
            data.map((item) => {
                if (found === 1) networklist += ';';
                networklist += item;
                found++;
            });
        }
        parameter +=
            'fromDate=' +
            data.from_date +
            '&toDate=' +
            data.to_date +
            '&contractCode=' +
            data.contract_code +
            '&progressCode=' +
            data.progress_code;
        parameter += '&businessList=' + businesslist + '&networkList=' + networklist + '&keyword=';
        callApi('getList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/lrcmanagment/project/foundation/search?${parameter}`,
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
    // 재단정보
    // 재단정보 조회
    const getFoundationInfo = (data) => {
        callApi('getFoundationInfo', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/lrcmanagment/project/foundation-info/${data}`,
            requestConfig: {}
        });
    };

    // 프로젝트 정보
    // 프로젝트 정보 조회
    const getProjectListData = (data) => {
        callApi('getProjectList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/lrcmanagment/project/project-info/${data}`,
            requestConfig: {}
        });
    };

    // 담당자 정보
    // 담당자 정보 조회
    const getUserListData = (data) => {
        callApi('getUserList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/lrcmanagment/project/user-account/${data}`,
            requestConfig: {}
        });
    };

    // 상장 정보
    // 상장 정보 조회
    const getIcoListData = (data) => {
        callApi('getIcoList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/lrcmanagment/project/ico-info/${data}`,
            requestConfig: {}
        });
    };

    // 마케팅 정보
    // 마케팅 수량 정보 조회
    const getMarketingListData = (data) => {
        callApi('getMarketingList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/lrcmanagment/project/marketing-quantity/${data}`,
            requestConfig: {}
        });
    };

    // 검토 평가
    // 검토 평가 조회
    const getReviewListData = (data) => {
        callApi('getReviewList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/lrcmanagment/project/review-estimate/${data}`,
            requestConfig: {}
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            foundationSearch: getListData,
            foundationInsert: insertData,
            foundationUpdate: updateData,
            foundationDelete: deleteData,
            marketingSearch: getMarketingListData,
            reviewSearch: getReviewListData,
            projectSearch: getProjectListData,
            userSearch: getUserListData,
            icoSearch: getIcoListData,
            officeSearch: getFoundationInfo
        }
    ];
};

export default FoundationApi;
