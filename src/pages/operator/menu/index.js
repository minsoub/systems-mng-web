import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import DefaultDataGrid from '../../../components/DataGrid/DefaultDataGrid';
import CheckBoxDataGrid from '../../../components/DataGrid/CheckBoxDataGrid';
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

const SiteMenuRegForm = () => {
    const navigate = useNavigate();
    const { siteId } = useSelector((state) => state.auth);

    const [resData, reqErr, resLoading, { siteSearch }] = SiteApi();
    const [
        responseData,
        requestError,
        responseLoading,
        { menumngSearch, menumngDetail, menumngInsert, menumngUpdate, menumngDelete }
    ] = MenuMngApi();

    const [expanded, setExpanded] = useState([]);
    const [selected, setSelected] = useState([]);
    const [menudata, setMenuData] = useState([]); // menu data

    const [isUpdate, setIsUpdate] = useState(false); // input mode
    const [isButton, setIsButton] = useState(false); // +, - 버튼 모드

    const [login_site_id, setLoginStiteId] = useState(''); // 사용자 로그인 - 사이트 ID

    // 입력 데이터 - Default
    const [inputs, setInputs] = useState({
        id: '',
        name: '',
        site_id: '',
        parents_menu_id: '',
        parents_menu_name: '',
        order: 1,
        is_use: true,
        url: '',
        type: '',
        target: false,
        icon: '',
        external_link: false,
        description: ''
    });
    const {
        id,
        name,
        site_id,
        parents_menu_id,
        parents_menu_name,
        order,
        is_use,
        url,
        type,
        target,
        icon,
        external_link,
        description
    } = inputs;

    ////////////////////////////////////////////////////
    // 공통 에러 처리
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const parentErrorClear = () => {
        setOpen(false);
        setErrorTitle('');
        setErrorMessage('');
    };
    ////////////////////////////////////////////////////

    // TODO: onload
    useEffect(() => {
        // 세션 정보에서 사이트 아이디 정보를 가져온다.
        setLoginStiteId(siteId);
        // 디폴트 메뉴 조회
        menumngSearch(siteId, true);
    }, []);

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            if (requestError.result === 'FAIL') {
                console.log('error requestError');
                console.log(requestError);
                setErrorTitle('Error Message');
                setErrorMessage('[' + requestError.error.code + '] ' + requestError.error.message);
                setOpen(true);
            }
        }
    }, [requestError]);

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
                        parents_menu_id: res.parents_menu_id === null ? '' : res.parents_menu_id,
                        parents_menu_name: res.parents_menu_name,
                        order: res.order,
                        is_use: res.is_use,
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
                        parents_menu_id: res.parents_menu_id === null ? '' : res.parents_menu_id,
                        parents_menu_name: res.parents_menu_name,
                        order: res.order,
                        is_use: res.is_use,
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
            case 'updateData':
                if (responseData.data.data) {
                    alert('저장을 완료하였습니다!!!');
                    let res = responseData.data.data;
                    setInputs({
                        id: res.id,
                        name: res.name,
                        site_id: res.site_id,
                        parents_menu_id: res.parents_menu_id === null ? '' : res.parents_menu_id,
                        parents_menu_name: res.parents_menu_name,
                        order: res.order,
                        is_use: res.is_use,
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
            case 'deleteData':
                if (responseData.data.data) {
                    alert('삭제를 완료하였습니다!!!');
                    inputClear();
                    menumngSearch(login_site_id, true);
                }
                break;
            default:
        }
    }, [responseData]);

    const handleClose = () => {
        setVisible(false);
    };

    // Input Form clear
    const inputClear = () => {
        setInputs({
            id: '',
            name: '',
            site_id: '',
            parents_menu_id: '',
            parents_menu_name: '',
            order: 1,
            is_use: true,
            url: '',
            type: '',
            target: false,
            icon: '',
            external_link: false,
            description: ''
        });
    };

    // menu data search
    const searchClick = () => {
        menumngSearch(login_site_id, true);
    };
    // 저장한다.
    const saveClick = () => {
        console.log(inputs);
        // Validation check
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
                menumngUpdate(inputs);
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

    // 에러 메시지 처리
    const setError = (msg) => {
        setErrorTitle('입력 오류');
        setErrorMessage(msg);
        setOpen(true);
    };

    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    const handleSelect = (nodeIds) => {
        console.log(nodeIds);
        setSelected(nodeIds);
        setExpanded(nodeIds);
        // 선택한 노드에 대해서 상세 데이터를 조회한다.
        menumngDetail(nodeIds, login_site_id);
    };

    const onPlusSelect = (nodeIds) => {
        console.log('onPlusSelect called => ' + nodeIds);
        if (menudata) {
            //console.log(menudata);
            let found = 0;
            menudata.map((item, idx) => {
                if (item.id === nodeIds) {
                    found = 1;
                    console.log('found...1');
                    console.log(item);
                    setInputs({
                        id: '',
                        name: '',
                        site_id: login_site_id,
                        parents_menu_id: item.id,
                        parents_menu_name: item.name,
                        order: '1',
                        is_use: true,
                        url: '',
                        type: '',
                        target: false,
                        icon: '',
                        external_link: false,
                        description: ''
                    });
                    setSelected(nodeIds);
                    setIsUpdate(false); // 수정모드
                    return;
                } else if (item.child_menu && item.child_menu.length) {
                    item.child_menu.map((subitem, index) => {
                        if (subitem.id === nodeIds) {
                            found = 1;
                            console.log('found...2');
                            console.log(subitem);
                            setInputs({
                                id: '',
                                name: '',
                                site_id: login_site_id,
                                parents_menu_id: subitem.id,
                                parents_menu_name: subitem.name,
                                order: '1',
                                is_use: true,
                                url: '',
                                type: '',
                                target: false,
                                icon: '',
                                external_link: false,
                                description: ''
                            });
                            setSelected(nodeIds);
                            setIsUpdate(false); // 수정모드
                            return;
                        } else if (subitem.child_menu && subitem.child_menu.length) {
                            subitem.child_menu.map((subdata, i) => {
                                if (subdata.id === nodeIds) {
                                    found = 1;
                                    console.log('found...3');
                                    console.log(subdata);
                                    setInputs({
                                        id: '',
                                        name: '',
                                        site_id: login_site_id,
                                        parents_menu_id: subdata.id,
                                        parents_menu_name: subdata.name,
                                        order: '1',
                                        is_use: true,
                                        url: '',
                                        type: '',
                                        target: false,
                                        icon: '',
                                        external_link: false,
                                        description: ''
                                    });
                                    setSelected(nodeIds);
                                    setIsUpdate(false); // 수정모드
                                    return;
                                }
                            });
                        }
                    });
                }
            });
        }
    };

    // minus button 클릭 시 하위 메뉴까지 삭제한다.
    const onMinusSelect = (nodeIds) => {
        console.log('onMinusSelect called => ' + nodeIds);
        let deleteIds = [];
        if (menudata) {
            //console.log(menudata);
            let found = 0;
            console.log('menudata minusSelect called');
            menudata.map((item, idx) => {
                if (item.id === nodeIds) {
                    deleteIds.push(item.id);
                    console.log(item.name);
                    // 하위 메뉴가 있다면 삭제에 넣는다.
                    if (item.child_menu && item.child_menu.length) {
                        item.child_menu.map((subitem, index) => {
                            deleteIds.push(subitem.id);
                            console.log(subitem.name);
                            // 하위 메뉴가 있다면..
                            if (subitem.child_menu && subitem.child_menu.length) {
                                subitem.child_menu.map((subsubitem, i) => {
                                    deleteIds.push(subsubitem.id);
                                    console.log(subsubitem.name);
                                });
                            }
                        });
                    }
                    return;
                    // 상위 메뉴에 없다면 하위메뉴를 검색한다.
                } else if (item.child_menu && item.child_menu.length) {
                    item.child_menu.map((subitem, index) => {
                        // 2 depth
                        if (subitem.id === nodeIds) {
                            deleteIds.push(subitem.id);
                            // 3 depth check
                            if (subitem.child_menu && subitem.child_menu.length) {
                                subitem.child_menu.map((subsubitem, i) => {
                                    deleteIds.push(subsubitem.id);
                                });
                            }
                            return;
                        } else if (subitem.child_menu && subitem.child_menu.length) {
                            // 3 depth
                            if (subitem.id === nodeIds) {
                                deleteIds.push(subitem.id);
                                return;
                            }
                        }
                    });
                }
            });
        }
        console.log(deleteIds.length);
        if (deleteIds && deleteIds.length) {
            if (
                confirm(
                    '삭제를 진행하시겠습니까? 상위 메뉴 삭제는 하위 메뉴까지 같이 삭제됩니다.(연결된 프로그램이 있으면 프로그램도 같이 삭제됩니다'
                )
            ) {
                menumngDelete(site_id, deleteIds);
            }
        }
    };

    const renderTreeItem = (items) => {
        //console.log(items);
        const menu = items.map((item) => {
            if (item.child_menu && item.child_menu.length) {
                return (
                    <StyledTtreeItem
                        key={item.id}
                        nodeId={item.id}
                        dataMsg={item.id}
                        labelText={item.name}
                        labelPlus={'block'}
                        labelMinus={'block'}
                        plusSelect={onPlusSelect}
                        minusSelect={onMinusSelect}
                        nodeSelect={handleSelect}
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
                        plusSelect={onPlusSelect}
                        minusSelect={onMinusSelect}
                        nodeSelect={handleSelect}
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
                        <Typography variant="h3">메뉴 등록</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">사이트 관리 &gt; 메뉴 관리 &gt; 메뉴 등록</Typography>
                    </Grid>
                    <Grid container spacing={2}></Grid>
                </Grid>
                <MainCard sx={{ mt: 1 }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid container spacing={0} sx={{ mt: 0 }}>
                            <Grid item xs={8} sm={11.4}></Grid>
                            <Grid item xs={8} sm={0.6}>
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
                            <Grid container spacing={0} sx={{ mt: 1 }}>
                                <TreeView
                                    aria-label="controlled"
                                    //defaultExpanded={expanded}
                                    defaultCollapseIcon={<MinusSquare />}
                                    defaultExpandIcon={<PlusSquare />}
                                    defaultEndIcon={<CloseSquare />}
                                    sx={{ height: 600, flexGrow: 1, overflowY: 'auto' }}
                                    //expanded={expanded}
                                    //selected={selected}
                                    onNodeToggle={handleToggle}
                                    //onNodeSelect={handleSelect}
                                >
                                    {renderTreeItem(menudata)}
                                </TreeView>
                            </Grid>
                        </MainCard>
                    </Grid>
                    <Grid item md={8.8}>
                        <Stack spacing={2}>
                            <MainCard sx={{ mt: 2, height: 620 }} content={false}>
                                <Grid container spacing={0} sx={{ mt: 4 }}>
                                    <Grid item xs={8} sm={0.2}></Grid>
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
                                    <Grid item xs={8} sm={0.2}></Grid>
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
                                                    value={parents_menu_id}
                                                    name="parents_menu_id"
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
                                            value={parents_menu_name}
                                            name="parents_menu_name"
                                            inputProps={{ readOnly: true }}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="선택시 자동입력"
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={0} sx={{ mt: 1 }}>
                                    <Grid item xs={8} sm={0.2}></Grid>
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
                                    <Grid item xs={8} sm={0.2}></Grid>
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
                                    <Grid item xs={8} sm={0.2}></Grid>
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
                                    <Grid item xs={8} sm={0.2}></Grid>
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
                                    <Grid item xs={8} sm={0.2}></Grid>
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
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
            </Grid>
        </Grid>
    );
};

export default SiteMenuRegForm;
