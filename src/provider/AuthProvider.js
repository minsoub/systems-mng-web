import { createContext, useState } from 'react';

const AuthContext = createContext({
    state: { userid: null, username: null, loggined: false, token: null },
    action: {
        setUserid: () => {},
        setUsername: () => {},
        setLoggined: () => {},
        setToken: () => {}
    }
});

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ chidlren }) => {
    const [userid, setUserid] = useState(null);
    const [username, setUsername] = useState(null);
    const [loggined, setLoggined] = useState(false);
    const [token, setToken] = useState(null);

    const login = {
        state: { userid, username, loggined, token },
        actions: { setUserid, setUsername, setLoggined, setToken }
    };

    return <AuthContext.Provider value={login}>{chidlren}</AuthContext.Provider>;
};

const { Consumer: AuthConsumer } = AuthContext;

export { AuthProvider, AuthConsumer };
export default AuthContext;
