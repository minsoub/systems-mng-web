/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Grid, Button } from '@mui/material';

// project import
import ButtonLayout from 'components/Common/ButtonLayout';

// transition
import BoardApi from 'apis/cms/boardapi';

// style
import styles from './styles.module.scss';

// =============|| BottomButtonSet - Component ||============= //

const BottomButtonSet = ({ type, editMode, changeEditState, id }) => {
    const navigate = useNavigate();
    const [responseData, requestError, loading, { createBoard, deleteBoard }] = BoardApi();
    const {
        reduceNotiCategory1, // 공지 카테고리1
        reduceNotiCategory2, // 공지 카테고리2
        reduceTitle, // 타이틀
        reduceTopFixable, // 상단고정
        reducePostState, // 게시 상태
        reduceReservation, // 예약 게시 여부
        reduceReservationDate, // 예약 게시일
        reduceShareTitle, // 공유 타이틀
        reduceShareDesc, // 공유 설명
        reduceShareBtnName, // 공유 버튼명
        reduceUpdateDate, // 업데이트 날자  여부 설정
        reduceTopNoti
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

    const deleteClick = () => {
        if (confirm('삭제를 하시겠습니까?')) {
            switch (type) {
                case 'notice':
                    deleteBoard('notices', id);
                    break;
                default:
                    break;
            }
        }
    };

    const listClick = () => {
        navigate(`/cms/${type}/list`);
    };
    const submitClick = () => {
        console.log('카테고리1 : ', reduceNotiCategory1);
        console.log('카테고리2 : ', reduceNotiCategory2);
        console.log('제목 : ', reduceTitle);
        console.log('상단 고정 : ', reduceTopFixable);
        console.log('공개 상태 : ', reducePostState);
        console.log('게시 예약 : ', reduceReservation);
        console.log('게시 예약일 : ', reduceReservationDate);
        console.log('에디터 입력내용 : ', window['contentsEditor'].getPublishingHtml());
        console.log('공유 타이틀 : ', reduceShareTitle);
        console.log('공유 설명 : ', reduceShareDesc);
        console.log('공유 버튼 이름 : ', reduceShareBtnName);
        console.log('날자 업데이트 여부 : ', reduceUpdateDate);
        console.log('게시물 상단 노출 : ', reduceTopNoti);
        console.log('이벤트 유형 : ', reduceEventType);
        console.log('이벤트 시작일시 : ', reduceEventStartDate);
        console.log('이벤트 종료일시 : ', reduceEventEndDate);
        console.log('이벤트 참여대상 : ', reduceEventJoinUser);
        console.log('이벤트 개인정보 수집 및 동의 : ', reduceEventPrivateTxt);
        console.log('이벤트 버튼명 : ', reduceEventBtnName);
        console.log('이벤트 버튼 색상 : ', reduceEventBtnColor);
        console.log('이벤트 버튼 링크 경로 : ', reduceEventBtnLink);
        console.log('이벤트 참여 완료시 메시지 : ', reduceEventSuccessMsg);
        console.log('이벤트 중복 참여시 메시지 : ', reduceEventOverlapMsg);
        if (type === 'notice') {
            // const request = {
            //     category_ids: ['8b82daaa42614fea88faef4f2e6d357c'],
            //     title: 'test1',
            //     content: 'test2',
            //     is_fix_top: false,
            //     is_show: false,
            //     is_delete: false,
            //     is_schedule: false,
            //     is_draft: false,
            //     read_count: 0,
            //     is_use_update_date: false,
            //     is_align_top: false,
            //     is_banner: false
            // };
            const request = {
                category_ids: ['5315d045f031424a8ca53128f344ac04'],
                title: '제목',
                content: '본문',
                is_fix_top: false,
                is_show: false,
                is_delete: false,
                share_title: '공유 태그 타이틀',
                share_description: '공유 태그 설명',
                share_button_name: '공유 태그 버튼명',
                is_schedule: false,
                schedule_date: '2023-01-08 01:27:12',
                is_draft: false,
                read_count: 0,
                is_use_update_date: false,
                is_align_top: false,
                is_banner: false
            };
            const formData = new FormData();
            formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
            createBoard('notices', formData);
        }
    };

    // 연동 결과
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'createBoard':
                if (responseData.data.data) {
                    console.log(responseData.data.data);
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
    return (
        <Grid className={styles.button_layout}>
            <ButtonLayout>
                {editMode ? (
                    <>
                        <Button disableElevation size="medium" type="button" variant="outlined_d" color="secondary" onClick={listClick}>
                            PC 미리보기
                        </Button>
                        <Button disableElevation size="medium" type="button" variant="outlined_d" color="secondary" onClick={listClick}>
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
                        {!detailID && (
                            <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={deleteClick}>
                                초안 저장
                            </Button>
                        )}
                        <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={submitClick}>
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
        </Grid>
    );
};

export default BottomButtonSet;
