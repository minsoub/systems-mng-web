import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// material-ui
// eslint-disable-next-line prettier/prettier
import { Button, Checkbox, FormControl, FormControlLabel, Grid, MenuItem, Select, Stack } from '@mui/material';
import MainCard from 'components/MainCard';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import RoleApi from 'apis/roles/roleapi';
import SiteApi from 'apis/site/siteapi';
import ErrorScreen from 'components/ErrorScreen';
import TopInputLayout from '../../components/Common/TopInputLayout';
import InputLayout from '../../components/Common/InputLayout';
import ButtonLayout from '../../components/Common/ButtonLayout';
import HeaderTitle from '../../components/HeaderTitle';
import cx from "classnames";

const RoleManagementPage = () => {
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
        },
        {
            field: 'type',
            headerName: 'Type',
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
        },
        {
            field: 'valid_start_date',
            headerName: '유효기간(from)',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'valid_end_date',
            headerName: '유효기간(to)',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'create_date',
            headerName: '등록일자',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        }
    ];
    const navigate = useNavigate();
    const { search_site_id, search_is_use } = useParams();
    const [responseData, requestError, loading, { roleSearch, roleList }] = RoleApi();
    const [resData, reqErr, resLoading, { siteSearch }] = SiteApi();

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);

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

    // 파라미터 상태값
    const [param_site_id, setParamSiteId] = useState(search_site_id);
    const [param_is_use, setParamIsUse] = useState(search_is_use);

    // Change Event
    // site가 변경되었을 때 호출된다.
    const siteChanged = (e) => {
        console.log('siteChanged called..');
        console.log(e.target.value);
        setSiteId(e.target.value);
    };

    // onload
    useEffect(() => {
        // 사이트 구분 리스트 가져오기
        console.log('paramter data => ');
        console.log(search_site_id);
        console.log(search_is_use);
        console.log('====================');
        // if (search_site_id) {
        //     setParamSiteId(search_site_id);
        //     setParamIsUse(search_is_use);
        // }
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

                    if (param_site_id) {
                        console.log('==============called...here ');
                        console.log(search_site_id);
                        console.log(search_is_use);
                        console.log(param_site_id);
                        console.log(param_is_use);
                        console.log('================');
                        setSiteId(param_site_id);
                        if (param_is_use === 'true') {
                            setIsUse(true);
                        } else {
                            setIsUse(false);
                        }
                        roleSearch(param_is_use, search_site_id);
                        //searchClick();
                    } else {
                        // default 조회
                        setSiteId(list[1].id);
                        roleSearch(is_use, list[1].id);
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
        switch (responseData.transactionId) {
            case 'roleList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setDataGridRows(responseData.data.data);
                } else {
                    setDataGridRows([]);
                }
                break;
            case 'deleteData':
                console.log('deleteData');
                roleList();
                break;
            default:
        }
    }, [responseData]);

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
    // 페이징 변경 이벤트
    const handlePage = (page) => {};

    // 그리드 클릭
    const handleClick = (rowData) => {
        if (rowData && rowData.field && rowData.field !== '__check__') {
            let searchCondition = { site_id: site_id, is_use: is_use };
            navigate(`/roles/reg/${rowData.id}/${site_id}/${is_use}`);
        }
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // new
    const newClick = (e) => {
        console.log('called register form');
        navigate('/roles/reg');
    };

    // search
    const searchClick = () => {
        console.log('searchClick called...');
        if (!site_id) {
            alert('사이트명을 선택하세요!!!');
            return;
        }
        roleSearch(is_use, site_id);
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle titleNm="Role 리스트" menuStep01="통합시스템 관리" menuStep02="Role 관리" menuStep03="Role 리스트" />

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

                            <Button disableElevation size="medium" type="submit" variant="contained" onClick={newClick} color="primary">
                                등록
                            </Button>
                        </ButtonLayout>
                    </TopInputLayout>
                </MainCard>

                <MainCard sx={{ mt: 2 }} content={false}>
                    <DefaultDataGrid
                        columns={columns}
                        rows={dataGridRows}
                        handlePageChange={handlePage}
                        handleGridClick={handleClick}
                        handleGridDoubleClick={handleDoubleClick}
                        selectionChange={handleSelectionChange}
                    />
                </MainCard>

                {errorMessage ? (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                ) : null}
            </Grid>
        </Grid>
    );
};

export default RoleManagementPage;
