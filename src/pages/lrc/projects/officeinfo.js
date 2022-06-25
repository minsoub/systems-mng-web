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

const OfficeInfo = (props) => {
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
                    <Typography variant="h3">위믹스(WEMIX)</Typography>
                </Grid>
                <Grid item xs={8} sm={1}>
                    <FormControl sx={{ m: 0 }} size="small">
                        <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                            접수중
                        </Button>
                    </FormControl>
                </Grid>
                <Grid item xs={8} sm={2}></Grid>
                <Grid item xs={8} sm={3} sx={{ m: 1 }}>
                    <Typography variant="h6">[체크리스트] 미작성</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 1 }}>
                <FormControl sx={{ m: 0 }} fullWidth>
                    <TextField id="outlined-multiline-static" multiline rows={3} defaultValue="Default Value" />
                </FormControl>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Typography variant="h4">프로젝트 정보</Typography>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 1 }}>
                <MainCard sx={{ mt: 1 }} content={false}>
                    <Table sx={{ width: 900 }} stickyHeader aria-label="simple table">
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
                    <Table sx={{ width: 900 }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">컨텍스트 주소</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                http://33333asdfasffasfasfasfasfasfasfsafasfasfasfasfasffasfasfasfasfasfasfas
                            </TableCell>
                        </TableRow>
                    </Table>
                </MainCard>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Typography variant="h4">담당자 정보</Typography>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <MainCard sx={{ mt: 1 }} content={false}>
                    <Table sx={{ width: 900 }} stickyHeader aria-label="simple table">
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

            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Typography variant="h4">상장 정보</Typography>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <MainCard sx={{ mt: 1 }} content={false}>
                    <Table sx={{ width: 900 }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">마켓 정보</TableCell>
                                <TableCell align="center">상장일</TableCell>
                                <TableCell align="center">상장가 (원)</TableCell>
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
                        </TableRow>
                    </Table>
                </MainCard>
            </Grid>

            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Typography variant="h4">마케팅 수량</Typography>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <MainCard sx={{ mt: 1 }} content={false}>
                    <Table sx={{ width: 900 }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">심볼</TableCell>
                                <TableCell align="center">최소 지원 수량</TableCell>
                                <TableCell align="center">실제 상장 지원 수량</TableCell>
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
                        </TableRow>
                    </Table>
                </MainCard>
            </Grid>

            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Typography variant="h4">검토 평가</Typography>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <MainCard sx={{ mt: 1 }} content={false}>
                    <Table sx={{ width: 900 }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">평가 기관</TableCell>
                                <TableCell align="center">평가 결과</TableCell>
                                <TableCell align="center">평가 자료</TableCell>
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
                        </TableRow>
                    </Table>
                </MainCard>
            </Grid>

            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Typography variant="h4">서류 제출 현황</Typography>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <MainCard sx={{ mt: 1 }} content={false}>
                    <Table sx={{ width: 900 }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">거래지원 신청서</TableCell>
                                <TableCell align="center">개인정보 수집 및 이용동의</TableCell>
                                <TableCell align="center">프로젝트 백서</TableCell>
                                <TableCell align="center">기술 검토 보고서</TableCell>
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
                                -33
                            </TableCell>
                        </TableRow>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">토큰 세일 및 분배 계획서</TableCell>
                                <TableCell align="center">법률검토의견서</TableCell>
                                <TableCell align="center">사업자 등록증</TableCell>
                                <TableCell align="center">윤리서약서</TableCell>
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
                                -33
                            </TableCell>
                        </TableRow>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">규제준수 확약서</TableCell>
                                <TableCell align="center">기타</TableCell>
                                <TableCell align="center"></TableCell>
                                <TableCell align="center"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                -333
                            </TableCell>
                            <TableCell component="th" scope="row">
                                -333
                            </TableCell>
                            <TableCell component="th" scope="row"></TableCell>
                            <TableCell component="th" scope="row"></TableCell>
                        </TableRow>
                    </Table>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default OfficeInfo;
