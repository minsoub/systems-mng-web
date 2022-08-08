import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import * as menuapi from 'apis/menu/menuapi';
import { useNavigate } from 'react-router-dom';
import MenuTreeItem from 'components/TreeMenu/MenuTreeItem';
import SvgIcon from '@mui/material/SvgIcon';
import NavGroup from './NavGroup';
import { Box, Typography } from '@mui/material';
import MenuMngApi from 'apis/menu/menumngapi';
import RoleApi from 'apis/roles/roleapi';
import { activeSite, activeRole, activeEmail, activeName, activeToken, activeLogin, activeLoginDate } from 'store/reducers/auth';

export default function FileSystemNavigator(navigation, site) {
    const navgate = useNavigate();
    const dispatch = useDispatch();
    const { siteId } = useSelector((state) => state.auth);
    const { roleId } = useSelector((state) => state.auth);
    const [menuList, setMenuList] = useState([]);
    //const data = menuapi.findmenus({}).items;
    //const [responseData, requestError, loading, { menumngSearch }] = MenuMngApi();
    const [responseData, requestError, loading, { roleRegisterTreeList }] = RoleApi();
    const [site_id, setSiteId] = useState(siteId);
    const [role_id, setRoleId] = useState(roleId);

    //const data = menumngSearch(site_id, true);
    //  menuapi.findlist(site_id);

    useEffect(() => {
        console.log('menusearch called...');
        // let local_site_id;
        if (!siteId) {
            console.log('site is is null => reload');
            if (localStorage.hasOwnProperty('authenticated')) {
                let authData = JSON.parse(localStorage.getItem('authenticated'));
                dispatch(activeSite({ siteId: authData.siteId }));
                dispatch(activeRole({ roleId: authData.roleId })); // Role Id
                dispatch(activeEmail({ email: authData.email }));
                dispatch(activeName({ name: authData.name }));
                dispatch(activeToken({ accessToken: authData.accessToken }));
                dispatch(activeLogin({ isLoggined: authData.isLoggined }));
                dispatch(activeLoginDate({ loginDate: authData.loginDate }));
            } else {
                navgate('/');
            }
        }
        if (siteId && roleId) roleRegisterTreeList(roleId, siteId);
        //menumngSearch(site_id, true);
    }, []);

    useEffect(() => {
        if (requestError) {
            if (requestError.result === 'FAIL') {
                console.log('error requestError');
                console.log(requestError);
                if (requestError.error.code === 909 || !localStorage.hasOwnProperty('authenticated')) {
                    // token expire
                    //alert('로그인 유효기간이 만료되어 로그아웃되었습니다. 재로그인 하시기 바랍니다.');
                    navgate('/login');
                }
            }
        }
    }, [requestError]);
    useEffect(() => {
        console.log(`useEffect site called..${siteId}`);
        if (siteId) {
            console.log('site => ' + siteId);
            setSiteId(siteId);
        }
        if (roleId) {
            setRoleId(roleId);
            roleRegisterTreeList(roleId, siteId);
            //menumngSearch(siteId, true);
        }
    }, [siteId, roleId]);

    useEffect(() => {
        if (!responseData) {
            return;
        }
        console.log(responseData);
        if (responseData.data) {
            console.log(responseData.data);
            console.log('menuData:', responseData.data.data.menu_list);
            setMenuList(responseData.data.data.menu_list);
            makeMenuData(responseData.data.data.menu_list);
        }
    }, [responseData]);

    //검색용 메뉴 데이터 생성
    const menuData = [];
    const expendMenuId = [];
    const makeMenuData = (items) => {
        items.filtering;
        items.forEach((item) => {
            if (item.visible === true) {
                //console.log('>>', item);
                menuData.push(item);
                if (item.type === 'GROUP') {
                    expendMenuId.push(item.id);
                }

                if (item.children && item.child_menu_resources.length) {
                    //children.length) {
                    makeMenuData(item.child_menu_resources); // .children);
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
                navgate(selectItem.url);
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
    return menuList.length > 0 && <Box sx={{ pt: 1 }}>{navGroups(menuList)}</Box>;
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
