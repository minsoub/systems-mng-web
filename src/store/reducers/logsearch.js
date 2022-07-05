// Action Type - login auth data
const LOG_SEARCH_ADD = 'log/SET_DATA';
const LOG_SEARCH_DEL = 'log/DEL_DATA';
const LOG_SEARCH_GET = 'log/GET_DATA';

// Action function => dispatch에서 호출
export const setSearchData = (arg) => ({
    type: LOG_SEARCH_ADD,
    data: arg
});
export const delSearchData = () => ({
    type: LOG_SEARCH_DEL,
    data: null
});

// 데이터 정의
const initialState = {
    reduceFromDate: '',
    reduceToDate: '',
    reducePeriod: '',
    reduceKeyword: ''
};

// 초기 데이터 리듀서
const logSearchReducer = (state = initialState, action) => {
    const { type, data } = action;
    switch (action.type) {
        case LOG_SEARCH_ADD:
            return {
                ...state,
                ...data
            };
        case LOG_SEARCH_DEL:
            return {
                ...state,
                ...data
            };
        default:
            return state;
    }
};

export default logSearchReducer;
