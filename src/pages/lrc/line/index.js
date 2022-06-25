import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material-ui
// eslint-disable-next-line prettier/prettier
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
    MenuItem
} from '@mui/material';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Input } from 'antd';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import LineApis from 'apis/lrc/line/lineapi';
import ErrorScreen from 'components/ErrorScreen';

const LineMngPage = () => {
    let isSubmitting = false;
    const columns = [
        {
            field: 'type',
            headerName: '계열 타입',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'name',
            headerName: '계열 명칭',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'use_yn',
            headerName: '사용여부',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'create_date',
            headerName: '등록 일시',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        }
    ];

    const navigate = useNavigate();
    const [responseData, requestError, loading, { lineSearch, lineInsert, lineUpdate, lineDelete }] = LineApis();

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [search_line_type, setSearchLineType] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);

    // 입력 데이터 - Default
    const [inputs, setInputs] = useState({
        id: '',
        name: '',
        type: '',
        use_yn: true
    });
    const { id, name, type } = inputs;

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            console.log('error requestError');
            console.log(requestError);
            setErrorTitle('Error Message');
            setErrorMessage(requestError);
            setOpen(true);
        }
    }, [requestError]);

    // onload
    useEffect(() => {
        // 리스트 가져오기
        lineSearch('');
        setIsUpdate(false);
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
            case 'insertData':
                if (responseData.data.data) {
                    alert('저장을 완료하였습니다!!!');
                    newClick();
                    lineSearch(search_line_type);
                }
                break;
            case 'updateData':
                if (responseData.data.data) {
                    alert('수정을 완료하였습니다!!!');
                    newClick();
                    lineSearch(search_line_type);
                }
                break;
            case 'deleteData':
                console.log('deleteData');
                alert('삭제 처리를 완료하였습니다!');
                newClick();
                lineSearch(search_line_type);
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
        console.log(rowData);
        if (rowData && rowData.field && rowData.field !== '__check__') {
            setIsUpdate(true);
            setInputs({
                id: rowData.row.id,
                name: rowData.row.name,
                use_yn: rowData.row.use_yn,
                type: rowData.row.type
            });
        }
    };

    const searchLineChanged = (e) => {
        setSearchLineType(e.target.value);
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // search
    const searchClick = () => {
        lineSearch(search_line_type);
    };
    // 입력 박스 입력 시 호출
    const handleChange = (e) => {
        let { value, name } = e.target;
        if (e.target.type === 'checkbox') {
            value = e.target.checked;
        }
        setInputs({
            ...inputs, // 기존 input 객체 복사
            [name]: value
        });
    };
    const handleBlur = (e) => {
        console.log(e);
    };
    // new
    const newClick = () => {
        console.log('called register form');
        //navigate('/account/reg');
        setInputs({
            id: '',
            name: '',
            type: '',
            use_yn: true
        });
        setIsUpdate(false);
    };

    // save
    const saveClick = () => {
        if (!name) {
            alert('계열 명칭을 입력하지 않았습니다!!!');
            return;
        }
        if (!type) {
            alert('계열 타입을 선택하지 않았습니다!!!');
            return;
        }
        if (!isUpdate) {
            lineInsert(inputs);
        } else {
            lineUpdate(inputs);
        }
    };
    // delete
    const deleteClick = () => {
        if (!isUpdate) {
            alert('삭제할 데이터가 없습니다!!!');
            return;
        }
        if (confirm('선택한 데이터에 대해서 삭제를 하시겠습니까?')) {
            // 선택한 계정에 대해서 삭제를 수행한다.
            lineDelete(inputs);
        }
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h3">계열 관리</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">사이트 운영 > 상태값 관리 > 계열 관리</Typography>
                    </Grid>
                    <Grid container spacing={2}></Grid>
                </Grid>
                <MainCard sx={{ mt: 1 }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid container spacing={0} sx={{ mt: 0 }}>
                            <Grid item xs={8} sm={2}>
                                <FormControl sx={{ m: 0, minWidth: 200 }} size="small">
                                    <Select name="search_line_type" label="계얄타입" value={search_line_type} onChange={searchLineChanged}>
                                        <MenuItem value="BUSINESS">사업계열</MenuItem>
                                        <MenuItem value="NETWORK">네트워크계열</MenuItem>
                                        <MenuItem value="">전체</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={8.3}></Grid>
                            <Grid item xs={8} sm={0.7}>
                                <FormControl sx={{ m: 1 }} size="small">
                                    <Button
                                        disableElevation
                                        size="small"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        onClick={searchClick}
                                    >
                                        검색
                                    </Button>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={0.1}></Grid>
                            <Grid item xs={8} sm={0.7}>
                                <FormControl sx={{ m: 1 }} size="small">
                                    <Button
                                        disableElevation
                                        size="small"
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        onClick={newClick}
                                    >
                                        신규
                                    </Button>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={0.1}></Grid>
                        </Grid>
                    </Grid>
                </MainCard>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <DefaultDataGrid
                        columns={columns}
                        rows={dataGridRows}
                        handlePageChange={handlePage}
                        handleGridClick={handleClick}
                        handleGridDoubleClick={handleDoubleClick}
                        selectionChange={handleSelectionChange}
                        height={350}
                    />
                </MainCard>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <Grid container spacing={0} sx={{ mt: 1 }}>
                        <Grid item xs={8} sm={0.2}></Grid>
                        <Grid item xs={8} sm={1.3}>
                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                <Stack spacing={0}>계열 타입</Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs={8} sm={2}>
                            <FormControl sx={{ m: 0, minWidth: 200 }} size="small">
                                <Select name="type" label="계얄타입" value={type} onChange={handleChange}>
                                    <MenuItem value="BUSINESS">사업계열</MenuItem>
                                    <MenuItem value="NETWORK">네트워크계열</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={8} sm={1.3}></Grid>
                        <Grid item xs={8} sm={1.3}>
                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                <Stack spacing={0}>계열 명칭</Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs={8} sm={3}>
                            <Stack spacing={3}>
                                <FormControl sx={{ m: 0, minWidth: 280, maxHeight: 30 }} size="small">
                                    <TextField
                                        id="filled-hidden-label-small"
                                        type="text"
                                        size="small"
                                        value={name}
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter the Name"
                                        fullWidth
                                    />
                                </FormControl>
                            </Stack>
                        </Grid>
                        <Grid item xs={8} sm={0.3}></Grid>
                        <Grid item xs={8} sm={0.7}>
                            <FormControl sx={{ m: 0 }} size="small">
                                <Button
                                    disableElevation
                                    size="small"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    onClick={saveClick}
                                >
                                    저장
                                </Button>
                            </FormControl>
                        </Grid>
                        <Grid item xs={8} sm={0.1}></Grid>
                        <Grid item xs={8} sm={0.7}>
                            <FormControl sx={{ m: 0 }} size="small">
                                <Button
                                    disableElevation
                                    disabled={!isUpdate}
                                    size="small"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    onClick={deleteClick}
                                >
                                    삭제
                                </Button>
                            </FormControl>
                        </Grid>
                        <Grid item xs={8} sm={0.1}></Grid>
                    </Grid>
                </MainCard>
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} />
            </Grid>
        </Grid>
    );
};

export default LineMngPage;
