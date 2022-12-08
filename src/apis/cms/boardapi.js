import axiosInstanceDefault from '../axiosDefault';
import useAxios from '../useAxios';

const BoardApis = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 게시글 목록 조회
    const getBoards = (boardKey, request) => {
        let apiURL = '/mng/cms/' + boardKey + '?';
        if (request.keyword != undefined) {
            apiURL = apiURL + 'query=' + request.keyword;
        }
        if (request.start_date != undefined) {
            apiURL = apiURL + '&start_date=' + request.start_date;
        }
        if (request.end_date != undefined) {
            apiURL = apiURL + '&end_date=' + request.end_date;
        }
        if (request.is_use != undefined && request.is_use != 0) {
            apiURL = apiURL + '&is_use=' + (request.is_use == 1 ? 'true' : 'false');
        }

        callApi('getBoards', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: apiURL,
            requestConfig: {}
        });
    };
    // 게시글 등록
    const createBoard = (boardKey, data) => {
        callApi('createBoard', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: `/mng/cms/${boardKey}`,
            requestConfig: data
        });
    };

    // 게시글 수정
    const updateBoard = (boardKey, boardId, data) => {
        callApi('updateBoard', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/mng/cms/${boardKey}/${boardId}`,
            requestConfig: data
        });
    };

    // 게시글 삭제
    const deleteBoard = (boardKey, boardId) => {
        callApi('deleteBoard', {
            axiosInstance: axiosInstanceDefault,
            method: 'delete',
            url: `/mng/cms/${boardKey}/${boardId}`,
            requestConfig: {}
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            searchBoardList: getBoards,
            createBoard,
            updateBoard,
            deleteBoard
        }
    ];
};

export default BoardApis;
