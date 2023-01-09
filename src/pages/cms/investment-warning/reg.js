/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '@mui/material';

// project import
import HeaderTitle from 'components/HeaderTitle';
import PostSetting from 'components/board/PostSetting';
import ShareSetting from 'components/board/ShareSetting';
import DetailContens from 'components/board/DetailContens';
import BottomButtonSet from 'components/board/BottomButtonSet';

//style
import styles from './styles.module.scss';

// =============|| InvestmentWarning - Detail ||============= //

const InvestmentWarningView = () => {
    const { paramId } = useParams(); //상세번호
    const [isEditMode, setIsEditMode] = useState(false); //수정모드

    const changeEditState = () => {
        setIsEditMode(true);
    };

    useEffect(() => {
        console.log('paramId', paramId);
        if (!paramId) {
            setIsEditMode(true);
        }
    }, [paramId]);
    return (
        <Grid container rowSpacing={4} columnSpacing={2.75} className={styles.notceView}>
            <Grid item xs={12}>
                <HeaderTitle titleNm="투자유의지정 안내 상세" menuStep01="사이트 운영" menuStep02="투자유의지정 안내 상세" />
                <DetailContens type="investment-warning" editMode={isEditMode} />
                <ShareSetting type="investment-warning" editMode={isEditMode} />
                <PostSetting type="investment-warning" editMode={isEditMode} />
                <BottomButtonSet type="investment-warning" editMode={isEditMode} changeEditState={changeEditState} />
            </Grid>
        </Grid>
    );
};

export default InvestmentWarningView;
