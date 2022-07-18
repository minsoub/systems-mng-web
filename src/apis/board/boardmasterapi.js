import axiosInstanceDefault from '../axiosDefault';
import useAxios from '../useAxios';

const BoardMasterApis = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 게시판 유형 조회
    const getBoardTypes = () => {
        callApi('getBoardTypes', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: '/board/board-types',
            requestConfig: {}
        });
    };

    // 게시판 페이징 유형 조회
    const getPaginationTypes = () => {
        callApi('getPaginationTypes', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: '/board/pagination-types',
            requestConfig: {}
        });
    };

    // 게시판 마스터 목록 조회
    const getBoardMasters = (request) => {
        callApi('getBoardMasters', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/board?site_id=${request.site_id}&is_use=${request.is_use}`,
            requestConfig: {}
        });
    };

    // 게시판 마스터 조회
    const getBoardMaster = (id) => {
        callApi('getBoardMasterInfo', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/board/${id}`,
            requestConfig: {}
        });
    };

    // 게시판 마스터 등록
    const createBoardMaster = (data) => {
        callApi('createBoardMaster', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: '/board',
            requestConfig: data
        });
    };

    // 게시판 마스터 수정
    const updateBoardMaster = (data) => {
        callApi('createBoardMaster', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: '/board',
            requestConfig: data
        });
    };

    // 게시판 마스터 삭제
    const deleteBoardMaster = (data) => {
        callApi('createBoardMaster', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: '/board',
            requestConfig: data
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            searchBoardTypes: getBoardTypes,
            searchPaginationTypes: getPaginationTypes,
            searchBoardMasterList: getBoardMasters,
            searchBoardMaster: getBoardMaster,
            createBoardMaster: createBoardMaster,
            updateBoardMaster: updateBoardMaster,
            deleteBoardMaster: deleteBoardMaster
        }
    ];
};

export default BoardMasterApis;
