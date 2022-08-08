import axiosInstanceDefault from '../../axiosDefault';
import useAxios from '../../useAxios';

const BoardApis = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 게시글 목록 조회
    const getBoards = (boardMasterId, request) => {
        const start_date = request.start_date;
        const end_date = request.end_date;
        const keyword = request.keyword == undefined ? '' : encodeURIComponent(request.keyword);
        const category = request.category == undefined ? '' : encodeURIComponent(request.category);
        callApi('getBoards', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/cpc/board/${boardMasterId}?start_date=${start_date}&end_date=${end_date}&query=${keyword}&category=${category}`,
            requestConfig: {}
        });
    };

    // 게시글 목록 삭제
    const deleteBoards = (boardMasterId, deleteIds) => {
        callApi('deleteBoards', {
            axiosInstance: axiosInstanceDefault,
            method: 'delete',
            url: `/mng/cpc/board/${boardMasterId}/bulk-delete?deleteIds=${deleteIds}`,
            requestConfig: {}
        });
    };

    // 게시글 정보 조회
    const getBoard = (boardMasterId, boardId) => {
        callApi('getBoard', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/cpc/board/${boardMasterId}/${boardId}`,
            requestConfig: {}
        });
    };

    // 게시글 등록
    const createBoard = (boardMasterId, data) => {
        callApi('createBoard', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: `/mng/cpc/board/${boardMasterId}`,
            requestConfig: data
        });
    };

    // 게시글 수정
    const updateBoard = (boardMasterId, boardId, data) => {
        callApi('updateBoard', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/mng/cpc/board/${boardMasterId}/${boardId}`,
            requestConfig: data
        });
    };

    // 게시글 삭제
    const deleteBoard = (boardMasterId, boardId) => {
        callApi('deleteBoard', {
            axiosInstance: axiosInstanceDefault,
            method: 'delete',
            url: `/mng/cpc/board/${boardMasterId}/${boardId}`,
            requestConfig: {}
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            searchBoardList: getBoards,
            deleteBoardList: deleteBoards,
            searchBoard: getBoard,
            createBoard: createBoard,
            updateBoard: updateBoard,
            deleteBoard: deleteBoard
        }
    ];
};

export default BoardApis;
