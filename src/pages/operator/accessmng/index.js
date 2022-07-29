import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FormControl, Grid, MenuItem, OutlinedInput, Select } from '@mui/material';
import MainCard from 'components/Common/MainCard';
import CheckBoxDataGrid from '../../../components/DataGrid/CheckBoxDataGrid';
import AccountApis from 'apis/account/accountapis';
import HeaderTitle from '../../../components/HeaderTitle';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import InputLayout from '../../../components/Common/InputLayout';
import TopInputLayout from '../../../components/Common/TopInputLayout';
import './styles.scss';
import cx from 'classnames';
import ContentLine from '../../../components/Common/ContentLine';

const AccessMngPage = () => {
    let isSubmitting = false;
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 180
        },
        {
            field: 'name',
            headerName: '사용자명',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 100
        },
        {
            field: 'email',
            headerName: '이메일주소',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 220
        },
        {
            field: 'role_management_name',
            headerName: '운영권한',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'status',
            headerName: '상태',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 150
        },
        {
            field: 'valid_start_date',
            headerName: '유효기간(from)',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 150
        },
        {
            field: 'valid_end_date',
            headerName: '유효기간(to)',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 150
        },
        {
            field: 'create_date',
            headerName: '생성날짜',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 140
        }
    ];

    const navigate = useNavigate();
    const [responseData, requestError, loading, { accountMngSearch, accountList, accountDeletes }] = AccountApis();

    // 그리드 선택된 row id
    const [selectedRows, setSelectedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);
    ////////////////////////////////////////////////////
    // 공통 에러 처리
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    // const parentErrorClear = () => {
    //     setOpen(false);
    //     setErrorTitle('');
    //     setErrorMessage('');
    // };
    ////////////////////////////////////////////////////

    const [is_use, setIsUsed] = useState('');
    const [keyword, setKeyword] = useState('');

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            if (requestError.result === 'FAIL') {
                console.log('error requestError');
                console.log(requestError);
                // setErrorTitle('Error Message');
                // setErrorMessage('[' + requestError.error.code + '] ' + requestError.error.message);
                // setOpen(true);
            }
        }
    }, [requestError]);

    // onload
    useEffect(() => {
        setIsUsed('true');
        // 리스트 가져오기
        accountMngSearch(true, '');
    }, []);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getList':
                if (responseData.data.data) {
                    setDataGridRows(responseData.data.data);
                } else {
                    setDataGridRows([]);
                }
                break;
            case 'deleteDatas':
                console.log('deleteData');
                alert('삭제 처리를 완료하였습니다!');
                accountMngSearch(is_use, '');
                break;
            default:
        }
    }, [responseData]);

    //체크박스 선택된 row id 저장
    const handleSelectionChange = (item) => {
        if (item) {
            setSelectedRows(item);
        }
    };
    // 페이징 변경 이벤트
    const handlePage = (page) => {};

    // 그리드 클릭
    const handleClick = (rowData) => {
        if (rowData && rowData.field && rowData.field !== '__check__') {
            navigate(`/access/reg/${rowData.id}`);
        }
    };

    const isUseChanged = (e) => {
        if(e.target.value === '') {
            console.log(e.target.value)
        }
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
        accountMngSearch(is_use, '');
    };
    // search
    const searchClick = () => {
        if (keyword === '') {
            alert('검색 단어를 입력하세요!');
            return;
        }
        accountMngSearch(is_use, keyword);
    };

    // new
    const newClick = () => {
        console.log('called register form');
        navigate('/access/reg');
    };

    // delete
    const deleteClick = () => {
        if (selectedRows.length === 0) {
            alert('삭제 할 계정에 대해서 체크박스를 선택하세요!!!');
            return;
        }
        console.log(selectedRows);
        if (confirm('선택한 계정에 대해서 삭제를 하시겠습니까?')) {
            // 선택한 계정에 대해서 삭제를 수행한다.
            let deleteIds = '';
            let idx = 0;
            selectedRows.map((data, index) => {
                if (idx > 0) deleteIds = deleteIdx + '::';
                deleteIds = deleteIds + data;
                idx++;
            });
            console.log(deleteIds);
            accountDeletes(deleteIds);
        }
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle titleNm="사용자 접근관리" menuStep01="사이트 관리" menuStep02="사용자 접근관리" />

                <MainCard>
                    <TopInputLayout>
                        <InputLayout>
                            <FormControl sx={{ minWidth: 160 }} size="medium" className="layout--blank">
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
                                color="primary"
                                onClick={searchClick}
                            >
                                검색
                            </Button>
                            <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={newClick}>
                                신규
                            </Button>

                            <Button
                                disableElevation
                                size="medium"
                                type="submit"
                                variant="contained"
                                color="secondary"
                                onClick={deleteClick}
                            >
                                삭제
                            </Button>

                            <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={listClick}>
                                초기화
                            </Button>
                        </ButtonLayout>
                    </TopInputLayout>
                </MainCard>
                <ContentLine>
                    <CheckBoxDataGrid
                        columns={columns}
                        rows={dataGridRows}
                        handlePageChange={handlePage}
                        handleGridClick={handleClick}
                        handleGridDoubleClick={handleDoubleClick}
                        selectionChange={handleSelectionChange}
                        height={700}
                    />
                </ContentLine>
                {/* <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} /> */}
            </Grid>
        </Grid>
    );
};

export default AccessMngPage;
