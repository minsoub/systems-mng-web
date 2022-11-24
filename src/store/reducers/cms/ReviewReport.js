import { createSlice } from '@reduxjs/toolkit';
// 데이터 정의
const initialState = {
    reduceFromDate: '',
    reduceToDate: '',
    reduceViewState: '',
    reduceKeyword: '',
    reducePageNum: 0
};

const cmsReviewReport = createSlice({
    name: 'cmsReviewReport',
    initialState,
    reducers: {
        activeFromDate(state, action) {
            state.reduceFromDate = action.payload.reduceFromDate;
        },
        activeToDate(state, action) {
            state.reduceToDate = action.payload.reduceToDate;
        },
        activeViewState(state, action) {
            state.reduceViewState = action.payload.reduceViewState;
        },
        activeKeyword(state, action) {
            state.reduceKeyword = action.payload.reduceKeyword;
        },
        activePageNum(state, action) {
            state.reducePageNum = action.payload.reducePageNum;
        }
    }
});

export default cmsReviewReport.reducer;

export const { activeFromDate, activeToDate, activeViewState, activeKeyword, activePageNum } = cmsReviewReport.actions;
