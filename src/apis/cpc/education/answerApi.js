import axiosInstanceDefault from '../../axiosDefault';
import useAxios from '../../useAxios';

const AnswerApi = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 신청자 관리 답변 저장
    const putAnswer = (request) => {
        const id = request.id;
        const isEmail = request.isEmail;
        const answer = request.answer;
        const isMasking = request.isMasking;
        callApi('putAnswer', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/api/v1/mng/cpc/education/${id}`,
            requestConfig: {
                id,
                isEmail,
                answer,
                isMasking
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
