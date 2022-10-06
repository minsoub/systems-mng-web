import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './styles.scss';
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
// third party
import MainCard from 'components/Common/MainCard';
import { styled } from '@mui/material/styles';
import AccountApis from 'apis/account/accountapis';
import SiteApi from 'apis/site/siteapi';
import RoleApi from 'apis/roles/roleapi';
import CheckBoxDataGrid from '../../../components/DataGrid/CheckBoxDataGrid';
import HeaderTitle from '../../../components/HeaderTitle';
import DropInput from '../../../components/Common/DropInput';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import TopInputLayout from '../../../components/Common/TopInputLayout';
import ContentLine from '../../../components/Common/ContentLine';
import FlexBox from '../../../components/Common/FlexBox';
import SearchDate from '../../../components/ContentManage/SearchDate';
import cx from 'classnames';

const AccessRegForm = () => {
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
    const { siteId } = useSelector((state) => state.auth);
    const [
        responseData,
        requestError,
        loading,
        { accountMngDetail, accountSearch, accessUpdate, accountInsert, accountMngRole, accountRolesUpdate }
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
    const [newHidden, setNewHidden] = useState(false);
    const [loginFailCount, setLoginFailCount] = useState(0);

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
    const [is_use, setIsUse] = useState(true);
    const [status, setStatus] = useState('');
    const [currentStatus, setCurrentStatus] = useState('');
    const [valid_start_date, setValidStartDate] = useState(new Date());
    const [valid_end_date, setValidEndDate] = useState('');

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
                if (err.error.code === 'R501') {
                    alert('Role은 사이트당 한개만 등록이 가능합니다.');
                }
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
            // Role 정보 조회
            accountMngRole(paramId);
            setIsRoleUpdate(false);
        } else {
            setIsUpdate(false);
            setIsRoleUpdate(true);
            setValidStartDate(currentDate);
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
                    alert('이미 등록된 메일 주소입니다.');
                    setEmailChk(false);
                } else {
                    // 중복이 아니다.
                    alert('사용 가능한 이메일 주소입니다.');
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
                    console.log(checkChangeable(res.status));
                    if (checkChangeable(res.status)) {
                        setStatus(res.status);
                    } else {
                        setStatus('INIT');
                    }
                    setCurrentStatus(getStatusText(res.status));
                    setIsUpdate(true);
                    setEmailStatus(true);
                    setEmailChk(true);
                    setNewHidden(true);
                    setValidStartDate(res.valid_start_date);
                    setValidEndDate(res.valid_end_date);
                    setLoginFailCount(res.login_fail_count == null ? 0 : res.login_fail_count + ' (정상으로 변경시 0 으로 초기화)');
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
                    alert('등록된 Role을 저장하였습니다.');
                    // Role 정보 조회
                    accountMngRole(paramId);
                    setIsRoleUpdate(false);
                }
                break;
            case 'insertData':
                alert('등록을 완료하였습니다.');
                navigate('/access/list');
                break;
            case 'updateAccessData':
                alert('수정을 완료하였습니다.');
                navigate('/access/list');
                break;
            case 'deleteDatas':
                console.log('deleteData');
                alert('삭제 처리를 완료하였습니다');
                //actionList();
                break;
            default:
        }
    }, [responseData]);
    const resetPeriod = () => {
        //setPeriod(0);
    };
    const changeDate = (type, e) => {
        switch (type) {
            case 'start':
                setValidStartDate(e);
                break;
            case 'end':
                setValidEndDate(e);
                break;
            default:
                break;
        }
    };
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
                setIsUse(e.target.value);
                break;
            case 'send_chk':
                setSendChk(e.target.checked);
                break;
            case 'valid_start_date':
                setValidStartDate(e.target.value);
                break;
            case 'valid_end_date':
                setValidEndDate(e.target.value);
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
        setStatus('');
        setIsUse(true);
        setDataGridRegisterRows([]);
        setIsRoleUpdate(true);
        setValidStartDate(currentDate);
    };

    const currentDate = () => {
        const date = new Date();
        return `${String(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    // getStatusText
    const getStatusText = (value) => {
        switch (value) {
            case 'NORMAL':
                return '정상';
            case 'INIT_OTP_REQUEST':
                return '초기화요청(OTP)';
            case 'INIT_OTP_COMPLETE':
                return '초기화완료(OTP)';
            case 'CHANGE_PASSWORD':
                return '비밀번호 변경필요';
            case 'INIT_REQUEST':
                return '초기화요청(비밀번호)';
            case 'INIT_CONFIRM':
                return '초기화확인';
            case 'INIT_COMPLETE':
                return '초기화완료';
            case 'INIT_REGISTER':
                return '신규등록';
            case 'DENY_ACCESS':
                return '중지상태';
            case 'CLOSED_ACCOUNT':
                return '계정잠금';
        }
    };

    const checkChangeable = (value) => {
        switch (value) {
            case 'NORMAL':
                return true;
            case 'INIT_OTP_COMPLETE':
                return true;
            case 'DENY_ACCESS':
                return true;
            case 'CLOSED_ACCOUNT':
                return true;
            default:
                return false;
        }
    };

    // list
    const listClick = () => {
        navigate('/access/list');
    };
    // 입력 데이터를 저장한다.
    const saveClick = () => {
        // Validation check
        if (email === '') {
            // setErrorTitle('입력 오류');
            // setErrorMessage('Email주소를 입력하지 않았습니다');
            // setOpen(true);
            alert('이메일 주소를 입력해 주세요.');
            return;
        }
        if (emailChk === false) {
            alert('이메일 주소 중복체크를 선택해 주세요.');
            return;
        }
        if (name === '') {
            // setErrorTitle('입력 오류');
            // setErrorMessage('Name을 입력하지 않았습니다');
            // setOpen(true);
            alert('이름을 입력해 주세요.');
            return;
        }
        if (status === '' || status === 'INIT') {
            // setErrorTitle('입력 오류');
            // setErrorMessage('계정상태를 입력하지 않았습니다');
            // setOpen(true);
            alert('계정상태를 입력해 주세요.');
            return;
        }
        if (valid_start_date === '' || valid_end_date === '') {
            alert('계정의 유효기간을 선택해 주세요.');
            return;
        }
        if (dataGridRegisterRows.length === 0) {
            alert('운영권한을 등록해야 합니다.');
            return;
        }
        // Data 가공
        let roles = [];
        dataGridRegisterRows.map((data, idx) => {
            roles.push(data.id);
        });
        const requestData = {
            id: id,
            site_id: '', // null 이 가능.
            email: email,
            name: name,
            roles: roles,
            status: status,
            is_use: is_use,
            valid_start_date: valid_start_date,
            valid_end_date: valid_end_date
        };
        console.log(requestData);
        if (paramId) {
            accessUpdate(id, requestData);
        } else {
            accountInsert(requestData);
        }
    };

    // Email Duplicate Check
    const emailDuplicateCheck = () => {
        const regEmail = /^[a-zA-Z0-9._!#$%&*+-/=?^{}~]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]+$/i; // /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
        if (regEmail.test(email) === false) {
            alert('정확한 메일주소를 입력해 주세요.');
            return;
        }
        // 메일 주소 중복 체크를 한다.
        if (email === '') {
            alert('메일 주소를 입력 후 중복 체크 해주시기 바랍니다.');
            return;
        }
        accountSearch(null, email);
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
            alert('사이트명을 선택하세요.');
            return;
        }
        if (role_id === '') {
            alert('운영권한을 선택하세요.');
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
            alert('사이트당 한개의 Role만 등록이 가능합니다.');
            return;
        }
        // 등록이 가능하다.
        let r = roleList.filter((data) => data.id === role_id); // .match(new RegExp(role_id, 'g')));
        let d = itemList.filter((data) => data.id === site_id); // .match(new RegExp(site_id, 'g')));
        let regData = {
            id: role_id,
            name: r[0].name,
            site_id: site_id,
            site_name: d[0].name
        };

        console.log(roleList.filter((data) => data.id === role_id)); // .match(new RegExp(role_id, 'g'))));

        console.log(regData);

        // 그리드에 등록한다.
        setDataGridRegisterRows((prevRows) => [...prevRows, regData]);
    };
    // 등록된 Role 목록에서 Role을 제거한다.
    const minusRegister = () => {
        console.log(selectedRegisterRows.length);
        if (selectedRegisterRows.length > 0) {
            let newList = dataGridRegisterRows;
            selectedRegisterRows.map((id, Index) => {
                newList = newList.filter((item) => item.id !== id);
                setDataGridRegisterRows(newList);
                setIsSave(true);
            });
        }
    };

    // Role 만 등록한다.
    const roleUpdate = () => {
        if (dataGridRegisterRows.length == 0) {
            alert('운영권한을 등록해야 합니다.');
            return;
        }
        // Data 가공
        let roles = [];
        dataGridRegisterRows.map((data, idx) => {
            roles.push(data.id);
        });
        const requestData = {
            admin_account_id: id,
            role_management_id: roles
        };
        console.log(requestData);
        accountRolesUpdate(id, requestData);
    };

    return (
        <>
            <Grid container rowSpacing={4} columnSpacing={2.75} className="accessReg">
                <Grid item xs={12}>
                    <HeaderTitle titleNm="사용자 접근 관리" menuStep01="사이트 관리" menuStep02="사용자 접근 관리" menuStep03="계정 등록" />

                    <MainCard sx={{ mt: 2 }}>
                        <div className="bottom--blank">
                            <DropInput title="이름">
                                <TextField
                                    id="filled-hidden-label-small"
                                    type="text"
                                    size="small"
                                    value={name}
                                    inputProps={{ readOnly: true }}
                                    name="name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Input the name"
                                    fullWidth
                                />
                            </DropInput>
                            <DropInput title="이메일 주소">
                                <TextField
                                    id="filled-hidden-label-small"
                                    type="text"
                                    size="small"
                                    value={email}
                                    name="email"
                                    inputProps={{ readOnly: true }}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Enter Email ID"
                                    fullWidth
                                />
                            </DropInput>
                            {/* <Button
                                disableElevation
                                size="medium"
                                type="button"
                                disabled={isUpdate}
                                variant="contained"
                                color="secondary"
                                onClick={emailDuplicateCheck}
                            >
                                중복체크
                            </Button> */}
                        </div>

                        <div className="bottom--blank">
                            {/*<DropInput title="비밀번호">*/}
                            {/*    <TextField*/}
                            {/*        id="filled-hidden-label-small"*/}
                            {/*        type="password"*/}
                            {/*        size="small"*/}
                            {/*        value={password}*/}
                            {/*        name="password"*/}
                            {/*        onBlur={handleBlur}*/}
                            {/*        onChange={handleChange}*/}
                            {/*        placeholder="Input the password."*/}
                            {/*        fullWidth*/}
                            {/*    />*/}
                            {/*</DropInput>*/}
                            <Grid>
                                {/* 기간 검색 */}
                                <SearchDate
                                    start_date={valid_start_date}
                                    end_date={valid_end_date}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    noneChecked="noneChecked"
                                    startName="valid_start_date"
                                    endName="valid_end_date"
                                    title="유효 기간"
                                    addAll={true}
                                    changeDate={changeDate}
                                    resetPeriod={resetPeriod}
                                />
                            </Grid>
                            <DropInput title="계정상태">
                                <Grid>
                                    <TextField
                                        name="currentStatus"
                                        label="현재 계정상태"
                                        value={currentStatus}
                                        readOnly="readOnly"
                                    ></TextField>
                                    <span className={cx('center')}> </span>
                                    <Select name="status" label="변경 계정상태" value={status} onChange={statusChanged}>
                                        <MenuItem value="INIT">변경 상태선택</MenuItem>
                                        <MenuItem value="NORMAL">정상</MenuItem>
                                        <MenuItem value="INIT_OTP_COMPLETE">초기화완료(OTP)</MenuItem>
                                        <MenuItem value="DENY_ACCESS">중지상태</MenuItem>
                                        <MenuItem value="CLOSED_ACCOUNT">계정잠금</MenuItem>
                                    </Select>
                                </Grid>
                            </DropInput>
                        </div>

                        <div className="bottom--blank">
                            <DropInput title="로그인 실패">
                                <TextField
                                    id="filled-hidden-label-small"
                                    type="text"
                                    size="small"
                                    value={loginFailCount}
                                    inputProps={{ readOnly: true }}
                                    name="name"
                                    placeholder="Input the name"
                                    fullWidth
                                />
                            </DropInput>
                            <DropInput title="사용여부">
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="is_use"
                                    value={is_use}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value="true" control={<Radio />} label="사용함" />
                                    <FormControlLabel value="false" control={<Radio />} label="사용안함" />
                                </RadioGroup>
                            </DropInput>
                        </div>

                        <ButtonLayout>
                            <Button
                                disableElevation
                                disabled={isSubmitting}
                                size="medium"
                                type="button"
                                variant="contained"
                                color="primary"
                                onClick={saveClick}
                            >
                                저장
                            </Button>
                            <Button
                                disableElevation
                                disabled={isSubmitting}
                                size="medium"
                                type="button"
                                variant="contained"
                                color="secondary"
                                onClick={newClick}
                                hidden={newHidden}
                            >
                                신규
                            </Button>
                            <Button
                                disableElevation
                                disabled={isSubmitting}
                                size="medium"
                                type="button"
                                variant="contained"
                                color="secondary"
                                onClick={listClick}
                            >
                                리스트
                            </Button>
                        </ButtonLayout>
                    </MainCard>

                    <TopInputLayout className="layout--button__bottom">
                        <Item>Role 등록 리스트</Item>
                        <ButtonLayout>
                            <Button
                                disableElevation
                                size="medium"
                                type="button"
                                variant="contained"
                                color="secondary"
                                onClick={minusRegister}
                            >
                                삭제
                            </Button>
                            <Button
                                disableElevation
                                size="medium"
                                type="button"
                                variant="contained"
                                color="primary"
                                onClick={roleUpdate}
                                disabled={isRoleUpdate}
                            >
                                저장
                            </Button>
                        </ButtonLayout>
                    </TopInputLayout>

                    <ContentLine>
                        <CheckBoxDataGrid
                            columns={regColumns}
                            rows={dataGridRegisterRows}
                            handlePageChange={handlePage}
                            handleGridClick={handleClick}
                            handleGridDoubleClick={handleDoubleClick}
                            selectionChange={handleSelectionRegisterChange}
                            height={400}
                        />
                    </ContentLine>

                    <MainCard>
                        <TopInputLayout>
                            <div className="selectBoxSet">
                                <DropInput title="사이트명">
                                    <Select name="site_id" label="사이트명" value={site_id} onChange={siteChanged}>
                                        <MenuItem value="">
                                            <em>Choose a Site Type</em>
                                        </MenuItem>
                                        {itemList
                                            .filter((item) => item.id === siteId)
                                            .map((item, index) => (
                                                <MenuItem key={index} value={item.id}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </DropInput>

                                <DropInput title="운영권한">
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
                                </DropInput>
                            </div>

                            <ButtonLayout>
                                <Button
                                    disableElevation
                                    size="medium"
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    onClick={plusRegister}
                                >
                                    등록
                                </Button>
                            </ButtonLayout>
                        </TopInputLayout>
                    </MainCard>
                </Grid>
            </Grid>
        </>
    );
};

export default AccessRegForm;
