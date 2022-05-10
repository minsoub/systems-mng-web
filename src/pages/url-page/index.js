import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import MailIcon from '@mui/icons-material/Mail';
import DeleteIcon from '@mui/icons-material/Delete';
import Label from '@mui/icons-material/Label';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import InfoIcon from '@mui/icons-material/Info';
import ForumIcon from '@mui/icons-material/Forum';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import { useEffect, useState } from 'react';
import Collapse from '@mui/material/Collapse';
import { SvgIconProps } from '@mui/material/SvgIcon';

import axiosInstanceDefault from '../../apis/common/axiosDefault';
import useAxios from '../../apis/common/useAxios';

// material-ui
import {
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Grid,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import MainCard from 'components/MainCard';
import * as apis from 'apis/menu/menuapi';

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: 'var(--tree-view-color)'
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: 'inherit'
        }
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 0,
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(2)
        }
    }
}));

function StyledTreeItem(props) {
    const { bgColor, color, labelIcon: LabelIcon, labelInfo, labelText, ...other } = props;

    return (
        <StyledTreeItemRoot
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
                    <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                        {labelText}
                    </Typography>
                    <Typography variant="caption" color="inherit">
                        {labelInfo}
                    </Typography>
                </Box>
            }
            style={{
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor
            }}
            {...other}
        />
    );
}
StyledTreeItem.propTypes = {
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelIcon: PropTypes.elementType.isRequired,
    labelInfo: PropTypes.string,
    labelText: PropTypes.string.isRequired
};

const TableUrlPage = () => {
    const [list, setList] = useState([]);
    const [data, setData] = useState([]);
    // 메뉴 transaction 호출
    const [resInitMenu, errorMenu, loadingMenu, requestMenu] = useAxios();
    const getMenu = () => {
        requestMenu({
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: '/api/menu',
            requestConfig: {}
        });
    };
    useEffect(() => {
        console.log('>> InitApp <<');
        getMenu();
    }, []);
    useEffect(() => {
        if (resInitMenu && resInitMenu.data && resInitMenu.data.length > 0) {
            const menuComp = resInitMenu.data.map((arr) => <MenuInfo key={arr.id} data={arr} />);
            setData(menuComp);
        }
        // clean up
        return () => setData([]);
    }, [resInitMenu]);
    const getTreeView = (treeData) => {
        return treeData.map((item) => {
            if (item.type === 'group') {
                // group
                // (item.children.length == 0) return;
                const element = item.children;
                return (
                    <StyledTreeItem nodeId={item.id} labelText={item.title} labelIcon={Label}>
                        {getTreeView(element)}
                    </StyledTreeItem>
                );
            } else {
                return <StyledTreeItem nodeId={item.id} labelText={item.title} labelIcon={Label} />;
            }
        });
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">API Get Sample</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    {data}
                </MainCard>
                <TreeView
                    aria-label="gmail"
                    defaultExpanded={['3']}
                    defaultCollapseIcon={<ArrowDropDownIcon />}
                    defaultExpandIcon={<ArrowRightIcon />}
                    defaultEndIcon={<div style={{ width: 24 }} />}
                    sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                >
                    {getTreeView(list)}
                </TreeView>
                <TreeView aria-label="icon expansion" sx={{ flexGrow: 1, maxWidth: 400, position: 'relative' }}>
                    <TreeItem nodeId="1" label="test1">
                        <TreeItem nodeId="1-1" label="test2" />
                        <TreeItem nodeId="1-2" label="test3" />
                        <TreeItem nodeId="1-3" label="test4">
                            <TreeItem nodeId="1-4" label="test5" />
                        </TreeItem>
                    </TreeItem>
                </TreeView>
            </Grid>
        </Grid>
    );
};

export const MenuInfo = (props) => {
    return (
        <div>
            <li key={props.data.id}>
                <b>{props.data.title}</b>
            </li>
            <MenuDetail info={props.data.children} />
        </div>
    );
};

export const MenuDetail = (props) => {
    if (props.info.length === 0) return;
    const data = props.info.map((item, index) => <li key={item.id}> - {item.title}</li>);

    return <div>{data}</div>;
};

export default TableUrlPage;
