import axiosInstanceDefault from '../../axiosDefault';
import useAxios from '../../useAxios';

const AnswerApi = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 신청자 관리 답변 저장
    const putAnswer = (request) => {
        const id = request.id;
        const is_email = request.isEmail;
        const answer = request.answer;
        const is_masking = request.isMasking;
        callApi('putAnswer', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/mng/cpc/education/${id}`,
            requestConfig: {
                id,
                is_email,
                answer,
                is_masking
            }
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            sendAnswer: putAnswer
        }
    ];
};

export default AnswerApi;
