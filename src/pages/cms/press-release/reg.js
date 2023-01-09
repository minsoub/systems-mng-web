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

// =============|| Pressrelease - Detail ||============= //

const PressReleaseView = () => {
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
                <HeaderTitle titleNm="보도자료 상세" menuStep01="사이트 운영" menuStep02="보도자료 상세" />
                <DetailContens type="press-release" editMode={isEditMode} />
                <ShareSetting type="press-release" editMode={isEditMode} />
                <PostSetting type="press-release" editMode={isEditMode} />
                <BottomButtonSet type="press-release" editMode={isEditMode} changeEditState={changeEditState} />
            </Grid>
        </Grid>
    );
};

export default PressReleaseView;
