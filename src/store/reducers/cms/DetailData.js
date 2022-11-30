import { createSlice } from '@reduxjs/toolkit';
// 데이터 정의
const initialState = {
    reduceNotiCategory1: '', // 카테고리1
    reduceNotiCategory2: '', // 카테고리2
    reduceTitle: '', // 제목
    reduceTopFixable: '', // 상단고정
    reducePostState: '', // 게시글 상태
    reduceReservation: '', // 게시 예약
    reduceReservationDate: '', // 게시 예약일
    reduceShareTitle: '', // 공유 타이틀
    reduceShareDesc: '', // 공유 설명
    reduceShareBtnName: '', // 공유 버튼명
    reduceUpdateDate: '', // 공유 날자 업데이트 여부
    reduceTopNoti: '' // 공유 상단 노출
};

// 초기 데이터 리듀서
const cmsDetailData = createSlice({
    name: 'cmsDetailData',
    initialState,
    reducers: {
        activeNotiCategory1(state, action) {
            state.reduceNotiCategory1 = action.payload.reduceNotiCategory1;
        },
        activeNotiCategory2(state, action) {
            state.reduceNotiCategory2 = action.payload.reduceNotiCategory2;
        },
        activeTitle(state, action) {
            state.reduceTitle = action.payload.reduceTitle;
        },
        activeTopFixable(state, action) {
            state.reduceTopFixable = action.payload.reduceTopFixable;
        },
        activePostState(state, action) {
            state.reducePostState = action.payload.reducePostState;
        },
        activeReservation(state, action) {
            state.reduceReservation = action.payload.reduceReservation;
        },
        activeReservationDate(state, action) {
            state.reduceReservationDate = action.payload.reduceReservationDate;
        },
        activeShareTitle(state, action) {
            state.reduceShareTitle = action.payload.reduceShareTitle;
        },
        activeShareDesc(state, action) {
            state.reduceShareDesc = action.payload.reduceShareDesc;
        },
        activeShareBtnName(state, action) {
            state.reduceShareBtnName = action.payload.reduceShareBtnName;
        },
        activeUpdateDate(state, action) {
            state.reduceUpdateDate = action.payload.reduceUpdateDate;
        },
        activeTopNoti(state, action) {
            state.reduceTopNoti = action.payload.reduceTopNoti;
        }
    }
});

export default cmsDetailData.reducer;

export const {
    activeNotiCategory1,
    activeNotiCategory2,
    activeTitle,
    activeTopFixable,
    activePostState,
    activeReservation,
    activeReservationDate,
    activeShareTitle,
    activeShareDesc,
    activeShareBtnName,
    activeUpdateDate,
    activeTopNoti
} = cmsDetailData.actions;
