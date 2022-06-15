import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// material-ui
// eslint-disable-next-line prettier/prettier
import {
    OutlinedInput,
    Box,
    Button,
    Grid,
    Stack,
    TextField,
    Collapse,
    Alert,
    AlertTitle,
    Typography,
    FormControl,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Paper,
    IconButton
} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { styled } from '@mui/material/styles';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import SvgIcon from '@mui/material/SvgIcon';
import { Input } from 'antd';
import { boolean } from '../../../node_modules/yup/lib/index';
import DefaultDataGrid from '../../components/DataGrid/DefaultDataGrid';
import CheckBoxDataGrid from '../../components/DataGrid/CheckBoxDataGrid';
import SiteApi from 'apis/site/siteapi';
import MenuMngApi from 'apis/menu/menumngapi';
import ErrorScreen from 'components/ErrorScreen';
import StyledTtreeItem from 'components/TreeMenu/StyledTreeItem';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

import MailIcon from '@mui/icons-material/Mail';
import Label from '@mui/icons-material/Label';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import InfoIcon from '@mui/icons-material/Info';
import ForumIcon from '@mui/icons-material/Forum';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import menu from 'store/reducers/menu';

function MinusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
        </SvgIcon>
    );
}

function PlusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
        </SvgIcon>
    );
}

function CloseSquare(props) {
    return (
        <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
        </SvgIcon>
    );
}

const MenuRegForm = () => {
    const navigate = useNavigate();
    const [resData, reqErr, resLoading, { siteSearch }] = SiteApi();
    const [responseData, requestError, responseLoading, { menumngSearch, menumngDetail, menumngInsert }] = MenuMngApi();

    const [expanded, setExpanded] = useState([]);
    const [selected, setSelected] = useState([]);
    const [menudata, setMenuData] = useState([]); // menu data

    const [isUpdate, setIsUpdate] = useState(false); // input mode
    const [isButton, setIsButton] = useState(false); // +, - 버튼 모드

    const menuData = [
        {
            id: 't1',
            name: '통합관리',
            is_use: true,
            site_id: 'xxxx',
            order: 1,
            parent_menu_id: '',
            childMenu: [
                {
                    id: 't2',
                    name: '사이트관리',
                    is_use: true,
                    site_id: 'xxxx',
                    order: 1,
                    parent_menu_id: 't1'
                },
                {
                    id: 't3',
                    name: '메뉴 관리',
                    is_use: true,
                    site_id: 'xxxx',
                    order: 1,
                    parent_menu_id: 't1'
                },
                {
                    id: 't4',
                    name: '권한 관리',
                    is_use: true,
                    site_id: 'xxxx',
                    order: 1,
                    parent_menu_id: 't1'
                }
            ]
        },
        {
            id: 't5',
            name: '통합 관리',
            is_use: true,
            site_id: 'xxxx',
            order: 1,
            parent_menu_id: '',
            childMenu: [
                {
                    id: 't6',
                    name: '계정 관리',
                    is_use: true,
                    site_id: 'xxxx',
                    order: 1,
                    parent_menu_id: 't5'
                }
            ]
        },
        {
            id: 't7',
            name: '통합시스템 관리',
            is_use: true,
            site_id: 'xxxx',
            order: 1,
            parent_menu_id: '',
            childMenu: [
                {
                    id: 't8',
                    name: '사이트 관리',
                    is_use: true,
                    site_id: 'xxxx',
                    order: 1,
                    parent_menu_id: 't7'
                },
                {
                    id: 't9',
                    name: '메뉴 관리',
                    is_use: true,
                    site_id: 'xxxx',
                    order: 1,
                    parent_menu_id: 't7',
                    childMenu: [
                        {
                            id: 't10',
                            name: '메뉴 등록',
                            is_use: true,
                            site_id: 'xxxx',
                            order: 1,
                            parent_menu_id: 't9'
                        }
                    ]
                }
            ]
        }
    ];

    // 입력 데이터 - Default
    const [inputs, setInputs] = useState({
        id: '',
        name: '',
        site_id: '',
        parent_menu_id: '',
        parent_menu_name: '',
        order: 1,
        is_use: true,
        url: '',
        type: '',
        target: '',
        icon: '',
        external_link: false,
        description: ''
    });
    const {
        id,
        name,
        site_id,
        parent_menu_id,
        parent_menu_name,
        order,
        is_use,
        url,
        type,
        target,
        icon,
        external_link,
        description
    } = inputs;

    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [siteList, setSiteList] = useState([]);
    const [search_is_use, setIsUse] = useState(true);

    // onload
    useEffect(() => {
        //errorClear();
        // 사이트 구분 리스트 가져오기
        siteSearch(true, '');
        // setMenuData(menuData);
        // //roleList();
        // // test - tree expended
        // console.log(menudata);
        // let exp = [];
        // menudata.map((data, idx) => {
        //     exp.push(data.id);
        //     if (data.childMenu) {
        //         data.map((d, i) => {
        //             exp.push(d.id);
        //             if (d.childMenu) {
        //                 d.map((c, k) => {
        //                     c.push(c.id);
        //                 });
        //             }
        //         });
        //     }
        // });
        // setExpanded(exp);
        // console.log(exp);
    }, []);

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            console.log('error requestError');
            console.log(requestError);
            setErrorTitle('Error Message');
            setErrorMessage(requestError);
            setOpen(true);
        }
    }, [requestError]);

    // Combobox data transaction
    // 사이트
    useEffect(() => {
        if (!resData) {
            return;
        }
        switch (resData.transactionId) {
            case 'siteList':
                if (resData.data.data) {
                    let siteData = resData.data.data;
                    let list = [];
                    siteData.map((site, index) => {
                        const s = { id: site.id, name: site.name };
                        console.log(s);
                        list.push(s);
                    });
                    setSiteList(list);
                }
                break;
            default:
        }
    }, [resData]);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'menuList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setMenuData(responseData.data.data);
                } else {
                    setMenuData([]);
                }
                break;
            case 'detailData':
                if (responseData.data.data) {
                    let res = responseData.data.data;
                    setInputs({
                        id: res.id,
                        name: res.name,
                        site_id: res.site_id,
                        parent_menu_id: res.parent_menu_id,
                        parent_menu_name: res.parent_menu_name,
                        order: res.order,
                        url: res.url,
                        type: res.type,
                        target: res.target,
                        icon: res.icon,
                        external_link: res.external_link,
                        description: res.description
                    });
                    setIsUpdate(true);
                }
                break;
            case 'insertData':
                if (responseData.data.data) {
                    alert('저장을 완료하였습니다!!!');
                    let res = responseData.data.data;
                    setInputs({
                        id: res.id,
                        name: res.name,
                        site_id: res.site_id,
                        parent_menu_id: res.parent_menu_id,
                        parent_menu_name: res.parent_menu_name,
                        order: res.order,
                        url: res.url,
                        type: res.type,
                        target: res.target,
                        icon: res.icon,
                        external_link: res.external_link,
                        description: res.description
                    });
                    setIsUpdate(true);
                    searchClick();
                }
                break;
            case 'detailData':
                break;
            default:
        }
    }, [responseData]);

    // 에러 정보를 클리어 한다.
    // const errorClear = () => {
    //     setOpen(false);
    //     setErrorTitle('');
    //     setErrorMessage('');
    // };

    const handleClose = () => {
        setVisible(false);
    };

    const isUseChange = (e) => {
        switch (e.target.name) {
            case 'is_use':
                setIsUse(e.target.checked);
                break;
            default:
                break;
        }
    };

    // search
    const searchClick = () => {
        //errorClear();
        console.log('searchClick called...');
        if (!inputs.site_id) {
            alert('사이트명을 선택하세요!!!');
            return;
        }
        menumngSearch(inputs.site_id, search_is_use);
    };
    // 저장한다.
    const saveClick = () => {
        console.log(inputs);
        // Validation check
        if (!inputs.site_id) {
            setError('사이트명을 선택하지 않았습니다');
            return;
        }
        if (!inputs.name) {
            setError('메뉴명을 입력하지 않았습니다!');
            return;
        }
        if (!inputs.order) {
            setError('정렬 순서를 입력하지 않았습니다');
            return;
        }
        if (!inputs.type) {
            setError('메뉴타입을 선택하지 않았습니다');
            return;
        }
        if (confirm('저장하시겠습니까?')) {
            if (!isUpdate) {
                menumngInsert(inputs);
            } else {
                menuUpdate(inputs);
            }
        }
    };

    // 입력 박스 입력 시 호출
    const handleChange = (e) => {
        let { value, name } = e.target;
        if (e.target.type === 'checkbox') {
            value = e.target.checked;
        }
        setInputs({
            ...inputs, // 기존 input 객체 복사
            [name]: value
        });
    };
    const handleBlur = (e) => {
        console.log(e);
    };

    // 메뉴 팝업 검색
    const menuPopupSearch = () => {
        // 검색
    };

    // 에러 메시지 처리
    const setError = (msg) => {
        setErrorTitle('입력 오류');
        setErrorMessage(msg);
        setOpen(true);
    };

    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds);
        // 선택한 노드에 대해서 상세 데이터를 조회한다.
        if (!isButton) {
            menumngDetail(nodeIds, inputs.site_id);
        }
    };

    const onPlusSelect = (e) => {
        console.log(e);
        console.log(e.target.id);
        if (menudata) {
            setIsButton(true);
            let found = 0;
            menudata.map((item, idx) => {
                if (item.id === e.target.id) {
                    found = 1;
                    console.log('found...');
                    console.log(item);
                    setInputs({
                        ...inputs, // 기존 input 객체 복사
                        [parent_menu_id]: item.id,
                        [parent_menu_name]: item.name
                    });
                    console.log(inputs);
                }
            });
        }
    };

    const onMinusSelect = (e) => {
        console.log(e.target.id);
    };

    const renderTreeItem = (items) => {
        //console.log(items);
        const menu = items.map((item) => {
            if (!item.parent_menu_id) {
                return (
                    <StyledTtreeItem
                        key={item.id}
                        nodeId={item.id}
                        dataMsg={item.id}
                        labelText={item.name}
                        labelPlus={'block'}
                        labelMinus={'none'}
                        color="#a250f5"
                        bgColor="#f3e8fd"
                        plusSelect={onPlusSelect}
                        minusSelect={onMinusSelect}
                    >
                        {renderTreeItem(item.child_menu)}
                    </StyledTtreeItem>
                );
            } else if (item.child_menu && item.child_menu.length) {
                return (
                    <StyledTtreeItem
                        key={item.id}
                        nodeId={item.id}
                        dataMsg={item.id}
                        labelText={item.name}
                        labelPlus={'block'}
                        labelMinus={'block'}
                    >
                        {renderTreeItem(item.child_menu)}
                    </StyledTtreeItem>
                );
            } else {
                return (
                    <StyledTtreeItem
                        key={item.id}
                        nodeId={item.id}
                        dataMsg={item.id}
                        labelText={item.name}
                        labelPlus={'block'}
                        labelMinus={'block'}
                    />
                );
            }
            return null;
        });
        return menu;
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h3">사이트 메뉴 등록</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">통합관리 &gt; 메뉴 관리 &gt; 메뉴 등록</Typography>
                    </Grid>
                    <Grid container spacing={2}></Grid>
                </Grid>
                <MainCard sx={{ mt: 1 }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid container spacing={0} sx={{ mt: 0 }}>
                            <Grid item xs={8} sm={1}>
                                <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                    <Stack spacing={0}>Site 구분</Stack>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={2.5}>
                                <FormControl sx={{ m: 0.5, minWidth: 200, minHeight: 30 }} size="small">
                                    <Select name="site_id" label="사이트명" value={site_id} onChange={handleChange}>
                                        <MenuItem value="">
                                            <em>Choose a Site Type</em>
                                        </MenuItem>
                                        {siteList.map((item, index) => (
                                            <MenuItem key={index} value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={1}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="search_is_use"
                                            checked={search_is_use}
                                            value={search_is_use}
                                            onChange={isUseChange}
                                        />
                                    }
                                    label="사용함"
                                />
                            </Grid>
                            <Grid item xs={8} sm={1}>
                                <FormControl sx={{ m: 1 }} size="small">
                                    <Button
                                        disableElevation
                                        size="small"
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        onClick={searchClick}
                                    >
                                        검색
                                    </Button>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={5.5}></Grid>
                            <Grid item xs={8} sm={1}>
                                <FormControl sx={{ m: 1 }} size="small">
                                    <Button
                                        disableElevation
                                        size="small"
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        onClick={saveClick}
                                    >
                                        저장
                                    </Button>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </MainCard>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item md={3}>
                        <MainCard sx={{ mt: 2 }} content={false}>
                            <TreeView
                                aria-label="controlled"
                                defaultExpanded={['1']}
                                defaultCollapseIcon={<MinusSquare />}
                                defaultExpandIcon={<PlusSquare />}
                                defaultEndIcon={<CloseSquare />}
                                sx={{ height: 620, flexGrow: 1, overflowY: 'auto' }}
                                expanded={expanded}
                                selected={selected}
                                onNodeToggle={handleToggle}
                                onNodeSelect={handleSelect}
                            >
                                {renderTreeItem(menudata)}
                            </TreeView>
                        </MainCard>
                    </Grid>
                    <Grid item md={8.8}>
                        <Stack spacing={2}>
                            <MainCard sx={{ mt: 2, height: 620 }} content={false}>
                                <Grid container spacing={0} sx={{ mt: 1 }}>
                                    <Grid item xs={8} sm={1.5}>
                                        <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                            <Stack spacing={0}>메뉴 ID</Stack>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={8} sm={4}>
                                        <Stack spacing={4}>
                                            <FormControl sx={{ m: 0, maxWidth: 220, maxHeight: 30 }} size="small">
                                                <TextField
                                                    id="filled-hidden-label-small"
                                                    type="text"
                                                    size="small"
                                                    value={id}
                                                    name="id"
                                                    inputProps={{ readOnly: true }}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="신규 등록시 자동입력"
                                                    fullWidth
                                                />
                                            </FormControl>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={8} sm={1.5}>
                                        <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                            <Stack spacing={0}>메뉴명</Stack>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={8} sm={4}>
                                        <TextField
                                            id="filled-hidden-label-small"
                                            type="text"
                                            size="small"
                                            value={name}
                                            name="name"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Input the name"
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={0} sx={{ mt: 1 }}>
                                    <Grid item xs={8} sm={1.5}>
                                        <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                            <Stack spacing={0}>상위 메뉴 ID</Stack>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={8} sm={4}>
                                        <Stack spacing={4}>
                                            <FormControl sx={{ m: 0, maxWidth: 220, maxHeight: 30 }} size="small">
                                                <TextField
                                                    id="filled-hidden-label-small"
                                                    type="text"
                                                    size="small"
                                                    value={parent_menu_id}
                                                    name="parent_menu_id"
                                                    inputProps={{ readOnly: true }}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="선택시 자동입력"
                                                    fullWidth
                                                />
                                            </FormControl>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={8} sm={1.5}>
                                        <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                            <Stack spacing={0}>상위 메뉴명</Stack>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={8} sm={2.5}>
                                        <TextField
                                            id="filled-hidden-label-small"
                                            type="text"
                                            size="small"
                                            value={parent_menu_name}
                                            name="parent_menu_name"
                                            inputProps={{ readOnly: true }}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="선택시 자동입력"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={8} sx={{ mt: 0 }} sm={2}>
                                        <FormControl sx={{ m: 0, maxHeight: 30 }} size="small">
                                            <Button
                                                disableElevation
                                                size="small"
                                                type="button"
                                                variant="contained"
                                                color="secondary"
                                                onClick={menuPopupSearch}
                                            >
                                                검색
                                            </Button>
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={0} sx={{ mt: 1 }}>
                                    <Grid item xs={8} sm={1.5}>
                                        <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                            <Stack spacing={0}>정렬 순서</Stack>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={8} sm={4}>
                                        <Stack spacing={4}>
                                            <FormControl sx={{ m: 0, maxWidth: 50, maxHeight: 30 }} size="small">
                                                <TextField
                                                    id="filled-hidden-label-small"
                                                    type="text"
                                                    size="small"
                                                    value={order}
                                                    name="order"
                                                    inputProps={{ readOnly: false }}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="순서 입력"
                                                    fullWidth
                                                />
                                            </FormControl>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={8} sm={1.5}>
                                        <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                            <Stack spacing={0}>사용 여부</Stack>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={8} sm={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="is_use"
                                                    value={is_use}
                                                    checked={is_use}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                            }
                                            label="사용함"
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={0} sx={{ mt: 1 }}>
                                    <Grid item xs={8} sm={1.5}>
                                        <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                            <Stack spacing={0}>메뉴 URL</Stack>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={8} sm={8}>
                                        <Stack spacing={4}>
                                            <FormControl sx={{ m: 0, maxWidth: 450, maxHeight: 30 }} size="small">
                                                <TextField
                                                    id="filled-hidden-label-small"
                                                    type="text"
                                                    size="small"
                                                    value={url}
                                                    name="url"
                                                    inputProps={{ readOnly: false }}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="Menu URL 입력"
                                                    fullWidth
                                                />
                                            </FormControl>
                                        </Stack>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={0} sx={{ mt: 1 }}>
                                    <Grid item xs={8} sm={1.5}>
                                        <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                            <Stack spacing={0}>메뉴 타입</Stack>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={8} sm={4}>
                                        <Stack spacing={4}>
                                            <FormControl sx={{ m: 0, maxWidth: 160 }} size="small">
                                                <Select name="type" label="메뉴 타입" value={type} onChange={handleChange}>
                                                    <MenuItem value="ITEM">ITEM</MenuItem>
                                                    <MenuItem value="GROUP">GROUP</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={8} sm={1.5}>
                                        <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                            <Stack spacing={0}>Target</Stack>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={8} sm={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="target"
                                                    value={target}
                                                    checked={target}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                            }
                                            label="사용함"
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={0} sx={{ mt: 1 }}>
                                    <Grid item xs={8} sm={1.5}>
                                        <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                            <Stack spacing={0}>메뉴 아이콘</Stack>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={8} sm={4}>
                                        <Stack spacing={4}>
                                            <FormControl sx={{ m: 0, maxWidth: 160 }} size="small">
                                                <Select name="icon" label="메뉴 아이콘" value={icon} onChange={handleChange}>
                                                    <MenuItem value="ChromeOutlined">ChromeOutlined</MenuItem>
                                                    <MenuItem value="ChromeOutlined">ChromeOutlined</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={8} sm={1.5}>
                                        <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                            <Stack spacing={0}>External Link</Stack>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={8} sm={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="external_link"
                                                    value={external_link}
                                                    checked={external_link}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                            }
                                            label="외부링크 사용함"
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={0} sx={{ mt: 1 }}>
                                    <Grid item xs={8} sm={1.5}>
                                        <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                            <Stack spacing={0}>비고</Stack>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={8} sm={8}>
                                        <Stack spacing={4}>
                                            <FormControl sx={{ m: 0, maxWidth: 450, maxHeight: 30 }} size="small">
                                                <TextField
                                                    id="filled-hidden-label-small"
                                                    type="text"
                                                    size="small"
                                                    value={description}
                                                    name="description"
                                                    inputProps={{ readOnly: false }}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="비고 입력"
                                                    fullWidth
                                                />
                                            </FormControl>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </MainCard>
                        </Stack>
                    </Grid>
                </Grid>
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} />
            </Grid>
        </Grid>
    );
};

export default MenuRegForm;
