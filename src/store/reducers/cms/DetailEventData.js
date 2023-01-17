import { createSlice } from '@reduxjs/toolkit';
// 데이터 정의
const initialState = {
    reduceEventType: '', // 이벤트 유형
    reduceEventStartDate: '', // 이벤트 시작일시
    reduceEventEndDate: '', // 이벤트 종료일시
    reduceEventJoinUser: '', // 이벤트 참여대상
    reduceEventPrivateTitle: '', // 이벤트 개인정보 수집 및 동의 타이틀
    reduceEventPrivateTxt: '', // 이벤트 개인정보 수집 및 동의 텍스트
    reduceEventBtnName: '', // 이벤트 버튼명
    reduceEventBtnColor: '', // 이벤트 버튼 색상
    reduceEventBtnLink: '', // 이벤트 버튼 링크 경로
    reduceEventSuccessMsg: '', // 이벤트 참여 완료시 메시지
    reduceEventOverlapMsg: '' // 이벤트 중복 참여시 메시지
};

// 초기 데이터 리듀서
const cmsDetailEventData = createSlice({
    name: 'cmsDetailEventData',
    initialState,
    reducers: {
        activeEventType(state, action) {
            state.reduceEventType = action.payload.reduceEventType;
        },
        activeEventStartDate(state, action) {
            state.reduceEventStartDate = action.payload.reduceEventStartDate;
        },
        activeEventEndDate(state, action) {
            state.reduceEventEndDate = action.payload.reduceEventEndDate;
        },
        activeEventJoinUser(state, action) {
            state.reduceEventJoinUser = action.payload.reduceEventJoinUser;
        },
        activeEventPrivateTitle(state, action) {
            state.reduceEventPrivateTitle = action.payload.reduceEventPrivateTitle;
        },
        activeEventPrivateTxt(state, action) {
            state.reduceEventPrivateTxt = action.payload.reduceEventPrivateTxt;
        },
        activeEventBtnName(state, action) {
            state.reduceEventBtnName = action.payload.reduceEventBtnName;
        },
        activeEventBtnColor(state, action) {
            state.reduceEventBtnColor = action.payload.reduceEventBtnColor;
        },
        activeEventBtnLink(state, action) {
            state.reduceEventBtnLink = action.payload.reduceEventBtnLink;
        },
        activeEventSuccessMsg(state, action) {
            state.reduceEventSuccessMsg = action.payload.reduceEventSuccessMsg;
        },
        activeEventOverlapMsg(state, action) {
            state.reduceEventOverlapMsg = action.payload.reduceEventOverlapMsg;
        }
    }
});

export default cmsDetailEventData.reducer;

export const {
    activeEventType,
    activeEventStartDate,
    activeEventEndDate,
    activeEventJoinUser,
    activeEventPrivateTitle,
    activeEventPrivateTxt,
    activeEventBtnName,
    activeEventBtnColor,
    activeEventBtnLink,
    activeEventSuccessMsg,
    activeEventOverlapMsg
} = cmsDetailEventData.actions;
