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
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { styled } from '@mui/material/styles';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

import { Input } from 'antd';
import { boolean } from '../../../node_modules/yup/lib/index';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import CheckBoxDataGrid from 'components/DataGrid/CheckBoxDataGrid';
import RoleApi from 'apis/roles/roleapi';
import SiteApi from 'apis/site/siteapi';
import AccountApis from 'apis/account/accountapis';
import ErrorScreen from 'components/ErrorScreen';
import HeaderTitle from '../../components/HeaderTitle';
import TopInputLayout from '../../components/Common/TopInputLayout';
import InputLayout from '../../components/Common/InputLayout';
import ButtonLayout from '../../components/Common/ButtonLayout';
import cx from 'classnames';

const RoleMappingForm = () => {
    let isSubmitting = false;
    const columns = [
        {
            field: 'id',
            headerName: 'Role ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'name',
            headerName: 'Role Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        }
    ];
    const regColumns = [
        {
            field: 'email',
            headerName: '사용자 ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'name',
            headerName: '사용자명',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        }
    ];
    const searchColumns = [
        {
            field: 'email',
            headerName: '사용자 ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'name',
            headerName: '사용자명',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        }
    ];
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary
    }));

    const navigate = useNavigate();
    const [responseData, requestError, loading, { roleSearch, roleRegisterSave, roleRegisterSearch, roleRegisterDelete }] = RoleApi();
    const [resData, reqErr, resLoading, { siteSearch }] = SiteApi();
    const [resAccData, reqAccErr, resAccLoading, { accountUserSearch }] = AccountApis();

    // 저장대상 여부 체크
    const [isSave, setIsSave] = useState(false);

    // 선택된 Role ID
    const [selectedRole, setSelectedRole] = useState('');

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 검색 그리드 선택된 row id
    const [selectedSearchRows, setSelectedSearchRows] = useState([]);
    // 등록된 그리드 선택된 row id
    const [selectedRegisterRows, setSelectedRegisterRows] = useState([]);

    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);
    const [dataGridRegisterRows, setDataGridRegisterRows] = useState([]);
    const [dataGridSearchRows, setSearchGridRows] = useState([]);
    // 저장을 위한 이전 데이터 백업
    const [prevDataGridRows, setPrevDataGridRows] = useState([]);

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
    const [site_id, setSiteId] = useState('');
    const [is_use, setIsUse] = useState(true);

    // 등록 검색 조건
    const [keyword, setKeyword] = useState('');

    // Change Event
    // site가 변경되었을 때 호출된다.
    const siteChanged = (e) => {
        console.log('siteChanged called..');
        console.log(e.target.value);
        setSiteId(e.target.value);
    };

    // onload
    useEffect(() => {
        //errorClear();
        // 사이트 구분 리스트 가져오기
        siteSearch(true, '');
        //roleList();
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
                    setSiteId(list[1].id);
                    roleSearch(true, list[1].id);
                }
                break;
            default:
        }
    }, [resData]);
    // 사용자 검색
    useEffect(() => {
        if (!resAccData) {
            return;
        }
        switch (resAccData.transactionId) {
            case 'getList':
                if (resAccData.data.data && resAccData.data.data.length > 0) {
                    console.log(resAccData.data.data);
                    setSearchGridRows(resAccData.data.data);
                } else {
                    setSearchGridRows([]);
                }
                break;
                break;
            default:
        }
    }, [resAccData]);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'roleList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setDataGridRows(responseData.data.data);
                } else {
                    setDataGridRows([]);
                }
                break;
            case 'registerList':
                if (responseData.data.data) {
                    setDataGridRegisterRows(responseData.data.data);
                    setPrevDataGridRows(responseData.data.data);
                } else {
                    setDataGridRegisterRows([]);
                    setPrevDataGridRows([]);
                }
                break;
            case 'registerData':
                if (responseData.data.data) {
                    alert('저장을 완료하였습니다!!!');
                    roleRegisterSearch(selectedRole, '', '');
                }
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
        if (rowData && rowData.field && rowData.field !== '__check__') {
            // 해당 롤에 등록된 사용자 리스트를 조회한다.
            // Role, SiteId
            setSelectedRole(rowData.id);
            roleRegisterSearch(rowData.id, rowData.site_id, rowData.type);
        }
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // search
    const searchClick = () => {
        //errorClear();
        console.log('searchClick called...');
        roleSearch(true, site_id);
    };
    // 저장한다.
    const saveClick = () => {
        let saveData = [];
        console.log(dataGridRegisterRows);
        if (dataGridRegisterRows.length > 0) {
            // 이전 저장된 백업본과 비교해서 달라진 부분만 저장한다.
            dataGridRegisterRows.map((data, idx) => {
                let found = 0;
                prevDataGridRows.map((prev, index) => {
                    if (prev.id === data.id) {
                        found = 1;
                    }
                });
                if (found === 0) {
                    saveData.push(data.id);
                }
            });
            if (saveData.length === 0) {
                alert('저장할 사용자가 존재하지 않습니다!!!');
            } else {
                let data = { accounts: saveData };
                console.log(selectedRole);
                console.log(data);
                roleRegisterSave(selectedRole, data);
            }
        } else if (dataGridRegisterRows.length === 0 && prevDataGridRows.length > 0) {
            if (confirm('등록 취소한 사용자를 모두 삭제하시겠습니까?')) {
                // all delete
                prevDataGridRows.map((prev, index) => {
                    roleRegisterDelete(selectedRole, prev.id);
                });
            }
        } else {
            alert('등록된 사용자가 없습니다!!!');
        }
    };

    const handleBlur = () => {};
    const handleChange = (e) => {
        if (e.target.name === 'site_id') {
            setSiteId(e.target.value);
        } else {
            setKeyword(e.target.value);
        }
    };
    // 사용자 검색
    const userSearchClick = () => {
        if (!keyword) {
            alert('검색 단어를 입력하세요!!!');
        } else {
            accountUserSearch(true, keyword);
        }
    };
    // 체크된 사용자 리스트에서 등록된 사용자로 이동.
    const plusRegister = () => {
        if (selectedSearchRows.length > 0) {
            selectedSearchRows.map((id, Index) => {
                let found = 0;
                dataGridRegisterRows.map((regData, idx) => {
                    if (id === regData.id) {
                        found = 1;
                    }
                });
                if (found === 0) {
                    dataGridSearchRows.map((data, i) => {
                        if (id === data.id) {
                            let selectedData = { id: data.id, name: data.name, email: data.email };
                            console.log(selectedData);
                            setDataGridRegisterRows((prevRows) => [...prevRows, selectedData]);
                            setIsSave(true);
                        }
                    });
                }
            });
        }
    };
    // 체크된 등록된 사용자를 뺀다.
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

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle titleNm="사용자 맵핑" menuStep01="통합시스템 관리" menuStep02="Role 관리" menuStep03="사용자 맵핑" />
                <MainCard>
                    <TopInputLayout>
                        <InputLayout>
                            <Stack spacing={10} className={cx('borderTitle')}>
                                사이트 구분
                            </Stack>

                            <FormControl size="medium" sx={{ minWidth: 250 }}>
                                <Select name="site_id" label="사이트명" value={site_id} onChange={siteChanged} placeholder="사이트명">
                                    {siteList.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControlLabel
                                control={<Checkbox name="is_use" checked={is_use} value={is_use} onChange={isUseChange} />}
                                label="사용함"
                                className="checkedBox"
                            />
                        </InputLayout>

                        <ButtonLayout>
                            <Button disableElevation size="medium" type="submit" variant="contained" onClick={searchClick} color="primary">
                                검색
                            </Button>

                            <Button disableElevation size="medium" type="submit" variant="contained" onClick={saveClick} color="primary">
                                저장
                            </Button>
                        </ButtonLayout>
                    </TopInputLayout>
                </MainCard>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item md={4}>
                        <MainCard sx={{ mt: 3 }} content={false}>
                            <DefaultDataGrid
                                columns={columns}
                                rows={dataGridRows}
                                height={840}
                                handlePageChange={handlePage}
                                handleGridClick={handleClick}
                                handleGridDoubleClick={handleDoubleClick}
                                selectionChange={handleSelectionChange}
                            />
                        </MainCard>
                    </Grid>
                    <Grid item md={7.8}>
                        <Grid item xs={8} sm={1.5}>
                            <Stack spacing={5} sx={{ mt: 2 }} justifyContent="left" alignItems="left">
                                <Item>등록된 사용자</Item>
                            </Stack>
                        </Grid>
                        <Stack spacing={5}>
                            <MainCard sx={{ mt: 2, height: 330 }} content={false}>
                                <CheckBoxDataGrid
                                    columns={regColumns}
                                    rows={dataGridRegisterRows}
                                    handlePageChange={handlePage}
                                    //handleGridClick={handleClick}
                                    handleGridDoubleClick={handleDoubleClick}
                                    selectionChange={handleSelectionRegisterChange}
                                    height={330}
                                />
                            </MainCard>
                        </Stack>
                        <Stack mt={1} spacing={2} direction="row" justifyContent="center" alignItems="center">
                            <Item>
                                <ArrowDropUpIcon aria-label=" +" disabled color="primary" onClick={plusRegister}></ArrowDropUpIcon>
                            </Item>
                            <Item>
                                <ArrowDropDownIcon aria-label=" +" disabled color="primary" onClick={minusRegister}></ArrowDropDownIcon>
                            </Item>
                        </Stack>
                        <Stack spacing={1} sx={{ mt: 2 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={8} sm={2}>
                                    <Stack spacing={5} sx={{ mt: 0 }} justifyContent="left" alignItems="left">
                                        <Item>사용자 검색</Item>
                                    </Stack>
                                </Grid>
                                <Grid item xs={8} sm={4}>
                                    <Stack spacing={5}>
                                        <FormControl sx={{ m: 0, maxWidth: 220 }} size="small">
                                            <TextField
                                                id="filled-hidden-label-small"
                                                type="text"
                                                size="small"
                                                value={keyword}
                                                name="keyword"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Role ID"
                                                fullWidth
                                            />
                                        </FormControl>
                                    </Stack>
                                </Grid>
                                <Grid item xs={8} sm={4}></Grid>
                                <Grid item xs={8} sm={2}>
                                    <FormControl sx={{ m: 0, maxHeight: 30 }} size="small">
                                        <Button
                                            disableElevation
                                            size="small"
                                            type="button"
                                            variant="contained"
                                            color="secondary"
                                            onClick={userSearchClick}
                                        >
                                            검색
                                        </Button>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Stack>
                        <Stack spacing={5}>
                            <MainCard sx={{ mt: 2, height: 330 }} content={false}>
                                <CheckBoxDataGrid
                                    columns={searchColumns}
                                    rows={dataGridSearchRows}
                                    handlePageChange={handlePage}
                                    //handleGridClick={handleClick}
                                    handleGridDoubleClick={handleDoubleClick}
                                    selectionChange={handleSelectionSearchChange}
                                    height={330}
                                />
                            </MainCard>
                        </Stack>
                    </Grid>
                </Grid>
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
            </Grid>
        </Grid>
    );
};

export default RoleMappingForm;
