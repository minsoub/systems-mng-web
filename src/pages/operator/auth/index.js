import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Button, Checkbox, FormControl, FormControlLabel, Grid, MenuItem, Radio, RadioGroup, Select, Stack } from '@mui/material';
import MainCard from 'components/Common/MainCard';
import DefaultDataGrid from '../../../components/DataGrid/DefaultDataGrid';
import RoleApi from 'apis/roles/roleapi';
import SiteApi from 'apis/site/siteapi';
import ErrorScreen from 'components/ErrorScreen';
import HeaderTitle from '../../../components/HeaderTitle';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import cx from 'classnames';
import InputLayout from '../../../components/Common/InputLayout';
import TopInputLayout from '../../../components/Common/TopInputLayout';
import './styles.scss';
import DropInput from '../../../components/Common/DropInput';
import ContentLine from '../../../components/Common/ContentLine';
import { getDateFormat } from 'utils/CommonUtils';

const SiteAuthManagementPage = () => {
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
            headerName: '유효기간(From)',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'valid_end_date',
            headerName: '유효기간(To)',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'create_date',
            headerName: '등록일자',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: ({ value }) => `${getDateFormat(value)}`
        }
    ];
    const navigate = useNavigate();
    // const { search_site_id, search_is_use } = useParams();
    const { siteId } = useSelector((state) => state.auth);
    const [responseData, requestError, loading, { roleList, roleComboSearch }] = RoleApi();
    const [resData, reqErr, resLoading, { siteSearch }] = SiteApi();

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);

    // 공통 에러 처리
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const parentErrorClear = () => {
        setOpen(false);
        setErrorTitle('');
        setErrorMessage('');
    };

    const [siteList, setSiteList] = useState([]);
    const [site_id, setSiteId] = useState('');
    const [type, setType] = useState('ADMIN');
    const [is_use, setIsUse] = useState(true);

    // 파라미터 상태값
    // const [param_site_id, setParamSiteId] = useState(search_site_id);
    // const [param_is_use, setParamIsUse] = useState(search_is_use);

    // Change Event
    // site가 변경되었을 때 호출된다.
    const siteChanged = (e) => {
        setSiteId(e.target.value);
    };
    // Role Type인 변경되었을 때 호출된다.
    const typeChanged = (e) => {
        setType(e.target.value);
    };

    // onload
    useEffect(() => {
        // 사이트 구분 리스트 가져오기
        // console.log('paramter data => ');
        // console.log(search_site_id);
        // console.log(search_is_use);
        // console.log('====================');
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
                    setSiteId(siteId);
                    roleComboSearch(true, 'ADMIN', siteId);
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
        let { value } = e.target;
        if (e.target.type === 'checkbox') {
            value = e.target.checked;
        }
        setIsUse(value);
    };

    const listClick = () => {
        setIsUse(true);
        siteSearch(true, '');
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
            let searchCondition = { site_id: site_id, is_use: is_use, type: type };

            navigate(`/siteauth/reg/${site_id}/${type}/${rowData.id}`);
            //navigate(`/siteauth/reg/${rowData.id}`);
        }
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // search
    const searchClick = () => {
        console.log('searchClick called...');
        if (!site_id) {
            alert('사이트명을 선택하세요.');
            return;
        }
        roleComboSearch(is_use, type, site_id);
    };

    return (
        <Grid container rowSpacing={4} columnSpacing={2.75} className="siteauthList">
            <Grid item xs={12}>
                <HeaderTitle titleNm="권한 리스트" menuStep01="사이트 관리" menuStep02="권한 관리" menuStep03="권한 리스트" />

                <MainCard>
                    <TopInputLayout>
                        <InputLayout>
                            <DropInput title="사이트명" titleWidth={90}>
                                <Select name="site_id" label="사이트명" value={site_id} onChange={siteChanged}>
                                    <MenuItem value="">
                                        <em>Choose a Site Type</em>
                                    </MenuItem>
                                    {siteList
                                        .filter((item) => item.id === siteId)
                                        .map((item, index) => (
                                            <MenuItem key={index} value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </DropInput>

                            <DropInput title="Role Type" titleWidth={90}>
                                <Select name="type" label="Role Type" value={type} onChange={typeChanged}>
                                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                                    <MenuItem value="USER">USER</MenuItem>
                                </Select>
                            </DropInput>
                            <DropInput title="사용여부" titleWidth={90}>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="is_use"
                                    value={is_use}
                                    onChange={isUseChange}
                                >
                                    <FormControlLabel value="true" control={<Radio />} label="사용함" />
                                    <FormControlLabel value="false" control={<Radio />} label="사용안함" />
                                </RadioGroup>
                            </DropInput>
                        </InputLayout>

                        <ButtonLayout>
                            <Button
                                disableElevation
                                size="medium"
                                type="submit"
                                variant="outlined_d"
                                color="secondary"
                                onClick={searchClick}
                            >
                                검색
                            </Button>

                            <Button disableElevation size="medium" type="submit" variant="outlined_d" color="secondary" onClick={listClick}>
                                초기화
                            </Button>
                        </ButtonLayout>
                    </TopInputLayout>
                </MainCard>

                <ContentLine>
                    <DefaultDataGrid
                        columns={columns}
                        rows={dataGridRows}
                        handlePageChange={handlePage}
                        handleGridClick={handleClick}
                        handleGridDoubleClick={handleDoubleClick}
                        selectionChange={handleSelectionChange}
                        height={700}
                    />
                </ContentLine>

                {errorMessage && (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                )}
            </Grid>
        </Grid>
    );
};

export default SiteAuthManagementPage;
