// Action Type - Campaign data
const SEARCH_ADD = 'cpc/Campaign/SET_DATA';
const SEARCH_DEL = 'cpc/Campaign/DEL_DATA';
const SEARCH_GET = 'cpc/Campaign/GET_DATA';

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
const EconomicResearchSearchReducer = (state = initialState, action) => {
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

export default EconomicResearchSearchReducer;
