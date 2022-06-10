// Action Type - login auth data
const AUTH_ADD = 'auth/SET_DATA';
const AUTH_DEL = 'auth/DEL_DATA';
const AUTH_GET = 'auth/GET_DATA';

// Action function => dispatch에서 호출
export const setAuthData = (arg) => ({
    type: AUTH_ADD,
    data: arg
});
export const delAuthData = () => ({
    type: AUTH_DEL,
    data: null
});

// 데이터 정의
const initialState = {
    siteId: '',
    email: '',
    accessToken: '',
    isLoggined: false
};

// 초기 데이터 리듀서
const authsReducer = (state = initialState, action) => {
    const { type, data } = action;
    switch (action.type) {
        case AUTH_ADD:
            return {
                ...state,
                ...data
            };
        case AUTH_DEL:
            return {
                ...state,
                ...data
            };
        default:
            return state;
    }
};

export default authsReducer;
