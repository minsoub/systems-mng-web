import axiosInstanceDefault from 'apis/axiosDefault';
import useAxios from '../../useAxios';

const HistoryApi = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 조회
    const historySearch = (projectId, keyword) => {
        var parameter = '';
        parameter = 'projectId=' + projectId + '&keyword=';
        if (keyword) {
            parameter += encodeURIComponent(keyword);
        }
        callApi('historyList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/lrcmanagment/project/history?${parameter}`,
            requestConfig: {}
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            historySearch: historySearch
        }
    ];
};

export default HistoryApi;
