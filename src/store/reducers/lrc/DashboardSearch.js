import moment from 'moment';

// Action Type - Notice data
const SEARCH_ADD = 'lrc/Dashboard/SET_DATA';
const SEARCH_DEL = 'lrc/Dashboard/DEL_DATA';

// Action function => dispatch에서 호출
export const setSearchData = (arg) => ({
    type: SEARCH_ADD,
    data: arg
});
export const delSearchData = () => ({
    type: SEARCH_DEL,
    data: null
});

// 데이터 정의
const initialState = {
    reduceFromDate: moment().format('YYYY-MM-DD'),
    reduceToDate: moment().format('YYYY-MM-DD'),
    reducePeriod: '1'
};

// 초기 데이터 리듀서
const DashboardSearchReducer = (state = initialState, action) => {
    const { type, data } = action;
    switch (type) {
        case SEARCH_ADD:
            return {
                ...state,
                ...data
            };
        case SEARCH_DEL:
            return {
                ...state,
                ...data
            };
        default:
            return state;
    }
};

export default DashboardSearchReducer;
