/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Grid, Button } from '@mui/material';
import ButtonLayout from 'components/Common/ButtonLayout';
import styles from './styles.module.scss';

const BottomButtonSet = ({ type, editMode, changeEditState }) => {
    const {
        reduceNotiCategory1,
        reduceNotiCategory2,
        reduceTitle,
        reduceTopFixable,
        reducePostState,
        reduceReservation,
        reduceReservationDate,
        reduceShareTitle,
        reduceShareDesc,
        reduceShareBtnName,
        reduceUpdateDate,
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
    const navigate = useNavigate();
    // 삭제 버튼 제어
    const [isDisabled, setIsDisabled] = useState(false);
    // delete
    const deleteClick = () => {
        if (confirm('삭제를 하시겠습니까?')) {
            const requestData = {
                // id: id,
                // name: name,
                // valid_start_date: valid_start_date,
                // valid_end_date: valid_end_date,
                // site_id: site_id,
                // is_use: false,
                // type: type
            };
            //roleDelete(id, requestData);
        }
    };
    // List
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
    };
    useEffect(() => {
        // console.log(changeEditState, editMode);
    }, []);
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
                        <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={deleteClick}>
                            초안 저장
                        </Button>
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
