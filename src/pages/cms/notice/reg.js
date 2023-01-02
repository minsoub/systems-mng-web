/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import HeaderTitle from 'components/HeaderTitle';
import PostSetting from 'components/board/PostSetting';
import ShareSetting from 'components/board/ShareSetting';
import DetailContens from 'components/board/DetailContens';
import BottomButtonSet from 'components/board/BottomButtonSet';
import BoardApi from 'apis/cms/boardapi';
import styles from './styles.module.scss';

const NoticeView = () => {
    const [responseData, requestError, loading, { readBoard }] = BoardApi();
    //수정모드
    const [editMode, setEditMode] = useState(false);
    //상세번호
    const { paramId } = useParams();
    const changeEditState = () => {
        setEditMode(true);
    };
    //상세 및 수정 모드
    useEffect(() => {
        // console.log('editMode', editMode);
    }, [editMode]);
    //전달 인자확인
    useEffect(() => {
        console.log('paramId', paramId);
        if (!paramId) {
            setEditMode(true);
        }
        readBoard('notices', paramId);
    }, [paramId]);
    // 통신 결과
    useEffect(() => {
        if (!responseData) {
            return;
        }
        console.log('responseData.transactionId', responseData.transactionId);
        switch (responseData.transactionId) {
            case 'readBoard':
                if (responseData.data.data) {
                    console.log(responseData.data.data.contents);
                }
                break;
            default:
                return;
        }
    }, [responseData]);
    return (
        <Grid container rowSpacing={4} columnSpacing={2.75} className={styles.notceView}>
            <Grid item xs={12}>
                <HeaderTitle titleNm="공지사항 상세" menuStep01="사이트 운영" menuStep02="공지사항 상세" />
                <DetailContens type="notice" editMode={editMode} />
                <ShareSetting type="notice" editMode={editMode} />
                <PostSetting type="notice" editMode={editMode} />
                <BottomButtonSet type="notice" editMode={editMode} changeEditState={changeEditState} />
            </Grid>
        </Grid>
    );
};

export default NoticeView;
