import React, { useEffect, useState } from 'react';
import { Button, FormControl, Grid, MenuItem, Select, TextField } from '@mui/material';
import HeaderTitle from 'components/HeaderTitle';
import MainCard from 'components/Common/MainCard';
import TopInputLayout from 'components/Common/TopInputLayout';
import InputLayout from 'components/Common/InputLayout';
import ButtonLayout from 'components/Common/ButtonLayout';
import SiteApi from 'apis/site/siteapi';
import RoleApi from 'apis/roles/roleapi';
import ContentLine from 'components/Common/ContentLine';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import { getDateFormat } from 'utils/CommonUtils';
import { useNavigate } from 'react-router-dom';

const IpMng = () => {
    const navigate = useNavigate();
    const [siteList, setSiteList] = useState([]);
    const [resData, reqErr, resLoading, { siteSearch }] = SiteApi();
    const [responseData, requestError, loading, { roleList, roleComboSearch }] = RoleApi();
    const [site_id, setSiteId] = useState('');
    const [type, setType] = useState('ADMIN');
    const [is_use, setIsUse] = useState(true);
    const [name, setName] = useState('');
    const [dataGridRows, setDataGridRows] = useState([]);
    const [selectedRows, setSeletedRows] = useState([]);

    const columns = [
        {
            field: 'id',
            headerName: '구분',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'name',
            headerName: '이메일 주소',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'type',
            headerName: '사용자명',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'is_use',
            headerName: '운영권한',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'valid_start_date',
            headerName: '접근 IP',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'valid_end_date',
            headerName: '생성일자',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: ({ value }) => `${getDateFormat(value)}`
        }
    ];

    // site가 변경되었을 때 호출된다.
    const siteChanged = (e) => {
        setSiteId(e.target.value);
    };

    // 페이징 변경 이벤트
    const handlePage = (page) => {};

    //체크박스 선택된 row id 저장
    const handleSelectionChange = (item) => {
        if (item) {
            setSeletedRows(item);
        }
    };
    // 그리드 클릭
    const handleClick = (rowData) => {
        if (rowData && rowData.field && rowData.field !== '__check__') {
            let searchCondition = { site_id: site_id, is_use: is_use };
            navigate(`/ipmng/ipRegForm/${rowData.id}/${site_id}/${is_use}`);
        }
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    const handleBlur = (e) => {
        console.log(e);
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
                setIsUse(e.target.checked);
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

    // search
    const searchClick = () => {
        if (!site_id) {
            alert('사이트명을 선택하세요.');
            return;
        }
        roleComboSearch(is_use, type, site_id);
    };

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
                }
                break;
            default:
        }
    }, [resData]);

    // onload
    useEffect(() => {
        siteSearch(true, '');
    }, []);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'siteList':
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

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle titleNm="접근 IP 관리" menuStep01="통합시스템 관리" menuStep02="접근 IP 관리" />

                <MainCard>
                    <TopInputLayout>
                        <InputLayout gridClass="gridClass">
                            <FormControl sx={{ minWidth: 250, boxSizing: 'border-box' }} size="medium">
                                <Select name="site_id" label="사이트명" value={site_id} onChange={siteChanged}>
                                    {siteList.map((item, index) => (
                                        <MenuItem key={index} value={item.id} placeholder={item.name}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </InputLayout>

                        <InputLayout gridClass="gridClass">
                            <FormControl sx={{ minWidth: 250, boxSizing: 'border-box' }} size="medium">
                                <TextField
                                    id="filled-hidden-label-small"
                                    type="text"
                                    size="medium"
                                    value={name}
                                    name="name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Input the name"
                                    fullWidth
                                />
                            </FormControl>

                            <ButtonLayout>
                                <Button
                                    disableElevation
                                    size="medium"
                                    color="primary"
                                    type="submit"
                                    variant="contained"
                                    onClick={searchClick}
                                >
                                    조회
                                </Button>
                            </ButtonLayout>
                        </InputLayout>
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
            </Grid>
        </Grid>
    );
};

export default IpMng;
