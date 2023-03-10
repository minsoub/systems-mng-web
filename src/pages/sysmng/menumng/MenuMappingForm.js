import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Checkbox, FormControl, FormControlLabel, Grid, MenuItem, Paper, Select, Stack, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import MainCard from 'components/Common/MainCard';
import SvgIcon from '@mui/material/SvgIcon';
import CheckBoxDataGrid from 'components/DataGrid/CheckBoxDataGrid';
import SiteApi from 'apis/site/siteapi';
import MenuMngApi from 'apis/menu/menumngapi';
import ProgramApi from 'apis/programs/programapi';
import ErrorScreen from 'components/ErrorScreen';
import CustomTreeItem from 'components/TreeMenu/CustomTreeItem';
import TreeView from '@mui/lab/TreeView';
import HeaderTitle from 'components/HeaderTitle';
import ButtonLayout from 'components/Common/ButtonLayout';
import TopInputLayout from 'components/Common/TopInputLayout';
import InputLayout from 'components/Common/InputLayout';
import cx from 'classnames';
import './styles.scss';
import ContentLine from '../../../components/Common/ContentLine';
import DropInput from '../../../components/Common/DropInput';

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

const MenuMappingForm = () => {
    const navigate = useNavigate();
    const [resData, reqErr, resLoading, { siteSearch }] = SiteApi();
    const [
        responseData,
        requestError,
        responseLoading,
        { menumngSearch, menumngDetail, programMapping, programMappingSearch, programMappingDelete }
    ] = MenuMngApi();
    const [rData, rError, rLoading, { programTextSearch }] = ProgramApi();

    const [expanded, setExpanded] = useState([]);
    const [selected, setSelected] = useState([]);
    const [menudata, setMenuData] = useState([]); // menu data

    const [isSave, setIsSave] = useState(false); // input mode

    const regColumns = [
        {
            field: 'id',
            headerName: '???????????? ID',
            flex: 0.5,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'name',
            headerName: '???????????????',
            flex: 0.7,
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
            flex: 0.5,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'action_url',
            headerName: 'Action Url',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        }
    ];
    const searchColumns = [
        {
            field: 'id',
            headerName: '???????????? ID',
            flex: 0.5,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'name',
            headerName: '???????????????',
            flex: 0.7,
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
            flex: 0.5,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'action_url',
            headerName: 'Action Url',
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

    const [dataGridRegisterRows, setDataGridRegisterRows] = useState([]);
    const [dataGridSearchRows, setSearchGridRows] = useState([]);
    // ????????? ????????? ????????? row id
    const [selectedRegisterRows, setSelectedRegisterRows] = useState([]);
    // ?????? ????????? ????????? row id
    const [selectedSearchRows, setSelectedSearchRows] = useState([]);

    // ?????? ????????? - Default
    const [inputs, setInputs] = useState({
        site_id: '',
        is_use: true,
        keyword: '',
        program_site_id: ''
    });
    const { site_id, is_use, keyword, program_site_id } = inputs;

    // onload
    useEffect(() => {
        // ????????? ?????? ????????? ????????????
        siteSearch(true, '');
    }, []);

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
                    setInputs({
                        ...inputs, // ?????? input ?????? ??????
                        site_id: list[1].id,
                        program_site_id: list[1].id
                    });
                    menumngSearch(list[1].id, is_use);
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
                    setSearchGridRows(rData.data.data);
                } else {
                    setSearchGridRows([]);
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
            case 'mappingList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setDataGridRegisterRows(responseData.data.data);
                } else {
                    setDataGridRegisterRows([]);
                }
                break;
            default:
        }
    }, [responseData]);

    const handleClose = () => {
        setVisible(false);
    };

    // search
    const searchClick = () => {
        //errorClear();
        console.log('searchClick called...');
        if (!site_id) {
            alert('??????????????? ???????????????.');
            return;
        }
        menumngSearch(site_id, is_use);
    };
    // ????????????.
    const saveClick = () => {};

    // Site??????, is_use, ?????? ????????? ?????? ?????? ?????? ??? ??????
    const handleChange = (e) => {
        let { value, name } = e.target;
        if (e.target.type === 'checkbox') {
            value = e.target.checked;
        } else {
            value = e.target.value;
        }
        setInputs({
            ...inputs, // ?????? input ?????? ??????
            [name]: value
        });
    };
    const handleBlur = (e) => {
        console.log(e);
    };

    // ?????? ?????? ??????
    const menuPopupSearch = () => {
        // ??????
    };

    //???????????? ????????? row id ??????
    const handleSelectionChange = (item) => {
        if (item) {
            setSeletedRows(item);
        }
    };
    // ????????? ?????? ??????????????? ???????????? ????????? row id.
    const handleSelectionSearchChange = (item) => {
        if (item) {
            console.log(item);
            setSelectedSearchRows(item);
        }
    };
    // ????????? ??????????????? ???????????? ????????? row id.
    const handleSelectionRegisterChange = (item) => {
        if (item) {
            setSelectedRegisterRows(item);
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

    // ????????? ??????????????? ????????? ?????? ?????????.
    const plusRegister = () => {
        console.log('plusRegister call..');
        console.log(selectedSearchRows);
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
            console.log(programs_ids);
            if (programs_ids.length) {
                programMapping(selected, site_id, programs_ids);
            }
        }
    };
    // ?????? ???????????? ???????????? ??????????????? ????????????.
    const deleteMapping = () => {
        let programs_ids = [];
        if (selectedRegisterRows.length > 0) {
            let newList = dataGridRegisterRows;
            selectedRegisterRows.map((id, Index) => {
                newList = newList.filter((item) => item.id !== id);
                setDataGridRegisterRows(newList);
                setIsSave(true);
                programs_ids.push(id);
                console.log(programs_ids);
                if (programs_ids.length) {
                    programMappingDelete(selected, site_id, programs_ids);
                }
            });
        }
    };
    // ???????????? ?????? - ??????
    const programSearchClick = () => {
        if (program_site_id === '????????????') {
            programTextSearch(site_id, true, keyword, true);
        } else {
            programTextSearch(program_site_id, true, keyword, false);
        }
    };
    const keyPress = (e) => {
        if (e.key === 'Enter') {
            programSearchClick();
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
        setExpanded(nodeIds);
    };

    // TreeView ????????? ???????????? ??? ????????? ???????????? ?????? ????????? ?????? ???????????? ????????? ???????????? ??????.
    const handleSelect = (nodeIds) => {
        console.log(nodeIds);
        setSelected(nodeIds);
        setExpanded(nodeIds);
        // ????????? ????????? ????????? ?????? ???????????? ????????????.
        programMappingSearch(nodeIds, site_id);
    };

    const renderTreeItem = (items) => {
        //console.log(items);
        const menu = items.map((item) => {
            if (item.child_menu && item.child_menu.length) {
                return (
                    <CustomTreeItem key={item.id} nodeId={item.id} dataMsg={item.id} labelText={item.name} nodeSelect={handleSelect}>
                        {renderTreeItem(item.child_menu)}
                    </CustomTreeItem>
                );
            } else {
                return <CustomTreeItem key={item.id} nodeId={item.id} dataMsg={item.id} labelText={item.name} nodeSelect={handleSelect} />;
            }
            return null;
        });
        return menu;
    };

    return (
        <Grid container rowSpacing={4} columnSpacing={2.75}>
            <Grid item xs={12}>
                <HeaderTitle titleNm="???????????? ??????" menuStep01="??????????????? ??????" menuStep02="?????? ??????" menuStep03="???????????? ??????" />

                <MainCard sx={{ mt: 1 }}>
                    <TopInputLayout>
                        <InputLayout>
                            <DropInput title="????????? ??????">
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
                            <FormControlLabel
                                control={<Checkbox name="is_use" checked={is_use} value={is_use} onChange={handleChange} />}
                                label="?????????"
                                className="checkedBox"
                            />
                        </InputLayout>

                        <ButtonLayout>
                            <Button
                                disableElevation
                                size="medium"
                                color="secondary"
                                type="submit"
                                variant="outlined_d"
                                onClick={searchClick}
                            >
                                ??????
                            </Button>
                        </ButtonLayout>
                    </TopInputLayout>
                </MainCard>

                {/* ????????? ?????? */}
                <Grid container alignItems="center" justifyContent="space-between" className="layout--out">
                    <Grid item xs={4} className="menu--submit">
                        <MainCard sx={{ height: '100%', mb: 0, p: 0 }}>
                            <TreeView
                                aria-label="controlled"
                                // defaultExpanded={expanded}
                                defaultCollapseIcon={<MinusSquare />}
                                defaultExpandIcon={<PlusSquare />}
                                defaultEndIcon={<CloseSquare />}
                                sx={{ m: 0, flexGrow: 1, overflowY: 'auto' }}
                                //expanded={expanded}
                                //selected={selected}
                                onNodeToggle={handleToggle}
                                //onNodeSelect={handleSelect}
                            >
                                {renderTreeItem(menudata)}
                            </TreeView>
                        </MainCard>
                    </Grid>
                    <Grid item xs={8} className="menu--right">
                        <Grid container spacing={0} sx={{ mt: 1 }} className="layout--align">
                            <Item>????????? ???????????? ??????</Item>

                            <ButtonLayout>
                                <Button
                                    disableElevation
                                    size="medium"
                                    type="button"
                                    variant="contained"
                                    color="error"
                                    onClick={deleteMapping}
                                >
                                    ??????
                                </Button>
                            </ButtonLayout>
                            <Grid item xs={8} sm={12} sx={{ mt: '8px' }}>
                                <ContentLine>
                                    <CheckBoxDataGrid
                                        columns={regColumns}
                                        rows={dataGridRegisterRows}
                                        handlePageChange={handlePage}
                                        handleGridClick={handleClick}
                                        handleGridDoubleClick={handleDoubleClick}
                                        selectionChange={handleSelectionRegisterChange}
                                        height={380}
                                    />
                                </ContentLine>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} sx={{ mt: 2.5 }} className="layout--align">
                            <Item>???????????? ??????</Item>

                            <div className="program--list">
                                <div className="program--list__align">
                                    <DropInput title="????????? ??????">
                                        <Select name="program_site_id" label="????????????" value={program_site_id} onChange={handleChange}>
                                            <MenuItem value="????????????">
                                                <em>????????????</em>
                                            </MenuItem>
                                            {siteList.map((item, index) => (
                                                <MenuItem key={index} value={item.id}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </DropInput>
                                    <InputLayout>
                                        <FormControl sx={{ minWidth: 250 }} size="medium">
                                            <TextField
                                                id="filled-hidden-label-small"
                                                type="text"
                                                size="medium"
                                                value={keyword}
                                                name="keyword"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                onKeyPress={keyPress}
                                                placeholder="??????????????? ??????"
                                                fullWidth
                                            />
                                        </FormControl>
                                    </InputLayout>

                                    <Button
                                        disableElevation
                                        size="medium"
                                        type="button"
                                        variant="outlined_d"
                                        onClick={programSearchClick}
                                        className={cx('layout--button--rightBlank')}
                                        color="secondary"
                                    >
                                        ??????
                                    </Button>
                                    <Button
                                        disableElevation
                                        size="medium"
                                        type="button"
                                        variant="contained"
                                        color="primary"
                                        onClick={plusRegister}
                                    >
                                        ??????
                                    </Button>
                                </div>
                            </div>
                            <Grid container spacing={0} sx={{ mt: 1 }}>
                                <Grid item xs={8} sm={12}>
                                    <ContentLine>
                                        <CheckBoxDataGrid
                                            columns={searchColumns}
                                            rows={dataGridSearchRows}
                                            handlePageChange={handlePage}
                                            handleGridClick={handleClick}
                                            handleGridDoubleClick={handleDoubleClick}
                                            selectionChange={handleSelectionSearchChange}
                                            height={380}
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
    );
};

export default MenuMappingForm;
