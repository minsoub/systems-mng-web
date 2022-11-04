import axiosInstanceDefault from '../../axiosDefault';
import useAxios from '../../useAxios';

const MaskingApis = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 신청자 관리 목록 조회 - 마스킹
    const getMaskings = (request) => {
        const start_date = request.start_date;
        const end_date = request.end_date;
        const is_answer_complete = request.category == undefined ? '' : request.category;
        const keyword = request.keyword == undefined ? '' : encodeURIComponent(request.keyword);
        callApi('getMaskings', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/cpc/education/masking?start_date=${start_date}&end_date=${end_date}&is_answer_complete=${is_answer_complete}&keyword=${keyword}`,
            requestConfig: {}
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            searchEducationList: getMaskings
        }
    ];
};

export default MaskingApis;
