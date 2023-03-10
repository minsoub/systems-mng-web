import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Grid, MenuItem, Paper, Select } from '@mui/material';
import { styled } from '@mui/material/styles';
import MainCard from 'components/Common/MainCard';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import CheckBoxDataGrid from 'components/DataGrid/CheckBoxDataGrid';
import SiteApi from 'apis/site/siteapi';
import MenuMngApi from 'apis/menu/menumngapi';
import ProgramApi from 'apis/programs/programapi';
import RoleApi from 'apis/roles/roleapi';
import ErrorScreen from 'components/ErrorScreen';
import CheckBoxTreeItem from 'components/TreeMenu/CheckBoxTreeItem';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HeaderTitle from 'components/HeaderTitle';
import TopInputLayout from 'components/Common/TopInputLayout';
import ButtonLayout from 'components/Common/ButtonLayout';
import DropInput from 'components/Common/DropInput';
import './styles.scss';
import ContentLine from '../../../components/Common/ContentLine';
import FlexBox from '../../../components/Common/FlexBox';

const AuthMngRegForm = () => {
    const navigate = useNavigate();
    const { siteId } = useSelector((state) => state.auth);
    const [resData, reqErr, resLoading, { siteSearch }] = SiteApi();
    const [
        responseData,
        requestError,
        responseLoading,
        {
            menumngSearch,
            menumngDetail,
            programMapping,
            programMappingSearch,
            initAuthProgramMenuMapping,
            authProgramMenuMapping,
            programMenuMapping,
            initProgramMenuMapping
        }
    ] = MenuMngApi();
    const [rData, rError, rLoading, { programTextSearch }] = ProgramApi();
    const [
        roleRequestData,
        roleRequestError,
        roleLoading,
        { roleComboSearch, roleRegisterSearch, roleRegisterTreeList, roleMenuSave, roleRedisInit }
    ] = RoleApi();

    const { roleType, roleId } = useParams();

    const [expanded, setExpanded] = useState([]);
    const [selected, setSelected] = useState([]);
    const [menudata, setMenuData] = useState([]); // menu data

    const [isSave, setIsSave] = useState(false); // input mode

    const roleColumns = [
        {
            field: 'id',
            headerName: 'Account ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'name',
            headerName: 'Account Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'create_date',
            headerName: '????????????',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        }
    ];
    const programColumns = [
        {
            field: 'id',
            headerName: '???????????? ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'name',
            headerName: '???????????????',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'kind_name',
            headerName: '??????',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'action_method',
            headerName: 'Action Type',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'type',
            headerName: '????????????',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'is_use',
            headerName: '????????????',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        }
    ];
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: '#1A2027',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: '#ffffff'
    }));

    ////////////////////////////////////////////////////
    // ?????? ?????? ??????
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
    const [roleList, setRoleList] = useState([]);

    const [dataGridRoleRows, setDataGridRoleRows] = useState([]);
    const [dataGridProgramRows, setDataGridProgramRows] = useState([]);

    const [selectedMenuName, setSelectedMenuName] = useState('');
    const [selectedMenuId, setSelectedMenuId] = useState('');

    // ?????? ????????? ????????? row id
    const [selectedProgramRows, setSelectedProgramRows] = useState([]);
    const [selectedRoleRows, setSelectedRoleRows] = useState([]);

    // ?????? ????????? - Default
    const [inputs, setInputs] = useState({
        site_id: '',
        type: 'ADMIN',
        role_id: '',
        role_name: '',
        is_use: false
    });
    const { site_id, type, role_id, role_name, is_use } = inputs;

    // onload
    useEffect(() => {
        // ????????? ?????? ????????? ????????????
        siteSearch(true, '');
        console.log('RoleType => ');
        console.log(roleType);
        if (roleType) {
            setInputs({
                ...inputs, // ?????? input ?????? ??????
                type: roleType
            });
        }
    }, []);

    // Role data
    useEffect(() => {
        if (roleRequestData) {
            switch (roleRequestData.transactionId) {
                case 'roleList':
                    if (roleRequestData.data.data) {
                        let roleData = roleRequestData.data.data;
                        let list = [];
                        roleData.map((role, index) => {
                            const s = { id: role.id, name: role.name };
                            console.log(s);
                            list.push(s);
                        });
                        console.log(list);
                        setRoleList(list);

                        if (roleId) {
                            setInputs({
                                ...inputs, // ?????? input ?????? ??????
                                role_id: roleId
                            });
                            // ????????? ?????? ????????? ??????
                            roleRegisterTreeList(roleId, siteId);
                            // role??? ????????? ????????? ??????
                            roleRegisterSearch(roleId, siteId, roleType);
                        }
                    }
                    break;
                case 'registerList':
                    if (roleRequestData.data.data) {
                        setDataGridRoleRows(roleRequestData.data.data);
                    } else {
                        setDataGridRoleRows([]);
                    }
                    break;
                case 'roleRegisterTreeList':
                    console.log(roleRequestData.data.data.menu_list);
                    if (roleRequestData.data.data.menu_list && roleRequestData.data.data.menu_list.length > 0) {
                        setMenuData(roleRequestData.data.data.menu_list);
                    } else {
                        setMenuData([]);
                    }
                    break;
                case 'roleMenuSave':
                    if (roleRequestData.data.data) {
                        console.log(roleRequestData.data.data);
                        alert('????????? ?????????????????????.');
                        // ????????? ?????? ????????? ??????
                        //menumngSearch(site_id, true);
                        roleRegisterTreeList(role_id, site_id);
                        // role??? ????????? ????????? ??????
                        roleRegisterSearch(role_id, site_id, type);
                    }
                default:
            }
        } else if (roleRequestError) {
            if (roleRequestError.result === 'FAIL') {
                console.log('error requestError');
                console.log(roleRequestError);
                setErrorTitle('Error Message');
                setErrorMessage('[' + roleRequestError.error.code + '] ' + roleRequestError.error.message);
                setOpen(true);
            }
        }
    }, [roleRequestData, roleRequestError]);

    // transaction error ??????
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
    // ?????????
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
                    if (siteId) {
                        setInputs({
                            ...inputs, // ?????? input ?????? ??????
                            site_id: siteId
                        });
                        roleComboSearch(true, type, siteId);
                    }
                }
                break;
            default:
        }
    }, [resData]);

    // ???????????? ?????? ??????
    useEffect(() => {
        if (!rData) {
            return;
        }
        switch (rData.transactionId) {
            case 'programList':
                if (rData.data.data) {
                    setProgramGridRows(rData.data.data);
                } else {
                    setProgramGridRows([]);
                }
                break;
            default:
        }
    }, [rData]);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'menuList':
                // Not used
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setMenuData(responseData.data.data);
                } else {
                    setMenuData([]);
                }
                break;
            case 'registerData':
                // ????????? ???????????? ?????? ?????????
                if (responseData.data.data) {
                    programMappingSearch(selected, site_id);
                }
                break;
            case 'mappingList': // ????????? ???????????? ?????? ??????
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setDataGridProgramRows(responseData.data.data);
                } else {
                    setDataGridProgramRows([]);
                }
                break;
            case 'initAuthProgramMenuMapping':
            case 'authProgramMenuMapping':
            case 'initProgramMenuMapping':
            case 'programMenuMapping':
            case 'roleRedisInit':
                alert('??????');
                break;
            default:
        }
    }, [responseData]);

    const handleInitAuthProgramMenuMapping = () => {
        if (confirm('?????? ?????? X ???????????? ??????????????????. \n ?????????????????????????')) {
            initAuthProgramMenuMapping();
        }
    };

    const handleAuthProgramMenuMapping = () => {
        if (confirm('?????? ?????? X ????????????(?????? ??????X???????????? ??????) ???????????????. \n ?????????????????????????')) {
            authProgramMenuMapping();
        }
    };

    const handleProgramMenuMapping = () => {
        if (confirm('?????? ?????? X ????????????(?????? menu_program_specification ??????) ???????????????. \n ?????????????????????????')) {
            programMenuMapping();
        }
    };

    const handleInitProgramMenuMapping = () => {
        if (confirm('?????? ?????? X ???????????? ????????? ?????????.\n ?????????????????????????')) {
            initProgramMenuMapping();
        }
    };

    const handleRoleRedisInit = () => {
        if (confirm('????????? ????????? ?????????.\n ?????????????????????????')) {
            roleRedisInit();
        }
    };

    // ????????? ??????, ??????, ???????????? ???????????? ????????????.
    // ?????? ?????? : ?????????
    // Role??? ????????? ????????? ??????
    // search
    const searchClick = () => {
        //errorClear();
        console.log('searchClick called...');
        if (!site_id) {
            alert('??????????????? ???????????????.');
            return;
        }
        if (!role_id) {
            alert('???????????? ???????????????.');
            return;
        }
        // ????????? ?????? ????????? ??????
        //menumngSearch(site_id, true);
        roleRegisterTreeList(role_id, site_id);
        // role??? ????????? ????????? ??????
        roleRegisterSearch(role_id, site_id, type);
    };

    // Site??????, type, role_id ?????? ?????? ?????? ??? ??????
    const handleChange = (e) => {
        let { value, name } = e.target;
        if (e.target.type === 'checkbox') {
            value = e.target.checked;
        } else {
            value = e.target.value;
        }
        console.log(name);
        console.log(value);
        if (e.target.name === 'role_id') {
            console.log(e.target);
            roleList.map((item, index) => {
                if (item.id === e.target.value) {
                    setInputs({
                        ...inputs, // ?????? input ?????? ??????
                        [name]: value,
                        role_name: item.name
                    });
                }
            });
        } else {
            setInputs({
                ...inputs, // ?????? input ?????? ??????
                [name]: value
            });
        }
        if (e.target.name === 'site_id') {
            // ????????? ???????????? ???????????? Type??? ????????? Role ????????? ????????????.
            roleComboSearch(true, type, e.target.value);
        }
    };
    const handleBlur = (e) => {
        console.log(e);
    };

    //???????????? ????????? row id ??????
    const handleSelectionChange = (item) => {
        if (item) {
            setSeletedRows(item);
        }
    };
    // ???????????? ??????????????? ??????
    const handleSelectionProgramChange = (item) => {
        if (item) {
            console.log(item);
            setSelectedProgramRows(item);
            console.log(selectedProgramRows);
        }
    };
    // ????????? ????????? ??????
    const handleSelectionRoleChange = (item) => {
        if (item) {
            console.log(item);
            setSelectedRoleRows(item);
        }
    };

    // ????????? ?????? ?????????
    const handlePage = (page) => {};

    // ????????? ??????
    const handleClick = (rowData) => {
        // if (rowData && rowData.field && rowData.field !== '__check__') {
        //     // ?????? ?????? ????????? ????????? ???????????? ????????????.
        //     // Role, SiteId
        //     setSelectedRole(rowData.id);
        //     roleRegisterSearch(rowData.id, rowData.site_id, rowData.type);
        // }
    };

    // ????????? ?????? ??????
    const handleDoubleClick = (rowData) => {};

    // ?????? ??? ???????????? ????????????.
    const programMappingSave = () => {
        // ????????????.
        if (selectedProgramRows.length === 0) {
            alert('???????????? ????????? ???????????? ???????????????.');
            return;
        }
        // ????????? ???????????? ????????? ????????? ????????? ???????????? ????????? ????????????.
        console.log(selectedProgramRows);
        let menuList = menudata;
        let found = 0;
        menuList.map((item, index) => {
            if (item.id === selectedMenuId) {
                item.program_list = selectedRoleRows;
                found = 1;
            }
            item.child_menu_resources.map((child, idx) => {
                if (child.id === selectedMenuId) {
                    child.program_list = selectedProgramRows;
                    found = 1;
                }
                child.child_menu_resources.map((sub, i) => {
                    if (sub.id === selectedMenuId) {
                        sub.program_list = selectedProgramRows;
                        found = 1;
                    }
                });
            });
        });
        console.log(menuList);
        setMenuData(menuList);
        if (found === 1) alert('?????????????????????.');
    };

    // ?????? ?????? ??????
    const programMappingSaveClick = () => {
        console.log(menudata);
        let saveData = [];
        if (menudata && confirm('?????????????????????????')) {
            menudata.map((item, index) => {
                // 1???
                if (item.visible === true) {
                    let program_list = [];
                    if (item.program_list.length > 0) {
                        item.program_list.map((pgm, idx) => {
                            program_list.push(pgm.id);
                        });
                    }
                    saveData.push({ menu_id: item.id, program_id: program_list });
                }
                if (item.child_menu_resources.length > 0) {
                    item.child_menu_resources.map((child, idx) => {
                        if (child.visible === true) {
                            let program_list = [];
                            if (child.program_list.length > 0) {
                                child.program_list.map((pgm, k) => {
                                    program_list.push(pgm.id);
                                });
                            }
                            saveData.push({ menu_id: child.id, program_id: program_list });
                        }

                        if (child.child_menu_resources.length > 0) {
                            child.child_menu_resources.map((sub, i) => {
                                if (sub.visible == true) {
                                    let program_list = [];
                                    if (sub.program_list.length > 0) {
                                        sub.program_list.map((pgm, k) => {
                                            program_list.push(pgm.id);
                                        });
                                    }
                                    saveData.push({ menu_id: sub.id, program_id: program_list });
                                }
                            });
                        }
                    });
                }
            });
            let requestData = { resources: saveData };
            console.log(requestData);
            roleMenuSave(role_id, requestData);
        }
    };

    // ????????? ??????????????? ????????? ?????? ?????????.
    const plusRegister = () => {
        let programs_ids = [];
        if (selectedSearchRows.length > 0) {
            selectedSearchRows.map((id, Index) => {
                let found = 0;
                dataGridRegisterRows.map((regData, idx) => {
                    // programinMapping
                    // ????????? ??????????????? ???????????? ???????????? ?????????.
                    if (id === regData.id) {
                        found = 1;
                    }
                });
                if (found === 0) {
                    dataGridSearchRows.map((data, i) => {
                        if (id === data.id) {
                            let selectedData = {
                                id: data.id,
                                name: data.name,
                                kind_name: data.kind_name,
                                action_method: data.action_method,
                                type: data.type,
                                is_use: data.is_use,
                                site_id: data.site_id
                            };
                            console.log(selectedData);
                            setDataGridRegisterRows((prevRows) => [...prevRows, selectedData]);
                            setIsSave(true);
                            programs_ids.push(data.id);
                        }
                    });
                }
            });
            if (programs_ids.length) {
                programMapping(selected, site_id, programs_ids);
            }
        }
    };
    // ?????? ???????????? ???????????? ??????????????? ????????????.
    const minusRegister = () => {
        if (selectedRegisterRows.length > 0) {
            let newList = dataGridProgramRows;
            selectedRegisterRows.map((id, Index) => {
                newList = newList.filter((item) => item.id !== id);
                setDataGridProgramRows(newList);
                setIsSave(true);
                // dataGridRegisterRows.map((regData, idx) => {
                //     if (id === regData.id) {
                //         setDataGridRegisterRows((prevRows) => [...prevRows.slice(0, idx), ...prevRows.slice(idx + 1)]);
                //         setIsSave(true);
                //     }
                // });
                // let selectedData = { id: data.id, name: data.name, email: data.email };
                // // ????????? ???????????? ????????? ???????????? ??????.
                // dataGridRegisterRows.pop(selectedData);
            });
        }
    };

    // ?????? ????????? ??????
    const setError = (msg) => {
        setErrorTitle('?????? ??????');
        setErrorMessage(msg);
        setOpen(true);
    };

    // TreeView Event Call
    const handleToggle = (event, nodeIds) => {
        console.log('handleToggle...');
        setExpanded(nodeIds);
    };

    // TreeView ????????? ???????????? ??? ????????? ???????????? ?????? ????????? ?????? ???????????? ????????? ???????????? ??????.
    const handleSelect = (nodeIds, nodeName) => {
        console.log('handleSelect called...');
        console.log(nodeIds);
        setSelected(nodeIds);
        setExpanded(nodeIds);
        // ????????? ????????? ????????? ?????? ???????????? ????????????.
        programMappingSearch(nodeIds, site_id);
        // ?????? ???????????? ????????? ????????? ???????????? ????????????.
        console.log(nodeName);
        setSelectedMenuName(nodeName);
        setSelectedMenuId(nodeIds);
    };

    const visibleChange = (id, checkValue) => {
        console.log(id);
        console.log(checkValue);
        let found = 0;
        let checkItems = [];
        let checkMenuData = menudata;
        checkMenuData.map((item, index) => {
            // ???????????? ???
            if (item.id === id) {
                found = 1;

                item.visible = checkValue;
                item.child_menu_resources.map((child, idx) => {
                    child.visible = checkValue;
                    if (child.child_menu_resources.length > 0) {
                        child.child_menu_resources.map((sub, i) => {
                            sub.visible = checkValue;
                        });
                    }
                });
            }
        });
        if (found === 0) {
            // 1??????????????? ??????. - 2??????
            let foundItemId;
            checkMenuData.map((item, index) => {
                item.child_menu_resources.map((child, idx) => {
                    // 2 step
                    if (child.id === id) {
                        found = 1;
                        foundItemId = item.id;
                        if (checkValue === true) {
                            item.visible = checkValue;
                        }
                        child.visible = checkValue;
                        if (child.child_menu_resources.length > 0) {
                            child.child_menu_resources.map((sub, i) => {
                                sub.visible = checkValue;
                            });
                        }
                    }
                });
                // UnVisible??? ??? 1????????? ????????? Unvisble??? ??? ???????????? ??????.
                if (found === 1 && checkValue === false) {
                    found = 0;
                    item.child_menu_resources.map((child, idx) => {
                        if (child.id !== id && item.id === foundItemId && child.visible === true) {
                            console.log('2 step found ......');
                            found = 1;
                        }
                    });
                    if (found === 0) item.visible = checkValue;
                    found = 1;
                }
            });
            console.log('2');
            console.log(found);
            if (found === 0) {
                // 3??????
                console.log('3');
                checkMenuData.map((item, index) => {
                    item.child_menu_resources.map((child, idx) => {
                        child.child_menu_resources.map((sub, i) => {
                            if (sub.id === id) {
                                found = 1;
                                // Visible??? ?????? ??????/?????? Visuble
                                if (checkValue === true) {
                                    item.visible = checkValue;
                                    child.visible = checkValue;
                                }
                                sub.visible = checkValue;
                            }
                        });

                        if (found === 1 && checkValue === false) {
                            found = 0;
                            child.child_menu_resources.map((sub, i) => {
                                if (sub.id !== id) {
                                    if (sub.visible === true) {
                                        found = 1;
                                    }
                                }
                            });
                            if (found === 0) {
                                child.visible = checkValue;
                            }
                            found = 1;
                        }
                    });
                    // found = 0;
                    // if (checkValue === false) {
                    //     item.child_menu_resources.map((child, idx) => {

                    //     });
                    // }
                });
            }
        }
        console.log('checkMenuData');
        console.log(checkMenuData);
        setMenuData(checkMenuData);
        renderTreeItem(checkMenuData);
    };

    const statusUpdate = (id, checked) => {
        setMenuData((current) => {
            current.map((obj) => {
                if (obj.id === id) {
                    console.log(obj);
                    return { ...obj, visible: checked };
                } else {
                    obj.child_menu_resources.map((o1) => {
                        if (o1.id === id) {
                            console.log(o1);
                            return { ...o1, visible: checked };
                        }
                        return o1;
                    });
                }
                return obj;
            });
        });
    };

    const renderTreeItem = (items) => {
        //console.log('renderTreeItem called...');
        //console.log(items);
        const menu = items.map((item) => {
            if (item.child_menu_resources && item.child_menu_resources.length) {
                return (
                    <CheckBoxTreeItem
                        key={item.id}
                        nodeId={item.id}
                        dataMsg={item.id}
                        label={item.name}
                        visible={item.visible}
                        //nodeSelect={() => handleSelect(item.id, item.name)}
                        visibleChange={visibleChange}
                        dataClick={() => handleSelect(item.id, item.name)}
                    >
                        {renderTreeItem(item.child_menu_resources)}
                    </CheckBoxTreeItem>
                );
            } else {
                return (
                    <CheckBoxTreeItem
                        key={item.id}
                        nodeId={item.id}
                        dataMsg={item.id}
                        label={item.name}
                        visible={item.visible}
                        //nodeSelect={() => handleSelect(item.id, item.name)}
                        visibleChange={visibleChange}
                        dataClick={() => handleSelect(item.id, item.name)}
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
                <HeaderTitle titleNm="?????? ?????? ??????" menuStep01="??????????????? ??????" menuStep02="?????? ??????" menuStep03="?????? ?????? ??????" />

                <MainCard>
                    <TopInputLayout>
                        <FlexBox>
                            <DropInput title="????????? ??????" style={{ marginRight: '2rem' }}>
                                <Select name="site_id" label="????????????" value={site_id} onChange={handleChange}>
                                    <MenuItem value="">
                                        <em>Choose a Site Type</em>
                                    </MenuItem>
                                    {siteList.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </DropInput>

                            <DropInput title="Type" style={{ marginRight: '2rem' }}>
                                <Select name="type" label="Role Type" value={type} onChange={handleChange}>
                                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                                    <MenuItem value="USER">USER</MenuItem>
                                </Select>
                            </DropInput>

                            <DropInput title="Role Name">
                                <Select name="role_id" label="Role Name" value={role_id} onChange={handleChange}>
                                    {roleList.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </DropInput>
                        </FlexBox>

                        <ButtonLayout>
                            <Button
                                disableElevation
                                size="medium"
                                type="submit"
                                color="secondary"
                                variant="outlined_d"
                                onClick={searchClick}
                            >
                                ??????
                            </Button>
                        </ButtonLayout>
                    </TopInputLayout>
                </MainCard>
                <MainCard>
                    <ButtonLayout>
                        <Button
                            disableElevation
                            size="medium"
                            type="submit"
                            color="primary"
                            variant="contained"
                            onClick={handleRoleRedisInit}
                        >
                            ????????? ?????????
                        </Button>
                        <Button
                            disableElevation
                            size="small"
                            type="submit"
                            color="error"
                            variant="contained"
                            onClick={handleInitProgramMenuMapping}
                        >
                            ??????X???????????? ?????????
                        </Button>
                        <Button
                            disableElevation
                            size="small"
                            type="submit"
                            color="warning"
                            variant="contained"
                            onClick={handleProgramMenuMapping}
                        >
                            ??????X???????????? ??????
                        </Button>
                        <Button
                            disableElevation
                            size="small"
                            type="submit"
                            color="error"
                            variant="contained"
                            onClick={handleInitAuthProgramMenuMapping}
                        >
                            ??????X???????????? ?????????
                        </Button>
                        <Button
                            disableElevation
                            size="small"
                            type="submit"
                            color="warning"
                            variant="contained"
                            onClick={handleAuthProgramMenuMapping}
                        >
                            ??????X???????????? ??????
                        </Button>
                    </ButtonLayout>
                </MainCard>
                <Grid container>
                    <Grid item xs={4}>
                        <MainCard sx={{ mb: 0, p: 0, height: '100%' }}>
                            <TreeView
                                aria-label="controlled"
                                defaultCollapseIcon={<ExpandMoreIcon />}
                                defaultExpandIcon={<ChevronRightIcon />}
                                sx={{ m: 0, height: '100%', flexGrow: 1, overflowY: 'auto' }}
                            >
                                {renderTreeItem(menudata)}
                            </TreeView>
                        </MainCard>
                    </Grid>

                    {/* ????????? ?????? */}
                    <Grid item xs={8} className="blank--layout">
                        <div className="layout--align">
                            <Item>Role : {role_name}</Item>
                            <Button disableElevation size="medium" type="button" variant="contained" onClick={programMappingSaveClick}>
                                ??????
                            </Button>
                        </div>

                        <Grid container spacing={0} sx={{ mt: 1 }}>
                            <Grid item xs={8} sm={12}>
                                <ContentLine>
                                    <DefaultDataGrid
                                        columns={roleColumns}
                                        rows={dataGridRoleRows}
                                        handlePageChange={handlePage}
                                        handleGridClick={handleClick}
                                        handleGridDoubleClick={handleDoubleClick}
                                        selectionChange={handleSelectionRoleChange}
                                        height={355}
                                    />
                                </ContentLine>
                            </Grid>

                            <Grid container spacing={0} sx={{ mt: 1 }}>
                                <div className="layout--align">
                                    <Item>???????????? ??????</Item>
                                    <Button
                                        disableElevation
                                        size="medium"
                                        type="button"
                                        variant="outlined_d"
                                        onClick={programMappingSave}
                                        color="secondary"
                                    >
                                        ????????????
                                    </Button>
                                </div>

                                <Grid container spacing={0} sx={{ mt: 1 }}>
                                    <Grid item xs={12}>
                                        <ContentLine>
                                            <CheckBoxDataGrid
                                                columns={programColumns}
                                                rows={dataGridProgramRows}
                                                handlePageChange={handlePage}
                                                handleGridClick={handleClick}
                                                handleGridDoubleClick={handleDoubleClick}
                                                selectionChange={handleSelectionProgramChange}
                                                height={357}
                                            />
                                        </ContentLine>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {errorMessage && (
                        <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default AuthMngRegForm;
