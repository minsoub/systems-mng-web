/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Grid, Button } from '@mui/material';

// project import
import ButtonLayout from 'components/Common/ButtonLayout';
import PreviewModal from '../modal/PreviewModal';
import LoadingModal from '../modal/LoadingModal';

// transition
import BoardApi from 'apis/cms/boardapi';

// style
import styles from './styles.module.scss';

// =============|| BottomButtonSet - Component ||============= //

const BottomButtonSet = ({ type, editMode, changeEditState, id, isDraft }) => {
    const navigate = useNavigate();
    const [responseData, requestError, loading, { createBoard, deleteBoard, updateBoard }] = BoardApi();
    const {
        reduceNotiCategory1, // 공지 카테고리1
        reduceNotiCategory2, // 공지 카테고리2
        reduceTitle, // 타이틀
        reduceTopFixable, // 상단고정
        reducePostState, // 게시 상태
        reduceReservation, // 예약 게시 여부
        reduceReservationDate, // 예약 게시일
        reduceFileId, // 첨부파일 아이디
        reduceThumbnailId, // 쎔네일 아이디
        reduceShareTitle, // 공유 타이틀
        reduceShareDesc, // 공유 설명
        reduceShareFileId, // 공유 이미지
        reduceShareBtnName, // 공유 버튼명
        reduceUpdateDate, // 업데이트 날자  여부 설정
        reduceTopNoti // 상단고정
    } = useSelector((state) => state.cmsDetailData);
    const {
        reduceEventType, // 이벤트 유형
        reduceEventStartDate, // 이벤트 시작일시
        reduceEventEndDate, // 이벤트 종료일시
        reduceEventJoinUser, // 이벤트 참여대상
        reduceEventPrivateTxt, // 이벤트 개인정보 수집 및 동의
        reduceEventBtnName, // 이벤트 버튼명
        reduceEventBtnColor, // 이벤트 버튼 색상
        reduceEventBtnLink, // 이벤트 버튼 링크 경로
        reduceEventSuccessMsg, // 이벤트 참여 완료시 메시지
        reduceEventOverlapMsg // 이벤트 중복 참여시 메시지
    } = useSelector((state) => state.cmsDetailEventData);

    const [detailID, setDetailID] = useState(id); // detail ID
    const [open, setOpen] = useState(false);
    const [loadOpen, setLoadOpen] = useState(false);
    const [viewMode, setViewMode] = useState('pc');

    const openModal = (mode) => {
        setViewMode(mode);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const loadClose = () => {
        setLoadOpen(false);
    };
    const deleteClick = () => {
        if (confirm('삭제를 하시겠습니까?')) {
            deleteBoard(type, id);
        }
    };

    const listClick = () => {
        navigate(`/cms/${type}/list`);
    };
    const submitClick = ($isDraft = false) => {
        let categorys = [];
        if (reduceNotiCategory1 !== '0') categorys.push(reduceNotiCategory1);
        if (reduceNotiCategory2 !== '0') categorys.push(reduceNotiCategory2);
        const editContents = window['contentsEditor'].getPublishingHtml();
        const isTopFix = reduceTopFixable === 0 ? false : true;
        const isShow = reducePostState === 0 ? false : true;
        const isSchedule = reduceReservation;
        const scheduleDate = reduceReservationDate ? reduceReservationDate.replace(' T ', ' ') + ':00' : '';
        const isUseUpdateDate = reduceUpdateDate === 0 ? false : true;
        const isAlignTop = reduceTopNoti === 0 ? false : true;
        let event_start_date = reduceEventStartDate ? reduceEventStartDate.replace(' T ', ' ') + ':00' : '';
        let event_end_date = reduceEventEndDate ? reduceEventEndDate.replace(' T ', ' ') + ':00' : '';
        let target = reduceEventJoinUser;
        let button_name = reduceEventBtnName;
        let button_color = reduceEventBtnColor;
        let button_url = reduceEventBtnLink;
        let participate_message = reduceEventSuccessMsg;
        let duplicate_message = reduceEventOverlapMsg;
        switch (reduceEventType) {
            // 게시 유형 상태
            case 'DEFAULT':
                target = 'NOT_LOGIN';
                event_start_date = '';
                event_end_date = '';
                button_name = '';
                button_color = '';
                button_url = '';
                participate_message = '';
                duplicate_message = '';
                break;
            case 'PARTICIPATION':
                button_url = '';
                break;
            case 'LINK':
                event_start_date = '';
                event_end_date = '';
                participate_message = '';
                duplicate_message = '';
                break;
        }

        console.log('초안 : ', $isDraft);
        console.log('카테고리 : ', categorys);
        console.log('제목 : ', reduceTitle);
        console.log('상단 고정 : ', isTopFix);
        console.log('공개 상태 : ', isShow);
        console.log('게시 예약 : ', isSchedule);
        console.log('게시 예약일 : ', scheduleDate);
        console.log('에디터 입력내용 : ', editContents);
        console.log('첨부파일 아이디: ', reduceFileId);
        console.log('첨부파일 데이터: ', document.getElementById('addFile') && document.getElementById('addFile').files[0]);
        console.log('썸네일 아이디: ', reduceThumbnailId);
        console.log('썸네일 데이터: ', document.getElementById('thumnailFile') && document.getElementById('thumnailFile').files[0]);
        console.log('공유 타이틀 : ', reduceShareTitle);
        console.log('공유 설명 : ', reduceShareDesc);
        console.log('공유 이미지 아이디: ', reduceShareFileId);
        console.log('공유 이미지 데이터: ', document.getElementById('shareFile') && document.getElementById('shareFile').files[0]);
        console.log('공유 버튼 이름 : ', reduceShareBtnName);
        console.log('날자 업데이트 여부 : ', isUseUpdateDate);
        console.log('게시물 상단 노출 : ', isAlignTop);
        console.log('이벤트 유형 : ', reduceEventType);
        console.log('이벤트 시작일시 : ', event_start_date);
        console.log('이벤트 종료일시 : ', event_end_date);
        console.log('이벤트 참여대상 : ', target);
        console.log('이벤트 개인정보 수집 및 동의 : ', reduceEventPrivateTxt);
        console.log('이벤트 버튼명 : ', button_name);
        console.log('이벤트 버튼 색상 : ', button_color);
        console.log('이벤트 버튼 링크 경로 : ', button_url);
        console.log('이벤트 참여 완료시 메시지 : ', participate_message);
        console.log('이벤트 중복 참여시 메시지 : ', duplicate_message);

        let request = {
            title: reduceTitle,
            content: editContents,
            is_show: isShow,
            file_id: reduceFileId,
            share_title: reduceShareTitle,
            share_description: reduceShareDesc,
            share_file_id: reduceShareFileId,
            share_button_name: reduceShareBtnName,
            is_schedule: isSchedule,
            schedule_date: scheduleDate,
            is_draft: $isDraft,
            is_use_update_date: isUseUpdateDate,
            is_align_top: isAlignTop
        };
        const formData = new FormData();
        const addFile = document.getElementById('addFile') && document.getElementById('addFile').files[0];
        if (document.getElementById('addFile') && document.getElementById('addFile').value) {
            formData.append('file', addFile);
        }
        const shareImageFile = document.getElementById('shareFile') && document.getElementById('shareFile').files[0];
        if (document.getElementById('shareFile') && document.getElementById('shareFile').value) {
            formData.append('share_file', shareImageFile);
        }
        const thumnailImageFile = document.getElementById('thumnailFile') && document.getElementById('thumnailFile').files[0];
        if (document.getElementById('thumnailFile') && document.getElementById('thumnailFile').value) {
            formData.append('thumbnail_file', thumnailImageFile);
        }
        switch (type) {
            case 'notices':
                request = {
                    ...request,
                    category_ids: categorys
                };
                if (categorys.length === 0) {
                    alert('카테고리를 선택하세요.');
                    return;
                }
                break;
            case 'review-reports':
            case 'economic-researches':
                request = {
                    ...request,
                    thumbnail_file_id: reduceThumbnailId
                };
                break;
            case 'events':
                const message = { participate_message, duplicate_message };
                request = {
                    ...request,
                    type: reduceEventType,
                    event_start_date,
                    event_end_date,
                    target,
                    button_name,
                    button_color,
                    button_url,
                    message,
                    agreement_content: reduceEventPrivateTxt
                };
                break;
            default:
                break;
        }
        if (reduceTitle === '') {
            alert('제목을 입력하세요.');
            return;
        }
        if (
            editContents ===
            '<div class="se-contents" style="box-sizing: content-box; font-family: &quot;맑은 고딕&quot;; font-size: 11pt; line-height: 1.2;" data-document-padding-top="18" data-document-padding-left="23" data-document-padding-right="23"><p style="margin: 16px 0px; display: block; overflow-wrap: break-word;"><br></p></div>'
        ) {
            alert('내용을 입력하세요.');
            return;
        }
        formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
        setLoadOpen(true);
        if (detailID) {
            updateBoard(type, detailID, formData);
        } else {
            createBoard(type, formData);
        }
    };

    // 연동 결과
    useEffect(() => {
        if (!responseData) {
            return;
        }
        setLoadOpen(false);
        switch (responseData.transactionId) {
            case 'createBoard':
                if (responseData.data.data) {
                    alert('등록 되었습니다.');
                    listClick();
                }
                break;
            case 'updateBoard':
                if (responseData.data.data) {
                    console.log(responseData.data.data);
                    alert('수정 되었습니다.');
                    listClick();
                }
                break;
            case 'deleteBoard':
                if (responseData.data.data) {
                    alert('삭제 되었습니다.');
                    listClick();
                }
                break;
            default:
                return;
        }
    }, [responseData]);

    useEffect(() => {
        setDetailID(id);
    }, [id]);
    useEffect(() => {
        console.log(type);
    }, [type]);
    return (
        <Grid className={styles.button_layout}>
            <ButtonLayout>
                {editMode ? (
                    <>
                        <Button
                            disableElevation
                            size="medium"
                            type="button"
                            variant="outlined_d"
                            color="secondary"
                            onClick={() => {
                                openModal('pc');
                            }}
                        >
                            PC 미리보기
                        </Button>
                        <Button
                            disableElevation
                            size="medium"
                            type="button"
                            variant="outlined_d"
                            color="secondary"
                            onClick={() => {
                                openModal('mobile');
                            }}
                        >
                            MO 미리보기
                        </Button>
                    </>
                ) : (
                    <Button disableElevation size="medium" type="button" variant="outlined_d" color="secondary" onClick={listClick}>
                        목록
                    </Button>
                )}
            </ButtonLayout>
            <ButtonLayout>
                {editMode ? (
                    <>
                        <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={listClick}>
                            취소
                        </Button>
                        {(!detailID || isDraft) && (
                            <Button
                                disableElevation
                                size="medium"
                                type="submit"
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    submitClick(true);
                                }}
                            >
                                초안 저장
                            </Button>
                        )}
                        <Button
                            disableElevation
                            size="medium"
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                submitClick(false);
                            }}
                        >
                            출판
                        </Button>
                    </>
                ) : (
                    <>
                        <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={deleteClick}>
                            삭제
                        </Button>
                        <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={changeEditState}>
                            수정
                        </Button>
                    </>
                )}
            </ButtonLayout>
            <PreviewModal open={open} onClose={handleClose} viewMode={viewMode} />
            <LoadingModal open={loadOpen} onClose={loadClose} />
        </Grid>
    );
};

export default BottomButtonSet;

// const categorySelector = document.querySelector("input[name='title']");
// console.log(categorySelector.focus());
// window.scrollTo({
//     top: 0,
//     left: 0,
//     behavior: 'smooth'
// });
