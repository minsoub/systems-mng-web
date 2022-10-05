import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FoundationApi from 'apis/lrc/project/foundationapi';

const ProjectLink = (props) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [responseData, requestError, loading, { checkProject }] = FoundationApi();

    useEffect(() => {
        // 1. 토큰이 만료되면 페이지로 돌아오기 전에 로그아웃처리 되므로 미리 세션스토리지에 링크를 세팅해 두고 로그인시 사용하고 바로 초기화.
        sessionStorage.setItem('moveUrl', `/projects/detail/${id}`);
        checkProject(id);
    }, []);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        // 2. 체크가 정상적으로 되었다면 로그인이 된 상태이므로 바로 링크 이동.
        sessionStorage.setItem('moveUrl', '');
        switch (responseData.transactionId) {
            case 'checkProject':
                if (responseData.data.data) {
                    navigate(`/projects/detail/${id}`);
                }
                break;
            default:
        }
    }, [responseData]);

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            // 3. 토큰이 유효한 상태에서 에러가 났다면 프로젝트 목록으로 이동
            sessionStorage.setItem('moveUrl', '');
            if (requestError.error.message === 'INVALID_PROJECT') {
                alert('유효하지 않은 프로젝트 입니다.');
                navigate('/projects/list');
            }
        }
    }, [requestError]);

    return <div>Link&nbsp;</div>;
};

export default ProjectLink;
