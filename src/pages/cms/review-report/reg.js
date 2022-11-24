/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import HeaderTitle from 'components/HeaderTitle';
import PostSetting from 'components/board/PostSetting';
import ShareSetting from 'components/board/ShareSetting';
import DetailContens from 'components/board/DetailContens';
import BottomButtonSet from 'components/board/BottomButtonSet';
import styles from './styles.module.scss';

const ReviewReportView = () => {
    //수정모드
    const [editMode, setEditMode] = useState(false);
    //상세번호
    const { paramId } = useParams();
    const changeEditState = () => {
        setEditMode(true);
    };
    useEffect(() => {
        // console.log('editMode', editMode);
    }, [editMode]);
    useEffect(() => {
        console.log('paramId', paramId);
        if (!paramId) {
            setEditMode(true);
        }
    }, [paramId]);
    return (
        <Grid container rowSpacing={4} columnSpacing={2.75} className={styles.notceView}>
            <Grid item xs={12}>
                <HeaderTitle titleNm="가상자산 검토보고서 상세" menuStep01="사이트 운영" menuStep02="가상자산 검토보고서 상세" />
                <DetailContens type="review-report" editMode={editMode} />
                <ShareSetting type="review-report" editMode={editMode} />
                <PostSetting type="review-report" editMode={editMode} />
                <BottomButtonSet type="review-report" editMode={editMode} changeEditState={changeEditState} />
            </Grid>
        </Grid>
    );
};

export default ReviewReportView;
