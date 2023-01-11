/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '@mui/material';

// project import
import HeaderTitle from 'components/HeaderTitle';
import PostSetting from 'components/cmsboard/PostSetting';
import ShareSetting from 'components/cmsboard/ShareSetting';
import DetailContens from 'components/cmsboard/DetailContens';
import BottomButtonSet from 'components/cmsboard/BottomButtonSet';

// transition
import BoardApi from 'apis/cms/boardapi';

//style
import styles from './styles.module.scss';

// =============|| InvestmentWarning - Detail ||============= //

const InvestmentWarningView = () => {
    const { paramId } = useParams(); //상세번호
    const [responseData, requestError, loading, { readBoard }] = BoardApi();

    const pageType = 'investment-warnings';
    const [isEditMode, setIsEditMode] = useState(false); //수정모드
    const [detailData, setDetailData] = useState(null); //상세 데이터
    const [shareData, setShareData] = useState(null); //공유 데이터
    const [postingData, setPostingData] = useState({}); //게시 설정

    const changeEditState = () => {
        setIsEditMode(true);
    };
    //전달 인자확인
    useEffect(() => {
        console.log('aaaa');
        if (!paramId) {
            setIsEditMode(true);
            return;
        }
        readBoard(pageType, paramId);
    }, [paramId]);

    // 통신 결과
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'readBoard':
                if (responseData.data.data) {
                    // console.log(responseData.data.data);
                    const _contents = responseData.data.data;
                    setDetailData(_contents);
                    const _shareData = {
                        id: _contents.id,
                        share_title: _contents.share_title,
                        share_description: _contents.share_description,
                        share_file_id: _contents.share_file_id,
                        share_button_name: _contents.share_button_name
                    };
                    setShareData(_shareData);
                    const _postingData = {
                        id: _contents.id,
                        is_use_update_date: _contents.is_use_update_date,
                        is_align_top: _contents.is_align_top
                    };
                    setPostingData(_postingData);
                }
                break;
            default:
                return;
        }
    }, [responseData]);

    return (
        <Grid container rowSpacing={4} columnSpacing={2.75} className={styles.notceView}>
            <Grid item xs={12}>
                <HeaderTitle titleNm="투자유의지정 안내 상세" menuStep01="사이트 운영" menuStep02="투자유의지정 안내 상세" />
                <DetailContens type={pageType} editMode={isEditMode} detailData={detailData} />
                <ShareSetting type={pageType} editMode={isEditMode} shareData={shareData} />
                <PostSetting type={pageType} editMode={isEditMode} postingData={postingData} />
                <BottomButtonSet
                    type={pageType}
                    editMode={isEditMode}
                    changeEditState={changeEditState}
                    id={detailData?.id}
                    isDraft={detailData?.is_draft}
                />
            </Grid>
        </Grid>
    );
};

export default InvestmentWarningView;
