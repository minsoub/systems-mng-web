import React, { useEffect, useState } from 'react';
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

export default function FileSystemNavigator(navigation) {
    const navgate = useNavigate();
    const [menuList, setMenuList] = useState([]);
    //const data = menuapi.findmenus({}).items;
    const [responseData, requestError, loading, { menumngSearch }] = MenuMngApi();

    let authData = null;
    if (localStorage.hasOwnProperty('authenticated')) {
        //console.log(localStorage.getItem('authenticated'));
        authData = JSON.parse(localStorage.getItem('authenticated'));
    }
    let site_id = authData.siteId; // login site id

    //const data = menumngSearch(site_id, true);
    //  menuapi.findlist(site_id);

    useEffect(() => {
        console.log('menusearch called...');
        menumngSearch(site_id, true);
    }, []);

    useEffect(() => {
        if (requestError) {
            if (requestError.result === 'FAIL') {
                console.log('error requestError');
                console.log(requestError);
            }
        }
    }, [requestError]);

    useEffect(() => {
        if (!responseData) {
            return;
        }
        console.log(responseData);
        if (responseData.data) {
            console.log(responseData.data);
            console.log('menuData:', responseData.data.data);
            setMenuList(responseData.data.data);
            makeMenuData(responseData.data.data);
        }
    }, [responseData]);

    //검색용 메뉴 데이터 생성
    const menuData = [];
    const expendMenuId = [];
    const makeMenuData = (items) => {
        items.forEach((item) => {
            //console.log('>>', item);
            menuData.push(item);
            if (item.type === 'group') {
                expendMenuId.push(item.id);
            }

            if (item.children && item.children.length) {
                makeMenuData(item.children);
            }
        });
    };

    const handleMenu = (event, nodeId) => {
        console.log('handleMenu called....');
        const selectItem = _.find(menuData, { id: nodeId });
        console.log('selectItem:', selectItem);
        if (selectItem.type === 'item') {
            if (selectItem.external) {
                //window.location.href = selectItem.url;
                window.open(selectItem.url, '_blank');
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
