// Action Type - DigitalAssetTrend data
const SEARCH_ADD = 'cpc/DigitalAssetTrend/SET_DATA';
const SEARCH_DEL = 'cpc/DigitalAssetTrend/DEL_DATA';
const SEARCH_GET = 'cpc/DigitalAssetTrend/GET_DATA';

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
    reduceKeyword: ''
};

// 초기 데이터 리듀서
const DigitalAssetTrendSearchReducer = (state = initialState, action) => {
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

export default DigitalAssetTrendSearchReducer;
