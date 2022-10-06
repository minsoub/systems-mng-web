import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NavGroup from './NavGroup';
import { Box, Typography } from '@mui/material';
import RoleApi from 'apis/roles/roleapi';
import { activeSite, activeRole, activeEmail, activeName, activeToken, activeLogin, activeLoginDate } from 'store/reducers/auth';
import _ from 'lodash';

export default function FileSystemNavigator(navigation, site) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // 사이트명, 권한
    const { siteId, roleId } = useSelector((state) => state.auth);
    // 메뉴 리스트
    const [menuList, setMenuList] = useState([]);
    //const data = menuapi.findmenus({}).items;
    //const [responseData, requestError, loading, { menumngSearch }] = MenuMngApi();
    const [responseData, requestError, loading, { roleRegisterTreeList }] = RoleApi();
    //검색용 메뉴 데이터 생성
    const menuData = [];
    const expendsMenuId = [];

    //const data = menumngSearch(site_id, true);
    //  menuapi.findlist(site_id);

    /**
     * 사이트 ID 가 없을 때,
     * 로컬스토리지 authenticated 가 있다면
     * store 에 값들 저장하기
     *
     * 사이트 ID && 권한 있을 경우,
     * 메뉴 리스트 호출해줌
     */
    useEffect(() => {
        console.log('menusearch called...');
        if (!siteId) {
            console.log('site is is null => reload');
            if (localStorage.hasOwnProperty('authenticated')) {
                let authData = JSON.parse(localStorage.getItem('authenticated'));
                dispatch(activeSite({ siteId: authData.siteId }));
                dispatch(activeRole({ roleId: authData.roleId }));
                dispatch(activeEmail({ email: authData.email }));
                dispatch(activeName({ name: authData.name }));
                dispatch(activeToken({ accessToken: authData.accessToken }));
                dispatch(activeLogin({ isLoggined: authData.isLoggined }));
                dispatch(activeLoginDate({ loginDate: authData.loginDate }));
            } else {
                navigate('/');
            }
        }
        // 메뉴 호출
        if (siteId && roleId) roleRegisterTreeList(roleId, siteId);
    }, [siteId, roleId]);

    /**
     * 실패했을 경우,
     * /login 으로 리다이렉팅
     */
    useEffect(() => {
        if (requestError) {
            if (requestError.result === 'FAIL') {
                console.log('error requestError :', requestError);
                if (requestError.error.code === 909 || !localStorage.hasOwnProperty('authenticated')) {
                    navigate('/login');
                }
            }
        }
    }, [requestError]);

    useEffect(() => {
        if (!responseData) {
            return;
        }
        // 메뉴 리스트 url
        const menuPathList = responseData.data.data.menu_list[0].child_menu_resources;
        const menuUrl = _.map(menuPathList, 'url');
        const currentUrl = window.location.pathname.toString();
        if (responseData.data) {
            setMenuList(responseData.data.data.menu_list);
            makeMenuData(responseData.data.data.menu_list);
        }

        // 메뉴바에 있는 메뉴말고 강제로 다른 URL 로 이탈할 경우
        if (!_.includes(menuUrl, window.location.pathname)) {
            alert('접근 권한이 없습니다.');
            navigate(-1);
        }
    }, [responseData]);

    // 메뉴
    const makeMenuData = (items) => {
        items.filtering;
        items.forEach((item) => {
            if (item.visible === true) {
                menuData.push(item);
                if (item.type === 'GROUP') {
                    expendsMenuId.push(item.id);
                }

                if (item.children && item.child_menu_resources.length) {
                    makeMenuData(item.child_menu_resources);
                }
            }
        });
    };

    const handleMenu = (event, nodeId) => {
        console.log('handleMenu called....');
        const selectItem = _.find(menuData, { id: nodeId });
        console.log('selectItem:', selectItem);
        if (selectItem.type === 'ITEM') {
            if (selectItem.external) {
                //window.location.href = selectItem.url;
                // TODO - Security 문제로 막음. : security/detect-non-literal-fs-filename
                alert('보안 문제로 지원하지 않습니다!!!');
                //window.open(selectItem.url, '_blank');
            } else {
                navigate(selectItem.url);
            }
        }
    };
    // const renderTreeItem = (items) => {
    //     const menu = items.map((item) => {
    //         let variant = '';
    //         if (!item.parents_menu_id || item.parents_menu_id === '') {
    //             variant = 'h5';
    //         } else {
    //             variant = 'body2';
    //         }
    //         if (item.children && item.children.length) {
    //             return (
    //                 <MenuTreeItem key={item.id} nodeId={item.id} label={item.name} labelText={item.name} variant={variant}>
    //                     {renderTreeItem(item.children)}
    //                 </MenuTreeItem>
    //             );
    //         } else {
    //             return <MenuTreeItem key={item.id} nodeId={item.id} label={item.name} labelText={item.name} variant={variant} />;
    //         }
    //         return null;
    //     });
    //     return menu;
    // };

    //console.log(navigation);
    const navGroups = (menus) => {
        const menu = menus.map((item) => {
            if (item.visible === true) {
                switch (item.type) {
                    case 'GROUP':
                        return <NavGroup key={item.id} item={item} />;
                    default:
                        return (
                            <Typography key={item.id} variant="h6" color="error" align="center">
                                Fix - Navigation Group
                            </Typography>
                        );
                }
            }
        });
        return menu;
    };
    return <>{menuList.length > 0 && <Box sx={{ pt: 1, pb: 8, mt: 5 }}>{navGroups(menuList)}</Box>}</>;
    // return (
    //     <TreeView
    //         aria-label="file system navigator"
    //         defaultExpanded={expendMenuId}
    //         defaultCollapseIcon={<ChevronRightIcon />}
    //         defaultExpandIcon={<ExpandMoreIcon />}
    //         onNodeSelect={handleMenu}
    //         sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    //     >
    //         {renderTreeItem(data)}
    //     </TreeView>
    // );
}
