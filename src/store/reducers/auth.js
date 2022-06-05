// action - login auth data
const AUTH_ADD = 'auth/SET_DATA';
const AUTH_DEL = 'auth/DEL_DATA';

export const setAuthData = (authData) => ({
    type: AUTH_ADD,
    auth: authData,
    isLoggined: true
});
export const delAuthData = () => ({ type: AUTH_DEL });

const initialState = {
    authData: {
        site_id: '',
        email: '',
        accessToken: ''
    },
    isLoggined: false
};
function auths(state = initialState, action) {
    switch (action.type) {
        case AUTH_ADD:
            return {
                authData: state.authData,
                isLoggined: true
            };
        case AUTH_DEL:
            return {
                authData: null,
                isLoggined: false
            };
        default:
            return state;
    }
}
export default auths;
