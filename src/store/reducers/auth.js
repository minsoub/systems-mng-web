import { createSlice } from '@reduxjs/toolkit';
// Action Type - login auth data
const AUTH_ADD = 'auth/SET_DATA';
const AUTH_DEL = 'auth/DEL_DATA';
const AUTH_GET = 'auth/GET_DATA';
const AUTH_ITEM_ADD = '`auth/ITEM_ADD';

// Action function => dispatch에서 호출
export const setAuthData = (arg) => ({
    type: AUTH_ADD,
    data: arg
});
export const delAuthData = () => ({
    type: AUTH_DEL,
    data: null
});
export const setAuthSite = (site) => ({
    type: AUTH_ITEM_ADD,
    data: site
});

// 데이터 정의
const initialState = {
    siteId: '',
    email: '',
    accessToken: '',
    isLoggined: false,
    loginDate: ''
};

// 초기 데이터 리듀서
// const authsReducer = (state = initialState, action) => {
//     const { type, data } = action;
//     switch (action.type) {
//         case AUTH_ADD:
//             return {
//                 ...state,
//                 ...data
//             };
//         case AUTH_DEL:
//             return {
//                 ...state,
//                 ...data
//             };
//         case AUTH_ITEM_ADD:
//             return {
//                 ...state,
//                 ...data
//             };
//         default:
//             return state;
//     }
// };

// export default authsReducer;

const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        activeSite(state, action) {
            state.siteId = action.payload.siteId;
        },

        activeEmail(state, action) {
            state.email = action.payload.email;
        },

        activeToken(state, action) {
            state.accessToken = action.payload.accessToken;
        },

        activeLogin(state, action) {
            state.isLoggined = action.payload.isLoggined;
        },

        activeLoginDate(state, action) {
            state.loginDate = action.payload.loginDate;
        }
    }
});

export default auth.reducer;

export const { activeSite, activeEmail, activeToken, activeLogin, activeLoginDate } = auth.actions;
