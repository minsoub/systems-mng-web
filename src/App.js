// project import
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

import Routes from 'routes';
import AuthRoute from 'routes/AuthRoute';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { signIn } from 'apis/auth/auth';
import { AuthProvider } from 'provider/AuthProvider';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

function App() {
    //const [user, setUser] = useState(null);
    const authenticated = null; // user != null;
    //const login = ({ email, password }) => setUser(signIn({ email, password }));

    return (
        // test
        <ThemeCustomization>
            <ScrollTop>
                {/* <AuthProvider> */}
                {/* {authenticated} ?  */}
                {/* authenticated ? <Routes /> : <Navigate to="/login" /> */}
                <Routes />
                {/* : <Navigate to="/login" /> */}
                {/* <Routes /> authenticated={authenticated} /> */}
                {/* </AuthProvider> */}
            </ScrollTop>
        </ThemeCustomization>
    );
}

export default App;
