import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Grid,
    Tab,
    TableCell,
    Tabs,
    TextField,
    Typography,
    Table,
    TableBody,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip
} from '@mui/material';
import MainCard from 'components/Common/MainCard';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import ErrorScreen from 'components/ErrorScreen';
import TabPanel from 'components/TabPanel';
import OfficeInfo from './officeinfo';
import ProjectMng from './projectmng';
import FileMng from './filemng';
import ProjectHistory from './history';
import Chat from './chat';
import ChatApi from 'apis/chat/chatapi';
import FoundationApi from 'apis/lrc/project/foundationapi';
import HeaderTitle from 'components/HeaderTitle';
import TopInputLayout from '../../../components/Common/TopInputLayout';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import { Empty } from 'antd';
import './styles.scss';
import { getDateFormat } from 'utils/CommonUtils';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
const ProjectsDetailPage = () => {
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
            renderCell: (params) => {
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
    const { paramId } = useParams();

    const [resData, reqError, loading, { insertChatFile, getChatFile, getChatFileList }] = ChatApi();

    const [responseData, requestError, loadingData, { sendEmail }] = FoundationApi();

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);

    const [value, setValue] = React.useState(0);

    // 파일 정보
    const [file_part, setFilePart] = useState();
    const [file, setFile] = useState('');

    // 파일 리스트
    const [fileList, setFileList] = useState([]);
    const [fileName, setFileName] = useState('');

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
    const chatRef = useRef({});
    const [chatStart, setChatStart] = useState(false);

    // onload
    useEffect(() => {
        //siteSearch(true, '');
        //roleList();
        // 파일 리스트 조회
        getChatFileList(paramId);

        // 탭 파일 변경.
        if (localStorage.getItem('projectTabIndex')) {
            let data = localStorage.getItem('projectTabIndex');
            console.log(`tab value => ${data}`);
            setValue(parseInt(data, 10));
        }
    }, [paramId]);

    // transaction error 처리
    useEffect(() => {
        if (reqError) {
            if (reqError.result === 'FAIL') {
                console.log('error requestError');
                console.log(reqError);
                setErrorTitle('Error Message');
                setErrorMessage('[' + reqError.error.code + '] ' + reqError.error.message);
                setOpen(true);

                if (chatStart === false) setChatStart(true);
            }
        }
    }, [reqError]);

    // 메일전송 결과
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'sendEmail':
                console.log(responseData.data);
                break;
            default:
                break;
        }
    }, [responseData]);

    useEffect(() => {
        if (!resData) {
            return;
        }
        switch (resData.transactionId) {
            case 'getFileList':
                if (resData.data.data) {
                    console.log(resData);
                    setFileList(resData.data.data);
                }
                setChatStart(true);
                break;
            case 'insertData':
                if (resData.data.data) {
                    console.log(resData);
                    getChatFileList(paramId);
                    // 파일에 대한 채팅 메시지 전송
                    chatRef.current.sendRequest(`FILE_MESSAGE::${resData.data.data.id}`);
                }
                break;
            case 'getFile':
                if (resData.data) {
                    let res = resData;
                    console.log('res data....');
                    console.log(res);
                    console.log(res.fileName);
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${fileName}`);
                    link.style.cssText = 'display:none';
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    setFileName('');
                }
                break;
            default:
        }
    }, [resData]);

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

    const tabChange = (event, value) => {
        setValue(value);
        // 해당 값을 로컬 스토리지에 저장한다.
        localStorage.setItem('projectTabIndex', value);
    };

    const listClick = () => {
        console.log('listClick called');
        navigate('/projects/list');
    };

    const fileSave = (type, data) => {
        if (!file) {
            alert('파일을 업로드 하지 않았습니다.');
            return;
        }
        const formData = new FormData();
        formData.append('file', file_part);
        formData.append('projectId', paramId);
        formData.append('fileName', file);
        formData.append('fileType', file_part.type);
        // 3.2MB로 계산하기
        formData.append('fileSize', humanFileSize(file_part.size, true, 2));

        console.log(formData);
        insertChatFile(formData);
    };

    // 입력 박스 입력 시 호출
    const fileHandleChange = (e) => {
        if (!e.target.files[0]) {
            setFilePart();
            return;
        }
        setFile(e.target.files[0].name);
        setFilePart(e.target.files[0]);
    };

    function byteString(index) {
        const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']; //  : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

        // eslint-disable-next-line security/detect-object-injection
        return units[index];
    }
    function humanFileSize(bytes, si = false, dp = 1) {
        const thresh = si ? 1000 : 1024;

        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }

        //const units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        const r = 10 ** dp;

        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < 8 - 1); // units.length - 1);

        return bytes.toFixed(dp) + ' ' + byteString(u); // units[u];
    }

    // 파일을 다운로드 한다.
    const FileDownload = (key, name) => {
        setFileName(name);
        getChatFile(key);
    };

    const FontTableCell = styled(TableCell)(({ theme }) => ({
        // [`&.${tableCellClasses.head}`]: {
        //     backgroundColor: theme.palette.common.black,
        //     color: theme.palette.common.white
        // },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 9
        }
    }));

    const mailSendKor = () => {
        if (chatRef.current.getMailSendAddress()) {
            let mail = chatRef.current.getMailSendAddress();
            console.log(mail);

            // 메일 전송
            sendEmail(mail, 'KOR');
        }
    };

    const mailSendEn = () => {
        if (chatRef.current.getMailSendAddress()) {
            let mail = chatRef.current.getMailSendAddress();
            console.log(mail);

            // 메일 전송
            sendEmail(mail, 'EN');
        }
    };
    // 페이징 변경 이벤트
    const handlePage = (page) => {};
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const fileSearch = () => {
        getChatFileList(paramId);
    };
    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle titleNm="거래지원 관리" menuStep01="사이트 운영" menuStep02="거래지원 관리" menuStep03="재단 정보" />

                <TopInputLayout className="layout--button__bottom">
                    <Tabs value={value} onChange={tabChange} aria-label="basic tabs example">
                        <Tab label="재단 정보" />
                        <Tab label="프로젝트 관리" />
                        <Tab label="제출 서류 관리" />
                        <Tab label="변경 히스토리" />
                    </Tabs>

                    <ButtonLayout>
                        <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={listClick}>
                            목록
                        </Button>
                    </ButtonLayout>
                </TopInputLayout>

                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid container spacing={0} sx={{ mt: 0 }}>
                        <Box sx={{ width: '100%' }}>
                            <Grid container spacing={0} sx={{ mt: 0 }}>
                                <Grid item xs={8} sm={8}>
                                    {/* 재단 정보 */}
                                    <TabPanel value={value} index={0}>
                                        <OfficeInfo value={value} projectId={paramId} index={0} />
                                    </TabPanel>
                                    {/* 프로젝트 관리 */}
                                    <TabPanel value={value} index={1}>
                                        <ProjectMng value={value} projectId={paramId} index={1} />
                                    </TabPanel>
                                    {/* 제출 서류 관리 */}
                                    <TabPanel value={value} index={2}>
                                        <FileMng value={value} projectId={paramId} index={2} />
                                    </TabPanel>
                                    {/* 변경 히스토리 */}
                                    <TabPanel value={value} index={3}>
                                        <ProjectHistory value={value} projectId={paramId} index={3} />
                                    </TabPanel>
                                </Grid>
                                <Grid item xs={4} sm={4} className="catting__layout">
                                    {/* 채팅 영역 */}
                                    <Chat
                                        projectId={paramId}
                                        ref={chatRef}
                                        chatStart={chatStart}
                                        fileList={fileList}
                                        fileDownload={FileDownload}
                                        fileSearch={fileSearch}
                                    />

                                    <div align="center" style={{ padding: '20px' }}>
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={mailSendKor}
                                        >
                                            국문 알림 메일 발송하기
                                        </Button>
                                        &nbsp;&nbsp;
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={mailSendEn}
                                        >
                                            영문 알림 메일 발송하기
                                        </Button>
                                    </div>

                                    {/* 파일 업로드 */}
                                    <TopInputLayout className="file__upload--box">
                                        <TextField
                                            type="file"
                                            id="file"
                                            name="file"
                                            size="medium"
                                            className="file__upload--field"
                                            onChange={fileHandleChange}
                                            inputProps={{
                                                accept:
                                                    '.doc, .docx, .xlsx, .xls, .ppt, .pptx, .ai, .mov, .mp4, .avi, .mkv, .jpg, .jpeg, .png, .gif, .pdf, .txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                            }}
                                        />
                                        &nbsp;
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="button"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => fileSave('CHAT', file)}
                                        >
                                            업로드
                                        </Button>
                                    </TopInputLayout>
                                    <MainCard>
                                        <Typography variant="h4">첨부파일 목록</Typography>
                                        {fileList.length > 0 ? (
                                            <div className="project__info--box">
                                                <div className="project__info--download">
                                                    <Table
                                                        fixedHeader={false}
                                                        style={{ width: '100%', tableLayout: 'auto' }}
                                                        stickyHeader
                                                        aria-label="simple table"
                                                    >
                                                        <TableBody>
                                                            {fileList
                                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                .map((item, index) => (
                                                                    <TableRow key={index} hover>
                                                                        <TableCell align="center" component="th" scope="row">
                                                                            {item.user_type_name}
                                                                        </TableCell>
                                                                        <TableCell align="center" component="th" scope="row">
                                                                            <Tooltip title={item.file_name}>
                                                                                <Button
                                                                                    variant="outlined"
                                                                                    startIcon={<AttachFileOutlinedIcon />}
                                                                                    size="small"
                                                                                    onClick={() => FileDownload(item.id, item.file_name)}
                                                                                >
                                                                                    파일 다운로드
                                                                                </Button>
                                                                            </Tooltip>
                                                                            <p>
                                                                                {item.file_size}&nbsp;{getDateFormat(item.create_date)}
                                                                            </p>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                        </TableBody>
                                                    </Table>
                                                    <TablePagination
                                                        rowsPerPageOptions={[10, 25, 100]}
                                                        component="div"
                                                        count={fileList.length}
                                                        rowsPerPage={rowsPerPage}
                                                        page={page}
                                                        onPageChange={handleChangePage}
                                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="첨부된 파일이 없습니다." />
                                        )}

                                        {/* {fileList.length > 0 ? (
                                            <div className="project__info--box">
                                                {fileList.map((item, index) => (
                                                    <TopInputLayout key={index} className="project__info">
                                                        <h6 style={{ width: '36%', lineBreak: 'anywhere' }}>[{item.user_type_name}]</h6>
                                                        <div className="project__info--download">
                                                            <Button
                                                                variant="outlined"
                                                                startIcon={<AttachFileOutlinedIcon />}
                                                                size="small"
                                                                onClick={() => FileDownload(item.id, item.file_name)}
                                                            >
                                                                {item.file_name}
                                                            </Button>
                                                            <p>
                                                                {item.file_size}&nbsp;{getDateFormat(item.create_date)}
                                                            </p>
                                                        </div>
                                                    </TopInputLayout>
                                                ))}
                                            </div>
                                        ) : (
                                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="첨부된 파일이 없습니다." />
                                        )} */}
                                    </MainCard>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>

                {errorMessage && (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                )}
            </Grid>
        </Grid>
    );
};

export default ProjectsDetailPage;
