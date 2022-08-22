import axiosInstanceDefault from '../axiosDefault';
import useAxios from '../useAxios';

const SiteApi = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 검색
    const getSearchData = (is_use, keyword) => {
        const encodeKeyword = encodeURIComponent(keyword);
        callApi('siteList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/sites?searchText=${encodeKeyword}&isUse=${is_use}`,
            requestConfig: {}
        });
    };

    // 데이터 조회
    const getListData = (is_use) => {
        callApi('siteList', {
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
    const insertStite = (data) => {
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

    // 데이터 수정
    const updateSiteData = (id, data) => {
        callApi('updateData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/site/${id}`,
            requestConfig: data
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
            siteInsert: insertStite,
            siteDetail: getDetailData,
            siteUpdate: updateSiteData
        }
    ];
};

export default SiteApi;
