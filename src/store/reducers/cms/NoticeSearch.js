import { createSlice } from '@reduxjs/toolkit';

// 데이터 정의
const initialState = {
    reduceFromDate: '',
    reduceToDate: '',
    reduceCategory: '',
    reduceBannerNoti: '',
    reduceBannerState: '',
    reduceKeyword: '',
    reducePageNum: 0
};
const cmsNotice = createSlice({
    name: 'cmsNotice',
    initialState,
    reducers: {
        activeFromDate(state, action) {
            state.reduceFromDate = action.payload.reduceFromDate;
        },
        activeToDate(state, action) {
            state.reduceToDate = action.payload.reduceToDate;
        },
        activeCategory(state, action) {
            state.reduceCategory = action.payload.reduceCategory;
        },
        activeBannerNoti(state, action) {
            state.reduceBannerNoti = action.payload.reduceBannerNoti;
        },
        activeBannerState(state, action) {
            state.reduceBannerState = action.payload.reduceBannerState;
        },
        activeKeyword(state, action) {
            state.reduceKeyword = action.payload.reduceKeyword;
        },
        activePageNum(state, action) {
            state.reducePageNum = action.payload.reducePageNum;
        }
    }
});

export default cmsNotice.reducer;

export const {
    activeFromDate,
    activeToDate,
    activeCategory,
    activeBannerNoti,
    activeBannerState,
    activeKeyword,
    activePageNum
} = cmsNotice.actions;
