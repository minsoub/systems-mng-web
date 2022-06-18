import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import * as menuapi from 'apis/menu/menuapi';
import { useNavigate } from 'react-router-dom';
import MenuTreeItem from 'components/TreeMenu/MenuTreeItem';
import SvgIcon from '@mui/material/SvgIcon';

export default function FileSystemNavigator() {
    const navgate = useNavigate();
    const data = menuapi.findmenus({}).items;
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
    makeMenuData(data);
    console.log('menuData:', menuData);

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
    const renderTreeItem = (items) => {
        const menu = items.map((item) => {
            let variant = '';
            if (!item.parents_menu_id || item.parents_menu_id === '') {
                variant = 'h5';
            } else {
                variant = 'body2';
            }
            if (item.children && item.children.length) {
                return (
                    <MenuTreeItem key={item.id} nodeId={item.id} label={item.title} labelText={item.title} variant={variant}>
                        {renderTreeItem(item.children)}
                    </MenuTreeItem>
                );
            } else {
                return <MenuTreeItem key={item.id} nodeId={item.id} label={item.title} labelText={item.title} variant={variant} />;
            }
            return null;
        });
        return menu;
    };
    return (
        <TreeView
            aria-label="file system navigator"
            defaultExpanded={expendMenuId}
            defaultCollapseIcon={<ChevronRightIcon />}
            defaultExpandIcon={<ExpandMoreIcon />}
            onNodeSelect={handleMenu}
            sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
            {renderTreeItem(data)}
        </TreeView>
    );
}
