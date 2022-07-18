import axiosInstanceDefault from '../../axiosDefault';
import useAxios from '../../useAxios';

const BoardApis = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 게시판 마스터 정보 조회
    const getBoardMasterInfo = (boardMasterId) => {
        callApi('getBoardMasterInfo', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/cpc/board/${boardMasterId}/info`,
            requestConfig: {}
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            searchBoardMaster: getBoardMasterInfo
        }
    ];
};

export default BoardApis;
