import axiosInstanceDefault from '../../axiosDefault';
import useAxios from '../../useAxios';

const MainContentsApis = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 메인화면 선택된 콘텐츠 조회
    const getMainContents = () => {
        callApi('getMainContents', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/cpc/main`,
            requestConfig: {}
        });
    };

    // 메인 화면 콘텐츠용 게시글 조회
    const getBoardsForMain = (boardMasterId, request) => {
        const start_date = request.start_date;
        const end_date = request.end_date;
        const keyword = request.keyword == undefined ? '' : encodeURIComponent(request.keyword);
        callApi('getBoardsForMain', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/cpc/main/${boardMasterId}?start_date=${start_date}&end_date=${end_date}&query=${keyword}`,
            requestConfig: {}
        });
    };

    // 선택된 게시글 저장
    const updateMainContents = (data) => {
        callApi('updateMainContents', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: `/mng/cpc/main`,
            requestConfig: data
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            searchMainContents: getMainContents,
            searchBoardsForMain: getBoardsForMain,
            updateMainContents: updateMainContents
        }
    ];
};

export default MainContentsApis;
