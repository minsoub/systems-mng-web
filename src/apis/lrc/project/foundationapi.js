import React from 'react';
import axiosInstanceDefault from 'apis/axiosDefault';
import axiosInstanceUpload from 'apis/axiosUpload';
import axiosInstanceDownload from 'apis/axiosDownload';
import useAxios from '../../useAxios';
import { doEncrypt } from 'utils/Crypt';

const FoundationApi = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 조회
    const getListData = (data) => {
        var parameter = '';
        var networklist = '';
        var businesslist = '';
        if (data.business_list && data.business_list.length > 0) {
            let found = 0;
            data.business_list.map((item) => {
                if (found !== 0) businesslist += ';';
                businesslist += item;
                found++;
            });
        }
        if (data.network_list && data.network_list.length > 0) {
            let found = 0;
            data.network_list.map((item) => {
                if (found !== 0) networklist += ';';
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

    const foundationExcelDownload = (data) => {
        var parameter = '';
        var networklist = '';
        var businesslist = '';
        if (data.business_list && data.business_list.length > 0) {
            let found = 0;
            data.business_list.map((item) => {
                if (found !== 0) businesslist += ';';
                businesslist += item;
                found++;
            });
        }
        if (data.network_list && data.network_list.length > 0) {
            let found = 0;
            data.network_list.map((item) => {
                if (found !== 0) networklist += ';';
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
        callApi('excelDownload', {
            axiosInstance: axiosInstanceDownload,
            method: 'get',
            url: `/mng/lrc/lrcmanagment/project/foundation/excel/download?${parameter}`,
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

    const getCreateUserData = (data) => {
        callApi('getCreateUser', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/lrcmanagment/project/create-user-account/${data}`,
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

    // 마케팅 정보 삭제
    const deleteMarketing = (projectId, id) => {
        callApi('deleteMarketing', {
            axiosInstance: axiosInstanceDefault,
            method: 'delete',
            url: `/mng/lrc/lrcmanagment/project/marketing-quantity/${projectId}/${id}`,
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
    // 검토 평가 리스트 수정 - 파일 업로드 가능
    const updateReviewList = (projectId, data) => {
        callApi('updateReviewList', {
            axiosInstance: axiosInstanceUpload,
            method: 'post',
            url: `/mng/lrc/lrcmanagment/project/review-estimate/upload/s3`,
            requestConfig: data
        });
    };
    // 검토 평가 삭제
    const deleteReview = (projectId, id) => {
        callApi('deleteReview', {
            axiosInstance: axiosInstanceDefault,
            method: 'delete',
            url: `/mng/lrc/lrcmanagment/project/review-estimate/${projectId}/${id}`,
            requestConfig: {}
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
    // File Search - 서류 제출 현황
    const getDocumentFiles = (projectId) => {
        callApi('getFileList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/lrcmanagment/project/submitted-document/file?projectId=${projectId}`,
            requestConfig: {}
        });
    };
    // File Search - 서류 제출 현황
    const getDocumentUrls = (projectId) => {
        callApi('getDocList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/lrcmanagment/project/submitted-document/url?projectId=${projectId}`,
            requestConfig: {}
        });
    };

    // mail send
    const sendEmail = (email, type) => {
        let sendAddr = encodeURIComponent(email);
        callApi('sendEmail', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/lrcmanagment/mail/send?email=${sendAddr}&type=${type}`,
            requestConfig: {}
        });
    };

    // 담당자 정보 조회
    const userKeywordSearch = (keyword) => {
        let keywordData = encodeURIComponent(keyword);
        callApi('getUserSearchList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/lrcmanagment/project/user-account?keyword=${keywordData}`,
            requestConfig: {}
        });
    };
    // 담당자 정보 등록
    const lrcUserRegister = (projectId, id, email) => {
        let data = {
            id: id,
            email: doEncrypt(email)
        };

        callApi('userRegister', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: `/mng/lrc/lrcmanagment/project/user-account/${projectId}`,
            requestConfig: data
        });
    };

    // 담당자 탈퇴 처리
    const lrcUserDelete = (projectId, id) => {
        callApi('delRegister', {
            axiosInstance: axiosInstanceDefault,
            method: 'delete',
            url: `/mng/lrc/lrcmanagment/project/user-account/${projectId}/${id}`,
            requestConfig: {}
        });
    };

    // 담당자 정보 수정
    const lrcUserSave = (projectId, userList) => {
        let data = userList;
        data.map((item, idx) => {
            item.user_name = doEncrypt(item.user_name);
            item.sns_id = doEncrypt(item.sns_id);
            item.phone = doEncrypt(item.phone);
            item.email = doEncrypt(item.email);
        });

        console.log(data);
        let sendData = { send_data: data };

        callApi('userUpdate', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: `/mng/lrc/lrcmanagment/project/user-accounts/${projectId}`,
            requestConfig: sendData
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            foundationSearch: getListData,
            foundationExcelDownload: foundationExcelDownload,
            updateFoundationInfo: updateFoundationInfo,
            marketingSearch: getMarketingListData,
            updateMarketingList: updateMarketingList,
            deleteMarketingData: deleteMarketing,
            reviewSearch: getReviewListData,
            updateReviewList: updateReviewList,
            deleteReviewData: deleteReview,
            projectSearch: getProjectListData,
            updateProjectInfo: updateProjectInfo,
            userSearch: getUserListData,
            createUserSearch: getCreateUserData,
            icoSearch: getIcoListData,
            updateIcoList: updateIcoList,
            officeSearch: getFoundationInfo,
            fileSearch: getDocumentFiles,
            docSearch: getDocumentUrls,
            fileReviewDownload: getFile,
            symbolKeywordSearch: keywordSimbolSearch,
            projectConnectSave: projectConnectSave,
            projectDisconnectSave: projectDisconnectSave,
            projectLinkListSearch: projectLinkListSearch,
            sendEmail: sendEmail,
            userKeywordSearch: userKeywordSearch,
            lrcUserRegister: lrcUserRegister,
            lrcUserDelete: lrcUserDelete,
            lrcUserSave: lrcUserSave
        }
    ];
};

export default FoundationApi;
