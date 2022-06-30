import React from 'react';
import axiosInstanceDefault from '../../axiosDefault';
import useAxios from '../../useAxios';

const BoardApis = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 게시판 유형 조회
    const getBoardTypes = () => {
        callApi('getBoardTypes', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: '/mng/cpc/board/board-types',
            requestConfig: {}
        });
    };

    // 게시판 페이징 유형 조회
    const getPaginationTypes = () => {
        callApi('getPaginationTypes', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: '/mng/cpc/board/pagination-types',
            requestConfig: {}
        });
    };

    // 게시판 마스터 목록 조회
    const getBoardMasters = () => {
        callApi('getBoardMasters', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/cpc/board`,
            requestConfig: {}
        });
    };

    // 게시판 마스터 정보 조회
    const getBoardMasterInfo = (boardMasterId) => {
        callApi('getBoardMasterInfo', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/cpc/board/${boardMasterId}/info`,
            requestConfig: {}
        });
    };

    // 게시판 마스터 등록
    const createBoardMaster = (data) => {
        callApi('createBoardMaster', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: '/mng/cpc/board',
            requestConfig: data
        });
    };

    // 게시판 마스터 수정
    const updateBoardMaster = (data) => {
        callApi('createBoardMaster', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: '/mng/cpc/board',
            requestConfig: data
        });
    };

    // 게시판 마스터 삭제
    const deleteBoardMaster = (data) => {
        callApi('createBoardMaster', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: '/mng/cpc/board',
            requestConfig: data
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            searchBoardMaster: getBoardMasterInfo,
            createBoardMaster: createBoardMaster,
            updateBoardMaster: updateBoardMaster,
            deleteBoardMaster: deleteBoardMaster
        }
    ];
};

export default BoardApis;
