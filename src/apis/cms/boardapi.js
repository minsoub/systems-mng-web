import useAxios from 'apis/useAxios';
import axiosInstanceUpload from 'apis/axiosUpload';
import axiosInstanceDefault from 'apis/axiosDefault';

const BoardApis = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 게시글 목록 조회
    const getBoards = (boardKey, request) => {
        let apiURL = '/mng/cms/' + boardKey + '?';
        if (request.keyword != undefined) {
            // 검색 키워드
            apiURL = apiURL + 'query=' + request.keyword;
        }
        if (request.start_date != undefined && request.start_date != '') {
            // 검색 시작일
            apiURL = apiURL + '&start_date=' + request.start_date;
        }
        if (request.end_date != undefined && request.end_date != '') {
            // 검색 종료일
            apiURL = apiURL + '&end_date=' + request.end_date;
        }
        if (request.is_use != undefined && request.is_use != 0) {
            // 사용 상태
            apiURL = apiURL + '&is_use=' + (request.is_use == 1 ? 'true' : 'false');
        }
        if (request.event_type != undefined && request.event_type != 0) {
            // 게시 유형 상태
            apiURL = apiURL + '&event_type=' + (request.event_type == 1 ? 'true' : 'false');
        }
        if (request.is_show != undefined && request.is_show != 0) {
            // 사용 상태
            apiURL = apiURL + '&is_show=' + (request.is_show == 1 ? 'true' : 'false');
        }
        if (request.category_id != undefined && request.category_id != '0') {
            // 카테고리 아이디
            apiURL = apiURL + '&category_ids=' + request.category_id;
        }
        if (request.is_banner != undefined && request.is_banner != 0) {
            // 배너 공지 여부
            apiURL = apiURL + '&is_banner=' + (request.is_banner == 1 ? 'true' : 'false');
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
            axiosInstance: axiosInstanceUpload,
            method: 'post',
            url: `/mng/cms/${boardKey}`,
            requestConfig: data
        });
    };

    // 게시글 상세
    const readBoard = (boardKey, boardId) => {
        callApi('readBoard', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/cms/${boardKey}/${boardId}`,
            requestConfig: {}
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
    // 파일 업로드
    const insertFileData = (data) => {
        callApi('uploadFile', {
            axiosInstance: axiosInstanceUpload,
            method: 'post',
            url: '/mng/cms/files',
            requestConfig: data
        });
    };

    // 카테고리 목록 조회
    const getCategory = (boardKey) => {
        let apiURL = '/mng/cms/' + boardKey;

        callApi('getCategory', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: apiURL,
            requestConfig: {}
        });
    };
    // 카테고리 등록
    const createCategoryBoard = (boardKey, data) => {
        callApi('createCategoryBoard', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: `/mng/cms/${boardKey}`,
            requestConfig: data
        });
    };
    //  카테고리 수정
    const updateCategoryBoard = (boardKey, boardId, data) => {
        callApi('updateCategoryBoard', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/mng/cms/${boardKey}/${boardId}`,
            requestConfig: data
        });
    };

    // 공지사항 배너 상태변경
    const changeBannerState = (id, state) => {
        const apiURL = '/mng/cms/notices/' + id + '/banners';
        let method = 'post';
        if (!state) method = 'delete';
        callApi('changeBannerState', {
            axiosInstance: axiosInstanceDefault,
            method: method,
            url: apiURL,
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
            createCategoryBoard,
            updateCategoryBoard,
            readBoard,
            updateBoard,
            deleteBoard,
            getCategory,
            insertFileData,
            changeBannerState
        }
    ];
};

export default BoardApis;
