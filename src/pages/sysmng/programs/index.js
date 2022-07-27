import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Checkbox, FormControlLabel, Grid, MenuItem, Select } from '@mui/material';
import MainCard from 'components/Common/MainCard';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import SiteApi from 'apis/site/siteapi';
import ProgramApi from 'apis/programs/programapi';
import ButtonLayout from 'components/Common/ButtonLayout';
import TopInputLayout from 'components/Common/TopInputLayout';
import InputLayout from 'components/Common/InputLayout';
import HeaderTitle from 'components/HeaderTitle';
import ContentLine from '../../../components/Common/ContentLine';
import DropInput from '../../../components/Common/DropInput';

const ProgramManagementPage = () => {
    let isSubmitting = false;
    const columns = [
        {
            field: 'id',
            headerName: '프로그램 ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'name',
            headerName: '프로그래명',
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
    const [responseData, requestError, loading, { programSearch, programList }] = ProgramApi();
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

                    let searchData = JSON.parse(localStorage.getItem('pgmSearchData'));
                    if (searchData) {
                        setSiteId(searchData.site_id);
                        setIsUse(searchData.is_use);
                        programSearch(searchData.site_id, searchData.is_use);
                        //searchClick();
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
            console.log(rowData);
            // 검색 데이터에 대한 세팅.
            let searchData = { site_id: site_id, is_use: is_use };
            localStorage.setItem('pgmSearchData', JSON.stringify(searchData));
            navigate(`/pgm/reg/${rowData.id}/${rowData.row.site_id}`);
        }
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // program 등록 화면
    const newClick = (e) => {
        console.log('called register form');
        navigate('/pgm/reg');
    };

    // program search
    const searchClick = () => {
        console.log('searchClick called...');
        if (!site_id) {
            alert('사이트명을 선택하지 않았습니다!!!');
            return;
        }
        console.log(site_id);
        programSearch(site_id, true);
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle
                    titleNm="프로그램 리스트"
                    menuStep01="통합시스템 관리"
                    menuStep02="프로그램 관리"
                    menuStep03="프로그램 리스트"
                />

                <MainCard>
                    <TopInputLayout>
                        <InputLayout>
                            <DropInput title="사이트명">
                                <Select name="site_id" label="사이트명" value={site_id} onChange={siteChanged} placeholder="사이트명">
                                    {siteList.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </DropInput>

                            <FormControlLabel
                                control={<Checkbox name="is_use" checked={is_use} value={is_use} onChange={isUseChange} />}
                                label="사용함"
                                className="checkedBox"
                            />
                        </InputLayout>

                        <ButtonLayout>
                            <Button
                                disableElevation
                                size="medium"
                                type="submit"
                                variant="contained"
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

export default ProgramManagementPage;
