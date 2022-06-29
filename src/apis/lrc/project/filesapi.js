import React from 'react';
import axiosInstanceDefault from 'apis/axiosDefault';
import axiosInstanceUpload from 'apis/axiosUpload';
import axiosInstanceDownload from 'apis/axiosDownload';
import useAxios from '../../useAxios';

const FilesApi = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 제출 서류 조회
    const getFileListData = (project_id) => {
        callApi('getFileList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/lrcmanagment/project/submitted-document/file?projectId=${project_id}`,
            requestConfig: {}
        });
    };

    const getUrlListData = (project_id) => {
        callApi('getUrlList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/lrcmanagment/project/submitted-document/url?projectId=${project_id}`,
            requestConfig: {}
        });
    };

    // 제출 서류 URL 등록
    const insertUrlData = (type, data, projectId) => {
        let postData = {
            project_id: projectId,
            type: type,
            url: data
        };
        callApi('insertData', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: '/mng/lrc/lrcmanagment/project/submitted-document/url',
            requestConfig: postData
        });
    };

    // 제출 서류 파일 등록
    const insertFileData = (data) => {
        callApi('insertData', {
            axiosInstance: axiosInstanceUpload,
            method: 'post',
            url: '/mng/lrc/lrcmanagment/project/submitted-document/file',
            requestConfig: data
        });
    };

    // 파일 다운로드
    const getFile = (key) => {
        callApi('getFile', {
            axiosInstance: axiosInstanceDownload,
            method: 'get',
            url: `/mng/lrc/files/download/s3/${key}`,
            requestConfig: {}
        });
    };
    return [
        responseData,
        requestError,
        loading,
        {
            fileSearch: getFileListData,
            urlSearch: getUrlListData,
            urlDocumentSave: insertUrlData,
            fileDocumentSave: insertFileData,
            fileDocumentDownload: getFile
        }
    ];
};

export default FilesApi;
