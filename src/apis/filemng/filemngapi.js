import axiosInstanceDefault from '../axiosDefault';
import useAxios from '../useAxios';

const FilemngApi = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 검색
    const getSearchData = (site_id, is_use) => {
        //const encodeKeyword = encodeURIComponent(keyword);
        callApi('fileList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/files?isUse=${is_use}`,
            requestConfig: {}
        });
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
    const insertFile = (site_id, data) => {
        callApi('insertData', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: `/site/${site_id}/file`,
            requestConfig: data
        });
    };

    // 데이터 상세 조회
    const getDetailData = (id, site_id) => {
        callApi('detailData', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/site/${site_id}/file/${id}`,
            requestConfig: {}
        });
    };

    // 데이터 수정
    const updateData = (site_id, data) => {
        callApi('updateData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/site/${site_id}/file`,
            requestConfig: data
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            fileSearch: getSearchData,
            fileDelete: getDelete,
            fileInsert: insertFile,
            fileDetail: getDetailData,
            fileUpdate: updateData
        }
    ];
};

export default FilemngApi;
