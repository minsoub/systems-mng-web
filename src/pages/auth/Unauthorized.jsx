import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {useSelector, useDispatch} from "react-redux";
import { activeToken, activeRefreshToken, activeSite, activeRole, activeEmail, activeLogin, activeLoginDate } from 'store/reducers/auth';

function Unauthorized() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {accessToken} = useSelector((state) => state.auth);

    useEffect(() => {
        // 로그인 처리
        if (localStorage.hasOwnProperty('authenticated')) {
            dispatch(activeSite({ siteId: '' }));
            dispatch(activeRole({ roleId: '' })); // Role Id
            dispatch(activeEmail({ email: '' }));
            dispatch(activeToken({ accessToken: '' }));
            dispatch(activeRefreshToken({ refreshToken: '' }));
            dispatch(activeLoginDate({ loginDate: '' }));
            dispatch(activeLogin({ isLoggined: false }));
        }
        localStorage.clear();
    }, []);

    useEffect(() => {
        // 로그인 상태관리가 완전히 클리어된 후 로그인 페이지로 이동.
        if(accessToken === ''){
            navigate('/login');
        }
    }, [accessToken]);

    return (
        <div style={{display:"none"}}>
            인증이 실패하였거나, 인증시간이 만료되었습니다.
            <br /> 다시 로그인해 주세요.
        </div>

    );
}

export default Unauthorized;
