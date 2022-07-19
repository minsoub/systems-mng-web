// Action Type - board data
const SEARCH_ADD = 'board/SET_DATA';
const SEARCH_DEL = 'board/DEL_DATA';
const SEARCH_GET = 'board/GET_DATA';

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
    reduceSiteId: '',
    reduceIsUse: true
};

// 초기 데이터 리듀서
const BoardSearchReducer = (state = initialState, action) => {
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

export default BoardSearchReducer;
