import React from 'react';
import axiosInstanceDefault from 'apis/axiosDefault';
import axiosInstanceUpload from 'apis/axiosUpload';
import axiosInstanceDownload from 'apis/axiosDownload';
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
        parameter += '&businessCode=' + businesslist + '&networkCode=' + networklist + '&keyword=' + encodeURIComponent(data.keyword);
        callApi('getList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/lrcmanagment/project/foundation/search?${parameter}`,
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
    // 재단정보 수정
    const updateFoundationInfo = (data) => {
        callApi('updateFoundationInfo', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: `/mng/lrc/lrcmanagment/project/foundation-info/${data.id}`,
            requestConfig: data
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
    // 프로젝트 정보 수정
    const updateProjectInfo = (data) => {
        callApi('updateProjectInfo', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/mng/lrc/lrcmanagment/project/project-info/${data.project_id}`,
            requestConfig: data
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
    // 상장정보 정보 수정
    const updateIcoList = (projectId, data) => {
        callApi('updateIcoList', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: `/mng/lrc/lrcmanagment/project/ico-info/${projectId}`,
            requestConfig: data
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

    // 마케팅 리스트 정보 수정
    const updateMarketingList = (projectId, data) => {
        callApi('updateMarketingList', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: `/mng/lrc/lrcmanagment/project/marketing-quantity/${projectId}`,
            requestConfig: data
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
    // 검토 평가 리스트 수정 - 파일 업로드 가능
    const updateReviewList = (projectId, data) => {
        callApi('updateReviewList', {
            axiosInstance: axiosInstanceUpload,
            method: 'post',
            url: `/mng/lrc/lrcmanagment/project/review-estimate/upload/s3`,
            requestConfig: data
        });
    };
    // 파일 다운로드
    const getFile = (key) => {
        callApi('getFile', {
            axiosInstance: axiosInstanceDownload,
            method: 'get',
            url: `/mng/lrc/files/download/s3/common/${key}`,
            requestConfig: {}
        });
    };

    const keywordSimbolSearch = (keyword, projectId) => {
        callApi('getProjectKeyList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/lrcmanagment/project/project-link/foundation?symbol=${keyword}&projectId=${projectId}`,
            requestConfig: {}
        });
    };

    // 프로젝트 연결
    const projectConnectSave = (data) => {
        callApi('projectConnect', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: `/mng/lrc/lrcmanagment/project/project-link`,
            requestConfig: data
        });
    };
    // 프로젝트 연결 해제
    const projectDisconnectSave = (id) => {
        callApi('projectDisconnect', {
            axiosInstance: axiosInstanceDefault,
            method: 'delete',
            url: `/mng/lrc/lrcmanagment/project/project-link/${id}`,
            requestConfig: {}
        });
    };
    // 프로젝트 연결 조회
    const projectLinkListSearch = (projectId) => {
        callApi('getProjectLinkList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/lrcmanagment/project/project-link/link/${projectId}`,
            requestConfig: {}
        });
    };
    return [
        responseData,
        requestError,
        loading,
        {
            foundationSearch: getListData,
            updateFoundationInfo: updateFoundationInfo,
            marketingSearch: getMarketingListData,
            updateMarketingList: updateMarketingList,
            reviewSearch: getReviewListData,
            updateReviewList: updateReviewList,
            projectSearch: getProjectListData,
            updateProjectInfo: updateProjectInfo,
            userSearch: getUserListData,
            icoSearch: getIcoListData,
            updateIcoList: updateIcoList,
            officeSearch: getFoundationInfo,
            fileReviewDownload: getFile,
            symbolKeywordSearch: keywordSimbolSearch,
            projectConnectSave: projectConnectSave,
            projectDisconnectSave: projectDisconnectSave,
            projectLinkListSearch: projectLinkListSearch
        }
    ];
};

export default FoundationApi;
