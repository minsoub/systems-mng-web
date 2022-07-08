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
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import ErrorScreen from 'components/ErrorScreen';
import TabPanel from 'components/TabPanel';
import FoundationApi from 'apis/lrc/project/foundationapi';
import StatusApi from 'apis/lrc/status/statusapi';
import NumberFormat from 'react-number-format';
import moment from 'moment';

const OfficeInfo = (props) => {
    const navigate = useNavigate();
    const [
        responseData,
        requestError,
        Loading,
        {
            foundationSearch,
            marketingSearch,
            reviewSearch,
            projectSearch,
            userSearch,
            icoSearch,
            officeSearch,
            fileSearch,
            docSearch,
            projectLinkListSearch
        }
    ] = FoundationApi();
    const [resData, reqErr, resLoading, { statusSearch }] = StatusApi();
    const { projectId, children, tabindex, index, ...other } = props;

    ////////////////////////////////////////////////////
    // 공통 에러 처리
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    ////////////////////////////////////////////////////

    // 출력 정보 조회 데이터
    const [officeInfo, setOfficeInfo] = useState({}); // 재단정보
    const [projectLink, setProjectLink] = useState([]); // 프로젝트 연결 리스트.
    const [projecInfo, setProjectInfo] = useState({}); // 프로젝트 정보
    const [userList, setUserList] = useState([]); // User 정보
    const [icoList, setIcoList] = useState([]); // ICO 정보
    const [marketingList, setMarketingList] = useState([]); // 마켓팅 수량
    const [reviewList, setReviewList] = useState([]); // 검토평가 리스트
    // 서류제출 현황 항목 정의
    const [file1, setFile1] = useState({}); // 거래지원 신청서
    const [file2, setFile2] = useState({}); // 개인정보 수집 및 이용동의서
    const [file3, setFile3] = useState({}); // 프로젝트 백서
    const [file4, setFile4] = useState({}); // 기술검토보고서
    const [file5, setFile5] = useState({}); // 토큰세일 및 분배 계획서
    const [file6, setFile6] = useState({}); // 법률 검토 의견서
    const [file7, setFile7] = useState({}); // 사업자 등록증
    const [file8, setFile8] = useState({}); // 윤리서약서
    const [file9, setFile9] = useState({}); // 규제준수 확약서
    const [file10, setFile10] = useState({}); // 기타

    // onload
    useEffect(() => {
        //siteSearch(true, '');
        //roleList();
        // 7. 서류 제출 현황 조회
        fileSearch(projectId);
        // 1. 재단정보 조회
        officeSearch(projectId);
        // 1.1 프로젝트 연결 조회
        projectLinkListSearch(projectId);
        // 2. 프로젝트 정보 조회
        projectSearch(projectId);
        // 3. 담당자 정보 조회
        userSearch(projectId);
        // 4. 상장 정보 조회
        icoSearch(projectId);
        // 5. 마케팅 수량 정보 조회
        marketingSearch(projectId);
        // 6. 검토 평가 조회
        reviewSearch(projectId);
        // 7.1 URL 서류 제출 현황 조회
        docSearch(projectId);
    }, [projectId]);

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

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getFoundationInfo':
                if (responseData.data.data) {
                    setOfficeInfo(responseData.data.data);
                } else {
                    setOfficeInfo({});
                }
                break;
            case 'getProjectLinkList': // 프로젝트 연결 리스트
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setProjectLink(responseData.data.data);
                } else {
                    setProjectLink([]);
                }
                break;
            case 'getProjectList':
                if (responseData.data.data) {
                    setProjectInfo(responseData.data.data);
                } else {
                    setProjectInfo({});
                }
                break;
            case 'getUserList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setUserList(responseData.data.data);
                } else {
                    setUserList([]);
                }
                break;
            case 'getIcoList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setIcoList(responseData.data.data);
                } else {
                    setIcoList([]);
                }
                break;
            case 'getMarketingList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setMarketingList(responseData.data.data);
                } else {
                    setMarketingList([]);
                }
                break;
            case 'getReviewList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setReviewList(responseData.data.data);
                } else {
                    setReviewList([]);
                }
                break;
            case 'getFileList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    let files = responseData.data.data;
                    // 첫번째 데이터 들이 최신 데이터들이다.
                    files.map((item, index) => {
                        let name = '';
                        if (item.create_admin_account_id) {
                            name = '관리자';
                        } else {
                            name = '사용자';
                        }
                        let data = { item: `문서 추가(${name})`, item1: `${item.create_date}`, d: item.create_date };
                        //console.log(data);
                        if (item.type === 'IPO_APPLICATION') {
                            if (!file1.item) setFile1(data);
                            console.log(file1);
                        } else if (item.type === 'COLLECT_CONFIRM') {
                            if (!file2.item) setFile2(data);
                        } else if (item.type === 'PROJECT_WHITEPAPER') {
                            if (!file3.item) setFile3(data);
                        } else if (item.type === 'TECH_REVIEW_REPORT') {
                            if (!file4.item) setFile4(data);
                        } else if (item.type === 'TOKEN_DIVISION_PLAN') {
                            if (!file5.item) setFile5(data);
                        } else if (item.type === 'LEGAL_REVIEW') {
                            if (!file6.item) setFile6(data);
                        } else if (item.type === 'BUSINESS_LICENSE') {
                            if (!file7.item) setFile7(data);
                        } else if (item.type === 'ETHICAL_WRITE_AUTH') {
                            if (!file8.item) setFile8(data);
                        } else if (item.type === 'REGULATORY_COMPLIANCE') {
                            if (!file9.item) setFile9(data);
                        } else if (item.type === 'ETC') {
                            if (!file10.item) setFile10(data);
                        }
                    });
                }
                break;
            case 'getDocList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    let docs = responseData.data.data;
                    // 첫번째 데이터 들이 최신 데이터들이다.
                    docs.map((item, index) => {
                        let name = '';
                        if (item.create_admin_account_id) {
                            name = '관리자';
                        } else {
                            name = '사용자';
                        }
                        let data = { item: `URL 추가(${name})`, item1: `${item.create_date}`, d: item.create_date };
                        if (item.type === 'IPO_APPLICATION') {
                            if (!file1.item) setFile1(data);
                            else {
                                // 날짜 비교
                                if (moment(item.create_date).isAfter(file1.d)) {
                                    setFile1(data);
                                }
                            }
                        } else if (item.type === 'COLLECT_CONFIRM') {
                            if (!file2.item) setFile2(data);
                            else {
                                // 날짜 비교
                                if (moment(item.create_date).isAfter(file2.d)) {
                                    setFile2(data);
                                }
                            }
                        } else if (item.type === 'PROJECT_WHITEPAPER') {
                            if (!file3.item) setFile3(data);
                            else {
                                // 날짜 비교
                                if (moment(item.create_date).isAfter(file3.d)) {
                                    setFile3(data);
                                }
                            }
                        } else if (item.type === 'TECH_REVIEW_REPORT') {
                            if (!file4.item) setFile4(data);
                            else {
                                // 날짜 비교
                                if (moment(item.create_date).isAfter(file4.d)) {
                                    setFile4(data);
                                }
                            }
                        } else if (item.type === 'TOKEN_DIVISION_PLAN') {
                            if (!file5.item) setFile5(data);
                            else {
                                // 날짜 비교
                                if (moment(item.create_date).isAfter(file5.d)) {
                                    setFile5(data);
                                }
                            }
                        } else if (item.type === 'LEGAL_REVIEW') {
                            if (!file6.item) setFile6(data);
                            else {
                                // 날짜 비교
                                if (moment(item.create_date).isAfter(file6.d)) {
                                    setFile6(data);
                                }
                            }
                        } else if (item.type === 'BUSINESS_LICENSE') {
                            if (!file7.item) setFile7(data);
                            else {
                                // 날짜 비교
                                if (moment(item.create_date).isAfter(file7.d)) {
                                    setFile7(data);
                                }
                            }
                        } else if (item.type === 'ETHICAL_WRITE_AUTH') {
                            if (!file8.item) setFile8(data);
                            else {
                                // 날짜 비교
                                if (moment(item.create_date).isAfter(file8.d)) {
                                    setFile8(data);
                                }
                            }
                        } else if (item.type === 'REGULATORY_COMPLIANCE') {
                            if (!file9.item) setFile9(data);
                            else {
                                // 날짜 비교
                                if (moment(item.create_date).isAfter(file9.d)) {
                                    setFile9(data);
                                }
                            }
                        } else if (item.type === 'ETC') {
                            if (!file10.item) setFile10(data);
                            else {
                                // 날짜 비교
                                if (moment(item.create_date).isAfter(file10.d)) {
                                    setFile10(data);
                                }
                            }
                        }
                    });
                }
                break;
            default:
                break;
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
            case 'project_link':
                if (e.target.value === '') return;
                console.log(e.target.value);
                navigate('/projects/detail/' + e.target.value);
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
                <Grid item xs={8} sm={4}>
                    <Typography variant="h3">
                        {officeInfo.project_name}({officeInfo.symbol})
                    </Typography>
                </Grid>
                <Grid item xs={8} sm={1}>
                    <FormControl sx={{ m: 0 }} size="small">
                        <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                            {officeInfo.contract_name}
                        </Button>
                    </FormControl>
                </Grid>
                <Grid item xs={8} sm={1}></Grid>
                <Grid item xs={8} sm={3} sx={{ m: 1 }}>
                    <Typography variant="h6">{officeInfo.process_name}</Typography>
                </Grid>
                <Grid item xs={8} sm={2} sx={{ m: 0 }}>
                    <FormControl sx={{ m: 0.5, minWidth: 200, minHeight: 30 }} size="small">
                        <Select name="project_link" label="연결 프로젝트 선택" onChange={handleChange}>
                            <MenuItem value="">
                                <em>연결 프로젝트 선택</em>
                            </MenuItem>
                            {projectLink.map((item, index) => (
                                <MenuItem key={index} value={item.link_project_id}>
                                    {item.link_project_name} ( {item.link_project_symbol} )
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={8} sm={0.2}></Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 1 }}>
                <FormControl sx={{ m: 0 }} fullWidth>
                    <TextField id="outlined-multiline-static" multiline rows={3} defaultValue={officeInfo.admin_memo} />
                </FormControl>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Typography variant="h4">프로젝트 정보</Typography>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 1 }}>
                <MainCard sx={{ mt: 1 }} content={false} style={{ width: '100%' }}>
                    <Table
                        fixedheader={false}
                        style={{ border: 1, width: '100%', tableLayout: 'auto' }}
                        stickyHeader
                        aria-label="simple table"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: '25%' }} align="center">
                                    사업계열
                                </TableCell>
                                <TableCell style={{ width: '25%' }} align="center">
                                    네트워크 계열
                                </TableCell>
                                <TableCell style={{ width: '25%' }} align="center">
                                    백서 링크
                                </TableCell>
                                <TableCell style={{ width: '25%' }} align="center">
                                    최초 발행일
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {projecInfo && (
                            <TableRow>
                                <TableCell style={{ width: '25%' }} align="center" component="th" scope="row">
                                    {projecInfo.business_name}
                                </TableCell>
                                <TableCell style={{ width: '25%' }} align="center" component="th" scope="row">
                                    {projecInfo.network_name}
                                </TableCell>
                                <TableCell style={{ width: '25%' }} align="center" component="th" scope="row">
                                    {projecInfo.whitepaper_link}
                                </TableCell>
                                <TableCell style={{ width: '25%' }} align="center" component="th" scope="row">
                                    {projecInfo.create_date}
                                </TableCell>
                            </TableRow>
                        )}
                    </Table>
                    <Table fixedheader={false} style={{ width: '100%', tableLayout: 'auto' }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">컨텍스트 주소</TableCell>
                            </TableRow>
                        </TableHead>
                        {projecInfo && (
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    {projecInfo.contract_address}
                                </TableCell>
                            </TableRow>
                        )}
                    </Table>
                </MainCard>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Typography variant="h4">담당자 정보</Typography>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <MainCard sx={{ mt: 1 }} content={false} style={{ width: '100%' }}>
                    <Table fixedHeader={false} style={{ width: '100%', tableLayout: 'auto' }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: '25%' }} align="center">
                                    이름
                                </TableCell>
                                <TableCell style={{ width: '25%' }} align="center">
                                    연락처
                                </TableCell>
                                <TableCell style={{ width: '25%' }} align="center">
                                    SNS ID
                                </TableCell>
                                <TableCell style={{ width: '25%' }} align="center">
                                    이메일주소
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {userList.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell style={{ width: '25%' }} align="center" component="th" scope="row">
                                    {item.user_name}
                                </TableCell>
                                <TableCell style={{ width: '25%' }} align="center" component="th" scope="row">
                                    {item.phone}
                                </TableCell>
                                <TableCell style={{ width: '25%' }} align="center" component="th" scope="row">
                                    {item.sns_id}
                                </TableCell>
                                <TableCell style={{ width: '25%' }} align="center" component="th" scope="row">
                                    {item.email}
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </MainCard>
            </Grid>

            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Typography variant="h4">상장 정보</Typography>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <MainCard sx={{ mt: 1 }} content={false} style={{ width: '100%' }}>
                    <Table fixedheader={false} style={{ width: '100%', tableLayout: 'auto' }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">마켓 정보</TableCell>
                                <TableCell align="center">상장일</TableCell>
                                <TableCell align="center">상장가 (원)</TableCell>
                            </TableRow>
                        </TableHead>
                        {icoList.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell style={{ width: '33%' }} align="center" component="th" scope="row">
                                    {item.market_info}
                                </TableCell>
                                <TableCell style={{ width: '33%' }} align="center" component="th" scope="row">
                                    {item.ico_date}
                                </TableCell>
                                <TableCell style={{ width: '33%' }} align="center" component="th" scope="row">
                                    <NumberFormat value={item.price} displayType={'text'} thousandSeparator={true} prefix={''} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </MainCard>
            </Grid>

            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Typography variant="h4">마케팅 수량</Typography>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <MainCard sx={{ mt: 1 }} content={false} style={{ width: '100%' }}>
                    <Table fixedheader={false} style={{ width: '100%', tableLayout: 'auto' }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">심볼</TableCell>
                                <TableCell align="center">최소 지원 수량</TableCell>
                                <TableCell align="center">실제 상장 지원 수량</TableCell>
                            </TableRow>
                        </TableHead>
                        {marketingList.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell style={{ width: '33%' }} align="center" component="th" scope="row">
                                    {item.symbol}
                                </TableCell>
                                <TableCell style={{ width: '33%' }} align="center" component="th" scope="row">
                                    <NumberFormat value={item.minimum_quantity} displayType={'text'} thousandSeparator={true} prefix={''} />
                                </TableCell>
                                <TableCell style={{ width: '33%' }} align="center" component="th" scope="row">
                                    <NumberFormat value={item.actual_quantity} displayType={'text'} thousandSeparator={true} prefix={''} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </MainCard>
            </Grid>

            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Typography variant="h4">검토 평가</Typography>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <MainCard sx={{ mt: 1 }} content={false} style={{ width: '100%' }}>
                    <Table fixedheader={false} style={{ width: '100%', tableLayout: 'auto' }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">평가 기관</TableCell>
                                <TableCell align="center">평가 결과</TableCell>
                                <TableCell align="center">평가 자료</TableCell>
                            </TableRow>
                        </TableHead>
                        {reviewList.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell style={{ width: '33%' }} align="center" component="th" scope="row">
                                    {item.organization}
                                </TableCell>
                                <TableCell style={{ width: '33%' }} align="center" component="th" scope="row">
                                    {item.result}
                                </TableCell>
                                <TableCell style={{ width: '33%' }} align="center" component="th" scope="row">
                                    {item.reference}
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </MainCard>
            </Grid>

            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Typography variant="h4">서류 제출 현황</Typography>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <MainCard sx={{ mt: 1 }} content={false} style={{ width: '100%' }}>
                    <Table fixedheader={false} style={{ width: '100%', tableLayout: 'auto' }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">거래지원 신청서</TableCell>
                                <TableCell align="center">개인정보 수집 및 이용동의</TableCell>
                                <TableCell align="center">프로젝트 백서</TableCell>
                                <TableCell align="center">기술 검토 보고서</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableRow>
                            <TableCell component="th" scope="row" align="center">
                                {file1.item}
                                <br />
                                {file1.item1}
                            </TableCell>
                            <TableCell component="th" scope="row" align="center">
                                {file2.item}
                                <br />
                                {file2.item1}
                            </TableCell>
                            <TableCell component="th" scope="row" align="center">
                                {file3.item}
                                <br />
                                {file3.item1}
                            </TableCell>
                            <TableCell component="th" scope="row" align="center">
                                {file4.item}
                                <br />
                                {file4.item1}
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
                            <TableCell component="th" scope="row" align="center">
                                {file5.item}
                                <br />
                                {file5.item1}
                            </TableCell>
                            <TableCell component="th" scope="row" align="center">
                                {file6.item}
                                <br />
                                {file6.item1}
                            </TableCell>
                            <TableCell component="th" scope="row" align="center">
                                {file7.item}
                                <br />
                                {file7.item1}
                            </TableCell>
                            <TableCell component="th" scope="row" align="center">
                                {file8.item}
                                <br />
                                {file8.item1}
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
                            <TableCell component="th" scope="row" align="center">
                                {file9.item}
                                <br />
                                {file9.item1}
                            </TableCell>
                            <TableCell component="th" scope="row" align="center">
                                {file10.item}
                                <br />
                                {file10.item1}
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