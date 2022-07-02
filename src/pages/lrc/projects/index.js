import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    MenuItem,
    FormControlLabel,
    Checkbox,
    Radio,
    RadioGroup
} from '@mui/material';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Input } from 'antd';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import StatusApi from 'apis/lrc/status/statusapi';
import FoundationApi from 'apis/lrc/project/foundationapi';
import ErrorScreen from 'components/ErrorScreen';
import { BusinessCheckboxList } from './component/business';
import { NetworkCheckboxList } from './component/network';
import moment from 'moment';

const ProjectsPage = () => {
    let isSubmitting = false;
    const columns = [
        {
            field: 'id',
            headerName: '프로젝트명',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'symbol',
            headerName: '심볼',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'type',
            headerName: '거래지원 현황',
            width: 300,
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            rederCell: (params) => {
                <div>
                    <Typography>{params.value.name}</Typography>
                    <Typography color="textSecondary">{params.value.title}</Typography>
                </div>;
            }
        },
        {
            field: 'business_name',
            headerName: '사업 계열',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'network_name',
            headerName: '네트워크 계열',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'valid_end_date',
            headerName: '마케팅 수량',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'project_link',
            headerName: '연결 프로젝트',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'ico_date',
            headerName: '상장일',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'create_date',
            headerName: '등록일시',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        }
    ];
    const navigate = useNavigate();
    const [resData, reqErr, resLoading, { statusSearch }] = StatusApi();
    const [responseData, requestError, Loading, { foundationSearch }] = FoundationApi();

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);

    ////////////////////////////////////////////////////
    // 공통 에러 처리
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    ////////////////////////////////////////////////////

    // 검색 조건
    const [keyword, setKeyword] = useState('');
    const [from_date, setStartDate] = useState(new Date());
    const [to_date, setEndDate] = useState(new Date());
    const [period, setPeriod] = useState('1');
    const [contract_code, setSts] = useState('');
    const [process_code, setProcess] = useState('');

    const [checkedBusinessItems, setCheckedBusinessItems] = useState(new Set()); // 비즈니스 체크박스 리스트
    const [checkedNetworkItems, setCheckedNetworkItems] = useState(new Set()); // Network 체크박스 리스트
    const [statusAllList, setStatusAllList] = useState([]); // 전체 상태 리스트
    const [statusList, setStatusList] = useState([]); // 계약 상태
    const [processList, setProcessList] = useState([]); // 계약 상태 변경 시 진행상태 출력 리스트.

    const [isAllChecked, setIsAllChecked] = useState(false);
    // onload
    useEffect(() => {
        statusSearch(); // 상태 값 모두 조회
        setStartDate(moment().format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));
        console.log(new Date());
    }, []);

    // transaction error 처리
    // useEffect(() => {
    //     if (requestError) {
    //         console.log('error requestError');
    //         console.log(requestError);
    //         setErrorTitle('Error Message');
    //         setErrorMessage(requestError);
    //         setOpen(true);
    //     }
    // }, [requestError]);

    // Combobox data transaction
    useEffect(() => {
        if (!resData) {
            return;
        }
        switch (resData.transactionId) {
            case 'getList':
                if (resData.data.data) {
                    setStatusAllList(resData.data.data);

                    let itemData = resData.data.data;
                    let list = [];
                    itemData.map((item, index) => {
                        if (item.parent_code === '') {
                            const s = { id: item.id, name: item.name };
                            console.log(s);
                            list.push(s);
                        }
                    });
                    setStatusList(list);
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
            case 'getList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setDataGridRows(responseData.data.data);
                } else {
                    setDataGridRows([]);
                }
                break;
            default:
        }
    }, [responseData]);

    const handleClose = () => {
        setVisible(false);
    };
    const handleBlur = (e) => {
        console.log(e);
    };
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'keyword':
                setKeyword(e.target.value);
                break;
            case 'from_date':
                setStartDate(e.target.value);
                break;
            case 'to_date':
                setEndDate(e.target.value);
                break;
            case 'period':
                setPeriod(e.target.value);
                setDateFromToSet(e.target.value);
                break;
            case 'contract_code':
                setSts(e.target.value);
                // 진행상태 출력.
                processPrint(e.target.value);
                break;
            case 'process_code':
                setProcess(e.target.value);
                break;
            default:
                break;
        }
    };
    // 기간 선택시 날짜 변경
    const setDateFromToSet = (periodIndex) => {
        switch (periodIndex) {
            case '1':
                setStartDate(moment().format('YYYY-MM-DD'));
                setEndDate(moment().format('YYYY-MM-DD'));
                break;
            case '2':
                setStartDate(moment().add(-1, 'days').format('YYYY-MM-DD'));
                setEndDate(moment().add(-1, 'days').format('YYYY-MM-DD'));
                break;
            case '3':
                setStartDate(moment().format('YYYY-MM-DD'));
                setEndDate(moment().add(30, 'days').format('YYYY-MM-DD'));
                break;
            case '4':
                setStartDate(moment().format('YYYY-MM-DD'));
                setEndDate(moment().add(90, 'days').format('YYYY-MM-DD'));
                break;
            default:
                break;
        }
    };
    // 계약 상태 변경 시 진행상태 출력
    const processPrint = (id) => {
        setProcessList([]);
        console.log(id);
        let list = [];
        statusAllList.map((item, index) => {
            if (item.id === id && item.children && item.children.length > 0) {
                item.children.map((subitem, idx) => {
                    const s = { id: subitem.id, name: subitem.name };
                    //console.log(s);
                    list.push(s);
                });
                setProcessList(list);
                return;
            }
        });
    };
    // Business Checkbox Handler
    const checkedBusinessItemHandler = (id, isChecked) => {
        console.log(id);
        if (isChecked) {
            checkedBusinessItems.add(id);
            setCheckedBusinessItems(checkedBusinessItems);
        } else if (!isChecked && checkedBusinessItems.has(id)) {
            checkedBusinessItems.delete(id);
            setCheckedBusinessItems(checkedBusinessItems);
        }
    };
    // Network Checkbox Handler
    const checkedNetworkItemHandler = (id, isChecked) => {
        console.log(id);
        if (isChecked) {
            checkedNetworkItems.add(id);
            setCheckedNetworkItems(checkedNetworkItems);
        } else if (!isChecked && checkedNetworkItems.has(id)) {
            checkedNetworkItems.delete(id);
            setCheckedNetworkItems(checkedNetworkItems);
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
            navigate(`/projects/detail/${rowData.id}`);
        }
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // search
    const searchClick = () => {
        console.log('searchClick called...');
        //roleComboSearch(is_use, type, site_id);
        let business_list = [];
        let network_list = [];
        Array.from(checkedBusinessItems).map((item, idx) => {
            business_list.push(item.id);
        });
        Array.from(checkedNetworkItems).map((item, idx) => {
            network_list.push(item.id);
        });
        // 검색 조건 세팅
        let data = {
            from_date: from_date,
            to_date: to_date,
            contract_code: contract_code,
            progress_code: process_code,
            business_list: business_list,
            network_list: network_list,
            keyword: keyword
        };
        foundationSearch(data);
    };
    const clearClick = () => {
        setPeriod('1');
        setStartDate(moment().format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));
        setSts('');
        setProcess('');
        checkedBusinessItems.clear();
        setCheckedBusinessItems(new Set());
        setCheckedNetworkItems(new Set());
        checkedNetworkItems.clear();
        setKeyword('');
        setIsAllChecked(false);
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h3">거래지원 관리</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">사이트 운영 &gt; 거래지원 관리</Typography>
                    </Grid>
                    <Grid container spacing={2}></Grid>
                </Grid>
                <MainCard sx={{ mt: 1 }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid container spacing={0} sx={{ mt: 0 }}>
                            <Grid item xs={8} sm={1.2}>
                                <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                    <Stack spacing={0}>등록 기간 검색</Stack>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={1.5}>
                                <FormControl sx={{ m: 0, minHeight: 25 }} size="small">
                                    <TextField
                                        id="from_date"
                                        name="from_date"
                                        value={from_date}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="date"
                                        sx={{ width: 140 }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={0.3}>
                                ~{' '}
                            </Grid>
                            <Grid item xs={8} sm={1.5}>
                                <FormControl sx={{ m: 0, minHeight: 25 }} size="small">
                                    <TextField
                                        id="to_date"
                                        name="to_date"
                                        value={to_date}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="date"
                                        sx={{ width: 140 }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={3.5}>
                                <FormControl sx={{ m: 0, minHeight: 25 }} size="small">
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="period"
                                        value={period}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel value="1" control={<Radio />} label="오늘" />
                                        <FormControlLabel value="2" control={<Radio />} label="어제" />
                                        <FormControlLabel value="3" control={<Radio />} label="1개월" />
                                        <FormControlLabel value="4" control={<Radio />} label="3개월" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} sx={{ mt: 1 }}>
                            <Grid item xs={8} sm={1.2}>
                                <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                    <Stack spacing={0}>계약상태</Stack>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={2.5}>
                                <FormControl sx={{ m: 0, minWidth: 280 }} size="small">
                                    <Select name="contract_code" label="계정상태" value={contract_code} onChange={handleChange}>
                                        <MenuItem value="">전체</MenuItem>
                                        {statusList.map((item, index) => (
                                            <MenuItem key={index} value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={0.7}></Grid>
                            <Grid item xs={8} sm={1.2}>
                                <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                    <Stack spacing={0}>진행상태</Stack>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={2}>
                                <FormControl sx={{ m: 0, minWidth: 280 }} size="small">
                                    <Select name="process_code" label="계정상태" value={process_code} onChange={handleChange}>
                                        <MenuItem value="">전체</MenuItem>
                                        {processList.map((item, index) => (
                                            <MenuItem key={index} value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <BusinessCheckboxList checkedItemHandler={checkedBusinessItemHandler} isAllChecked={isAllChecked} />
                        <NetworkCheckboxList checkedItemHandler={checkedNetworkItemHandler} />
                        <Grid container spacing={0} sx={{ mt: 1 }}>
                            <Grid item xs={8} sm={1.2}>
                                <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                    <Stack spacing={0}>검색어</Stack>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={4}>
                                <FormControl sx={{ m: 0, minHeight: 25, minWidth: 640 }} size="small">
                                    <TextField
                                        id="filled-hidden-label-small"
                                        type="text"
                                        size="small"
                                        value={keyword}
                                        name="keyword"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter Keyword Name"
                                        fullWidth
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </MainCard>
                <Grid container alignItems="right" justifyContent="space-between">
                    <Grid container spacing={0} sx={{ mt: 0 }}>
                        <Grid item xs={8} sm={10.5}></Grid>
                        <Grid item xs={8} sm={0.6}>
                            <FormControl sx={{ m: 1 }} size="small">
                                <Button
                                    disableElevation
                                    size="small"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    onClick={searchClick}
                                >
                                    검색
                                </Button>
                            </FormControl>
                        </Grid>
                        <Grid item xs={8} sm={0.1}></Grid>
                        <Grid item xs={8} sm={0.6}>
                            <FormControl sx={{ m: 1 }} size="small">
                                <Button
                                    disableElevation
                                    size="small"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    onClick={clearClick}
                                >
                                    초기화
                                </Button>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <MainCard sx={{ mt: 1, minHeight: 60 }} content={false}>
                    <Grid container spacing={0} sx={{ mt: 2 }}>
                        <Grid item xs={8} sm={0.3}></Grid>
                        <Grid item xs={8} sm={0.7}>
                            전체(2)
                        </Grid>
                        <Grid item xs={8} sm={0.1}></Grid>
                        <Grid item xs={8} sm={0.7}>
                            접수중(2)
                        </Grid>
                        <Grid item xs={8} sm={0.1}></Grid>
                        <Grid item xs={8} sm={0.7}>
                            심사중(2)
                        </Grid>
                        <Grid item xs={8} sm={0.1}></Grid>
                        <Grid item xs={8} sm={0.7}>
                            상장완료(2)
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
                    />
                </MainCard>
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} />
            </Grid>
        </Grid>
    );
};

export default ProjectsPage;
