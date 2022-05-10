import AuthContext from 'provider/AuthProvider';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useRoutes } from 'react-router-dom';

// project import
//import LoginRoutes from './LoginRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function AuthRoute() {
    // ({ authenticated }) {
    const { state } = useContext(AuthContext);

    //const { isLoggedIn } = useSelector((state) => state.auth);
    //console.log(authenticated);

    //return useRoutes([MainRoutes(state.loggined), LoginRoutes(state.loggined)]);

    return useRoutes(); // LoginRoutes]);
}
