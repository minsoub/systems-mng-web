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
    //상세 데이터
    const [detailData, setDetailData] = useState(null);
    //공유 데이터
    const [shareData, setShareData] = useState({});
    //게시 설정
    const [postingData, setPostingData] = useState({});
    const changeEditState = () => {
        setEditMode(true);
    };
    //상세 및 수정 모드
    useEffect(() => {
        // console.log('editMode', editMode);
    }, [editMode]);
    //전달 인자확인
    useEffect(() => {
        if (!paramId) {
            setEditMode(true);
            return;
        }
        readBoard('notices', paramId);
    }, [paramId]);
    // 통신 결과
    useEffect(() => {
        if (!responseData) {
            return;
        }
        // console.log('responseData.transactionId', responseData.transactionId);
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
                <HeaderTitle titleNm="공지사항 상세" menuStep01="사이트 운영" menuStep02="공지사항 상세" />
                <DetailContens type="notice" editMode={editMode} detailData={detailData} />
                <ShareSetting type="notice" editMode={editMode} shareData={shareData} />
                <PostSetting type="notice" editMode={editMode} postingData={postingData} />
                <BottomButtonSet type="notice" editMode={editMode} changeEditState={changeEditState} id={detailData?.id} />
            </Grid>
        </Grid>
    );
};

export default NoticeView;
