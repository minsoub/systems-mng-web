import axiosInstanceDefault from '../axiosDefault';
import useAxios from '../useAxios';

const IpMngApi = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 검색
    const getSearchData = (is_use, keyword) => {
        const encodeKeyword = encodeURIComponent(keyword);
        callApi('ipRegSearchList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/sites?searchText=${encodeKeyword}&isUse=${is_use}`,
            requestConfig: {}
        });
    };

    // 데이터 조회
    const getListData = (is_use) => {
        callApi('ipRegList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/sites?isUse=${is_use}`,
            requestConfig: {}
        });
    };

    // 선택된 그리드 데이터 삭제
    const getDeleteData = (selectedRows) => {
        if (selectedRows && selectedRows.length > 0) {
            let paramIds = selectedRows.join('&ids=');
            callApi('deleteData', {
                axiosInstance: axiosInstanceDefault,
                method: 'delete',
                url: `/faq/content?ids=${paramIds}`,
                requestConfig: {}
            });
        }
    };

    const getDelete = (id, data) => {
        callApi('deleteData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/site/${id}`,
            requestConfig: data
        });
    };

    // 데이터 등록
    const insertData = (data) => {
        callApi('insertData', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: '/site',
            requestConfig: data
        });
    };

    // 데이터 상세 조회
    const getDetailData = (id) => {
        callApi('detailData', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/site/${id}`,
            requestConfig: {}
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            siteSearch: getSearchData,
            siteList: getListData,
            siteDelete: getDelete,
            getDeleteData: getDeleteData,
            insertData: insertData,
            siteDetail: getDetailData
        }
    ];
};

export default IpMngApi;
