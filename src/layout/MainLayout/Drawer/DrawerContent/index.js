// project import
import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import SimpleBar from 'components/third-party/SimpleBar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Grid, FormControl, Select, MenuItem } from '@mui/material';

import jwt from 'jsonwebtoken';
import RoleApi from 'apis/roles/roleapi';
import { activeSite, activeRole } from 'store/reducers/auth';
// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = ({ navigation, open }) => {
    const { siteId } = useSelector((state) => state.auth);
    //console.log(`site change => ${siteId}`);
    const dispatch = useDispatch();
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
    const [mySiteId, setMySiteId] = useState('');
    const [mySiteList, setSiteList] = useState([]);

    const [responseData, requestError, loading, { roleDetail }] = RoleApi();

    let authData = null;
    if (localStorage.hasOwnProperty('authenticated')) {
        //console.log(localStorage.getItem('authenticated'));
        authData = JSON.parse(localStorage.getItem('authenticated'));
    }
    let site_id = authData ? authData.siteId : null; // login site id
    useEffect(() => {
        if (authData) {
            if (!mySiteId) setMySiteId(site_id);
            // 나의 Role에 관련된 사이트 아이디 조회
            let tokenData = jwt.decode(authData.accessToken);
            //console.log(tokenData);
            let ROLE = tokenData.ROLE;
            setSiteList([]);
            ROLE.map((item, index) => {
                roleDetail(item);
            });
        }
    }, []);
    useEffect(() => {
        if (!responseData) return;
        // console.log(responseData);
        // console.log(responseData.data);
        // console.log(responseData.data.data.site_id);
        // console.log(responseData.data.data.name);
        if (responseData.data.data) {
            setSiteList((arr) => [
                ...arr,
                { id: responseData.data.data.id, site_id: responseData.data.data.site_id, name: responseData.data.data.name }
            ]);
            //console.log(mySiteList);

            if (responseData.data.data.site_id === mySiteId) {
                authData.roleId = responseData.data.data.id; // Role ID
                localStorage.setItem('authenticated', JSON.stringify(authData));

                // role과 site_id로 메뉴 조회
                dispatch(activeRole({ roleId: responseData.data.data.id }));
            }
        }
    }, [responseData]);
    // 입력 박스 입력 시 호출
    const handleChange = (e) => {
        sessionStorage.setItem('beforeSiteID', mySiteId);
        // console.log(authData, mySiteList, mySiteId, e.target.value);
        if (!e.target.value) {
            return;
        }
        changesiteType(e.target.value);
    };
    const changesiteType = (siteId) => {
        setMySiteId(siteId);
        // 변경된 사이트를 통해서 다시 메뉴를 리로드해야 한다.
        authData.siteId = siteId;
        // role define
        mySiteList.map((item, index) => {
            if (item.site_id === siteId) {
                authData.roleId = item.id; // Role ID
                dispatch(activeRole({ roleId: item.id })); // Role ID
            }
        });
        localStorage.setItem('authenticated', JSON.stringify(authData)); // 토큰 재저장
        //console.log(authData);
        // menu reload
        dispatch(activeSite({ siteId: siteId }));
        if (authData.siteId === '62a15f4ae4129b518b133128') {
            // 투자보호
            navigate('/cpc/dashboard');
        } else if (authData.siteId === '62a15f4ae4129b518b133129') {
            navigate('/main/dashboard');
        } else {
            navigate('/lrc/dashboard');
        }
    }

    return (
        <SimpleBar
            sx={{
                '& .simplebar-content': {
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
        >
            {open && (
                <Grid sx={{ position: 'fixed', width: '259px', top: '58px', left: 0, bgcolor: '#fff', zIndex: '1000', height: 35 }}>
                    <FormControl sx={{ ml: 2.5, mb: 2.5, width: 220, maxHeight: 35 }} size="small">
                        <Select name="mySiteId" label="사이트명" size="small" value={mySiteId} onChange={handleChange}>
                            <MenuItem value="">
                                <em>Choose a Site Type</em>
                            </MenuItem>
                            {mySiteList.length > 0 &&
                                mySiteList.map((item, index) => (
                                    <MenuItem key={index} value={item.site_id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </Grid>
            )}
            <Navigation sx={{ marginTop: '4rem' }} navigation={navigation} />
            {/* <NavCard /> */}
        </SimpleBar>
    );
};

export default DrawerContent;
