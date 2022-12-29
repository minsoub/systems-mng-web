import HeaderTitle from '../../../components/HeaderTitle';
import { Button, Grid, FormControl, Select, Stack, TextField, Typography, MenuItem } from '@mui/material';
import MainCard from '../../../components/Common/MainCard';
import FlexBox from '../../../components/Common/FlexBox';
import DropInput from '../../../components/Common/DropInput';
import React, { useEffect, useState } from 'react';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import ContentLine from '../../../components/Common/ContentLine';
import CheckBoxDataGrid from '../../../components/DataGrid/CheckBoxDataGrid';
import { getDateFormat } from '../../../utils/CommonUtils';
import cx from 'classnames';
import './styles.scss';
import { useNavigate, useParams } from 'react-router-dom';
import SearchDate from 'components/ContentManage/SearchDate';
import UserSearchDialog from 'pages/popup/UserSearchPopup';
import IpMngApi from 'apis/sysmng/ipmng';
import SiteApi from 'apis/site/siteapi';

const IpRegForm = () => {
    const navigate = useNavigate();
    const [resData, reqErr, resLoading, { siteSearch }] = SiteApi();
    const [responseData, requestError, loading, { getAccessIpList, deleteData, insertData, updateData }] = IpMngApi();
    const [selectedRows, setSeletedRows] = useState([]);
    const [dataGridRows, setDataGridRows] = useState([]);
    const [siteList, setSiteList] = useState([]);
    const [isMode, setMode] = useState(false);

    const { paramId1, paramId2 } = useParams();

    // 사이트명
    const [site_id, setSiteId] = useState('');
    const [adminId, setAdminId] = useState('');
    // 이메일주소
    const [email, setEmail] = useState('');
    // 이름
    const [name, setName] = useState('');
    // 운영 권한
    const [role_management_name, setRoleManagementName] = useState('');
    const [role_management_id, setRoleManagementId] = useState('');
    // 계정 상태
    const [adminState, setAdminState] = useState('');
    const [allow_ip, setAllowIp] = useState('');
    // 유효기간
    const [valid_start_date, setValidStartDate] = useState(new Date());
    const [valid_end_date, setValidEndDate] = useState(new Date());

    // User Search Dialog
    const [openUserSearch, setOpenUserSearch] = useState(false);
    const [selectedValue, setSelectedValue] = useState([]);

    const [isUpdate, setIsUpdate] = useState(false);

    // User Valid date
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');

    const columns = [
        {
            field: 'No',
            headerName: 'No.',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 100,
            renderCell: (index) => index.api.getRowIndex(index.row.id) + 1
        },
        {
            field: 'allow_ip',
            headerName: '접근 IP',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'valid_start_date',
            headerName: '유효기간(From)',
            flex: 1,
            headerAlign: 'center',
            align: 'left',
            maxWidth: 230
        },
        {
            field: 'valid_end_date',
            headerName: '유효기간(To)',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 230
        },
        {
            field: 'create_date',
            headerName: '등록일자',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 230,
            valueGetter: ({ value }) => `${getDateFormat(value)}`
        }
    ];
    // site가 변경되었을 때 호출된다.
    const siteChanged = (e) => {
        setSiteId(e.target.value);
    };

    // 사용자 검색 팝업 닫음
    const handleClose = (returnData) => {
        setOpenUserSearch(false);
        console.log(requestError);
        // 데이터 처리
        if (returnData.length !== 0) {
            // 데이터 처리
            console.log(returnData);
            if (!returnData.row.role_management_id) {
                alert('해당 사이트에 권한을 가지고 있지 않습니다.');
                return;
            }
            setName(returnData.row.name);
            setAdminId(returnData.row.id);
            setEmail(returnData.row.email);
            setRoleManagementName(returnData.row.role_management_name);
            setRoleManagementId(returnData.row.role_management_id);
            setAdminState(returnData.row.status);
            setStartDate(validDateSplit(returnData.row.valid_start_date));
            setEndDate(validDateSplit(returnData.row.valid_end_date));

            searchRegisterIpList(site_id, returnData.row.id);
        }
    };
    // 체크박스 선택된 row id 저장
    const handleSelectionChange = (item) => {
        console.log(item);
        if (item) {
            setSeletedRows(item);
        }
    };
    // 페이징 변경 이벤트
    const handlePage = (page) => {};

    // 그리드 클릭
    const handleClick = (rowData) => {
        // if (rowData && rowData.field && rowData.field !== '__check__') {
        //     navigate(`/accountmng/reg/${rowData.id}`);
        // }
    };

    // program 등록 화면
    const listClick = () => {
        navigate('/ipmng/list');
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    const validDateSplit = (data) => {
        if (data !== null) {
            let d = data.substring(0, 10);
            console.log(d);
            return d;
        } else {
            console.log(data);
            return data;
        }
    };
    useEffect(() => {
        siteSearch(true, '');
        if (paramId2) {
            setMode(true);
        }
    }, []);
    // 사용자 상세 정보 검색
    // useEffect(() => {
    //     if (!accountData) {
    //         return;
    //     }
    //     switch (accountData.transactionId) {
    //         case 'getData':
    //             if (accountData.data.data) {
    //                 //setSiteName(responseData.data.data.id);
    //                 setEmail(responseData.data.data.email);
    //                 setName(responseData.data.data.name);
    //                 //setRoleManagementName(responseData.data.data.is_use);
    //                 setAdminState(responseData.data.admin_account_id);
    //                 setStartDate(validDateSplit(responseData.data.data.valid_start_date));
    //                 setEndDate(validDateSplit(responseData.data.data.valid_end_date));
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // }, [accountData]);
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

                    if (paramId2) {
                        setSiteId(paramId1);
                        setAdminId(paramId2);
                        searchRegisterIpList(paramId1, paramId2);
                    }
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
        console.log(responseData);
        switch (responseData.transactionId) {
            case 'insertData':
                if (responseData.data.data) {
                    alert('등록을 완료하였습니다.');
                    setDataGridRows(responseData.data.data);
                    //searchRegisterIpList(site_id, adminId);
                    searchRegisterIpList(site_id, adminId);
                }
                break;
            case 'ipRegList':
                if (responseData.data.data) {
                    setDataGridRows(responseData.data.data);
                    if (responseData.data.data.length > 0) {
                        setMode(true);
                        setEmail(responseData.data.data[0].email);
                        setName(responseData.data.data[0].name);
                        setRoleManagementId(responseData.data.data[0].role_id);
                        setRoleManagementName(responseData.data.data[0].role_name);
                        setAdminState(responseData.data.data[0].admin_state); // admin_account_id);
                        setStartDate(responseData.data.data[0].valid_start_date);
                        setEndDate(responseData.data.data[0].valid_end_date);
                    }
                } else {
                    setMode(false);
                    setDataGridRows([]);
                }
                break;
            case 'updateData':
                console.log('updateData');
                if (responseData.data.data) {
                    alert('저장을 완료하였습니다');
                    searchRegisterIpList(site_id, adminId);
                }
                break;
            case 'deleteData':
                console.log('deleteData');
                if (responseData.data.data) {
                    alert('삭제를 완료하였습니다');
                    searchRegisterIpList(site_id, adminId);
                }
                break;
            default:
        }
    }, [responseData]);
    const handleBlur = (e) => {
        console.log(e);
    };
    const resetPeriod = () => {
        console.log('resetPeriod');
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
            case 'valid_start_date':
                setValidStartDate(e.target.value);
                break;
            case 'valid_end_date':
                setValidEndDate(e.target.value);
                break;
            case 'allow_ip':
                setAllowIp(e.target.value);
                break;
            default:
                break;
        }
    };

    // 등록된 IP List를 가져온다.
    const searchRegisterIpList = (site_id, id) => {
        getAccessIpList(site_id, id);
    };
    // 사용자 검색 팝업
    const userSearch = () => {
        if (!site_id) {
            alert('사이트명을 선택하세요!!!');
            return;
        }
        setOpenUserSearch(true);
    };
    // IP 등록
    const ipRegister = () => {
        if (!allow_ip) {
            alert('접근 IP 대역을 입력하세요.');
            return;
        }
        // IP 형식 검증
        //var regExp = /^([1-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.([1-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.([1-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.([1-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$'/;
        var regExp = /^([0-9]{1,3}[.][0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}[/][1-9]{1,2})$/;
        if (!regExp.test(allow_ip)) {
            alert('IP 대역 형식이 일치하지 않습니다!!!');
            return;
        }
        // 이미 등록되어 있는지 확인한다.
        let found = 0;
        dataGridRows.map((data, idx) => {
            if (allow_ip === data.allow_ip) {
                found = 1;
            }
        });
        if (found === 1) {
            alert('이미 등록된 IP 대역입니다.');
            return;
        }

        // new
        let cnt = dataGridRows.length;
        let regData = {
            id: cnt + 1,
            admin_account_id: adminId,
            allow_ip: allow_ip,
            valid_start_date: valid_start_date,
            valid_end_date: valid_end_date
        };
        // grid register
        setDataGridRows((prevRows) => [...prevRows, regData]);
    };

    // 선택한 접근 IP 대역을 삭제한다.
    const deleteIp = () => {
        if (isMode) {
            // 수정모드
            console.log(selectedRows.length);
            if (selectedRows.length > 0) {
                let newList = dataGridRows;
                let deleteIds = [];
                selectedRows.map((id, Index) => {
                    if (id.length > 10) {
                        deleteIds.push(id);
                    }
                    newList = newList.filter((item) => item.id !== id);
                    setDataGridRows(newList);
                });

                if (deleteIds.length > 0) {
                    // api 호출을 통해서 삭제를 해야 한다.
                    if (confirm('데이터베이스 삭제건이 있습니다. 삭제를 하시겠습니까?')) {
                        deleteData(deleteIds);
                    }
                }
            }
        } else {
            // 신규 모드일 때 체크 선택된 데이터를 삭제한다.
            console.log(selectedRows.length);
            if (selectedRows.length > 0) {
                let newList = dataGridRows;
                selectedRows.map((id, Index) => {
                    newList = newList.filter((item) => item.id !== id);
                    setDataGridRows(newList);
                });
            }
        }
    };

    const saveIp = () => {
        if (!site_id) {
            alert('사이트명을 선택하세요.');
            return;
        }
        if (!adminId) {
            alert('사용자를 선택하지 않았습니다. 이메일주소 검색을 통해서 사용자를 등록하세요.');
            return;
        }

        // data
        let accessIdRequests = [];
        dataGridRows.map((item, index) => {
            let data = null;
            if (item.id.length > 5) {
                data = {
                    id: item.id,
                    allow_ip: item.allow_ip,
                    valid_start_date: item.valid_start_date,
                    valid_end_date: item.valid_end_date
                };
            } else {
                data = {
                    id: '',
                    allow_ip: item.allow_ip,
                    valid_start_date: item.valid_start_date,
                    valid_end_date: item.valid_end_date
                };
            }
            accessIdRequests.push(data);
        });
        let regData = {
            admin_account_id: adminId,
            site_id: site_id,
            role_id: role_management_id,
            access_ip_requests: accessIdRequests
        };
        console.log(regData);

        if (isMode) {
            updateData(regData);
        } else {
            insertData(regData);
        }
    };
    return (
        <Grid container rowSpacing={4} columnSpacing={2.75}>
            <Grid item xs={12}>
                <HeaderTitle titleNm="접근 IP 등록" menuStep01="통합시스템 관리" menuStep02="접근 IP 관리" menuStep03="접근 IP 등록" />

                <ButtonLayout buttonName="btn__blank">
                    <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={listClick}>
                        목록
                    </Button>
                </ButtonLayout>
                <UserSearchDialog selectedValue={selectedValue} open={openUserSearch} onClose={handleClose} siteId={site_id} />
                <MainCard sx={{ height: 230 }} content={false} className="stateSubmit layout--inner">
                    <div className="bottom--blank">
                        <FlexBox>
                            <DropInput title="사이트명" titleWidth={70}>
                                <FormControl sx={{ minWidth: 250, boxSizing: 'border-box' }} size="medium">
                                    <Select name="site_id" label="사이트명" value={site_id} onChange={siteChanged}>
                                        {siteList.map((item, index) => (
                                            <MenuItem key={index} value={item.id} placeholder={item.name}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </DropInput>
                            <DropInput title="이메일주소" titleWidth={70} style={{ marginLeft: '2rem' }}>
                                <TextField
                                    id="filled-hidden-label-small"
                                    type="text"
                                    size="medium"
                                    value={email}
                                    name="email"
                                    fullWidth
                                    disabled={isUpdate}
                                />
                            </DropInput>
                            <Button
                                disableElevation
                                size="medium"
                                type="button"
                                disabled={isUpdate}
                                variant="outlined_d"
                                color="secondary"
                                onClick={userSearch}
                            >
                                검색
                            </Button>
                        </FlexBox>
                    </div>
                    <div className="bottom--blank">
                        <FlexBox>
                            <DropInput title="이름" titleWidth={70}>
                                <TextField
                                    id="filled-hidden-label-small"
                                    type="text"
                                    size="medium"
                                    value={name}
                                    name="name"
                                    fullWidth
                                    disabled={isUpdate}
                                />
                            </DropInput>
                            <DropInput title="운영권한" titleWidth={70} style={{ marginLeft: '2rem' }}>
                                <TextField
                                    id="filled-hidden-label-small"
                                    type="text"
                                    size="medium"
                                    value={role_management_name}
                                    name="role_management_name"
                                    fullWidth
                                    disabled={isUpdate}
                                />
                            </DropInput>
                        </FlexBox>
                    </div>
                    <div>
                        <FlexBox>
                            <DropInput title="계정상태" titleWidth={70}>
                                <TextField
                                    id="filled-hidden-label-small"
                                    type="text"
                                    size="medium"
                                    value={adminState}
                                    disabled={isUpdate}
                                    name="name"
                                    fullWidth
                                />
                            </DropInput>
                            <DropInput title="유효기간" titleWidth={70} style={{ marginLeft: '2rem' }}>
                                <TextField
                                    id="filled-hidden-label-small"
                                    type="text"
                                    size="medium"
                                    value={start_date}
                                    disabled={isUpdate}
                                    name="name"
                                    fullWidth
                                />
                            </DropInput>
                            <DropInput title="~" style={{ marginLeft: '1rem' }}>
                                <TextField
                                    id="filled-hidden-label-small"
                                    type="text"
                                    size="medium"
                                    value={end_date}
                                    disabled={isUpdate}
                                    name="name"
                                    fullWidth
                                />
                            </DropInput>
                        </FlexBox>
                    </div>
                </MainCard>

                <div className="ip__layout">
                    <Typography variant="h4" className={cx('contentTilte')}>
                        접근 제어 IP
                    </Typography>

                    <ButtonLayout>
                        <Button
                            disableElevation
                            size="medium"
                            type="submit"
                            name="saveBtn"
                            variant="contained"
                            color="primary"
                            onClick={saveIp}
                        >
                            저장
                        </Button>
                        <Button
                            disableElevation
                            size="medium"
                            type="submit"
                            name="saveBtn"
                            variant="contained"
                            color="secondary"
                            onClick={deleteIp}
                        >
                            삭제
                        </Button>
                    </ButtonLayout>
                </div>

                <ContentLine>
                    <CheckBoxDataGrid
                        columns={columns}
                        rows={dataGridRows}
                        handlePageChange={handlePage}
                        handleGridClick={handleClick}
                        handleGridDoubleClick={handleDoubleClick}
                        selectionChange={handleSelectionChange}
                        height={450}
                    />
                </ContentLine>

                <MainCard className="bottom__layout">
                    <FlexBox>
                        <DropInput title="접근 IP 대역" titleWidth={70}>
                            <TextField
                                id="filled-hidden-label-small"
                                type="text"
                                size="medium"
                                onChange={handleChange}
                                value={allow_ip}
                                name="allow_ip"
                                fullWidth
                            />
                        </DropInput>

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
                            titleWidth={70}
                        />
                    </FlexBox>

                    <ButtonLayout>
                        <Button disableElevation size="medium" type="submit" name="saveBtn" variant="contained" onClick={ipRegister}>
                            등록
                        </Button>
                    </ButtonLayout>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default IpRegForm;
