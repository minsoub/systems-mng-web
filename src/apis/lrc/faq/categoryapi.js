import axiosInstanceDefault from '../../axiosDefault';
import useAxios from '../../useAxios';

const CategoryApis = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 조회
    const getListData = (language) => {
        callApi('getList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/faq/category?language=${language}`,
            requestConfig: {}
        });
    };

    // LRC - 등록
    const insertData = (data) => {
        callApi('insertData', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: '/mng/lrc/faq/category',
            requestConfig: data
        });
    };
    // 수정
    const updateData = (data) => {
        callApi('updateData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/mng/lrc/faq/category/${data.id}`,
            requestConfig: data
        });
    };

    // 삭제
    const deleteData = (data) => {
        callApi('deleteData', {
            axiosInstance: axiosInstanceDefault,
            method: 'delete',
            url: `/mng/lrc/faq/category/${data.id}`,
            requestConfig: {}
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            categorySearch: getListData,
            categoryInsert: insertData,
            categoryUpdate: updateData,
            categoryDelete: deleteData
        }
    ];
};

export default CategoryApis;
