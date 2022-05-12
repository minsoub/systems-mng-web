import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import * as menuapi from 'apis/menu/menuapi';
import { useNavigate } from 'react-router-dom';

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
    /*
    const data = [
        {
            id: '1',
            title: 'Applications',
            children: [{ id: '2', title: 'Calendar' }]
        },
        {
            id: '5',
            title: 'Documents',
            children: [
                { id: '10', title: 'OSS' },
                { id: '6', title: 'MUI', children: [{ id: '8', title: 'Index' }] }
            ]
        }
    ];
*/

    const handleMenu = (event, nodeId) => {
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
            if (item.children && item.children.length) {
                return (
                    <TreeItem key={item.id} nodeId={item.id} label={item.title}>
                        {renderTreeItem(item.children)}
                    </TreeItem>
                );
            } else {
                return <TreeItem key={item.id} nodeId={item.id} label={item.title} />;
            }
            return null;
        });
        return menu;
    };
    return (
        <TreeView
            aria-label="file system navigator"
            defaultExpanded={expendMenuId}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            onNodeSelect={handleMenu}
            sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
            {renderTreeItem(data)}
        </TreeView>
    );
}
