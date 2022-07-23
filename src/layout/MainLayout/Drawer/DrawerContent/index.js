// project import
import Navigation from './Navigation';
import SimpleBar from 'components/third-party/SimpleBar';
import { useSelector } from 'react-redux';
import React from 'react';
import { useNavigate } from 'react-router-dom';
// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = ({ navigation }) => {
    const { siteId } = useSelector((state) => state.auth);
    //console.log(`site change => ${siteId}`);
    const navigate = useNavigate();

    // let authData = null;
    // if (localStorage.hasOwnProperty('authenticated')) {
    //     //console.log(localStorage.getItem('authenticated'));
    //     authData = JSON.parse(localStorage.getItem('authenticated'));
    // }

    // if (authData == null) {
    //     console.log('토큰 정보가 존재하지 않습니다!!!');
    //     navigate('/login');
    //     return;
    // }
    // let decodePayload = jwt.decode(authData.accessToken);
    // var exp = new Date(decodePayload.exp * 1000).getTime();
    // var now = new Date().getTime();
    // if (now > exp) {
    //     console.log('AccessToken is invalid...');
    //     alert('Token 정보가 만료되었습니다!!!');
    //     navigate('/login');
    //     return;
    // }

    return (
        <SimpleBar
            sx={{
                '& .simplebar-content': {
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
        >
            <Navigation navigation={navigation} />
            {/* <NavCard /> */}
        </SimpleBar>
    );
};

export default DrawerContent;
