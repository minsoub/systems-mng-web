import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    Button,
    TableCell,
    TextField,
    Typography,
    Table,
    TableBody,
    TableHead,
    TableRow,
    Tooltip
} from '@mui/material';
import MainCard from 'components/Common/MainCard';
import Chat from './chat';
import ChatApi from 'apis/chat/chatapi';
import FoundationApi from 'apis/lrc/project/foundationapi';
import TopInputLayout from '../../../components/Common/TopInputLayout';
import { Empty } from 'antd';
import './styles.scss';
import { getDateFormat } from 'utils/CommonUtils';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import FlexBox from 'components/Common/FlexBox/index';
import CustomPagination from 'components/CustomPagination';

const ProjectCommunity = (props) => {
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
    const { paramId } = useParams();

    const [resData, reqError, loading, { insertChatFile, getChatFile, getChatFileList, fileDetailSearch }] = ChatApi();

    const [responseData, requestError, loadingData, { sendEmailToProjectUser }] = FoundationApi();

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
            //console.log(`tab value => ${data}`);
            setValue(parseInt(data, 10));
        }
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
    // 페이징 변경 이벤트
    const handlePage = (page) => {};
    const [page, setPage] = useState(0);
    const [viewPage, setViewPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(1);

    const handleChangePage = (event, newPage) => {
        setPage(Number(newPage - 1));
    };
    useEffect(() => {
        setViewPage(page+1);
    },[page])

    const fileSearch = (projectId, fileKey) => {
        fileDetailSearch(projectId, fileKey);
    };
    return (
        <>
            <Chat
                projectId={paramId}
                ref={chatRef}
                chatStart={chatStart}
                fileList={fileList}
                fileDownload={FileDownload}
                fileSearch={fileSearch}
                value={value}
                index={4}
            />
            <MainCard>
                {/* 파일 업로드 */}

                <FlexBox sx={{ justifyContent: 'space-between', px: '0.7rem' }}>
                    <Typography variant="h4">첨부파일 목록</Typography>
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
                </FlexBox>
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
                                            <TableCell align="left" component="td" scope="row" sx={{ width: '88%' }}>
                                                <div>{item.user_type_name}</div>
                                                <div>{item.file_name}</div>
                                                <div style={{ color: '#aaa' }}>{getDateFormat(item.create_date)}</div>
                                            </TableCell>
                                            <TableCell align="right" component="td" scope="row">
                                                <Tooltip title={item.file_name}>
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<AttachFileOutlinedIcon />}
                                                        size="small"
                                                        sx={{ minWidth: '120px' }}
                                                        onClick={() => FileDownload(item.id, item.file_name)}
                                                    >
                                                        파일 다운로드
                                                    </Button>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <CustomPagination
                                total={fileList.length}
                                page={viewPage}
                                count={Number(Math.ceil(fileList.length / rowsPerPage))}
                                shape="rounded"
                                color="primary"
                                rows_per_page={rowsPerPage}
                                boundary_count={2}
                                on_change={handleChangePage}
                            />
                        </div>
                    </div>
                ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="첨부된 파일이 없습니다." />
                )}
            </MainCard>
        </>
    );
};

export default ProjectCommunity;