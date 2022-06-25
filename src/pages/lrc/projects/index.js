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
import DefaultDataGrid from '../../../components/DataGrid/DefaultDataGrid';
import RoleApi from 'apis/roles/roleapi';
import SiteApi from 'apis/site/siteapi';
import ErrorScreen from 'components/ErrorScreen';

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
            field: 'name',
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
            field: 'is_use',
            headerName: '사업 계열',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'valid_start_date',
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
            field: 'parameter',
            headerName: '연결 프로젝트',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'project_date',
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
    const [responseData, requestError, loading, { roleList, roleComboSearch }] = RoleApi();
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
    ////////////////////////////////////////////////////

    // 검색 조건
    const [keyword, setKeyword] = useState('');
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [period, setPeriod] = useState('1');
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);
    const [checked4, setChecked4] = useState(false);
    // onload
    useEffect(() => {
        //siteSearch(true, '');
        //roleList();
    }, []);

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
    const handleBlur = (e) => {
        console.log(e);
    };
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'keyword':
                setKeyword(e.target.value);
                break;
            case 'start_date':
                setStartDate(e.target.value);
                break;
            case 'end_date':
                setEndDate(e.target.value);
                break;
            case 'period':
                setPeriod(e.target.value);
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
            let searchCondition = { site_id: site_id, is_use: is_use, type: type };

            //navigate(`/authmng/reg/${rowData.id}`);
        }
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // search
    const searchClick = () => {
        console.log('searchClick called...');
        //roleComboSearch(is_use, type, site_id);
    };
    const clearClick = () => {};

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
                                        id="start_date"
                                        name="start_date"
                                        value={start_date}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="date"
                                        defaultValue=""
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
                                        id="end_date"
                                        name="end_date"
                                        value={end_date}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="date"
                                        defaultValue=""
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
                                    <Select name="status" label="계정상태" value={period} onChange={handleChange}>
                                        <MenuItem value="true">사용</MenuItem>
                                        <MenuItem value="false">미사용</MenuItem>
                                        <MenuItem value="">전체</MenuItem>
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
                                    <Select name="status" label="계정상태" value={period} onChange={handleChange}>
                                        <MenuItem value="true">사용</MenuItem>
                                        <MenuItem value="false">미사용</MenuItem>
                                        <MenuItem value="">전체</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} sx={{ mt: 1 }}>
                            <Grid item xs={8} sm={1.2}>
                                <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                    <Stack spacing={0}>사업 계열</Stack>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={2.5}>
                                <FormControl sx={{ m: 0 }} size="small">
                                    <FormControlLabel
                                        control={<Checkbox defaultChecked checked={checked1} onChange={handleChange} />}
                                        label="NFT"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={0.7}></Grid>
                            <Grid item xs={8} sm={2}>
                                <FormControl sx={{ m: 0 }} size="small">
                                    <FormControlLabel
                                        control={<Checkbox defaultChecked checked={checked2} onChange={handleChange} />}
                                        label="DeFi"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} sx={{ mt: 1 }}>
                            <Grid item xs={8} sm={1.2}>
                                <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                    <Stack spacing={0}>네트워크 계열</Stack>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={2.5}>
                                <FormControl sx={{ m: 0 }} size="small">
                                    <FormControlLabel
                                        control={<Checkbox defaultChecked checked={checked3} onChange={handleChange} />}
                                        label="ERC-20"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={0.7}></Grid>
                            <Grid item xs={8} sm={2}>
                                <FormControl sx={{ m: 0 }} size="small">
                                    <FormControlLabel
                                        control={<Checkbox defaultChecked checked={checked4} onChange={handleChange} />}
                                        label="Klatn"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} sx={{ mt: 0 }}>
                            <Grid item xs={8} sm={1.2}>
                                <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                    <Stack spacing={0}>검색어</Stack>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={4}>
                                <FormControl sx={{ m: 0, minHeight: 25, minWidth: 240 }} size="small">
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
