// Action Type - Notice data
const SEARCH_ADD = 'lrc/SystemCheckMng/SET_DATA';
const SEARCH_DEL = 'lrc/SystemCheckMng/DEL_DATA';
const SEARCH_GET = 'lrc/SystemCheckMng/GET_DATA';

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
    reduceFromDate: '',
    reduceToDate: '',
    reducePeriod: '',
    reduceCategory: '',
    reduceKeyword: ''
};

// 초기 데이터 리듀서
const SystemCheckMngSearchReducer = (state = initialState, action) => {
    const { type, data } = action;
    switch (action.type) {
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

export default SystemCheckMngSearchReducer;