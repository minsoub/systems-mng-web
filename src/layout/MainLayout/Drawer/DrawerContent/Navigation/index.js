import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RoleApi from 'apis/roles/roleapi';
import { activeSite, activeRole, activeEmail, activeName, activeToken, activeLogin, activeLoginDate } from 'store/reducers/auth';
import NavGroup from './NavGroup';
import { Box, Typography } from '@mui/material';
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

    /**
     * 권한있어 접근 가능한 url과
     * 현재 url location 비교하여 접근 방지
     * @param items --> 데이터
     */
    const makeMenuData = (items) => {
        // Type === 'GROUP'
        const group = [];
        const groupUrl = [];
        // 메뉴 URL
        const menuUrl = [];
        items.filtering;
        // 메뉴 찾기
        const findChild = (menu) => _.mapValues(menu, 'child_menu_resources');
        // 메뉴 합치기
        const sumChild = (item) => _.flatten(Object.values(findChild(item)).map((k) => k));
        /**
         * type 이 ITEM 인 것들 MenuUrl 에 값 push
         * type 이 GROUP 이라면, 새로운 배열에 하위 메뉴 url 담기
         */
        sumChild(items).map((v) => {
            if (v.type === 'ITEM') {
                menuUrl.push(v.url);
            } else {
                group.push(v);
                groupUrl.push(sumChild(group).map((v) => v.url));
            }
        });
        const unCheckMenuList = ['/cpc/dashboard'];
        const interLink = _.union(_.concat(_.flatten(groupUrl), menuUrl, unCheckMenuList));
        // console.log('interLink--->', interLink);
        // console.log('items--->', items);
        // console.log('있나없나--->', !_.includes(interLink, window.location.pathname.toString()));
        //
        // if (!_.includes(interLink, window.location.pathname.toString())) {
        //     alert('접근 권한이 없습니다.');
        //     navigate(-1);
        // }
    };

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
        if (responseData.data) {
            setMenuList(responseData.data.data.menu_list);
            makeMenuData(responseData.data.data.menu_list);
        }
    }, [responseData]);

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
