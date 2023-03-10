import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    FormControl,
    Grid,
    MenuItem,
    Select,
    Stack,
    Table,
    TableCell,
    TableHead,
    TableBody,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import { LinkOutlined } from '@ant-design/icons';
import FoundationApi from 'apis/lrc/project/foundationapi';
import StatusApi from 'apis/lrc/status/statusapi';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import ContentLine from '../../../components/Common/ContentLine';
import TopInputLayout from '../../../components/Common/TopInputLayout';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import DropInput from '../../../components/Common/DropInput';
import './styles.scss';
import cx from 'classnames';
import FlexBox from '../../../components/Common/FlexBox';
import PrivateReasonDialog from '../../popup/PrivateResonPopup';
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
            userUnMaskingSearch,
            createUserSearch,
            icoSearch,
            officeSearch,
            fileSearch,
            docSearch,
            projectLinkListSearch,
            fileReviewDownload
        }
    ] = FoundationApi();
    const [resData, reqErr, resLoading, { statusSearch }] = StatusApi();
    const { projectId, chatClose, children, tabindex, index, ...other } = props;

    // Log reason Dialog
    const [openReason, setOpenReason] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');

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
    const [file1, setFile1] = useState([]); // 거래지원 신청서
    const [file2, setFile2] = useState([]); // 개인정보 수집 및 이용동의서
    const [file3, setFile3] = useState([]); // 프로젝트 백서
    const [file4, setFile4] = useState([]); // 기술검토보고서
    const [file5, setFile5] = useState([]); // 토큰세일 및 분배 계획서
    const [file6, setFile6] = useState([]); // 법률 검토 의견서
    const [file7, setFile7] = useState([]); // 사업자 등록증
    const [file8, setFile8] = useState([]); // 윤리서약서
    const [file9, setFile9] = useState([]); // 규제준수 확약서
    const [file10, setFile10] = useState([]); // 기타
    const [file11, setFile11] = useState([]); // 별첨
    const [file12, setFile12] = useState([]); // 주주명부
    // 다운로드 파일명 정의
    const [downloadFileName, setDownloadFileName] = useState('');
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
            case 'getFile':
                if (responseData.data) {
                    let res = responseData;
                    console.log('res data....');
                    console.log(res);
                    console.log(res.fileName);
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${downloadFileName}`);
                    link.style.cssText = 'display:none';
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    setDownloadFileName('');
                }
                break;
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
                console.log('>>getUserList called...<<');
                if (responseData.data.data && responseData.data.data.length > 0) {
                    console.log(responseData.data.data);
                    setUserList(responseData.data.data);
                } else {
                    setUserList([]);
                    // 담당자가 없으면
                    console.log('>>createUserSearch called...<<');
                    createUserSearch(projectId);
                }
                break;
            case 'getCreateUser':
                if (responseData.data.data) {
                    setUserList((prevRows) => [...prevRows, responseData.data.data]);
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
                        let data = { item: `문서 추가`, item1: `${item.create_date}`, d: item.create_date };
                        //console.log(data);
                        if (item.type === 'IPO_APPLICATION') {
                            setFile1((prevRows) => [...prevRows, data]);
                        } else if (item.type === 'COLLECT_CONFIRM') {
                            setFile2((prevRows) => [...prevRows, data]);
                        } else if (item.type === 'PROJECT_WHITEPAPER') {
                            setFile3((prevRows) => [...prevRows, data]);
                        } else if (item.type === 'TECH_REVIEW_REPORT') {
                            setFile4((prevRows) => [...prevRows, data]);
                        } else if (item.type === 'TOKEN_DIVISION_PLAN') {
                            setFile5((prevRows) => [...prevRows, data]);
                        } else if (item.type === 'LEGAL_REVIEW') {
                            setFile6((prevRows) => [...prevRows, data]);
                        } else if (item.type === 'BUSINESS_LICENSE') {
                            setFile7((prevRows) => [...prevRows, data]);
                        } else if (item.type === 'ETHICAL_WRITE_AUTH') {
                            setFile8((prevRows) => [...prevRows, data]);
                        } else if (item.type === 'REGULATORY_COMPLIANCE') {
                            setFile9((prevRows) => [...prevRows, data]);
                        } else if (item.type === 'ETC') {
                            setFile10((prevRows) => [...prevRows, data]);
                        } else if (item.type === 'PERSONAL_INFO_REQ') {
                            setFile11((prevRows) => [...prevRows, data]);
                        } else if (item.type === 'SHAREHOLDER') {
                            setFile12((prevRows) => [...prevRows, data]);
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
                        let data = { item: `URL 추가`, item1: `${item.create_date}`, d: item.create_date };
                        if (item.type === 'IPO_APPLICATION') {
                            setFile1((prevRows) => [...prevRows, data]);
                            // if (!file1.item) setFile1(data);
                            // else {
                            //     // 날짜 비교
                            //     if (moment(item.create_date).isAfter(file1.d)) {
                            //         setFile1(data);
                            //     }
                            // }
                        } else if (item.type === 'COLLECT_CONFIRM') {
                            setFile2((prevRows) => [...prevRows, data]);
                            // if (!file2.item) setFile2(data);
                            // else {
                            //     // 날짜 비교
                            //     if (moment(item.create_date).isAfter(file2.d)) {
                            //         setFile2(data);
                            //     }
                            // }
                        } else if (item.type === 'PROJECT_WHITEPAPER') {
                            setFile3((prevRows) => [...prevRows, data]);
                            // if (!file3.item) setFile3(data);
                            // else {
                            //     // 날짜 비교
                            //     if (moment(item.create_date).isAfter(file3.d)) {
                            //         setFile3(data);
                            //     }
                            // }
                        } else if (item.type === 'TECH_REVIEW_REPORT') {
                            setFile4((prevRows) => [...prevRows, data]);
                            // if (!file4.item) setFile4(data);
                            // else {
                            //     // 날짜 비교
                            //     if (moment(item.create_date).isAfter(file4.d)) {
                            //         setFile4(data);
                            //     }
                            // }
                        } else if (item.type === 'TOKEN_DIVISION_PLAN') {
                            setFile5((prevRows) => [...prevRows, data]);
                            // if (!file5.item) setFile5(data);
                            // else {
                            //     // 날짜 비교
                            //     if (moment(item.create_date).isAfter(file5.d)) {
                            //         setFile5(data);
                            //     }
                            // }
                        } else if (item.type === 'LEGAL_REVIEW') {
                            setFile6((prevRows) => [...prevRows, data]);
                            // if (!file6.item) setFile6(data);
                            // else {
                            //     // 날짜 비교
                            //     if (moment(item.create_date).isAfter(file6.d)) {
                            //         setFile6(data);
                            //     }
                            // }
                        } else if (item.type === 'BUSINESS_LICENSE') {
                            setFile7((prevRows) => [...prevRows, data]);
                            // if (!file7.item) setFile7(data);
                            // else {
                            //     // 날짜 비교
                            //     if (moment(item.create_date).isAfter(file7.d)) {
                            //         setFile7(data);
                            //     }
                            // }
                        } else if (item.type === 'ETHICAL_WRITE_AUTH') {
                            setFile8((prevRows) => [...prevRows, data]);
                            // if (!file8.item) setFile8(data);
                            // else {
                            //     // 날짜 비교
                            //     if (moment(item.create_date).isAfter(file8.d)) {
                            //         setFile8(data);
                            //     }
                            // }
                        } else if (item.type === 'REGULATORY_COMPLIANCE') {
                            setFile9((prevRows) => [...prevRows, data]);
                            // if (!file9.item) setFile9(data);
                            // else {
                            //     // 날짜 비교
                            //     if (moment(item.create_date).isAfter(file9.d)) {
                            //         setFile9(data);
                            //     }
                            // }
                        } else if (item.type === 'ETC') {
                            setFile10((prevRows) => [...prevRows, data]);
                            // if (!file10.item) setFile10(data);
                            // else {
                            //     // 날짜 비교
                            //     if (moment(item.create_date).isAfter(file10.d)) {
                            //         setFile10(data);
                            //     }
                            // }
                        } else if (item.type === 'PERSONAL_INFO_REQ') {
                            setFile11((prevRows) => [...prevRows, data]);
                            // if (!file11.item) setFile11(data);
                            // else {
                            //     // 날짜 비교
                            //     if (moment(item.create_date).isAfter(file11.d)) {
                            //         setFile11(data);
                            //     }
                            // }
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
                chatClose();
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
    // 검토 파일 다운로드
    const fileDownload = (id, fileKey, fileName) => {
        setDownloadFileName(fileName);
        fileReviewDownload(projectId, id, fileKey);
    };
    const format = (num, decimals) =>
        num.toLocaleString('en-US', {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
        });

    const reqUnMask = () => {
        if (userList.length > 0) {
            // 마스킹 해제 요청을 한다. (해당 요청은 내부망에서만 이루어질 것이다)
            setOpenReason(true);
        }
    };

    const handlePopupClose = (returnData) => {
        setOpenReason(false);
        // 데이터 처리
        if (returnData.length !== 0) {
            // 데이터 처리
            console.log(returnData);
            let reason = returnData;
            userUnMaskingSearch(projectId, reason);
        }
    };

    return (
        <Grid container alignItems="center" justifyContent="space-between">
            <Grid container className="officeinfo__content--box">
                <div className="order__content--width">
                    <Grid sx={{ p: '1rem 2rem ' }}>
                        <FlexBox>
                            <Typography variant="h3">
                                {officeInfo.project_name} ({officeInfo.symbol})
                            </Typography>
                            <div className="order__content--checkList">
                                <p>{officeInfo.contract_name}</p>
                                {officeInfo.process_name ? <p>{officeInfo.process_name}</p> : ''}
                            </div>
                            {projectLink.length > 0 && (
                                <ButtonLayout buttonName="project_link" name="project_link" label="연결 프로젝트 선택">
                                    {projectLink.map((item, index) => (
                                        <Button key={index} value={item.link_project_id} variant="linked" onClick={handleChange}>
                                            <LinkOutlined />
                                            {item.link_project_name} ( {item.link_project_symbol} )
                                        </Button>
                                    ))}
                                </ButtonLayout>
                            )}
                        </FlexBox>
                    </Grid>
                </div>
                <div style={{ width: '100%', padding: '2rem', borderTop: '1px solid #e6ebf1' }}>{officeInfo.admin_memo}</div>
            </Grid>

            <Grid container className="officeinfo__content--box">
                <Grid sx={{ p: '1rem 2rem ' }}>
                    <Typography variant="h4">프로젝트 정보</Typography>
                </Grid>

                <ContentLine className="officeinfo__table__width">
                    <Table style={{ width: '100%' }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: '25%' }} align="center">
                                    사업계열
                                </TableCell>
                                <TableCell style={{ width: '25%' }} align="center">
                                    네트워크 계열
                                </TableCell>
                                <TableCell style={{ width: '25%' }} align="center">
                                    Jira 번호
                                </TableCell>
                                <TableCell style={{ width: '25%' }} align="center">
                                    최초 발행일
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {projecInfo && (
                                <TableRow>
                                    <TableCell style={{ width: '25%' }} align="center" component="td" scope="row">
                                        {projecInfo.business_name ? projecInfo.business_name : '-'}
                                    </TableCell>
                                    <TableCell style={{ width: '25%' }} align="center" component="td" scope="row">
                                        {projecInfo.network_name ? projecInfo.network_name : '-'}
                                    </TableCell>
                                    <TableCell style={{ width: '25%', lineBreak: 'anywhere' }} align="center" component="td" scope="row">
                                        {projecInfo.whitepaper_link ? projecInfo.whitepaper_link : '-'}
                                    </TableCell>
                                    <TableCell style={{ width: '25%' }} align="center" component="td" scope="row">
                                        {projecInfo.create_date ? projecInfo.create_date : '-'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <Table style={{ width: '100%', tableLayout: 'auto' }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" component="th">
                                    컨트렉트 주소
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {projecInfo && (
                                <TableRow>
                                    <TableCell align="center" component="td" scope="row">
                                        {projecInfo.contract_address ? projecInfo.contract_address : '-'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ContentLine>
            </Grid>

            <Grid container className="officeinfo__content--box">
                <Grid sx={{ width: '100%', p: '1rem 2rem', display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h4">담당자 정보</Typography>
                    {userList.length > 0 ? (
                        <ButtonLayout>
                            <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={reqUnMask}>
                                마스킹 해제
                            </Button>
                        </ButtonLayout>
                    ) : (
                        ''
                    )}
                </Grid>

                <ContentLine className="officeinfo__table__width">
                    <Table style={{ width: '100%', tableLayout: 'auto' }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: '25%' }} align="center" component="th">
                                    이름
                                </TableCell>
                                <TableCell style={{ width: '25%' }} align="center" component="th">
                                    연락처
                                </TableCell>
                                <TableCell style={{ width: '25%' }} align="center" component="th">
                                    SNS ID
                                </TableCell>
                                <TableCell style={{ width: '25%' }} align="center" component="th">
                                    이메일주소
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userList.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell style={{ width: '25%' }} align="center" component="td" scope="row">
                                        {item.user_name ? item.user_name : '_'}
                                    </TableCell>
                                    <TableCell style={{ width: '25%' }} align="center" component="td" scope="row">
                                        {item.phone ? item.phone : '-'}
                                    </TableCell>
                                    <TableCell style={{ width: '25%' }} align="center" component="td" scope="row">
                                        {item.sns_id ? item.sns_id : '-'}
                                    </TableCell>
                                    <TableCell style={{ width: '25%' }} align="center" component="td" scope="row">
                                        {item.email ? item.email : item.user_email}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ContentLine>
            </Grid>
            <Grid container className="officeinfo__content--box">
                <Grid sx={{ p: '1rem 2rem ' }}>
                    <Typography variant="h4">마케팅 수량</Typography>
                </Grid>

                <ContentLine className="officeinfo__table__width">
                    <Table style={{ width: '100%', tableLayout: 'auto' }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" component="th">
                                    심볼
                                </TableCell>
                                <TableCell align="center" component="th">
                                    제안받은 수량
                                </TableCell>
                                <TableCell align="center" component="th">
                                    입금 완료된 수량
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {marketingList.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell style={{ width: '33%' }} align="center" component="td" scope="row">
                                        {item.symbol ? item.symbol : '-'}
                                    </TableCell>
                                    <TableCell style={{ width: '33%' }} align="center" component="td" scope="row">
                                        {item.minimum_quantity ? (
                                            <NumberFormat
                                                value={item.minimum_quantity}
                                                allowNegative={true}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                prefix={''}
                                            />
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                    <TableCell style={{ width: '33%' }} align="center" component="td" scope="row">
                                        <NumberFormat
                                            value={item.actual_quantity}
                                            allowNegative={true}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={''}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ContentLine>
            </Grid>

            <Grid container className="officeinfo__content--box">
                <Grid sx={{ p: '1rem 2rem ' }}>
                    <Typography variant="h4">검토 평가</Typography>
                </Grid>
                <ContentLine className="officeinfo__table__width">
                    <Table style={{ width: '100%', tableLayout: 'auto' }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell component="th" align="center">
                                    평가 기관
                                </TableCell>
                                <TableCell component="th" align="center">
                                    평가 결과
                                </TableCell>
                                <TableCell component="th" align="center" colSpan="2">
                                    평가 자료
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reviewList.length > 0 ? (
                                reviewList.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell style={{ width: '25%' }} align="center" component="td" scope="row">
                                            {item.organization ? item.organization : '-'}
                                        </TableCell>
                                        <TableCell style={{ width: '25%' }} align="center" component="td" scope="row">
                                            {item.result ? item.result : '-'}
                                        </TableCell>
                                        <TableCell style={{ width: '25%' }} align="center" component="td" scope="row">
                                            {item.reference ? item.reference : '-'}
                                        </TableCell>
                                        <TableCell style={{ width: '25%' }} align="center" component="td" scope="row">
                                            {item.file_key && item.file_status === 'CLEAN' && (
                                                <a href="#" onClick={() => fileDownload(item.id, item.file_key, item.file_name)}>
                                                    {item.file_name}
                                                </a>
                                            )}
                                            {item.file_key && item.file_status === 'ING' && <div>{item.file_name} [검사중]</div>}
                                            {item.file_key && item.file_status === 'INFECTED' && <div>{item.file_name} [감염파일]</div>}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell style={{ width: '25%' }} align="center" component="td" scope="row">
                                        -
                                    </TableCell>
                                    <TableCell style={{ width: '25%' }} align="center" component="td" scope="row">
                                        -
                                    </TableCell>
                                    <TableCell style={{ width: '25%' }} align="center" component="td" scope="row">
                                        -
                                    </TableCell>
                                    <TableCell style={{ width: '25%' }} align="center" component="td" scope="row">
                                        -
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ContentLine>
            </Grid>
            <Grid container className="officeinfo__content--box">
                <Grid sx={{ p: '1rem 2rem ' }}>
                    <Typography variant="h4">서류 제출 현황</Typography>
                </Grid>
                <ContentLine className="officeinfo__table__width">
                    <Table style={{ width: '100%', tableLayout: 'auto' }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" component="th">
                                    1. 거래지원 신청서
                                </TableCell>
                                <TableCell align="center" component="th">
                                    2. [별첨-1]개인정보 요청서
                                </TableCell>
                                <TableCell align="center" component="th">
                                    3. 개인정보 수집 및 이용동의서
                                </TableCell>
                                <TableCell align="center" component="th">
                                    4. 프로젝트 백서
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="td" scope="row" align="center">
                                    {file1.length > 0
                                        ? file1
                                              .sort((a, b) => (a.d.create_date > b.d.create_date ? 1 : -1))
                                              .filter((doc, idx) => idx < 2)
                                              .map((doc, index) => (
                                                  <p key={index}>
                                                      {doc.item} {doc.item1}
                                                  </p>
                                              ))
                                        : '-'}
                                </TableCell>
                                <TableCell component="td" scope="row" align="center">
                                    {file11.length > 0
                                        ? file11
                                              .sort((a, b) => (a.d.create_date > b.d.create_date ? 1 : -1))
                                              .filter((doc, idx) => idx < 2)
                                              .map((doc, index) => (
                                                  <p key={index}>
                                                      {doc.item} {doc.item1}
                                                  </p>
                                              ))
                                        : '-'}
                                </TableCell>
                                <TableCell component="td" scope="row" align="center">
                                    {file2.length > 0
                                        ? file2
                                              .sort((a, b) => (a.d.create_date > b.d.create_date ? 1 : -1))
                                              .filter((doc, idx) => idx < 2)
                                              .map((doc, index) => (
                                                  <p key={index}>
                                                      {doc.item} {doc.item1}
                                                  </p>
                                              ))
                                        : '-'}
                                </TableCell>
                                <TableCell component="td" scope="row" align="center">
                                    {file3.length > 0
                                        ? file3
                                              .sort((a, b) => (a.d.create_date > b.d.create_date ? 1 : -1))
                                              .filter((doc, idx) => idx < 2)
                                              .map((doc, index) => (
                                                  <p key={index}>
                                                      {doc.item} {doc.item1}
                                                  </p>
                                              ))
                                        : '-'}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" component="th">
                                    5. 기술 검토 보고서
                                </TableCell>
                                <TableCell align="center" component="th">
                                    6. 토큰 분배 계획서(Token matrix)
                                </TableCell>
                                <TableCell align="center" component="th">
                                    7. 법률 검토 의견서
                                </TableCell>
                                <TableCell align="center" component="th">
                                    8. 사업자 등록증
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="td" scope="row" align="center">
                                    {file4.length > 0
                                        ? file4
                                              .sort((a, b) => (a.d.create_date > b.d.create_date ? 1 : -1))
                                              .filter((doc, idx) => idx < 2)
                                              .map((doc, index) => (
                                                  <p key={index}>
                                                      {doc.item} {doc.item1}
                                                  </p>
                                              ))
                                        : '-'}
                                </TableCell>
                                <TableCell component="td" scope="row" align="center">
                                    {file5.length > 0
                                        ? file5
                                              .sort((a, b) => (a.d.create_date > b.d.create_date ? 1 : -1))
                                              .filter((doc, idx) => idx < 2)
                                              .map((doc, index) => (
                                                  <p key={index}>
                                                      {doc.item} {doc.item1}
                                                  </p>
                                              ))
                                        : '-'}
                                </TableCell>
                                <TableCell component="td" scope="row" align="center">
                                    {file6.length > 0
                                        ? file6
                                              .sort((a, b) => (a.d.create_date > b.d.create_date ? 1 : -1))
                                              .filter((doc, idx) => idx < 2)
                                              .map((doc, index) => (
                                                  <p key={index}>
                                                      {doc.item} {doc.item1}
                                                  </p>
                                              ))
                                        : '-'}
                                </TableCell>
                                <TableCell component="td" scope="row" align="center">
                                    {file7.length > 0
                                        ? file7
                                              .sort((a, b) => (a.d.create_date > b.d.create_date ? 1 : -1))
                                              .filter((doc, idx) => idx < 2)
                                              .map((doc, index) => (
                                                  <p key={index}>
                                                      {doc.item} {doc.item1}
                                                  </p>
                                              ))
                                        : '-'}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" component="th">
                                    9. 주주명부
                                </TableCell>
                                <TableCell align="center" component="th">
                                    10. 규제준수 확약서
                                </TableCell>
                                <TableCell align="center" component="th">
                                    11. 윤리서약서
                                </TableCell>
                                <TableCell align="center" component="th">
                                    12. 기타
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="td" scope="row" align="center">
                                    {file12.length > 0
                                        ? file12
                                              .sort((a, b) => (a.d.create_date > b.d.create_date ? 1 : -1))
                                              .filter((doc, idx) => idx < 2)
                                              .map((doc, index) => (
                                                  <p key={index}>
                                                      {doc.item} {doc.item1}
                                                  </p>
                                              ))
                                        : '-'}
                                </TableCell>
                                <TableCell component="td" scope="row" align="center">
                                    {file9.length > 0
                                        ? file9
                                              .sort((a, b) => (a.d.create_date > b.d.create_date ? 1 : -1))
                                              .filter((doc, idx) => idx < 2)
                                              .map((doc, index) => (
                                                  <p key={index}>
                                                      {doc.item} {doc.item1}
                                                  </p>
                                              ))
                                        : '-'}
                                </TableCell>
                                <TableCell component="td" scope="row" align="center">
                                    {file8.length > 0
                                        ? file8
                                              .sort((a, b) => (a.d.create_date > b.d.create_date ? 1 : -1))
                                              .filter((doc, idx) => idx < 2)
                                              .map((doc, index) => (
                                                  <p key={index}>
                                                      {doc.item} {doc.item1}
                                                  </p>
                                              ))
                                        : '-'}
                                </TableCell>

                                <TableCell component="td" scope="row" align="center">
                                    {file10.length > 0
                                        ? file10
                                              .sort((a, b) => (a.d.create_date > b.d.create_date ? 1 : -1))
                                              .filter((doc, idx) => idx < 2)
                                              .map((doc, index) => (
                                                  <p key={index}>
                                                      {doc.item} {doc.item1}
                                                  </p>
                                              ))
                                        : '-'}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </ContentLine>
            </Grid>

            <Grid container className="officeinfo__content--box">
                <Grid sx={{ p: '1rem 2rem ' }}>
                    <Typography variant="h4">상장 정보</Typography>
                </Grid>
                <ContentLine className="officeinfo__table__width">
                    <Table style={{ width: '100%', tableLayout: 'auto' }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" component="th">
                                    마켓 정보
                                </TableCell>
                                <TableCell align="center" component="th">
                                    상장일
                                </TableCell>
                                <TableCell align="center" component="th">
                                    상장가
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {icoList.length > 0 ? (
                                icoList.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell style={{ width: '33%' }} align="center" component="td" scope="row">
                                            {item.market_info ? item.market_info : '-'}
                                        </TableCell>
                                        <TableCell style={{ width: '33%' }} align="center" component="td" scope="row">
                                            {item.ico_date ? item.ico_date : '-'}
                                        </TableCell>
                                        <TableCell style={{ width: '33%' }} align="center" component="td" scope="row">
                                            <NumberFormat
                                                value={item.price}
                                                allowNegative={true}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                prefix={''}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow key={index}>
                                    <TableCell style={{ width: '33%' }} align="center" component="td" scope="row">
                                        -
                                    </TableCell>
                                    <TableCell style={{ width: '33%' }} align="center" component="td" scope="row">
                                        -
                                    </TableCell>
                                    <TableCell style={{ width: '33%' }} align="center" component="td" scope="row">
                                        -
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ContentLine>
            </Grid>
            <PrivateReasonDialog selectedValue={selectedValue} open={openReason} onClose={handlePopupClose} />
        </Grid>
    );
};

export default OfficeInfo;
