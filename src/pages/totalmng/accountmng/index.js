import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    OutlinedInput,
    Box,
    Button,
    Grid,
    Stack,
    TextField,
    Collapse,
    Alert,
    AlertTitle,
    Typography,
    FormControl,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Input } from 'antd';
import { boolean } from '../../../../node_modules/yup/lib/index';
import CheckBoxDataGrid from '../../../components/DataGrid/CheckBoxDataGrid';
import AccountApis from 'apis/account/accountapis';
import ErrorScreen from 'components/ErrorScreen';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import TopInputLayout from '../../../components/Common/TopInputLayout';
import InputLayout from '../../../components/Common/InputLayout';
import HeaderTitle from '../../../components/HeaderTitle';

const AccountMng = () => {
    let isSubmitting = false;
    const columns = [
        {
            field: 'name',
            headerName: '사용자명',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 140
        },
        {
            field: 'email',
            headerName: '이메일주소',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 280
        },
        {
            field: 'role_management_name',
            headerName: '운영권한',
            flex: 1,
            headerAlign: 'center',
            align: 'left'
        },
        {
            field: 'last_login_date',
            headerName: 'Last Login Date',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 180
        },
        {
            field: 'create_date',
            headerName: '생성일자',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 180
        },
        {
            field: 'status',
            headerName: '상태',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 180
        }
    ];

    const navigate = useNavigate();
    const [responseData, requestError, loading, { accountMngSearch, accountList, accountMngDeletes }] = AccountApis();

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    const [deleteRows, setDeleteRows] = useState([]);

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
                if (responseData.data.data && responseData.data.data.count > 0) {
                    alert('삭제를 완료하였습니다');
                    listClick();
                }
                break;
            default:
        }
    }, [responseData]);

    //체크박스 선택된 row id 저장
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
        if (rowData && rowData.field && rowData.field !== '__check__') {
            navigate(`/accountmng/reg/${rowData.id}`);
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
        navigate('/accountmng/reg');
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
            accountMngDeletes(deleteIds);
        }
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle titleNm="계정 관리" menuStep01="통합시스템 관리" menuStep02="계정 관리" />

                <MainCard>
                    <TopInputLayout>
                        <InputLayout>
                            <FormControl size="medium" sx={{ minWidth: 100, marginRight: 2 }}>
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
                                리스트
                            </Button>
                        </ButtonLayout>
                    </TopInputLayout>
                </MainCard>

                {/* 표 */}
                <MainCard sx={{ mt: 2, height: 850 }} content={false}>
                    <CheckBoxDataGrid
                        columns={columns}
                        rows={dataGridRows}
                        handlePageChange={handlePage}
                        handleGridClick={handleClick}
                        handleGridDoubleClick={handleDoubleClick}
                        selectionChange={handleSelectionChange}
                        height={850}
                    />
                </MainCard>

                {errorMessage && (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                )}
            </Grid>
        </Grid>
    );
};

export default AccountMng;
