import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axiosInstanceAuth from './axiosAuth';
import {
    activeToken,
    activeRefreshToken,
    activeSite,
    activeRole,
    activeEmail,
    activeName,
    activeLogin,
    activeLoginDate
} from 'store/reducers/auth';
import { dispatch } from '../store';

const useAxios = () => {
    const dispatch = useDispatch();
    const [response, setResponse] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [controller, setController] = useState();
    const [tokenChecked, setTokenCheck] = useState(false);
    const navigate = useNavigate();
    const [requestSubscribers, setRequestSubscribers] = useState([]);

    const axiosFetch = async (tid, configObj) => {
        const { axiosInstance, method, url, requestConfig = {} } = configObj;

        console.log('>> axiosFetch called......');
        setLoading(true);

        // register a synchronous request interceptor
        console.log('>> axiosFetch url : %s', url);
        if (url.indexOf('adm') === -1) {
            try {
                let authData = null;
                if (localStorage.hasOwnProperty('authenticated')) {
                    authData = JSON.parse(localStorage.getItem('authenticated'));
                }
                if (authData === null || !authData.siteId) navigate('/login');
                //console.log(authData);
                let site_id = authData.siteId;
                // 현재 토큰 체크 진행중이 아니려면.. 아래 로직을 수행한다.
                if (!tokenChecked) {
                    if (authData == null) {
                        console.log('토큰 정보가 존재하지 않습니다.');
                        setTokenCheck(false);
                        setRequestSubscribers([]);
                        navigate('/login');
                        //setError('Token 정보가 존재하지 않습니다');
                        return;
                    }
                    let decodePayload = jwt.decode(authData.accessToken);
                    //console.log(decodePayload);
                    const exp = new Date(decodePayload.exp * 1000).getTime();
                    const now = new Date().getTime();
                    if (now > exp) {
                        console.log('>> AccessToken is invalid...');

                        console.log('>> refresh Token check');
                        console.log(authData.refreshToken);

                        let decodeRefreshPayload = jwt.decode(authData.refreshToken);
                        const expRefresh = new Date(decodeRefreshPayload.exp * 1000).getTime();
                        if (now > expRefresh) {
                            //console.log(now);
                            //console.log(expRefresh);
                            console.log('>> refresh token expire => now : %s, expRefresh : %s', now, expRefresh);
                            if (localStorage.hasOwnProperty('authenticated')) {
                                dispatch(activeSite({ siteId: '' }));
                                dispatch(activeRole({ roleId: '' })); // Role Id
                                dispatch(activeEmail({ email: '' }));
                                dispatch(activeName({ name: '' }));
                                dispatch(activeToken({ accessToken: '' }));
                                dispatch(activeRefreshToken({ refreshToken: '' }));
                                dispatch(activeLoginDate({ loginDate: '' }));
                                dispatch(activeLogin({ isLoggined: false }));
                            }
                            localStorage.clear();
                            setTokenCheck(false);
                            setRequestSubscribers([]);
                            navigate('/login');
                            return;
                        } else {
                            setTokenCheck(true);
                            // access token request
                            let requestTokenData = {
                                access_token: authData.accessToken,
                                refresh_token: authData.refreshToken
                            };
                            try {
                                console.log('>> refresh token call start....');
                                //console.log(requestTokenData);
                                axiosInstanceAuth.defaults.headers.my_site_id = site_id;
                                console.log('>> api refresh call...');
                                const result = await axiosInstanceAuth.put('/adm/token', requestTokenData);
                                console.log(result);
                                if (result.data.access_token) {
                                    authData.accessToken = result.data.access_token;
                                    localStorage.setItem('authenticated', JSON.stringify(authData));
                                    dispatch(activeToken({ accessToken: authData.accessToken }));
                                    dispatch(activeRefreshToken({ refreshToken: authData.refreshToken }));
                                }
                                setTokenCheck(false);
                            } catch (err) {
                                console.log('catch error....');
                                console.log(err);
                                if (localStorage.hasOwnProperty('authenticated')) {
                                    dispatch(activeSite({ siteId: '' }));
                                    dispatch(activeRole({ roleId: '' })); // Role Id
                                    dispatch(activeEmail({ email: '' }));
                                    dispatch(activeName({ name: '' }));
                                    dispatch(activeToken({ accessToken: '' }));
                                    dispatch(activeRefreshToken({ refreshToken: '' }));
                                    dispatch(activeLoginDate({ loginDate: '' }));
                                    dispatch(activeLogin({ isLoggined: false }));
                                }
                                localStorage.clear();
                                setTokenCheck(false);
                                setRequestSubscribers([]);
                                navigate('/login');
                                return;
                            }
                        }
                    }

                    let Authorization = `Bearer ${authData.accessToken}`; // `Bearer ${accessToken}`;
                    // Token 처리
                    axiosInstance.defaults.headers.Authorization = Authorization;
                    axiosInstance.defaults.headers.my_site_id = site_id;
                }
            } catch (err) {
                console.log('token error {%s}', err);
            }
        }
        if (!tokenChecked) {
            try {
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

                if (res.headers['content-disposition']) {
                    // 첨부파일 다운로드
                    const contentDisposition = res.headers['content-disposition']; // 파일 이름
                    let fileName = 'unknown';
                    if (contentDisposition) {
                        const [fileNameMatch] = contentDisposition.split(';').filter((str) => str.includes('filename'));
                        if (fileNameMatch) [, fileName] = fileNameMatch.split('=');
                    }
                    const returnData = { transactionId: tid, data: res.data, fileName: fileName };
                    setResponse(returnData);
                } else if (tid.indexOf('originResponse_') === 0) {
                    // 본문내용 그대로 받는 경우
                    const returnData = { transactionId: tid, data: res.data };
                    setResponse(returnData);
                } else {
                    const returnData = { transactionId: tid, data: res.data };
                    setResponse(returnData);
                }
            } catch (err) {
                console.log(err);
                console.log('error', err.message);
                if (err.response) setError(err.response.data);
            } finally {
                setLoading(false);
            }
        } else {
            setRequestSubscribers({ axiosInstance: axiosInstance, method: method, url: url, requestConfig: requestConfig });
        }
    };

    useEffect(() => {
        //console.log(controller);

        // useEffect cleanup function (memory-leak-and-useeffect)
        return () => controller && controller.abort();
    }, [controller]);

    const requestPrevData = async () => {
        requestSubscribers.map(async (item, index) => {
            try {
                let authData = null;
                if (localStorage.hasOwnProperty('authenticated')) {
                    authData = JSON.parse(localStorage.getItem('authenticated'));
                }
                if (authData === null || !authData.siteId) navigate('/login');
                let site_id = authData.siteId;
                let Authorization = `Bearer ${authData.accessToken}`; // `Bearer ${accessToken}`;
                // Token 처리
                item.axiosInstance.defaults.headers.Authorization = Authorization;
                item.axiosInstance.defaults.headers.my_site_id = site_id;

                const ctrl = new AbortController();
                setController(ctrl);
                let data = {};
                if (item.requestConfig instanceof FormData) {
                    item.requestConfig.append('signal', ctrl.signal);
                    data = item.requestConfig;
                } else {
                    data = {
                        ...item.requestConfig,
                        signal: ctrl.signal
                    };
                }
                const res = await item.axiosInstance[item.method](item.url, data);

                if (res.headers['content-disposition']) {
                    // 첨부파일 다운로드
                    const contentDisposition = res.headers['content-disposition']; // 파일 이름
                    let fileName = 'unknown';
                    if (contentDisposition) {
                        const [fileNameMatch] = contentDisposition.split(';').filter((str) => str.includes('filename'));
                        if (fileNameMatch) [, fileName] = fileNameMatch.split('=');
                    }
                    const returnData = { transactionId: tid, data: res.data, fileName: fileName };
                    setResponse(returnData);
                } else if (tid.indexOf('originResponse_') === 0) {
                    // 본문내용 그대로 받는 경우
                    const returnData = { transactionId: tid, data: res.data };
                    setResponse(returnData);
                } else {
                    const returnData = { transactionId: tid, data: res.data };
                    setResponse(returnData);
                }
            } catch (err) {
                console.log(err);
                console.log('error', err.message);
                if (err.response) setError(err.response.data);
            } finally {
                setLoading(false);
            }
        });
    };

    useEffect(() => {
        if (tokenChecked == false && requestSubscribers.length > 0) {
            requestPrevData();
        }
    }, [tokenChecked, requestSubscribers]);

    return [response, error, loading, axiosFetch];
};

export default useAxios;