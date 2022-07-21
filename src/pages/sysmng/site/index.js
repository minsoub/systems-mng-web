import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FormControl, Grid, MenuItem, OutlinedInput, Select } from '@mui/material';
import MainCard from 'components/MainCard';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import SiteApi from 'apis/site/siteapi';
import ErrorScreen from 'components/ErrorScreen';
import HeaderTitle from 'components/HeaderTitle';
import InputLayout from 'components/Common/InputLayout';
import ButtonLayout from 'components/Common/ButtonLayout';
import TopInputLayout from 'components/Common/TopInputLayout';
import './styles.scss';

const SiteManagementPage = () => {
    let isSubmitting = false;
    const columns = [
        {
            field: 'id',
            headerName: 'Site ID',
            flex: 1,
            headerAlign: 'center',
            headerHeight: 22
        },
        {
            field: 'name',
            headerName: '사이트명',
            flex: 1,
            headerAlign: 'center'
        },
        {
            field: 'admin_account_email',
            headerName: '사이트 관리자',
            flex: 1,
            headerAlign: 'center'
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
            headerName: '유효일자(from)',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'valid_end_date',
            headerName: '유효일자(to)',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'description',
            headerName: '비고',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        }
    ];

    const navigate = useNavigate();
    const [responseData, requestError, loading, { siteSearch, siteList }] = SiteApi();

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

    const [is_use, setIsUsed] = useState('');
    const [keyword, setKeyword] = useState('');

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

    // onload
    useEffect(() => {
        setIsUsed('true');
        // 리스트 가져오기
        siteList(true);
    }, []);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'siteList':
                if (responseData.data.data) {
                    setDataGridRows(responseData.data.data);
                } else {
                    setDataGridRows([]);
                }
                break;
            case 'deleteData':
                console.log('deleteData');
                siteList();
                break;
            default:
        }
    }, [responseData]);

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
            navigate(`/site/reg/${rowData.id}`);
        }
    };

    const isUseChanged = (e) => {
        setIsUsed(e.target.value);
    };
    const keywordChanged = (e) => {
        setKeyword(e.target.value);
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // list
    const listClick = () => {
        let isUse = 'true';
        setKeyword('');
        console.log('listClick called');
        console.log(is_use);
        siteSearch(is_use, '');
    };
    // search
    const searchClick = () => {
        if (keyword === '') {
            alert('검색 단어를 입력하세요!');
            return;
        }
        siteSearch(is_use, keyword);
    };

    // new
    const newClick = () => {
        console.log('called register form');
        navigate('/site/reg');
    };

    // delete
    const deleteClick = () => {};

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle titleNm="사이트 관리" menuStep01="통합시스템 관리" menuStep02="사이트 관리" />

                <MainCard sx={{ mt: 1 }}>
                    <TopInputLayout>
                        <InputLayout>
                            <FormControl sx={{ minWidth: 100, marginRight: 2 }} size="medium">
                                <Select name="status" label="계정상태" value={is_use} onChange={isUseChanged}>
                                    <MenuItem value="true">사용</MenuItem>
                                    <MenuItem value="false">미사용</MenuItem>
                                    <MenuItem value="">전체</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl sx={{ minWidth: 250 }} size="medium">
                                <OutlinedInput
                                    fullWidth
                                    id="word"
                                    type="text"
                                    value={keyword}
                                    name="word"
                                    placeholder=""
                                    onChange={keywordChanged}
                                />
                            </FormControl>
                        </InputLayout>

                        <ButtonLayout>
                            <Button
                                disableElevation
                                disabled={isSubmitting}
                                size="medium"
                                type="submit"
                                variant="contained"
                                color="secondary"
                                onClick={searchClick}
                            >
                                검색
                            </Button>

                            <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={newClick}>
                                신규
                            </Button>

                            <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={listClick}>
                                리스트
                            </Button>
                        </ButtonLayout>
                    </TopInputLayout>
                </MainCard>

                <MainCard sx={{ mt: 2 }} content={false} className="layout--blank">
                    <DefaultDataGrid
                        columns={columns}
                        rows={dataGridRows}
                        handlePageChange={handlePage}
                        handleGridClick={handleClick}
                        handleGridDoubleClick={handleDoubleClick}
                        selectionChange={handleSelectionChange}
                        sx={{
                            boxShadow: 2,
                            border: 2,
                            borderColor: 'primary.light',
                            '& .MuiDataGrid-cell:hover': {
                                color: 'primary.main'
                            }
                        }}
                    />
                </MainCard>
                {errorMessage && (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                )}
            </Grid>
        </Grid>
    );
};

export default SiteManagementPage;
