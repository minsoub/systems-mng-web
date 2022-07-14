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
    FormControlLabel,
    FormHelperText,
    InputLabel,
    Checkbox,
    Select,
    TextField,
    FormControl,
    Alert,
    Collapse,
    AlertTitle,
    Paper,
    Typography
} from '@mui/material';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import MainCard from 'components/MainCard';
import { styled } from '@mui/material/styles';
import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Input } from 'antd';
import { boolean } from '../../../node_modules/yup/lib/index';
import DefaultDataGrid from '../../components/DataGrid/DefaultDataGrid';
import AccountApis from 'apis/account/accountapis';
import SiteApi from 'apis/site/siteapi';
import RoleApi from 'apis/roles/roleapi';
import { DatePicker } from 'antd';
import { MenuItem } from '../../../node_modules/@mui/material/index';
import CheckBoxDataGrid from '../../components/DataGrid/CheckBoxDataGrid';
import ErrorScreen from 'components/ErrorScreen';

const AccountRegForm = () => {
    let isSubmitting = false;
    const regColumns = [
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
        },
        {
            field: 'site_id',
            headerName: '사이트 ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'site_name',
            headerName: '사이트명',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        }
    ];

    const navigate = useNavigate();
    const { paramId } = useParams();
    const [
        responseData,
        requestError,
        loading,
        { accountMngDetail, accountDetail, accountSearch, accountUpdate, accountInsert, accountMngRole, accountRoleUpdate }
    ] = AccountApis();
    const [resData, reqErr, resLoading, { siteSearch }] = SiteApi();
    const [resRoleData, resRoleError, resRoleLoading, { roleComboSearch }] = RoleApi();

    // Grid
    const [dataGridRegisterRows, setDataGridRegisterRows] = useState([]);
    // 등록된 그리드 선택된 row id
    const [selectedRegisterRows, setSelectedRegisterRows] = useState([]);
    const [isSave, setIsSave] = useState(false); // input mode

    const [itemList, setItemList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [role_id, setRoleId] = useState('');
    const [site_id, setSiteId] = useState('');

    // Role Update button
    const [isRoleUpdate, setIsRoleUpdate] = useState(true);

    // User Search Dialog
    const [openUserSearch, setOpenUserSearch] = useState(false);
    const [selectedValue, setSelectedValue] = useState([]);

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

    // Form data
    const [id, setId] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [is_use, setIsUse] = useState(true);
    const [status, setStatus] = useState('');
    const [send_chk, setSendChk] = useState(false);

    // Email 작성 여부
    const [emailStatus, setEmailStatus] = useState(false);
    // Email 중복 체크
    const [emailChk, setEmailChk] = useState(false);
    // 중복 체크 버튼 제어
    const [isUpdate, setIsUpdate] = useState(false);

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: '#1A2027',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: '#ffffff'
    }));

    // site가 변경되었을 때 호출된다.
    const siteChanged = (e) => {
        console.log('siteChanged called..');
        console.log(e.target.value);
        setSiteId(e.target.value);
        console.log(site_id);
        setRoleList([]);
        roleComboSearch(true, 'ADMIN', e.target.value);
    };

    const roleChanged = (e) => {
        console.log(e.target.value);
        setRoleId(e.target.value);
    };

    const statusChanged = (e) => {
        console.log(e.target.value);
        setStatus(e.target.value);
    };

    // transaction error 처리
    useEffect(() => {
        if (requestError || reqErr || resRoleError) {
            let err = requestError ? requestError : reqErr;
            if (resRoleError) err = resRoleError;

            if (err.result === 'FAIL') {
                console.log('error requestError');
                console.log(err);
                setErrorTitle('Error Message');
                setErrorMessage('[' + err.error.code + '] ' + err.error.message);
                setOpen(true);
            }
        }
    }, [requestError, reqErr, resRoleError]);

    // onload
    useEffect(() => {
        errorClear();
        // 사이트 구분 리스트 가져오기
        siteSearch(true, '');

        if (paramId) {
            // 수정 데이터 조회
            accountMngDetail(paramId);
            //accountDetail(paramId);
            // Role 정보 조회
            accountMngRole(paramId);
            setIsRoleUpdate(false);
        } else {
            setIsUpdate(false);
            setIsRoleUpdate(true);
        }
    }, []);

    // 에러 정보를 클리어 한다.
    const errorClear = () => {
        setOpen(false);
        setErrorTitle('');
        setErrorMessage('');
    };

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
                    let siteList = [];
                    siteData.map((site, index) => {
                        const s = { id: site.id, name: site.name };
                        console.log(s);
                        siteList.push(s);
                    });
                    setItemList(siteList);
                }
                break;
            default:
        }
    }, [resData]);

    // 운영권한(Role)
    useEffect(() => {
        if (!resRoleData) {
            return;
        }
        switch (resRoleData.transactionId) {
            case 'roleList':
                if (resRoleData.data.data) {
                    let roleData = resRoleData.data.data;
                    let roleList = [];
                    //roleList.push({ id: 'ALL', name: '통합시스템 관리자' });
                    roleData.map((role, index) => {
                        const s = { id: role.id, name: role.name };
                        console.log(s);
                        roleList.push(s);
                    });
                    setRoleList(roleList);
                    if (paramId) {
                        console.log('수정모드에서의 운영권한 멥핑');
                        console.log(role_id);
                        setRoleId(role_id);
                    }
                }
                break;
            default:
        }
    }, [resRoleData]);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        console.log(responseData);
        console.log(responseData.transactionId);
        switch (responseData.transactionId) {
            case 'getList': // Email 중복 체크
                if (responseData.data.data.length > 0) {
                    // 중복이다.
                    alert('이미 등록된 메일 주소입니다!!!');
                    setEmailChk(false);
                } else {
                    // 중복이 아니다.
                    alert('사용 가능한 이메일 주소입니다!!!');
                    setEmailChk(true);
                }
                break;
            case 'getData':
                if (responseData.data.data) {
                    let res = responseData.data.data;
                    setId(res.id);
                    setEmail(res.email);
                    setName(res.name);
                    //setSiteId(res.site_id);
                    //setRoleId(res.role_id);
                    //setPassword(res.password);
                    setIsUse(res.is_use);
                    setStatus(res.status);
                    setIsUpdate(true);
                    setEmailStatus(true);
                    setEmailChk(true);
                    // 수정모드이면 운영권한 콤보박스 데이터를 조회한다.
                    //setRoleList([]);
                    //roleComboSearch(true, 'ADMIN', res.site_id);
                }
                break;
            case 'getRoleData':
                if (responseData.data.data) {
                    let res = responseData.data.data;
                    setDataGridRegisterRows(res);
                } else {
                    setDataGridRegisterRows([]);
                }
                break;
            case 'updateRoleData':
                if (responseData.data.data) {
                    alert('등록된 Role을 저장하였습니다!!!');
                    // Role 정보 조회
                    accountMngRole(paramId);
                    setIsRoleUpdate(false);
                }
                break;
            case 'insertData':
                alert('등록을 완료하였습니다!!!');
                navigate('/account/list');
                break;
            case 'updateData':
                alert('수정을 완료하였습니다!!!');
                navigate('/account/list');
                break;
            case 'deleteDatas':
                console.log('deleteData');
                alert('삭제 처리를 완료하였습니다');
                //actionList();
                break;
            default:
        }
    }, [responseData]);

    const handleChange = (e) => {
        switch (e.target.name) {
            case 'id':
                setId(e.target.value);
                break;
            case 'email':
                setEmail(e.target.value);
                setEmailChk(false);
                break;
            case 'name':
                setName(e.target.value);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
            case 'is_use':
                setIsUse(e.target.checked);
                break;
            case 'send_chk':
                setSendChk(e.target.checked);
                break;
            default:
                break;
        }
    };
    const handleBlur = (e) => {
        console.log(e);
    };

    const handleClose = () => {
        setVisible(false);
    };

    // new
    const newClick = () => {
        setName('');
        setEmail('');
        setIsUpdate(false);
        setPassword('');
        setStatus('');
        setSendChk(false);
        setIsUse(true);
        setDataGridRegisterRows([]);
        setIsRoleUpdate(true);
    };

    // delete
    const deleteClick = () => {};

    // list
    const listClick = () => {
        navigate('/account/list');
    };
    // 입력 데이터를 저장한다.
    const saveClick = () => {
        // Validation check
        if (email === '') {
            setErrorTitle('입력 오류');
            setErrorMessage('Email주소를 입력하지 않았습니다');
            setOpen(true);
            return;
        }
        if (name === '') {
            setErrorTitle('입력 오류');
            setErrorMessage('Name을 입력하지 않았습니다');
            setOpen(true);
            return;
        }
        if (password === '') {
            setErrorTitle('입력 오류');
            setErrorMessage('Password를 입력하지 않았습니다');
            setOpen(true);
            return;
        }
        if (status === '') {
            setErrorTitle('입력 오류');
            setErrorMessage('계정상태를 입력하지 않았습니다');
            setOpen(true);
            return;
        }
        if (dataGridRegisterRows.length == 0) {
            alert('운영권한을 등록해야 합니다!!!');
            return;
        }
        // Data 가공
        let roles = [];
        let found = 0;
        dataGridRegisterRows.map((data, idx) => {
            roles.push(data.id);
        });
        const requestData = {
            id: id,
            site_id: '', // null 이 가능.
            email: email,
            name: name,
            password: password,
            roles: roles,
            status: status,
            is_use: is_use,
            is_send_mail: send_chk
        };
        console.log(requestData);
        if (paramId) {
            accountUpdate(id, requestData);
        } else {
            accountInsert(requestData);
        }
    };

    // Email Duplicate Check
    const emailDuplicateCheck = () => {
        // 메일 주소 중복 체크를 한다.
        if (email === '') {
            alert('메일 주소를 입력 후 중복 체크 해주시기 바랍니다!!!');
            return;
        }
        accountSearch(true, email);
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

    // 사이트명과 운영권한을 가지고 Role을 등록한다.
    // 기존에 등록된 Role이 있으면 등록하지 않는다.
    // 또한 한 사이트당 한개의 Role이 등록이 가능하다.
    const plusRegister = () => {
        let programs_ids = [];
        if (site_id === '') {
            alert('사이트명을 선택하세요!!!');
            return;
        }
        if (role_id === '') {
            alert('운영권한을 선택하세요!!!');
            return;
        }
        // 현재 등록된 Role에 사이트가 등록되어 있는지 확인한다.
        let found = 0;
        if (dataGridRegisterRows.length > 0) {
            dataGridRegisterRows.map((id, Index) => {
                if (id.site_id === site_id) {
                    console.log(id.site_id);
                    console.log(site_id);
                    found = 1;
                }
            });
        }
        if (found === 1) {
            alert('사이트당 한개의 Role만 등록이 가능합니다!!!');
            return;
        }
        // 등록이 가능하다.
        let r = roleList.filter((data) => data.id.match(new RegExp(role_id, 'g')));
        let d = itemList.filter((data) => data.id.match(new RegExp(site_id, 'g')));
        let regData = {
            id: role_id,
            name: r[0].name,
            site_id: site_id,
            site_name: d[0].name
        };

        console.log(roleList.filter((data) => data.id.match(new RegExp(role_id, 'g'))));

        console.log(regData);

        // 그리드에 등록한다.
        setDataGridRegisterRows((prevRows) => [...prevRows, regData]);
    };
    // 등록된 Role 목록에서 Role을 제거한다.
    const minusRegister = () => {
        if (selectedRegisterRows.length > 0) {
            selectedRegisterRows.map((id, Index) => {
                dataGridRegisterRows.map((regData, idx) => {
                    if (id === regData.id) {
                        setDataGridRegisterRows((prevRows) => [...prevRows.slice(0, idx), ...prevRows.slice(idx + 1)]);
                        setIsSave(true);
                    }
                });
            });
        }
    };

    // Role 만 등록한다.
    const roleUpdate = () => {
        if (dataGridRegisterRows.length == 0) {
            alert('운영권한을 등록해야 합니다!!!');
            return;
        }
        // Data 가공
        let roles = '';
        let found = 0;
        dataGridRegisterRows.map((data, idx) => {
            if (found !== 0) roles = roles + ',';
            roles = roles + data.id;
            found++;
        });
        const requestData = {
            admin_account_id: id,
            role_management_id: roles
        };
        console.log(requestData);
        accountRoleUpdate(id, requestData);
    };

    return (
        <>
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                <Grid item xs={12} md={7} lg={12}>
                    <HeaderTitle titleNm="계정 관리" menuStep01="계정 등록" />

                    <MainCard sx={{ mt: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={8} sm={1.5}>
                                <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                    <Stack spacing={0}>Name</Stack>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={4}>
                                <FormControl sx={{ m: 0, minWidth: 180, maxHeight: 30 }} size="small">
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
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={1.5}>
                                <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                    <Stack spacing={0}>이메일 주소</Stack>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={3}>
                                <Stack spacing={3}>
                                    <FormControl sx={{ m: 0, minWidth: 180, maxHeight: 30 }} size="small">
                                        <TextField
                                            id="filled-hidden-label-small"
                                            type="text"
                                            size="small"
                                            value={email}
                                            name="email"
                                            inputProps={{ readOnly: emailStatus }}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Enter Email ID"
                                            fullWidth
                                        />
                                    </FormControl>
                                </Stack>
                            </Grid>
                            <Grid item xs={8} sm={2}>
                                <FormControl sx={{ m: 0, maxHeight: 30 }} size="small">
                                    <Button
                                        disableElevation
                                        size="small"
                                        type="button"
                                        disabled={isUpdate}
                                        variant="contained"
                                        color="secondary"
                                        onClick={emailDuplicateCheck}
                                    >
                                        중복체크
                                    </Button>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={4}>
                            <Grid item xs={8} sm={1.5}>
                                <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                    <Stack spacing={0}> Password</Stack>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={4}>
                                <FormControl sx={{ m: 0, minWidth: 100, maxHeight: 30 }} size="small">
                                    <TextField
                                        id="filled-hidden-label-small"
                                        type="password"
                                        size="small"
                                        value={password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Input the password."
                                        fullWidth
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={1.5}>
                                <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                    <Stack spacing={0}>계정상태</Stack>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={3}>
                                <FormControl sx={{ m: 0, minWidth: 160 }} size="small">
                                    <Select name="status" label="계정상태" value={status} onChange={statusChanged}>
                                        <MenuItem value="NORMAL">정상</MenuItem>
                                        <MenuItem value="INIT_REQUEST">초기화요청</MenuItem>
                                        <MenuItem value="INIT_CONFIRM">초기화확인</MenuItem>
                                        <MenuItem value="INIT_COMPLETE">초기화완료</MenuItem>
                                        <MenuItem value="INIT_REGISTER">신규등록</MenuItem>
                                        <MenuItem value="DENY_ACCESS">중지상태</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={8} sm={1.5}>
                                <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                    <Stack spacing={0}>전송여부</Stack>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={4}>
                                <FormControlLabel
                                    control={<Checkbox name="send_chk" value={send_chk} onBlur={handleBlur} onChange={handleChange} />}
                                    label="체크시 패스워드 초기화 메일 전송됨."
                                />
                            </Grid>
                            <Grid item xs={8} sm={1.5}>
                                <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                    <Stack spacing={0}>사용여부</Stack>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="is_use"
                                            checked={is_use}
                                            value={is_use}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                    }
                                    label="사용함"
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={8} sm={12}>
                                <Stack spacing={2}>
                                    <MainCard sx={{ mt: 2, height: 370 }} content={false}>
                                        <Grid container spacing={0} sx={{ mt: 2 }}>
                                            <Grid item xs={8} sm={0.2}></Grid>
                                            <Grid item xs={8} sm={2.8}>
                                                <Stack spacing={5} sx={{ mt: 0 }} justifyContent="left" alignItems="left">
                                                    <Item>Role 등록 목록</Item>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={8} sm={7.4}></Grid>
                                            <Grid item xs={8} sm={0.8}>
                                                <FormControl sx={{ m: 0, maxHeight: 30 }} size="small">
                                                    <Button
                                                        disableElevation
                                                        size="small"
                                                        type="button"
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={minusRegister}
                                                    >
                                                        Remove
                                                    </Button>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={8} sm={0.8}>
                                                <FormControl sx={{ m: 0, maxHeight: 30 }} size="small">
                                                    <Button
                                                        disableElevation
                                                        size="small"
                                                        type="button"
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={roleUpdate}
                                                        disabled={isRoleUpdate}
                                                    >
                                                        Role 저장
                                                    </Button>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
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

                                        <Grid container spacing={0} sx={{ mt: 1 }}>
                                            <Grid container spacing={0} sx={{ mt: 1 }}>
                                                <Grid item xs={8} sm={1.5}>
                                                    <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                        <Stack spacing={0}>사이트명</Stack>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={8} sm={4}>
                                                    <FormControl sx={{ m: 0, minWidth: 180, maxHeight: 25 }} size="small">
                                                        <Select name="site_id" label="사이트명" value={site_id} onChange={siteChanged}>
                                                            <MenuItem value="">
                                                                <em>Choose a Site Type</em>
                                                            </MenuItem>
                                                            {itemList.map((item, index) => (
                                                                <MenuItem key={index} value={item.id}>
                                                                    {item.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={8} sm={1.5}>
                                                    <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                                        <Stack spacing={0}>운영권한</Stack>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={8} sm={4}>
                                                    <FormControl sx={{ m: 0, minWidth: 160 }} size="small">
                                                        <Select name="role_id" label="운영권한" value={role_id} onChange={roleChanged}>
                                                            <MenuItem value="">
                                                                <em>Choose a Role Type</em>
                                                            </MenuItem>
                                                            {roleList.map((item, index) => (
                                                                <MenuItem key={index} value={item.id}>
                                                                    {item.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={8} sm={1}>
                                                    <FormControl sx={{ m: 0, maxHeight: 30 }} size="small">
                                                        <Button
                                                            disableElevation
                                                            size="small"
                                                            type="button"
                                                            variant="contained"
                                                            color="secondary"
                                                            onClick={plusRegister}
                                                        >
                                                            Add
                                                        </Button>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </MainCard>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3} sx={{ m: 0 }}>
                            <Grid item xs={8} sm={9.5}></Grid>
                            <Grid item xs={8} sm={2.5}>
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        size="small"
                                        type="button"
                                        variant="contained"
                                        color="primary"
                                        onClick={saveClick}
                                    >
                                        저장하기
                                    </Button>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        size="small"
                                        type="button"
                                        variant="contained"
                                        color="secondary"
                                        onClick={newClick}
                                    >
                                        신규
                                    </Button>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        size="small"
                                        type="button"
                                        variant="contained"
                                        color="secondary"
                                        onClick={listClick}
                                    >
                                        리스트
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </MainCard>
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                </Grid>
            </Grid>
        </>
    );
};

export default AccountRegForm;
