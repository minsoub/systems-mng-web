import { useState, useEffect } from 'react';
import { AxiosInstance } from 'axios';
import { useSelector } from 'react-redux';

const useAxios = () => {
    const [response, setResponse] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [controller, setController] = useState();

    //const { siteId, email, accessToken, isLoggined } = useSelector((state) => state.authsReducer);

    const axiosFetch = async (tid, configObj) => {
        const { axiosInstance, method, url, requestConfig = {} } = configObj;

        //console.log('axiosFetch called..');
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
            // Token 처리
            axiosInstance.defaults.headers.Authorization = Authorization;
            // site_id 처리
            //axiosInstance.defaults.headers.site_id = site_id;
            /*
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
            */
        }
        try {
            console.log('called......');
            setLoading(true);
            const ctrl = new AbortController();
            setController(ctrl);
            let data = {};
            if (requestConfig instanceof FormData) {
                requestConfig.append('signal', ctrl.signal);
                data = requestConfig;
            } else {
                data = {
                    ...requestConfig,
                    signal: ctrl.signal
                };
            }
            const res = await axiosInstance[method](url, data);
            //console.log('success', res);
            //console.log(res.headers);
            //const returnData = { transactionId: tid, data: res.data };
            if (res.headers['content-disposition']) {
                // res.data instanceof Blob) {
                console.log('Blob data....');
                // 첨부파일 다운로드
                const contentDisposition = res.headers['content-disposition']; // 파일 이름
                let fileName = 'unknown';
                if (contentDisposition) {
                    const [fileNameMatch] = contentDisposition.split(';').filter((str) => str.includes('filename'));
                    if (fileNameMatch) [, fileName] = fileNameMatch.split('=');
                }
                console.log(fileName);
                const returnData = { transactionId: tid, data: res.data, fileName: fileName };
                setResponse(returnData);
            } else if (tid.indexOf('originResponse_') === 0) {
                // 본문내용 그대로 받는 경우
                const returnData = { transactionId: tid, data: res.data };
                setResponse(returnData);
            } else {
                //console.log(res);
                const returnData = { transactionId: tid, data: res.data };
                setResponse(returnData);
            }
            //setResponse(returnData);
        } catch (err) {
            console.log(err);
            console.log('error', err.message);
            //if (err.re)
            setError(err.response.data);
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
