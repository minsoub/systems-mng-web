import { useState, useEffect, useRef } from 'react';
import jwt from 'jsonwebtoken';
import { useNavigate } from 'react-router-dom';
import {useSelector, useDispatch} from "react-redux";
import axiosInstanceAuth from './axiosAuth';
import { activeToken, activeRefreshToken } from 'store/reducers/auth';
import { dispatch } from '../store';
import { v4 as uuidv4 } from 'uuid';

const useAxios = () => {
    const [response, setResponse] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [controller, setController] = useState();
    const navigate = useNavigate();
    // Refresh 토큰용
    const dispatch = useDispatch();
    const {accessToken, refreshToken} = useSelector((state) => state.auth);
    const refRequestInfo = useRef([]);        // transaction 백업
    const refFailCount = useRef(0);         // 인증실패 횟수
    const refRefreshChecker = useRef('');   // 최초 토큰갱신 요청 확인용 키

    // 인증 에러시 로그아웃 후 로그인 페이지로 이동.
    const logout = () => {
        sessionStorage.removeItem('checker');
        // actionLoadingSpinner(false);
        navigate('/401');
    };

    // 인증실패 처리
    const checkAuthError = (err) => {
        console.log('>> checkAuthError <<');
        // actionLoadingSpinner(false);
        // Token expired.
        try {
            // 토큰이 만료인 경우 Refresh 토큰으로 갱신 시도
            if (err.response.data.error.code === 909) {
                refreshFetch();
                return;
            }
        } catch (e) {
            console.log('checkAuthError-error-code-none');
        }
        logout();
    };

    /**
     * *  refresh 토큰으로 access 토큰 발급
     * 1. 첫번째 실패 호출건이 대표로 토큰을 새로 발급한다.
     * 2. 토큰갱신 전에 실행되는 건은 첫번째 호출건이 토큰을 갱신할때까지 대기한다.
     * 3. 혹시나 겹칠것을 대비하여 유니크 키를 생성하여 비교한다.(BE에서 먼저 토큰이 발급되면 기존 토큰은 만료시킴)
     * 4. 첫번째 호출건이 정상적으로 호출되고 토큰의 상태를 갱신(useEffect로 accessToken 상태 체크)한 후에 나머지 실패 건이 실행된다.
     * 5. 상태 갱신이 끝나면 기존 트랜젝션을 재 호출하고 체커(checker)를 초기화 한다.
     * */
     const refreshFetch = async () => {
        console.log('>> Run refreshFetch <<');
        // 토큰에러 카운팅
        refFailCount.current += 1;
        // 이미 먼저 나간게 있는지 체크 - 먼저 내간게 있다면 토큰변경 후 정상 트랜젝션으로 처리.
        const beforeChecker = sessionStorage.getItem('checker');
        console.log('beforeChecker:', beforeChecker, refRequestInfo.current);
        if (beforeChecker) {
            return;
        }
        // 먼저 나간게 없으면 최초 토큰용 transaction으로 등록
        refRefreshChecker.current = uuidv4();
        sessionStorage.setItem('checker', refRefreshChecker.current);

        let authData = null;
        if (localStorage.hasOwnProperty('authenticated')) {
            authData = JSON.parse(localStorage.getItem('authenticated'));
        }else{
            logout();
        }
        console.log('authData:', authData);
        // 기존 리프레시 토큰으로 토큰 갱신
        axiosInstanceAuth.defaults.headers.common.Authorization = `Bearer ${authData.refreshToken}`;
        axiosInstanceAuth.defaults.headers.my_site_id = authData.siteId;
        try {
            setLoading(true);
            const ctrl = new AbortController();
            setController(ctrl);
            const data = { access_token: authData.accessToken, refresh_token: authData.refreshToken, signal: ctrl.signal };
            const res = await axiosInstanceAuth.put('/adm/token', data);

            // 동시 호출 체크를 위한 최초 토큰 갱신용 트랜젝션인지 체크. 최초 토큰 호출용만 토큰 상태관리를 업데이트 한다.
            const afterChecker = sessionStorage.getItem('checker');
            if (afterChecker === refRefreshChecker.current) {
                // eslint-disable-next-line camelcase
                const { email, access_token, access_expires_at, id, refresh_token } = res.data;

                // 토큰 갱신
                authData.accessToken = access_token;
                authData.refreshToken = refresh_token;
                localStorage.setItem('authenticated', JSON.stringify(authData));
                // 소스 하단에 useEffect에서 트랜잭션 재 호출.
                dispatch(activeToken({ accessToken: access_token }));
                dispatch(activeRefreshToken({ refreshToken: refresh_token }));                
            }
        } catch (err) {
            console.log('refresh fail.');
            logout();
        } finally {
            setLoading(false);
        }
    };

    // 정상 트랜젝션
    const axiosFetch = async (tid, configObj) => {
        const { axiosInstance, method, url, requestConfig = {} } = configObj;

        //Refresh token 갱신 후처리를 위한 파라메터 백업
        refRequestInfo.current.push({ tid, configObj });

        console.log('>> axiosFetch called......');
        setLoading(true);

        // register a synchronous request interceptor
        console.log('>> axiosFetch url : %s', url);

        try {
            if (url.indexOf('adm') === -1) {
                let authData = null;
                if (localStorage.hasOwnProperty('authenticated')) {
                    authData = JSON.parse(localStorage.getItem('authenticated'));
                }
                if (authData === null || !authData.siteId) navigate('/login');
                console.log('authData:', authData);
                let site_id = authData.siteId;

                let Authorization = `Bearer ${authData.accessToken}`; // `Bearer ${accessToken}`;
                // Token 처리
                axiosInstance.defaults.headers.Authorization = Authorization;
                axiosInstance.defaults.headers.my_site_id = site_id;
            }
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

            // transaction이 성공했으므로 refresh token 체크용 초기화.
            sessionStorage.removeItem('checker');
            refFailCount.current = 0;

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
            if (err.response && err.response.status && err.response.status === 401) {
                //401 에러 처리(토큰만료)
                console.log('401 Error !!!');
                checkAuthError(err);
                return;
            }
            if (err.response) setError(err.response.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        //console.log(controller);

        // useEffect cleanup function (memory-leak-and-useeffect)
        return () => controller && controller.abort();
    }, [controller]);

    //Refresh Token조회 후 다시 트랜잭션 재호출
    useEffect(() => {
        console.log('re accessToken:', refRequestInfo.current);
        // 상태관리가 완전히 클리어된 후 로그인 페이지로 이동.
        if(accessToken && refFailCount.current > 0){
            // 실패 횟수 초기화
            refFailCount.current = 0;
            // 누적된 실패 건수 재 호출 처리
            refRequestInfo.current.forEach((item) => {
                axiosFetch(item.tid, item.configObj); 
            });
            // 실패 건수 클리어
            refRequestInfo.current = [];
        }
    }, [accessToken]);

    return [response, error, loading, axiosFetch];
};

export default useAxios;
