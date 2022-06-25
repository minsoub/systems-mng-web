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
    RadioGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
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
import TabPanel from 'components/TabPanel';

const ProjectMng = (props) => {
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
    const { children, tabindex, index, ...other } = props;

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);

    const [value, setValue] = React.useState(0);

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

    const tabChange = (event, value) => {
        setValue(value);
    };

    return (
        <Grid container alignItems="center" justifyContent="space-between">
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <Grid item xs={8} sm={3}>
                    <Typography variant="h3">재단정보</Typography>
                </Grid>
                <Grid item xs={8} sm={1}>
                    <FormControl sx={{ m: 0 }} size="small">
                        <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                            저장
                        </Button>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Grid item xs={8} sm={1.5} sx={{ mt: 1 }} color="text.secondary">
                    <Typography variant="h5">프로젝트명</Typography>
                </Grid>
                <Grid item xs={8} sm={10.5}>
                    <FormControl sx={{ m: 0 }} fullWidth>
                        <TextField
                            id="start_date"
                            name="start_date"
                            value="{start_date}"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            defaultValue=""
                        />
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Grid item xs={8} sm={1.5} sx={{ mt: 1 }} color="text.secondary">
                    <Typography variant="h5">심볼</Typography>
                </Grid>
                <Grid item xs={8} sm={10.5}>
                    <FormControl sx={{ m: 0 }} fullWidth>
                        <TextField
                            id="start_date"
                            name="start_date"
                            value="{start_date}"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            defaultValue=""
                        />
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Grid item xs={8} sm={1.5} sx={{ mt: 1 }} color="text.secondary">
                    <Typography variant="h5">계약 상태</Typography>
                </Grid>
                <Grid item xs={8} sm={10.5}>
                    <FormControl sx={{ m: 0, minWidth: 380 }} size="small">
                        <Select name="status" value="{period}" onChange={handleChange}>
                            <MenuItem value="true">사용</MenuItem>
                            <MenuItem value="false">미사용</MenuItem>
                            <MenuItem value="">전체</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Grid item xs={8} sm={1.5} sx={{ mt: 1 }} color="text.secondary">
                    <Typography variant="h5">진행 상태</Typography>
                </Grid>
                <Grid item xs={8} sm={10.5}>
                    <FormControl sx={{ m: 0, minWidth: 380 }} size="small">
                        <Select name="status" value="{period}" onChange={handleChange}>
                            <MenuItem value="true">사용</MenuItem>
                            <MenuItem value="false">미사용</MenuItem>
                            <MenuItem value="">전체</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Grid item xs={8} sm={1.5} sx={{ mt: 1 }} color="text.secondary">
                    <Typography variant="h5">관리자 메모</Typography>
                </Grid>
                <Grid item xs={8} sm={10.5}>
                    <FormControl sx={{ m: 0 }} fullWidth>
                        <TextField id="outlined-multiline-static" multiline rows={3} defaultValue="Default Value" />
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 3 }}>
                <Grid item xs={8} sm={3}>
                    <Typography variant="h3">프로젝트 정보</Typography>
                </Grid>
                <Grid item xs={8} sm={1}>
                    <FormControl sx={{ m: 0 }} size="small">
                        <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                            저장
                        </Button>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 1 }}>
                <MainCard sx={{ mt: 1 }} content={false}>
                    <Table sx={{ width: 800 }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">사업계열</TableCell>
                                <TableCell align="center">네트워크 계열</TableCell>
                                <TableCell align="center">백서 링크</TableCell>
                                <TableCell align="center">최초 발행일</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <FormControl sx={{ m: 0, minWidth: 120 }} size="small">
                                    <Select name="status" value="{period}" onChange={handleChange}>
                                        <MenuItem value="true">사용</MenuItem>
                                        <MenuItem value="false">미사용</MenuItem>
                                        <MenuItem value="">전체</MenuItem>
                                    </Select>
                                </FormControl>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <FormControl sx={{ m: 0, minWidth: 120 }} size="small">
                                    <Select name="status" value="{period}" onChange={handleChange}>
                                        <MenuItem value="true">사용</MenuItem>
                                        <MenuItem value="false">미사용</MenuItem>
                                        <MenuItem value="">전체</MenuItem>
                                    </Select>
                                </FormControl>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <FormControl sx={{ m: 0 }} fullWidth>
                                    <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                </FormControl>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <FormControl sx={{ m: 0, minHeight: 25 }} size="small">
                                    <TextField
                                        id="start_date"
                                        name="start_date"
                                        value="{start_date} "
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="date"
                                        defaultValue=""
                                        sx={{ width: 140 }}
                                    />
                                </FormControl>
                            </TableCell>
                        </TableRow>
                    </Table>
                    <Table sx={{ width: 800 }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">컨텍스트 주소</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <FormControl sx={{ m: 0 }} fullWidth>
                                    <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                </FormControl>
                            </TableCell>
                        </TableRow>
                    </Table>
                </MainCard>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 3 }}>
                <Typography variant="h4">담당자 정보</Typography>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <MainCard sx={{ mt: 1 }} content={false}>
                    <Table sx={{ width: 800 }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">이름</TableCell>
                                <TableCell align="center">연락처</TableCell>
                                <TableCell align="center">SNS ID</TableCell>
                                <TableCell align="center">이메일주소</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                -333
                            </TableCell>
                            <TableCell component="th" scope="row">
                                -333
                            </TableCell>
                            <TableCell component="th" scope="row">
                                -33
                            </TableCell>
                            <TableCell component="th" scope="row">
                                -333
                            </TableCell>
                        </TableRow>
                    </Table>
                </MainCard>
            </Grid>

            <Grid container spacing={0} sx={{ mt: 3 }}>
                <Grid item xs={8} sm={3}>
                    <Typography variant="h3">상장 정보</Typography>
                </Grid>
                <Grid item xs={8} sm={1}>
                    <FormControl sx={{ m: 0 }} size="small">
                        <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                            저장
                        </Button>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <MainCard sx={{ mt: 1 }} content={false}>
                    <Table sx={{ width: 800 }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">마켓 정보</TableCell>
                                <TableCell align="center">상장가</TableCell>
                                <TableCell align="center">상장일</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableRow>
                            <TableCell align="center" component="th" scope="row">
                                KRW
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                                <FormControl sx={{ m: 0 }} fullWidth>
                                    <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                </FormControl>
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                                <FormControl sx={{ m: 0, minHeight: 25 }} size="small">
                                    <TextField
                                        id="start_date"
                                        name="start_date"
                                        value="{start_date} "
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="date"
                                        defaultValue=""
                                        sx={{ width: 140 }}
                                    />
                                </FormControl>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center" component="th" scope="row">
                                BTC
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                                <FormControl sx={{ m: 0 }} fullWidth>
                                    <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                </FormControl>
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                                <FormControl sx={{ m: 0, minHeight: 25 }} size="small">
                                    <TextField
                                        id="start_date"
                                        name="start_date"
                                        value="{start_date} "
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="date"
                                        defaultValue=""
                                        sx={{ width: 140 }}
                                    />
                                </FormControl>
                            </TableCell>
                        </TableRow>
                    </Table>
                </MainCard>
            </Grid>

            <Grid container spacing={0} sx={{ mt: 3 }}>
                <Grid item xs={8} sm={3}>
                    <Typography variant="h3">마케팅 수량</Typography>
                </Grid>
                <Grid item xs={8} sm={7}></Grid>
                <Grid item xs={8} sm={1}>
                    <FormControl sx={{ m: 0 }} size="small">
                        <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                            추가
                        </Button>
                    </FormControl>
                </Grid>
                <Grid item xs={8} sm={1}>
                    <FormControl sx={{ m: 0 }} size="small">
                        <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                            저장
                        </Button>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <MainCard sx={{ mt: 1 }} content={false}>
                    <Table sx={{ width: 800 }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">심볼</TableCell>
                                <TableCell align="center">최소 지원 수량</TableCell>
                                <TableCell align="center">실제 상장 지원 수량</TableCell>
                                <TableCell align="center"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableRow>
                            <TableCell align="center" component="th" scope="row">
                                <FormControl sx={{ m: 0 }} fullWidth>
                                    <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                </FormControl>
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                                <FormControl sx={{ m: 0 }} fullWidth>
                                    <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                </FormControl>
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                                <FormControl sx={{ m: 0 }} fullWidth>
                                    <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                </FormControl>
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                                <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                    삭제
                                </Button>
                            </TableCell>
                        </TableRow>
                    </Table>
                </MainCard>
            </Grid>

            <Grid container spacing={0} sx={{ mt: 3 }}>
                <Grid item xs={8} sm={3}>
                    <Typography variant="h3">검토 평가</Typography>
                </Grid>
                <Grid item xs={8} sm={7}></Grid>
                <Grid item xs={8} sm={1}>
                    <FormControl sx={{ m: 0 }} size="small">
                        <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                            추가
                        </Button>
                    </FormControl>
                </Grid>
                <Grid item xs={8} sm={1}>
                    <FormControl sx={{ m: 0 }} size="small">
                        <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                            저장
                        </Button>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <MainCard sx={{ mt: 1 }} content={false}>
                    <Table sx={{ width: 800 }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">평가 기관</TableCell>
                                <TableCell align="center">평가 결과</TableCell>
                                <TableCell align="center">평가 자료</TableCell>
                                <TableCell align="center"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableRow>
                            <TableCell align="center" component="th" scope="row">
                                <FormControl sx={{ m: 0 }} fullWidth>
                                    <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                </FormControl>
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                                <FormControl sx={{ m: 0 }} fullWidth>
                                    <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                </FormControl>
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                                <FormControl sx={{ m: 0 }} fullWidth>
                                    <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                </FormControl>
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                                <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                    삭제
                                </Button>
                            </TableCell>
                        </TableRow>
                    </Table>
                </MainCard>
            </Grid>

            <Grid container spacing={0} sx={{ mt: 3 }}>
                <Grid item xs={8} sm={3}>
                    <Typography variant="h3">프로젝트 연결</Typography>
                </Grid>
                <Grid item xs={8} sm={7}></Grid>
                <Grid item xs={8} sm={1}>
                    <FormControl sx={{ m: 0 }} size="small">
                        <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                            추가
                        </Button>
                    </FormControl>
                </Grid>
                <Grid item xs={8} sm={1}>
                    <FormControl sx={{ m: 0 }} size="small">
                        <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                            저장
                        </Button>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <MainCard sx={{ mt: 1 }} content={false}>
                    <Table sx={{ width: 800 }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">프로젝트 선택</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableRow>
                            <TableCell align="center" component="th" scope="row">
                                <Grid container spacing={0} sx={{ mt: 0 }}>
                                    <Grid item xs={8} sm={8}>
                                        <FormControl sx={{ m: 0 }} fullWidth>
                                            <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={8} sm={0.2}></Grid>
                                    <Grid item xs={8} sm={1}>
                                        <FormControl sx={{ m: 1 }} size="small">
                                            <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                                검색
                                            </Button>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={8} sm={0.2}></Grid>
                                </Grid>
                            </TableCell>
                        </TableRow>
                    </Table>
                </MainCard>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Grid container spacing={0} sx={{ mt: 0 }}>
                    <Grid item xs={8} sm={8}>
                        <FormControl sx={{ m: 0 }} fullWidth>
                            <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                        </FormControl>
                    </Grid>
                    <Grid item xs={8} sm={1.6}></Grid>
                    <Grid item xs={8} sm={1}>
                        <FormControl sx={{ m: 1 }} size="small">
                            <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                연결
                            </Button>
                        </FormControl>
                    </Grid>
                    <Grid item xs={8} sm={0.2}></Grid>
                    <Grid item xs={8} sm={1}>
                        <FormControl sx={{ m: 1 }} size="small">
                            <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                삭제
                            </Button>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ProjectMng;
