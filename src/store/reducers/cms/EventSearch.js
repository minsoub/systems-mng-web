import { createSlice } from '@reduxjs/toolkit';

// 데이터 정의
const initialState = {
    reduceFromDate: '',
    reduceToDate: '',
    reduceViewState: '',
    reduceKeyword: '',
    reduceEventType: '',
    reducePageNum: 0
};

const cmsEvent = createSlice({
    name: 'cmsEvent',
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
        activeEventType(state, action) {
            state.reduceEventType = action.payload.reduceEventType;
        },
        activePageNum(state, action) {
            state.reducePageNum = action.payload.reducePageNum;
        }
    }
});

export default cmsEvent.reducer;

export const { activeFromDate, activeToDate, activeViewState, activeKeyword, activeEventType, activePageNum } = cmsEvent.actions;
