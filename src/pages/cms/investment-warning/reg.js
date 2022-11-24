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

const InvestmentWarningView = () => {
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
                <HeaderTitle titleNm="투자유의지정 안내 상세" menuStep01="사이트 운영" menuStep02="투자유의지정 안내 상세" />
                <DetailContens type="investment-warning" editMode={editMode} />
                <ShareSetting type="investment-warning" editMode={editMode} />
                <PostSetting type="investment-warning" editMode={editMode} />
                <BottomButtonSet type="investment-warning" editMode={editMode} changeEditState={changeEditState} />
            </Grid>
        </Grid>
    );
};

export default InvestmentWarningView;