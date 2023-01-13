import axiosInstanceDefault from '../../axiosDefault';
import useAxios from '../../useAxios';

const ProjectUserMngApis = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 조회
    const getListData = (request) => {
        const { start_date, end_date } = request;
        callApi('getList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/lrcmanagment/user`,
            requestConfig: {
                params: {
                    fromDate: start_date,
                    toDate: end_date
                }
            }
        });
    };
    return [
        responseData,
        requestError,
        loading,
        {
            projectUserMngSearch: getListData
        }
    ];
};

export default ProjectUserMngApis;
