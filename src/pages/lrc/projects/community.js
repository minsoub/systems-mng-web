import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
    Button,
    Grid,
    TableCell,
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
import Chat from './chat';
import ChatApi from 'apis/chat/chatapi';
import FoundationApi from 'apis/lrc/project/foundationapi';
import TopInputLayout from '../../../components/Common/TopInputLayout';
import { Empty } from 'antd';
import { getDateFormat } from 'utils/CommonUtils';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';

const ProjectCommunity = (props) => {
    let isSubmitting = false;
    const { paramId } = useParams();

    const [resData, reqError, loading, { insertChatFile, getChatFile, getChatFileList, fileDetailSearch }] = ChatApi();

    const [responseData, requestError, loadingData, { sendEmailToProjectUser }] = FoundationApi();

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);

    // 파일 정보
    const [file_part, setFilePart] = useState();
    const [file, setFile] = useState('');

    // 파일 리스트
    const [fileList, setFileList] = useState([]);
    const [fileName, setFileName] = useState('');

    ////////////////////////////////////////////////////
    const chatRef = useRef({});
    const [chatStart, setChatStart] = useState(false);

    // onload
    useEffect(() => {
        //siteSearch(true, '');
        //roleList();
        // 파일 리스트 조회
        getChatFileList(paramId);
    }, [paramId]);

    // transaction error 처리
    useEffect(() => {
        if (reqError) {
            if (reqError.result === 'FAIL') {
                //console.log('error requestError');
                //console.log(reqError);
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
                alert('전송을 완료하였습니다.');
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
            case 'getFileData':
                if (resData.data.data) {
                    console.log(resData);
                    setFileList([...fileList, resData.data.data]);
                }
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
                    //console.log('res data....');
                    //console.log(res);
                    //console.log(res.fileName);
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
    /*
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
*/
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

        //console.log(formData);
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
        const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']; //  : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

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
    /*
    const FontTableCell = styled(TableCell)(({ theme }) => ({
        // [`&.${tableCellClasses.head}`]: {
        //     backgroundColor: theme.palette.common.black,
        //     color: theme.palette.common.white
        // },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 9
        }
    }));
    */
    const sendEmail = (param) => {
        console.log(param);
        if (param === 'KOR') {
            if (confirm('국문 알림 메일을 발송하시겠습니까?')) {
                sendEmailToProjectUser(paramId, param);
            }
        } else if (param === 'EN') {
            if (confirm('영문 알림 메일을 발송하시겠습니까?')) {
                sendEmailToProjectUser(paramId, param);
            }
        }
    };
    /*
        const mailSendKor = () => {
            if (chatRef.current.getMailSendAddress()) {
                let mail = chatRef.current.getMailSendAddress();
                console.log(mail);

                // 메일 전송
                sendEmail(paramId, 'KOR');
            }
        };

        const mailSendEn = () => {
            if (chatRef.current.getMailSendAddress()) {
                let mail = chatRef.current.getMailSendAddress();
                console.log(mail);

                // 메일 전송
                sendEmail(paramId, 'EN');
            }
        };
    */
    // 페이징 변경 이벤트
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const fileSearch = (projectId, fileKey) => {
        fileDetailSearch(projectId, fileKey);
    };
    return (
        <Grid item className="catting__layout community">
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
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        sendEmail('KOR');
                    }}
                >
                    국문 알림 메일 발송하기
                </Button>
                &nbsp;&nbsp;
                <Button
                    disableElevation
                    size="medium"
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        sendEmail('EN');
                    }}
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
                                    {fileList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
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
    );
};

export default ProjectCommunity;