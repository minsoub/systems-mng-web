import axiosInstanceDefault from '../axiosDefault';
import useAxios from '../useAxios';

const SitemyprivacyApi = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 검색
    const getSearchData = (fromDate, toDate, keyword) => {
        const encodeKeyword = encodeURIComponent(keyword);
        callApi('siteMyPrivacyList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/access/logs?fromDate=${fromDate}&toDate=${toDate}&keyword=${encodeKeyword}`,
            requestConfig: {}
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            getSearchData: getSearchData
        }
    ];
};

export default SitemyprivacyApi;
