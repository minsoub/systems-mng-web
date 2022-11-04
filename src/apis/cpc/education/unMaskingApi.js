import axiosInstanceDefault from '../../axiosDefault';
import useAxios from '../../useAxios';

const UnMaskingApis = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 신청자 관리 목록 조회 - 마스킹 해제
    const getUnMaskings = (request) => {
        const start_date = request.start_date;
        const end_date = request.end_date;
        const is_answer_complete = request.category;
        const keyword = request.keyword == undefined ? '' : encodeURIComponent(request.keyword);
        const reason = request.reason;
        callApi('getUnMaskings', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/cpc/education/unmasking?start_date=${start_date}&end_date=${end_date}&is_answer_complete=${is_answer_complete}&keyword=${keyword}&reason=${reason}`,
            requestConfig: {}
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            searchEducationList: getUnMaskings
        }
    ];
};

export default UnMaskingApis;
