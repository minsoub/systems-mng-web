import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, FormControl, FormControlLabel, Grid, MenuItem, Select, Stack, TextField } from '@mui/material';
import MainCard from 'components/Common/MainCard';
import SvgIcon from '@mui/material/SvgIcon';
import SiteApi from 'apis/site/siteapi';
import MenuMngApi from 'apis/menu/menumngapi';
import StyledTtreeItem from 'components/TreeMenu/StyledTreeItem';
import TreeView from '@mui/lab/TreeView';
import HeaderTitle from 'components/HeaderTitle';
import TopInputLayout from 'components/Common/TopInputLayout';
import InputLayout from 'components/Common/InputLayout';
import cx from 'classnames';
import ButtonLayout from 'components/Common/ButtonLayout';
import './styles.scss';
import DropInput from '../../../components/Common/DropInput';
import FlexBox from '../../../components/Common/FlexBox';

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
    const [responseData, requestError, responseLoading, { menumngSearch, menumngDetail, menumngInsert, menumngUpdate, menumngDelete }] =
        MenuMngApi();

    const [expanded, setExpanded] = useState([]);
    const [selected, setSelected] = useState([]);
    const [menudata, setMenuData] = useState([]); // menu data

    const [isUpdate, setIsUpdate] = useState(false); // input mode
    const [isButton, setIsButton] = useState(false); // +, - 버튼 모드

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
    const { id, name, site_id, parents_menu_id, parents_menu_name, order, is_use, url, type, target, icon, external_link, description } =
        inputs;

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

    const [siteList, setSiteList] = useState([]);
    const [search_is_use, setIsUse] = useState(true);

    // onload
    useEffect(() => {
        //errorClear();
        // 사이트 구분 리스트 가져오기
        siteSearch(true, '');
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
                    let firstSelectedSite;
                    siteData.map((site, index) => {
                        const s = { id: site.id, name: site.name };
                        list.push(s);
                        if (index === 0) firstSelectedSite = site.id;
                    });
                    setSiteList(list);
                    setInputs({
                        ...inputs,
                        site_id: firstSelectedSite
                    });
                    menumngSearch(firstSelectedSite, search_is_use);
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
                    alert('저장을 완료하였습니다.');
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
                    alert('저장을 완료하였습니다.');
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
                    alert('삭제를 완료하였습니다.');
                    inputClear();
                    menumngSearch(inputs.site_id, search_is_use);
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
            site_id: inputs.site_id,
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
        setIsUpdate(false);
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
        if (!inputs.site_id) {
            alert('사이트명을 선택하세요.');
            return;
        }
        menumngSearch(inputs.site_id, search_is_use);
    };
    // 저장한다.
    const saveClick = () => {
        console.log(inputs);
        // Validation check
        if (!inputs.site_id) {
            setError('사이트명을 선택하지 않았습니다.');
            return;
        }
        if (!inputs.name) {
            setError('메뉴명을 입력하지 않았습니다.');
            return;
        }
        if (!inputs.order) {
            setError('정렬 순서를 입력하지 않았습니다.');
            return;
        }
        if (!inputs.type) {
            setError('메뉴타입을 선택하지 않았습니다.');
            return;
        }
        if (confirm('저장하시겠습니까?')) {
            console.log(isUpdate);
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

    const handleSelect = (nodeIds) => {
        console.log(nodeIds);
        setSelected(nodeIds);
        setExpanded(nodeIds);
        // 선택한 노드에 대해서 상세 데이터를 조회한다.
        menumngDetail(nodeIds, inputs.site_id);
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
                        site_id: site_id,
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
                                site_id: site_id,
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
                                        site_id: site_id,
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
        <Grid container rowSpacing={4} columnSpacing={2.75}>
            <Grid item xs={12}>
                <HeaderTitle titleNm="메뉴 등록" menuStep01="통합시스템 관리" menuStep02="메뉴 관리" menuStep03="메뉴 등록" />

                <MainCard>
                    <TopInputLayout>
                        <FlexBox>
                            <DropInput title="사이트 구분">
                                <Select name="site_id" label="사이트명" value={site_id} onChange={handleChange} placeholder="사이트명">
                                    {siteList.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </DropInput>
                            <FormControlLabel
                                control={
                                    <Checkbox name="search_is_use" checked={search_is_use} value={search_is_use} onChange={isUseChange} />
                                }
                                label="사용함"
                                className="checkedBox"
                            />
                        </FlexBox>

                        <ButtonLayout>
                            <Button
                                disableElevation
                                size="medium"
                                type="submit"
                                variant="outlined_d"
                                onClick={searchClick}
                                color="secondary"
                            >
                                검색
                            </Button>

                            <Button disableElevation size="medium" type="submit" variant="contained" onClick={saveClick} color="primary">
                                저장
                            </Button>
                        </ButtonLayout>
                    </TopInputLayout>
                </MainCard>

                <Grid container>
                    <Grid item xs={4}>
                        <MainCard sx={{ height: '100%' }}>
                            <TreeView
                                aria-label="controlled"
                                defaultCollapseIcon={<MinusSquare />}
                                defaultExpandIcon={<PlusSquare />}
                                defaultEndIcon={<CloseSquare />}
                                sx={{ height: 600, flexGrow: 1, overflowY: 'auto' }}
                                onNodeToggle={handleToggle}
                            >
                                {renderTreeItem(menudata)}
                            </TreeView>
                        </MainCard>
                    </Grid>

                    <Grid item xs={8} className="menu--right">
                        <MainCard sx={{ height: '100%' }}>
                            <FlexBox>
                                <DropInput title="메뉴 ID" className="bottom--blank"  titleWidth={80} style={{ marginRight: '2rem' }}>
                                    <TextField
                                        id="filled-hidden-label-small"
                                        type="text"
                                        size="medium"
                                        value={id}
                                        name="id"
                                        inputProps={{ readOnly: true }}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="신규 등록시 자동입력"
                                        fullWidth
                                    />
                                </DropInput>

                                <DropInput title="메뉴명" className="bottom--blank"  titleWidth={80}>
                                    <TextField
                                        id="filled-hidden-label-small"
                                        type="text"
                                        size="medium"
                                        value={name}
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Input the name"
                                        fullWidth
                                    />
                                </DropInput>
                            </FlexBox>
                            <FlexBox>
                                <DropInput title="상위 메뉴 ID" className="bottom--blank"  titleWidth={80} style={{ marginRight: '2rem' }}>
                                    <TextField
                                        id="filled-hidden-label-small"
                                        type="text"
                                        size="medium"
                                        value={parents_menu_id}
                                        name="parents_menu_id"
                                        inputProps={{ readOnly: true }}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="선택시 자동입력"
                                        fullWidth
                                    />
                                </DropInput>
                                <DropInput title="상위 메뉴명" className="bottom--blank"  titleWidth={80}>
                                    <TextField
                                        id="filled-hidden-label-small"
                                        type="text"
                                        size="medium"
                                        value={parents_menu_name}
                                        name="parents_menu_name"
                                        inputProps={{ readOnly: true }}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="선택시 자동입력"
                                        fullWidth
                                    />
                                </DropInput>
                            </FlexBox>
                            <FlexBox>
                                <DropInput title="정렬 순서" className="bottom--blank"  titleWidth={80} style={{ marginRight: '2rem' }}>
                                    <TextField
                                        id="filled-hidden-label-small"
                                        type="text"
                                        size="medium"
                                        value={order}
                                        name="order"
                                        inputProps={{ readOnly: false }}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="순서 입력"
                                        fullWidth
                                    />
                                </DropInput>
                                <DropInput title="사용 여부" className="bottom--blank"  titleWidth={80}>
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
                                </DropInput>
                            </FlexBox>
                            <FlexBox>
                                <DropInput title="메뉴 URL" className="bottom--blank"  titleWidth={80} style={{ marginRight: '2rem' }}>
                                    <TextField
                                        id="filled-hidden-label-small"
                                        type="text"
                                        size="medium"
                                        value={url}
                                        name="url"
                                        inputProps={{ readOnly: false }}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Menu URL 입력"
                                        fullWidth
                                    />
                                </DropInput>
                                <DropInput title="메뉴 타입" className="bottom--blank"  titleWidth={80}>
                                    <Select name="type" label="메뉴 타입" value={type} onChange={handleChange}>
                                        <MenuItem value="ITEM">ITEM</MenuItem>
                                        <MenuItem value="GROUP">GROUP</MenuItem>
                                    </Select>
                                </DropInput>
                            </FlexBox>
                            <FlexBox>
                                <DropInput title="Target" className="bottom--blank"  titleWidth={80} style={{ marginRight: '2rem' }}>
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
                                </DropInput>
                                <DropInput title="메뉴 아이콘" titleWidth={80}>
                                    <Select name="icon" label="메뉴 아이콘" value={icon} onChange={handleChange}>
                                        <MenuItem value="ChromeOutlined">ChromeOutlined</MenuItem>
                                        <MenuItem value="ChromeOutlined">ChromeOutlined</MenuItem>
                                    </Select>
                                </DropInput>
                            </FlexBox>

                            <FlexBox>
                                <DropInput title="External Link" titleWidth={80} style={{ marginRight: '2rem' }}>
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
                                </DropInput>
                                <DropInput title="비고" titleWidth={80}>
                                    <TextField
                                        id="filled-hidden-label-small"
                                        type="text"
                                        size="medium"
                                        value={description}
                                        name="description"
                                        inputProps={{ readOnly: false }}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="비고 입력"
                                        fullWidth
                                    />
                                </DropInput>
                            </FlexBox>
                        </MainCard>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default MenuRegForm;
