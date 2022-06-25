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
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import MainCard from 'components/MainCard';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Input } from 'antd';
import DefaultDataGrid from '../../../components/DataGrid/DefaultDataGrid';
import { styled } from '@mui/material/styles';
import RoleApi from 'apis/roles/roleapi';
import SiteApi from 'apis/site/siteapi';
import ErrorScreen from 'components/ErrorScreen';
import TabPanel from 'components/TabPanel';

const FileMng = (props) => {
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
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        // [`&.${tableCellClasses.head}`]: {
        //     backgroundColor: theme.palette.common.black,
        //     color: theme.palette.common.white
        // },
        [`&.${tableCellClasses.body}`]: {
            backgroundColor: '#cecece', //theme.palette.common.black,
            color: theme.palette.common.black
        }
    }));
    const FontTableCell = styled(TableCell)(({ theme }) => ({
        // [`&.${tableCellClasses.head}`]: {
        //     backgroundColor: theme.palette.common.black,
        //     color: theme.palette.common.white
        // },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 9
        }
    }));

    return (
        <Grid container alignItems="center" justifyContent="space-between">
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <Grid item xs={8} sm={3}>
                    <Typography variant="h4">제출 서류 관리자</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={0} sx={{ mt: 1 }}>
                <MainCard sx={{ mt: 1 }} content={false}>
                    <Table sx={{ width: 1000 }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"></TableCell>
                                <TableCell align="center">URL</TableCell>
                                <TableCell align="center">파일</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <StyledTableCell component="th" scope="row" style={{ width: 120 }}>
                                    거래지원 신청서
                                </StyledTableCell>
                                <TableCell component="th" scope="row" style={{ width: 380 }}>
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Grid item xs={8} sm={9}>
                                            <FormControl sx={{ m: 0, height: 25 }} fullWidth>
                                                <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                        <Grid item xs={8} sm={1}>
                                            <FormControl sx={{ m: 1 }} size="small">
                                                <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                                    저장
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                    </Grid>
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Table sx={{ minWidth: 250 }} size="small" aria-label="a dense table">
                                            <TableRow>
                                                <FontTableCell style={{ width: 80 }}>사용자 아이디</FontTableCell>
                                                <FontTableCell>링크 URL</FontTableCell>
                                                <FontTableCell>2020-04-10</FontTableCell>
                                            </TableRow>
                                        </Table>
                                    </Grid>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Grid item xs={8} sm={2.5}>
                                            <FormControl sx={{ m: 1 }} size="small">
                                                <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                                    파일 업로드
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                        <Grid item xs={8} sm={6.5}>
                                            <FormControl sx={{ m: 0 }} fullWidth>
                                                <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                    </Grid>
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Grid item xs={8} sm={10}>
                                            <Table sx={{ minWidth: 150 }} size="small" aria-label="a dense table">
                                                <TableRow>
                                                    <FontTableCell style={{ width: 80 }}>사용자 아이디</FontTableCell>
                                                    <FontTableCell>파일명 URL</FontTableCell>
                                                    <FontTableCell>2020-04-10</FontTableCell>
                                                </TableRow>
                                            </Table>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell component="th" scope="row">
                                    개인정보 수집 및 이용동의서
                                </StyledTableCell>
                                <TableCell component="th" scope="row">
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Grid item xs={8} sm={9}>
                                            <FormControl sx={{ m: 0, height: 25 }} fullWidth>
                                                <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                        <Grid item xs={8} sm={1}>
                                            <FormControl sx={{ m: 1 }} size="small">
                                                <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                                    저장
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                    </Grid>
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Table sx={{ minWidth: 250 }} size="small" aria-label="a dense table">
                                            <TableRow>
                                                <FontTableCell>사용자 아이디</FontTableCell>
                                                <FontTableCell align="right">링크 URL</FontTableCell>
                                                <FontTableCell align="right">2020-04-10</FontTableCell>
                                            </TableRow>
                                        </Table>
                                    </Grid>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Grid item xs={8} sm={4}>
                                            <FormControl sx={{ m: 1 }} size="small">
                                                <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                                    파일 업로드
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                        <Grid item xs={8} sm={7}>
                                            <FormControl sx={{ m: 0 }} fullWidth>
                                                <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                    </Grid>
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Table sx={{ minWidth: 250 }} size="small" aria-label="a dense table">
                                            <TableRow>
                                                <FontTableCell>사용자 아이디</FontTableCell>
                                                <FontTableCell align="right">파일명 URL</FontTableCell>
                                                <FontTableCell align="right">2020-04-10</FontTableCell>
                                            </TableRow>
                                        </Table>
                                    </Grid>
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <StyledTableCell component="th" scope="row" style={{ width: 120 }}>
                                    프로젝트 백서
                                </StyledTableCell>
                                <TableCell component="th" scope="row">
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Grid item xs={8} sm={9}>
                                            <FormControl sx={{ m: 0, height: 25 }} fullWidth>
                                                <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                        <Grid item xs={8} sm={1}>
                                            <FormControl sx={{ m: 1 }} size="small">
                                                <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                                    저장
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                    </Grid>
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Table sx={{ minWidth: 250 }} size="small" aria-label="a dense table">
                                            <TableRow>
                                                <FontTableCell>사용자 아이디</FontTableCell>
                                                <FontTableCell align="right">링크 URL</FontTableCell>
                                                <FontTableCell align="right">2020-04-10</FontTableCell>
                                            </TableRow>
                                        </Table>
                                    </Grid>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Grid item xs={8} sm={4}>
                                            <FormControl sx={{ m: 1 }} size="small">
                                                <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                                    파일 업로드
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                        <Grid item xs={8} sm={7}>
                                            <FormControl sx={{ m: 0 }} fullWidth>
                                                <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                    </Grid>
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Table sx={{ minWidth: 250 }} size="small" aria-label="a dense table">
                                            <TableRow>
                                                <FontTableCell>사용자 아이디</FontTableCell>
                                                <FontTableCell align="right">파일명 URL</FontTableCell>
                                                <FontTableCell align="right">2020-04-10</FontTableCell>
                                            </TableRow>
                                        </Table>
                                    </Grid>
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <StyledTableCell component="th" scope="row" style={{ width: 120 }}>
                                    기술검토 보고서
                                </StyledTableCell>
                                <TableCell component="th" scope="row">
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Grid item xs={8} sm={9}>
                                            <FormControl sx={{ m: 0, height: 25 }} fullWidth>
                                                <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                        <Grid item xs={8} sm={1}>
                                            <FormControl sx={{ m: 1 }} size="small">
                                                <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                                    저장
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                    </Grid>
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Table sx={{ minWidth: 250 }} size="small" aria-label="a dense table">
                                            <TableRow>
                                                <FontTableCell>사용자 아이디</FontTableCell>
                                                <FontTableCell align="right">링크 URL</FontTableCell>
                                                <FontTableCell align="right">2020-04-10</FontTableCell>
                                            </TableRow>
                                        </Table>
                                    </Grid>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Grid item xs={8} sm={4}>
                                            <FormControl sx={{ m: 1 }} size="small">
                                                <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                                    파일 업로드
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                        <Grid item xs={8} sm={7}>
                                            <FormControl sx={{ m: 0 }} fullWidth>
                                                <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                    </Grid>
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Table sx={{ minWidth: 250 }} size="small" aria-label="a dense table">
                                            <TableRow>
                                                <FontTableCell>사용자 아이디</FontTableCell>
                                                <FontTableCell align="right">파일명 URL</FontTableCell>
                                                <FontTableCell align="right">2020-04-10</FontTableCell>
                                            </TableRow>
                                        </Table>
                                    </Grid>
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <StyledTableCell component="th" scope="row" style={{ width: 120 }}>
                                    토큰 세일 및 분배 계획서
                                </StyledTableCell>
                                <TableCell component="th" scope="row">
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Grid item xs={8} sm={9}>
                                            <FormControl sx={{ m: 0, height: 25 }} fullWidth>
                                                <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                        <Grid item xs={8} sm={1}>
                                            <FormControl sx={{ m: 1 }} size="small">
                                                <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                                    저장
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                    </Grid>
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Table sx={{ minWidth: 250 }} size="small" aria-label="a dense table">
                                            <TableRow>
                                                <FontTableCell>사용자 아이디</FontTableCell>
                                                <FontTableCell align="right">링크 URL</FontTableCell>
                                                <FontTableCell align="right">2020-04-10</FontTableCell>
                                            </TableRow>
                                        </Table>
                                    </Grid>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Grid item xs={8} sm={4}>
                                            <FormControl sx={{ m: 1 }} size="small">
                                                <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                                    파일 업로드
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                        <Grid item xs={8} sm={7}>
                                            <FormControl sx={{ m: 0 }} fullWidth>
                                                <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                    </Grid>
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Table sx={{ minWidth: 250 }} size="small" aria-label="a dense table">
                                            <TableRow>
                                                <FontTableCell>사용자 아이디</FontTableCell>
                                                <FontTableCell align="right">파일명 URL</FontTableCell>
                                                <FontTableCell align="right">2020-04-10</FontTableCell>
                                            </TableRow>
                                        </Table>
                                    </Grid>
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <StyledTableCell component="th" scope="row" style={{ width: 120 }}>
                                    법률검토의견서
                                </StyledTableCell>
                                <TableCell component="th" scope="row">
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Grid item xs={8} sm={9}>
                                            <FormControl sx={{ m: 0, height: 25 }} fullWidth>
                                                <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                        <Grid item xs={8} sm={1}>
                                            <FormControl sx={{ m: 1 }} size="small">
                                                <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                                    저장
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                    </Grid>
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Table sx={{ minWidth: 250 }} size="small" aria-label="a dense table">
                                            <TableRow>
                                                <FontTableCell>사용자 아이디</FontTableCell>
                                                <FontTableCell align="right">링크 URL</FontTableCell>
                                                <FontTableCell align="right">2020-04-10</FontTableCell>
                                            </TableRow>
                                        </Table>
                                    </Grid>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Grid item xs={8} sm={4}>
                                            <FormControl sx={{ m: 1 }} size="small">
                                                <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                                    파일 업로드
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                        <Grid item xs={8} sm={7}>
                                            <FormControl sx={{ m: 0 }} fullWidth>
                                                <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                    </Grid>
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Table sx={{ minWidth: 250 }} size="small" aria-label="a dense table">
                                            <TableRow>
                                                <FontTableCell>사용자 아이디</FontTableCell>
                                                <FontTableCell align="right">파일명 URL</FontTableCell>
                                                <FontTableCell align="right">2020-04-10</FontTableCell>
                                            </TableRow>
                                        </Table>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell component="th" scope="row" style={{ width: 120 }}>
                                    사업자 등록증
                                </StyledTableCell>
                                <TableCell component="th" scope="row">
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Grid item xs={8} sm={9}>
                                            <FormControl sx={{ m: 0, height: 25 }} fullWidth>
                                                <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                        <Grid item xs={8} sm={1}>
                                            <FormControl sx={{ m: 1 }} size="small">
                                                <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                                    저장
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                    </Grid>
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Table sx={{ minWidth: 250 }} size="small" aria-label="a dense table">
                                            <TableRow>
                                                <FontTableCell>사용자 아이디</FontTableCell>
                                                <FontTableCell align="right">링크 URL</FontTableCell>
                                                <FontTableCell align="right">2020-04-10</FontTableCell>
                                            </TableRow>
                                        </Table>
                                    </Grid>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Grid item xs={8} sm={4}>
                                            <FormControl sx={{ m: 1 }} size="small">
                                                <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                                    파일 업로드
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                        <Grid item xs={8} sm={7}>
                                            <FormControl sx={{ m: 0 }} fullWidth>
                                                <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                    </Grid>
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Table sx={{ minWidth: 250 }} size="small" aria-label="a dense table">
                                            <TableRow>
                                                <FontTableCell>사용자 아이디</FontTableCell>
                                                <FontTableCell align="right">파일명 URL</FontTableCell>
                                                <FontTableCell align="right">2020-04-10</FontTableCell>
                                            </TableRow>
                                        </Table>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell component="th" scope="row" style={{ width: 120 }}>
                                    윤리서약서
                                </StyledTableCell>
                                <TableCell component="th" scope="row">
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Grid item xs={8} sm={9}>
                                            <FormControl sx={{ m: 0, height: 25 }} fullWidth>
                                                <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                        <Grid item xs={8} sm={1}>
                                            <FormControl sx={{ m: 1 }} size="small">
                                                <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                                    저장
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                    </Grid>
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Table sx={{ minWidth: 250 }} size="small" aria-label="a dense table">
                                            <TableRow>
                                                <FontTableCell>사용자 아이디</FontTableCell>
                                                <FontTableCell align="right">링크 URL</FontTableCell>
                                                <FontTableCell align="right">2020-04-10</FontTableCell>
                                            </TableRow>
                                        </Table>
                                    </Grid>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Grid item xs={8} sm={4}>
                                            <FormControl sx={{ m: 1 }} size="small">
                                                <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                                    파일 업로드
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                        <Grid item xs={8} sm={7}>
                                            <FormControl sx={{ m: 0 }} fullWidth>
                                                <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                    </Grid>
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Table sx={{ minWidth: 250 }} size="small" aria-label="a dense table">
                                            <TableRow>
                                                <FontTableCell>사용자 아이디</FontTableCell>
                                                <FontTableCell align="right">파일명 URL</FontTableCell>
                                                <FontTableCell align="right">2020-04-10</FontTableCell>
                                            </TableRow>
                                        </Table>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell component="th" scope="row" style={{ width: 120 }}>
                                    규제준수 확약서
                                </StyledTableCell>
                                <TableCell component="th" scope="row">
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Grid item xs={8} sm={9}>
                                            <FormControl sx={{ m: 0, height: 25 }} fullWidth>
                                                <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                        <Grid item xs={8} sm={1}>
                                            <FormControl sx={{ m: 1 }} size="small">
                                                <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                                    저장
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                    </Grid>
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Table sx={{ minWidth: 250 }} size="small" aria-label="a dense table">
                                            <TableRow>
                                                <FontTableCell>사용자 아이디</FontTableCell>
                                                <FontTableCell align="right">링크 URL</FontTableCell>
                                                <FontTableCell align="right">2020-04-10</FontTableCell>
                                            </TableRow>
                                        </Table>
                                    </Grid>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Grid item xs={8} sm={4}>
                                            <FormControl sx={{ m: 1 }} size="small">
                                                <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                                    파일 업로드
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                        <Grid item xs={8} sm={7}>
                                            <FormControl sx={{ m: 0 }} fullWidth>
                                                <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                    </Grid>
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Table sx={{ minWidth: 250 }} size="small" aria-label="a dense table">
                                            <TableRow>
                                                <FontTableCell>사용자 아이디</FontTableCell>
                                                <FontTableCell align="right">파일명 URL</FontTableCell>
                                                <FontTableCell align="right">2020-04-10</FontTableCell>
                                            </TableRow>
                                        </Table>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell component="th" scope="row" style={{ width: 120 }}>
                                    기타
                                </StyledTableCell>
                                <TableCell component="th" scope="row">
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Grid item xs={8} sm={9}>
                                            <FormControl sx={{ m: 0, height: 25 }} fullWidth>
                                                <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                        <Grid item xs={8} sm={1}>
                                            <FormControl sx={{ m: 1 }} size="small">
                                                <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                                    저장
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                    </Grid>
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Table sx={{ minWidth: 250 }} size="small" aria-label="a dense table">
                                            <TableRow>
                                                <FontTableCell>사용자 아이디</FontTableCell>
                                                <FontTableCell align="right">링크 URL</FontTableCell>
                                                <FontTableCell align="right">2020-04-10</FontTableCell>
                                            </TableRow>
                                        </Table>
                                    </Grid>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Grid item xs={8} sm={4}>
                                            <FormControl sx={{ m: 1 }} size="small">
                                                <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                                    파일 업로드
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                        <Grid item xs={8} sm={7}>
                                            <FormControl sx={{ m: 0 }} fullWidth>
                                                <TextField id="outlined-multiline-static" defaultValue="Default Value" />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={8} sm={0.2}></Grid>
                                    </Grid>
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Table sx={{ minWidth: 250 }} size="small" aria-label="a dense table">
                                            <TableRow>
                                                <FontTableCell>사용자 아이디</FontTableCell>
                                                <FontTableCell align="right">파일명 URL</FontTableCell>
                                                <FontTableCell align="right">2020-04-10</FontTableCell>
                                            </TableRow>
                                        </Table>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default FileMng;
