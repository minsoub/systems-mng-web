// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';

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
