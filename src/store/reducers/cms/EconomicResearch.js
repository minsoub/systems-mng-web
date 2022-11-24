import { createSlice } from '@reduxjs/toolkit';
// 데이터 정의
const initialState = {
    reduceFromDate: '',
    reduceToDate: '',
    reduceViewState: '',
    reduceKeyword: '',
    reducePageNum: 0
};

// 초기 데이터 리듀서
const cmsEconomicResearch = createSlice({
    name: 'cmsEconomicResearch',
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

export default cmsEconomicResearch.reducer;

export const { activeFromDate, activeToDate, activeViewState, activeKeyword, activePageNum } = cmsEconomicResearch.actions;
