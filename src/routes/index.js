import AuthContext from 'provider/AuthProvider';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useRoutes } from 'react-router-dom';

// project import
import MainRoutes from './MainRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    // ({ authenticated }) {
    const { state } = useContext(AuthContext);

    //const { isLoggedIn } = useSelector((state) => state.auth);
    //console.log(authenticated);

    //return useRoutes([MainRoutes(state.loggined), LoginRoutes(state.loggined)]);

    return useRoutes(MainRoutes); // [MainRoutes, LoginRoutes]);
}
