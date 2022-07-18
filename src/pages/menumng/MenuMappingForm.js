import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material-ui
// eslint-disable-next-line prettier/prettier
import { Button, Checkbox, FormControl, FormControlLabel, Grid, MenuItem, Paper, Select, Stack, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import MainCard from 'components/MainCard';
import SvgIcon from '@mui/material/SvgIcon';
import CheckBoxDataGrid from '../../components/DataGrid/CheckBoxDataGrid';
import SiteApi from 'apis/site/siteapi';
import MenuMngApi from 'apis/menu/menumngapi';
import ProgramApi from 'apis/programs/programapi';
import ErrorScreen from 'components/ErrorScreen';
import CustomTreeItem from 'components/TreeMenu/CustomTreeItem';
import TreeView from '@mui/lab/TreeView';
import HeaderTitle from '../../components/HeaderTitle';
import ButtonLayout from '../../components/Common/ButtonLayout';
import TopInputLayout from '../../components/Common/TopInputLayout';
import InputLayout from '../../components/Common/InputLayout';
import cx from 'classnames';
import './styles.scss';

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
        { menumngSearch, menumngDetail, programMapping, programMappingSearch }
    ] = MenuMngApi();
    const [rData, rError, rLoading, { programTextSearch }] = ProgramApi();

    const [expanded, setExpanded] = useState([]);
    const [selected, setSelected] = useState([]);
    const [menudata, setMenuData] = useState([]); // menu data

    const [isSave, setIsSave] = useState(false); // input mode

    const regColumns = [
        {
            field: 'id',
            headerName: '프로그램 ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'name',
            headerName: '프로그램명',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'kind_name',
            headerName: '분류',
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
            headerName: '관리메뉴',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'is_use',
            headerName: '사용여부',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        }
    ];
    const searchColumns = [
        {
            field: 'id',
            headerName: '프로그램 ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'name',
            headerName: '프로그램명',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'kind_name',
            headerName: '분류',
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
            headerName: '관리메뉴',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'is_use',
            headerName: '사용여부',
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

    const [dataGridRegisterRows, setDataGridRegisterRows] = useState([]);
    const [dataGridSearchRows, setSearchGridRows] = useState([]);
    // 등록된 그리드 선택된 row id
    const [selectedRegisterRows, setSelectedRegisterRows] = useState([]);
    // 검색 그리드 선택된 row id
    const [selectedSearchRows, setSelectedSearchRows] = useState([]);

    // 입력 데이터 - Default
    const [inputs, setInputs] = useState({
        site_id: '',
        is_use: true,
        keyword: ''
    });
    const { site_id, is_use, keyword } = inputs;

    // onload
    useEffect(() => {
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
                    siteData.map((site, index) => {
                        const s = { id: site.id, name: site.name };
                        console.log(s);
                        list.push(s);
                    });
                    setSiteList(list);
                    setInputs({
                        ...inputs, // 기존 input 객체 복사
                        site_id: list[1].id
                    });
                    menumngSearch(list[1].id, is_use);
                }
                break;
            default:
        }
    }, [resData]);

    // 프로그램 목록 검색
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
                // 메뉴와 프로그램 연결 완료시
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
            alert('사이트명을 선택하세요!!!');
            return;
        }
        menumngSearch(site_id, is_use);
    };
    // 저장한다.
    const saveClick = () => {};

    // Site구분, is_use, 검색 키워드 입력 박스 입력 시 호출
    const handleChange = (e) => {
        let { value, name } = e.target;
        if (e.target.type === 'checkbox') {
            value = e.target.checked;
        } else {
            value = e.target.value;
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

    //체크박스 선택된 row id 저장
    const handleSelectionChange = (item) => {
        if (item) {
            setSeletedRows(item);
        }
    };
    // 사용자 검색 그리드에서 체크박스 선택된 row id.
    const handleSelectionSearchChange = (item) => {
        if (item) {
            console.log(item);
            setSelectedSearchRows(item);
        }
    };
    // 등록된 그리드에서 체크박스 선택된 row id.
    const handleSelectionRegisterChange = (item) => {
        if (item) {
            setSelectedRegisterRows(item);
        }
    };

    // 페이징 변경 이벤트
    const handlePage = (page) => {};

    // 그리드 클릭
    const handleClick = (rowData) => {
        // if (rowData && rowData.field && rowData.field !== '__check__') {
        //     // 해당 롤에 등록된 사용자 리스트를 조회한다.
        //     // Role, SiteId
        //     setSelectedRole(rowData.id);
        //     roleRegisterSearch(rowData.id, rowData.site_id, rowData.type);
        // }
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // 선택된 프로그램에 대해서 연결 시킨다.
    const plusRegister = () => {
        let programs_ids = [];
        if (selectedSearchRows.length > 0) {
            selectedSearchRows.map((id, Index) => {
                let found = 0;
                dataGridRegisterRows.map((regData, idx) => {
                    // programinMapping
                    // 중복된 프로그램이 존재하면 등록하지 않는다.
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
    // 연결 프로그램 목록에서 프로그램을 제거한다.
    const minusRegister = () => {
        if (selectedRegisterRows.length > 0) {
            selectedRegisterRows.map((id, Index) => {
                dataGridRegisterRows.map((regData, idx) => {
                    if (id === regData.id) {
                        setDataGridRegisterRows((prevRows) => [...prevRows.slice(0, idx), ...prevRows.slice(idx + 1)]);
                        setIsSave(true);
                    }
                });
                // let selectedData = { id: data.id, name: data.name, email: data.email };
                // // 등록된 데이터가 없으면 등록해야 한다.
                // dataGridRegisterRows.pop(selectedData);
            });
        }
    };
    // 프로그램 목로 - 검색
    const programSearchClick = () => {
        if (!keyword) {
            alert('검색 단어를 입력하세요!!!');
            return;
        }
        if (!site_id) {
            alert('사이트 구분을 선택하시고 조회하시기 바랍니다!!!');
            return;
        }
        programTextSearch(site_id, true, keyword);
    };
    const keyPress = (e) => {
        if (e.key == 'Enter') {
            programSearchClick();
        }
    };

    // 에러 메시지 처리
    const setError = (msg) => {
        setErrorTitle('입력 오류');
        setErrorMessage(msg);
        setOpen(true);
    };

    // TreeView Event Call
    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    // TreeView 메뉴를 선택했을 때 연결된 프로그램 목록 조회와 메뉴 아이디를 상태에 보관해야 한다.
    const handleSelect = (nodeIds) => {
        console.log(nodeIds);
        setSelected(nodeIds);
        setExpanded(nodeIds);
        // 프로그램 목록 초기화
        setSearchGridRows([]);
        setSelectedSearchRows([]);
        // 선택한 노드에 대해서 상세 데이터를 조회한다.
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
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle titleNm="프로그램 연결" menuStep01="통합시스템 관리" menuStep02="메뉴 관리" menuStep03="프로그램 연결" />

                <MainCard>
                    <TopInputLayout>
                        <InputLayout>
                            <Stack spacing={10} className={cx('borderTitle')}>
                                사이트 구분
                            </Stack>
                            <FormControl sx={{ minWidth: 250 }} size="medium">
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
                            <FormControlLabel
                                control={<Checkbox name="is_use" checked={is_use} value={is_use} onChange={handleChange} />}
                                label="사용함"
                                className="checkedBox"
                            />
                        </InputLayout>

                        <ButtonLayout>
                            <Button disableElevation size="medium" type="submit" variant="contained" onClick={searchClick} color="primary">
                                검색
                            </Button>
                        </ButtonLayout>
                    </TopInputLayout>
                </MainCard>

                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item md={3}>
                        <MainCard sx={{ mt: 2 }} content={false}>
                            <TreeView
                                aria-label="controlled"
                                // defaultExpanded={expanded}
                                defaultCollapseIcon={<MinusSquare />}
                                defaultExpandIcon={<PlusSquare />}
                                defaultEndIcon={<CloseSquare />}
                                sx={{ height: 640, flexGrow: 1, overflowY: 'auto' }}
                                //expanded={expanded}
                                //selected={selected}
                                onNodeToggle={handleToggle}
                                //onNodeSelect={handleSelect}
                            >
                                {renderTreeItem(menudata)}
                            </TreeView>
                        </MainCard>
                    </Grid>
                    <Grid item md={8.8}>
                        <MainCard sx={{ mt: 2 }}>
                            <TopInputLayout>
                                <Item>연결된 프로그램 목록</Item>

                                <ButtonLayout>
                                    <Button disableElevation size="medium" type="button" variant="contained" onClick={minusRegister}>
                                        Remove
                                    </Button>
                                </ButtonLayout>
                            </TopInputLayout>

                            <Grid container spacing={0} sx={{ mt: 1 }}>
                                <Grid item xs={8} sm={12}>
                                    <MainCard sx={{ mt: 0 }} content={false}>
                                        <CheckBoxDataGrid
                                            columns={regColumns}
                                            rows={dataGridRegisterRows}
                                            handlePageChange={handlePage}
                                            handleGridClick={handleClick}
                                            handleGridDoubleClick={handleDoubleClick}
                                            selectionChange={handleSelectionRegisterChange}
                                            height={240}
                                        />
                                    </MainCard>
                                </Grid>
                            </Grid>
                            <Grid container spacing={0} sx={{ mt: 2 }}>
                                <TopInputLayout>
                                    <Item>프로그램 목록</Item>

                                    <div className="program--list">
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
                                                placeholder="프로그램명 입력"
                                                fullWidth
                                            />
                                        </FormControl>

                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="button"
                                            variant="contained"
                                            onClick={programSearchClick}
                                            className={cx('layout--blank')}
                                        >
                                            검색
                                        </Button>
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="button"
                                            variant="contained"
                                            color="secondary"
                                            onClick={plusRegister}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </TopInputLayout>

                                <Grid container spacing={0} sx={{ mt: 1 }}>
                                    <Grid item xs={8} sm={12}>
                                        <MainCard sx={{ mt: 0 }} content={false}>
                                            <CheckBoxDataGrid
                                                columns={searchColumns}
                                                rows={dataGridSearchRows}
                                                handlePageChange={handlePage}
                                                handleGridClick={handleClick}
                                                handleGridDoubleClick={handleDoubleClick}
                                                selectionChange={handleSelectionSearchChange}
                                                height={240}
                                            />
                                        </MainCard>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </MainCard>
                    </Grid>
                </Grid>
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
            </Grid>
        </Grid>
    );
};

export default MenuMappingForm;
