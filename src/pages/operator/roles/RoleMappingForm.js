import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { styled } from '@mui/material/styles';
import MainCard from 'components/Common/MainCard';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import CheckBoxDataGrid from 'components/DataGrid/CheckBoxDataGrid';
import RoleApi from 'apis/roles/roleapi';
import SiteApi from 'apis/site/siteapi';
import AccountApis from 'apis/account/accountapis';
import ErrorScreen from 'components/ErrorScreen';
import HeaderTitle from 'components/HeaderTitle';
import TopInputLayout from 'components/Common/TopInputLayout';
import InputLayout from 'components/Common/InputLayout';
import ButtonLayout from 'components/Common/ButtonLayout';
import cx from 'classnames';
import DropInput from '../../../components/Common/DropInput';
import './styles.scss';
import ContentLine from '../../../components/Common/ContentLine';

const SiteRoleMappingForm = () => {
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
    const [
        responseData,
        requestError,
        loading,
        { roleSearch, roleRegisterSave, roleRegisterSearch, roleRegisterDelete, roleMappingRegisterSave }
    ] = RoleApi();
    const [resData, reqErr, resLoading, { siteSearch }] = SiteApi();
    const [resAccData, reqAccErr, resAccLoading, { accountUserSearch }] = AccountApis();
    const { siteId } = useSelector((state) => state.auth);
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

    const [deleteCount, setDeleteCount] = useState(0);
    const [deleteProcessCount, setDeleteProcessCount] = useState(0);

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

    const [site_id, setSiteId] = useState(siteId);
    const [is_use, setIsUse] = useState(true);

    // 등록 검색 조건
    const [keyword, setKeyword] = useState('');

    // onload
    useEffect(() => {
        roleSearch(true, siteId);
    }, []);

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            if (requestError.result === 'FAIL') {
                if (requestError.error.code === 'R501') {
                    alert('Role은 사이트당 한개만 등록이 가능합니다.');
                }
                console.log('error requestError');
                console.log(requestError);
                setErrorTitle('Error Message');
                setErrorMessage('[' + requestError.error.code + '] ' + requestError.error.message);
                setOpen(true);
            }
        }
    }, [requestError]);

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
            case 'registerList': // 등록된 사용자 리스트
                if (responseData.data.data) {
                    console.log(responseData.data.data);
                    setDataGridRegisterRows(responseData.data.data);
                    setPrevDataGridRows(responseData.data.data);
                } else {
                    setDataGridRegisterRows([]);
                    setPrevDataGridRows([]);
                }
                break;
            case 'registerData':
                if (responseData.data.data) {
                    alert('저장을 완료하였습니다.');
                    roleRegisterSearch(selectedRole, '', '');
                }
                break;
            case 'registerDeleteRoleData':
                if (responseData.data.data) {
                    setDeleteProcessCount(deleteProcessCount + 1);
                    if (deleteProcessCount + 1 === deleteCount) {
                        alert('저장을 완료하였습니다.');
                        setDeleteCount(0);
                        setDeleteProcessCount(0);
                    }
                }
                break;
            case 'registerRoleMappingData':
                if (responseData.data.data) {
                    alert('저장을 완료하였습니다.');
                    roleRegisterSearch(selectedRole, '', '');
                }
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
                    // 신규 등록
                    let insertData = { flag: 'INSERT', id: data.id };
                    saveData.push(insertData);
                }
            });
            // 이전 데이터는 있었지만 현재는 없다면 삭제이다.
            let deleteIds = [];
            prevDataGridRows.map((prev, index) => {
                let found = 0;
                dataGridRegisterRows.map((data, idx) => {
                    if (prev.id === data.id) found = 1;
                });
                if (found === 0) {
                    // 삭제건이다.
                    let deleteData = { flag: 'DELETE', id: prev.id };
                    //deleteIds.push(prev.id);
                    saveData.push(deleteData);
                }
            });
            // if (deleteIds.length > 0) {
            //     setDeleteCount(deleteIds.length);
            //     deleteIds.map((id) => {
            //         roleRegisterDelete(selectedRole, id);
            //     });
            // }
            if (saveData.length > 0) {
                let data = { accounts: saveData };
                console.log(selectedRole);
                console.log(data);
                roleMappingRegisterSave(selectedRole, data);
            }
        } else if (dataGridRegisterRows.length === 0 && prevDataGridRows.length > 0) {
            if (confirm('등록 취소한 사용자를 모두 삭제하시겠습니까?')) {
                // all delete
                let deleteIds = [];
                prevDataGridRows.map((prev, index) => {
                    deleteIds.push(prev.id);
                });
                if (deleteIds.length > 0) {
                    setDeleteCount(deleteIds.length);
                    deleteIds.map((id) => {
                        roleRegisterDelete(selectedRole, id);
                    });
                }
            }
        } else {
            alert('등록된 사용자가 없습니다.');
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
            alert('검색 단어를 입력하세요.');
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
            let newList = dataGridRegisterRows;
            selectedRegisterRows.map((id, index) => {
                newList = newList.filter((item) => item.id !== id);
                setDataGridRegisterRows(newList);
                setIsSave(true);
                // dataGridRegisterRows.map((regData, idx) => {
                //     if (id === regData.id) {
                //         setDataGridRegisterRows((prevRows) => [...prevRows.slice(0, idx), ...prevRows.slice(idx + 1)]);
                //         setIsSave(true);
                //     }
                // });
                // let selectedData = { id: data.id, name: data.name, email: data.email };
                // // 등록된 데이터가 없으면 등록해야 한다.
                // dataGridRegisterRows.pop(selectedData);
            });
        }
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle titleNm="사용자 맵핑" menuStep01="사이트 관리" menuStep02="Role 관리" menuStep03="사용자 맵핑" />
                <MainCard style={{ display: 'flex', justifyContent: 'right' }}>
                    <TopInputLayout>
                        <ButtonLayout>
                            <Button disableElevation size="medium" type="submit" variant="contained" onClick={saveClick} color="primary">
                                저장
                            </Button>
                        </ButtonLayout>
                    </TopInputLayout>
                </MainCard>

                <Grid container alignItems="center" justifyContent="space-between" className="roleLayout">
                    <Grid item md={4}>
                        <ContentLine>
                            <DefaultDataGrid
                                columns={columns}
                                rows={dataGridRows}
                                height={855}
                                handlePageChange={handlePage}
                                handleGridClick={handleClick}
                                handleGridDoubleClick={handleDoubleClick}
                                selectionChange={handleSelectionChange}
                            />
                        </ContentLine>
                    </Grid>

                    <Grid item md={7.8}>
                        <Typography variant="h4" className="title">
                            등록된 사용자
                        </Typography>

                        <Stack spacing={5}>
                            <ContentLine>
                                <CheckBoxDataGrid
                                    columns={regColumns}
                                    rows={dataGridRegisterRows}
                                    handlePageChange={handlePage}
                                    //handleGridClick={handleClick}
                                    handleGridDoubleClick={handleDoubleClick}
                                    selectionChange={handleSelectionRegisterChange}
                                    height={330}
                                />
                            </ContentLine>
                        </Stack>

                        {/* 화살표 */}
                        <div className="arr--layout">
                            <Item className="leftBlank" onClick={plusRegister}>
                                <ArrowDropUpIcon aria-label="+" disabled color="primary" />
                            </Item>

                            <Item onClick={minusRegister}>
                                <ArrowDropDownIcon aria-label="-" disabled color="primary" />
                            </Item>
                        </div>

                        <div className="role--layout__search">
                            <Typography variant="h4" className="title">
                                사용자 검색
                            </Typography>

                            <div className="role--layout">
                                <DropInput title="">
                                    <TextField
                                        id="filled-hidden-label-small"
                                        type="text"
                                        size="medium"
                                        value={keyword}
                                        name="keyword"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </DropInput>

                                <Button
                                    disableElevation
                                    size="medium"
                                    type="button"
                                    variant="contained"
                                    color="secondary"
                                    onClick={userSearchClick}
                                >
                                    검색
                                </Button>
                            </div>
                        </div>

                        <ContentLine>
                            <CheckBoxDataGrid
                                columns={searchColumns}
                                rows={dataGridSearchRows}
                                handlePageChange={handlePage}
                                //handleGridClick={handleClick}
                                handleGridDoubleClick={handleDoubleClick}
                                selectionChange={handleSelectionSearchChange}
                                height={330}
                            />
                        </ContentLine>
                    </Grid>
                </Grid>

                {errorMessage && (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                )}
            </Grid>
        </Grid>
    );
};

export default SiteRoleMappingForm;
