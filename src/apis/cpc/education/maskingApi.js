import axiosInstanceDefault from '../../axiosDefault';
import useAxios from '../../useAxios';

const MaskingApis = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 신청자 관리 목록 조회 - 마스킹
    const getMaskings = (request) => {
        const start_date = request.start_date;
        const end_date = request.end_date;
        const is_answer_complete = encodeURIComponent(request.category);
        const keyword = request.keyword.length === 0 ? undefined : encodeURIComponent(request.keyword);
        callApi('getMaskings', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/cpc/education/masking`,
            requestConfig: {
                params: {
                    start_date,
                    end_date,
                    is_answer_complete,
                    keyword
                }
            }
        });
    };

    // 신청자 관리 목록 조회 - 마스킹 해제
    const getUnMaskings = (request) => {
        const start_date = request.start_date;
        const end_date = request.end_date;
        const is_answer_complete = encodeURIComponent(request.category);
        const keyword = request.keyword.length === 0 ? undefined : encodeURIComponent(request.keyword);
        const reason = request.reason;
        callApi('getUnMaskings', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/cpc/education/unmasking`,
            requestConfig: {
                params: {
                    start_date,
                    end_date,
                    is_answer_complete,
                    keyword,
                    reason
                }
            }
        });
    };

    // 신청자 관리 상세 조회 - 마스킹
    const getEducationMasking = (request) => {
        const id = request.id;
        callApi('getEducationMasking', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/cpc/education/${id}/masking`,
            requestConfig: {}
        });
    };

    // 신청자 관리 상세 조회 - 마스킹 해제
    const getEducationUnMasking = (request) => {
        const id = request.id;
        const reason = request.reason;
        callApi('getEducationMasking', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/cpc/education/${id}/masking`,
            requestConfig: {
                params: {
                    reason
                }
            }
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            searchEducationList: getMaskings,
            searchUnMaskingList: getUnMaskings,
            searchEducation: getEducationMasking,
            searchUnMaskingEducation: getEducationUnMasking
        }
    ];
};

export default MaskingApis;
