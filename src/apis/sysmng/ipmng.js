import axiosInstanceDefault from '../axiosDefault';
import useAxios from '../useAxios';

const IpMngApi = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    const getSearchData = (site_id, keyword) => {
        const encodeKeyword = encodeURIComponent(keyword);
        callApi('searchList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/access/ip/${site_id}?keyword=${encodeKeyword}`,
            requestConfig: {}
        });
    };

    // 데이터 조회
    const getAccessIpList = (site_id, id) => {
        callApi('ipRegList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/access/ip/${site_id}/${id}`,
            requestConfig: {}
        });
    };

    // 선택된 그리드 데이터 삭제
    const deleteData = (deleteIds) => {
        if (deleteIds && deleteIds.length > 0) {
            let data = { del_id: deleteIds };
            console.log(data);
            callApi('deleteData', {
                axiosInstance: axiosInstanceDefault,
                method: 'put',
                url: '/access/ip',
                requestConfig: data
            });
        }
    };

    // 데이터 등록
    const insertData = (data) => {
        callApi('insertData', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: '/access/ip',
            requestConfig: data
        });
    };

    // 데이터 수정
    const updateData = (data) => {
        callApi('updateData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/access/ip/${data.site_id}`,
            requestConfig: data
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            accessIpSearch: getSearchData,
            getAccessIpList: getAccessIpList,
            deleteData: deleteData,
            insertData: insertData,
            updateData: updateData
        }
    ];
};

export default IpMngApi;
