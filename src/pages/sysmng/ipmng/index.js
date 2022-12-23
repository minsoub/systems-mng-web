import React, { useEffect, useState } from 'react';
import { Button, FormControl, Grid, MenuItem, Select, TextField } from '@mui/material';
import HeaderTitle from 'components/HeaderTitle';
import MainCard from 'components/Common/MainCard';
import TopInputLayout from 'components/Common/TopInputLayout';
import InputLayout from 'components/Common/InputLayout';
import ButtonLayout from 'components/Common/ButtonLayout';
import SiteApi from 'apis/site/siteapi';
import IpMngApi from 'apis/sysmng/ipmng';
import ContentLine from 'components/Common/ContentLine';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import { getDateFormat } from 'utils/CommonUtils';
import { useNavigate } from 'react-router-dom';

const IpMng = () => {
    const navigate = useNavigate();
    const [siteList, setSiteList] = useState([]);
    const [resData, reqErr, resLoading, { siteSearch }] = SiteApi();
    const [responseData, requestError, loading, { accessIpSearch }] = IpMngApi();
    const [site_id, setSiteId] = useState('');
    const [type, setType] = useState('ADMIN');
    const [is_use, setIsUse] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [dataGridRows, setDataGridRows] = useState([]);
    const [selectedRows, setSeletedRows] = useState([]);

    const columns = [
        {
            field: 'NO',
            headerName: '순번',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (index) => index.api.getRowIndex(index.row.id) + 1
        },
        {
            field: 'email',
            headerName: '이메일 주소',
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
        },
        {
            field: 'role_name',
            headerName: '운영권한',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'allow_ip',
            headerName: '접근 IP 대역',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'valid_start_date',
            headerName: '유효일자(From)',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: ({ value }) => `${getDateFormat(value)}`
        },
        {
            field: 'valid_end_date',
            headerName: '유효일자(To)',
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
        console.log(rowData);
        if (rowData && rowData.field && rowData.field !== '__check__') {
            //let searchCondition = { site_id: site_id, is_use: is_use };
            navigate(`/ipmng/reg/${site_id}/${rowData.row.admin_account_id}`);
        }
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    const handleBlur = (e) => {
        console.log(e);
    };

    // 검색 단어
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'keyword':
                setKeyword(e.target.value);
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
        accessIpSearch(site_id, keyword);
    };

    // program 등록 화면
    const newClick = (e) => {
        console.log('called register form');
        navigate('/ipmng/reg');
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
        console.log(responseData);
        switch (responseData.transactionId) {
            case 'searchList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setDataGridRows(responseData.data.data);
                } else {
                    setDataGridRows([]);
                }
                break;
            default:
        }
    }, [responseData]);

    return (
        <Grid container rowSpacing={4} columnSpacing={2.75}>
            <Grid item xs={12}>
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
                                    value={keyword}
                                    name="keyword"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Input the name"
                                    fullWidth
                                />
                            </FormControl>
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
                            <Button disableElevation size="medium" type="submit" variant="contained" onClick={newClick}>
                                등록
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
            </Grid>
        </Grid>
    );
};

export default IpMng;
