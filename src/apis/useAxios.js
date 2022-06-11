import { useState, useEffect } from 'react';
import { AxiosInstance } from 'axios';
import { useSelector } from 'react-redux';

const useAxios = () => {
    const [response, setResponse] = useState();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [controller, setController] = useState();

    //const { siteId, email, accessToken, isLoggined } = useSelector((state) => state.authsReducer);

    const axiosFetch = async (tid, configObj) => {
        const { axiosInstance, method, url, requestConfig = {} } = configObj;

        console.log('axiosFetch called..');
        let authData = null;
        if (localStorage.hasOwnProperty('authenticated')) {
            //console.log(localStorage.getItem('authenticated'));
            authData = JSON.parse(localStorage.getItem('authenticated'));
        }
        //console.log(authData);

        // register a synchronous request interceptor
        console.log(url);
        if (url.indexOf('adm') === -1) {
            if (authData == null) {
                console.log('토큰 정보가 존재하지 않습니다!!!');
                setError('Token 정보가 존재하지 않습니다');
                return;
            }
            let Authorization = `Bearer ${authData.accessToken}`; // `Bearer ${accessToken}`;
            let site_id = authData.siteId; //siteId;
            //if (!isLoggined) {
            axiosInstance.interceptors.request.use(
                (config) => ({
                    ...config,
                    headers: {
                        ...config.headers,
                        Authorization,
                        site_id
                    }
                }),
                null,
                { synchronous: true }
            );
        }
        try {
            setLoading(true);
            const ctrl = new AbortController();
            setController(ctrl);

            const res = await axiosInstance[method](url, {
                ...requestConfig,
                signal: ctrl.signal
            });
            console.log('success', res);
            const returnData = { transactionId: tid, data: res.data };
            setResponse(returnData);
        } catch (err) {
            console.log('error', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log(controller);

        // useEffect cleanup function (memory-leak-and-useeffect)
        return () => controller && controller.abort();
    }, [controller]);

    return [response, error, loading, axiosFetch];
};

export default useAxios;
