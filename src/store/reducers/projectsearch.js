// Action Type - login auth data
const PROJECT_SEARCH_ADD = 'project/SET_DATA';
const PROJECT_SEARCH_DEL = 'project/DEL_DATA';

// Action function => dispatch에서 호출
export const setSearchData = (arg) => ({
    type: PROJECT_SEARCH_ADD,
    data: arg
});
export const delSearchData = () => ({
    type: PROJECT_SEARCH_DEL,
    data: null
});

// 데이터 정의
const initialState = {
    reduceFromDate: '',
    reduceToDate: '',
    reducePeriod: '5',
    reduceContractCode: '',
    reduceProcessCode: '',
    reduceBusinessList: [],
    reduceNetworkList: [],
    reduceKeyword: '',
    reducePage: 0,
    reduceRowsPerPage: 10
};

// 초기 데이터 리듀서
const projectSearchReducer = (state = initialState, action) => {
    const { type, data } = action;
    switch (type) {
        case PROJECT_SEARCH_ADD:
            return {
                ...state,
                ...data
            };
        case PROJECT_SEARCH_DEL:
            return {
                ...state,
                ...data
            };
        default:
            return state;
    }
};

export default projectSearchReducer;
