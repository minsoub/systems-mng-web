import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Grid, TextField, Typography, FormControl, Table, TableBody, TableHead, TableRow } from '@mui/material';
import MainCard from 'components/Common/MainCard';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import FilesApi from 'apis/lrc/project/filesapi';
import ContentLine from '../../../components/Common/ContentLine';
import FlexBox from '../../../components/Common/FlexBox';
import TopInputLayout from '../../../components/Common/TopInputLayout';

const FileMng = (props) => {
    const navigate = useNavigate();
    const [
        responseData,
        requestError,
        loading,
        { fileSearch, urlSearch, urlDocumentSave, fileDocumentSave, fileDocumentDownload }
    ] = FilesApi();
    const { projectId, children, tabindex, index, ...other } = props;

    ////////////////////////////////////////////////////
    // 공통 에러 처리
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    ////////////////////////////////////////////////////

    // 제출 서류 관련 데이터 리스트 정보 (파일)
    const [fileList1, setFileList1] = useState([]);
    const [fileList2, setFileList2] = useState([]);
    const [fileList3, setFileList3] = useState([]);
    const [fileList4, setFileList4] = useState([]);
    const [fileList5, setFileList5] = useState([]);
    const [fileList6, setFileList6] = useState([]);
    const [fileList7, setFileList7] = useState([]);
    const [fileList8, setFileList8] = useState([]);
    const [fileList9, setFileList9] = useState([]);
    const [fileList10, setFileList10] = useState([]);
    const [fileList11, setFileList11] = useState([]);
    const [fileList12, setFileList12] = useState([]);

    // 제출 서류 관련 데이터 리스트 정보 (URL)
    const [docList1, setDocList1] = useState([]);
    const [docList2, setDocList2] = useState([]);
    const [docList3, setDocList3] = useState([]);
    const [docList4, setDocList4] = useState([]);
    const [docList5, setDocList5] = useState([]);
    const [docList6, setDocList6] = useState([]);
    const [docList7, setDocList7] = useState([]);
    const [docList8, setDocList8] = useState([]);
    const [docList9, setDocList9] = useState([]);
    const [docList10, setDocList10] = useState([]);
    const [docList11, setDocList11] = useState([]);
    const [docList12, setDocList12] = useState([]);
    const [downloadFileName, setDownloadFileName] = useState('');

    const styles = {
        hidden: {
            display: 'none'
        },
        importLabel: {
            color: 'black'
        }
    };

    // 파일 정보
    const [file_part, setFilePart] = useState();

    // 입력 데이터 - Default
    const [inputs, setInputs] = useState({
        url1: '',
        url2: '',
        url3: '',
        url4: '',
        url5: '',
        url6: '',
        url7: '',
        url8: '',
        url9: '',
        url10: '',
        url11: '',
        url12: '',
        file1: '',
        file2: '',
        file3: '',
        file4: '',
        file5: '',
        file6: '',
        file7: '',
        file8: '',
        file9: '',
        file10: '',
        file11: '',
        file12: ''
    });
    const {
        url1,
        url2,
        url3,
        url4,
        url5,
        url6,
        url7,
        url8,
        url9,
        url10,
        url11,
        url12,
        file1,
        file2,
        file3,
        file4,
        file5,
        file6,
        file7,
        file8,
        file9,
        file10,
        file11,
        file12
    } = inputs;
    // onload
    useEffect(() => {
        realodData();
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
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getFileList':
                if (responseData.data.data) {
                    let fileList = responseData.data.data;
                    let file1 = [];
                    let file2 = [];
                    let file3 = [];
                    let file4 = [];
                    let file5 = [];
                    let file6 = [];
                    let file7 = [];
                    let file8 = [];
                    let file9 = [];
                    let file10 = [];
                    let file11 = [];
                    let file12 = [];
                    fileList.map((file, index) => {
                        switch (file.type) {
                            case 'IPO_APPLICATION':
                                file1.push(file);
                                break;
                            case 'COLLECT_CONFIRM':
                                file2.push(file);
                                break;
                            case 'PROJECT_WHITEPAPER':
                                file3.push(file);
                                break;
                            case 'TECH_REVIEW_REPORT':
                                file4.push(file);
                                break;
                            case 'TOKEN_DIVISION_PLAN':
                                file5.push(file);
                                break;
                            case 'LEGAL_REVIEW':
                                file6.push(file);
                                break;
                            case 'BUSINESS_LICENSE':
                                file7.push(file);
                                break;
                            case 'ETHICAL_WRITE_AUTH':
                                file8.push(file);
                                break;
                            case 'REGULATORY_COMPLIANCE':
                                file9.push(file);
                                break;
                            case 'ETC':
                                file10.push(file);
                                break;
                            case 'PERSONAL_INFO_REQ':
                                file11.push(file);
                                break;
                            case 'SHAREHOLDER':
                                file12.push(file);
                            default:
                                break;
                        }
                    });
                    setFileList1(file1);
                    setFileList2(file2);
                    setFileList3(file3);
                    setFileList4(file4);
                    setFileList5(file5);
                    setFileList6(file6);
                    setFileList7(file7);
                    setFileList8(file8);
                    setFileList9(file9);
                    setFileList10(file10);
                    setFileList11(file11);
                    setFileList11(file12);
                }
                break;
            case 'getUrlList':
                if (responseData.data.data) {
                    let urlList = responseData.data.data;
                    let file1 = [];
                    let file2 = [];
                    let file3 = [];
                    let file4 = [];
                    let file5 = [];
                    let file6 = [];
                    let file7 = [];
                    let file8 = [];
                    let file9 = [];
                    let file10 = [];
                    let file11 = [];
                    let file12 = [];
                    urlList.map((file, index) => {
                        switch (file.type) {
                            case 'IPO_APPLICATION':
                                file1.push(file);
                                break;
                            case 'COLLECT_CONFIRM':
                                file2.push(file);
                                break;
                            case 'PROJECT_WHITEPAPER':
                                file3.push(file);
                                break;
                            case 'TECH_REVIEW_REPORT':
                                file4.push(file);
                                break;
                            case 'TOKEN_DIVISION_PLAN':
                                file5.push(file);
                                break;
                            case 'LEGAL_REVIEW':
                                file6.push(file);
                                break;
                            case 'BUSINESS_LICENSE':
                                file7.push(file);
                                break;
                            case 'ETHICAL_WRITE_AUTH':
                                file8.push(file);
                                break;
                            case 'REGULATORY_COMPLIANCE':
                                file9.push(file);
                                break;
                            case 'ETC':
                                file10.push(file);
                                break;
                            case 'PERSONAL_INFO_REQ':
                                file11.push(file);
                                break;
                            case 'SHAREHOLDER':
                                file12.push(file);
                                break;
                            default:
                                break;
                        }
                    });
                    setDocList1(file1);
                    setDocList2(file2);
                    setDocList3(file3);
                    setDocList4(file4);
                    setDocList5(file5);
                    setDocList6(file6);
                    setDocList7(file7);
                    setDocList8(file8);
                    setDocList9(file9);
                    setDocList10(file10);
                    setDocList11(file11);
                    setDocList11(file12);
                }
                break;
            case 'insertData':
                if (responseData.data.data) {
                    alert('저장을 완료하였습니다.');
                }
                realodData();
                break;
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
            default:
                break;
        }
    }, [responseData]);

    const realodData = () => {
        // 거래지원 신청서 - 제출서류 조회 (파일)
        fileSearch(projectId);
        // 거래지원 신청서 - 제출서류 조회 (URL)
        urlSearch(projectId);
    };

    const handleClose = () => {
        setVisible(false);
    };
    const handleBlur = (e) => {
        console.log(e);
    };
    // 입력 박스 입력 시 호출
    const handleChange = (e) => {
        let { value, name } = e.target;
        if (e.target.type === 'checkbox') {
            value = e.target.checked;
        }
        setInputs({
            ...inputs, // 기존 input 객체 복사
            [name]: value
        });
    };

    // 입력 박스 입력 시 호출
    const fileHandleChange = (e) => {
        if (!e.target.files[0]) {
            setFilePart();
            return;
        }
        let { name } = e.target;
        setInputs({
            ...inputs, // 기존 input 객체 복사
            [name]: e.target.files[0].name
        });
        setFilePart(e.target.files[0]);
    };

    // URL Save
    const urlSave = (type, data) => {
        if (!data) {
            alert('URL 정보를 입력하지 않았습니다.');
            return;
        }
        if (confirm('저장하시겠습니까?')) {
            urlDocumentSave(type, data, projectId);
        }
    };

    const fileSave = (type, data) => {
        if (!data) {
            alert('파일을 업로드 하지 않았습니다.');
            return;
        }
        if (confirm('저장하시겠습니까?')) {
            const formData = new FormData();
            formData.append('file', file_part);
            formData.append('projectId', projectId);
            formData.append('fileName', data);
            formData.append('type', type);
            console.log(formData);
            fileDocumentSave(formData);
        }
    };

    const fileDownload = (file_status, fileKey, fileName) => {
        if (file_status === 'CLEAN') {
            setDownloadFileName(fileName);
            fileDocumentDownload(fileKey);
        } else {
            alert('파일을 다운로드 받을 수가 없습니다.');
        }
    };

    const tabChange = (event, value) => {
        setValue(value);
    };
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        // [`&.${tableCellClasses.head}`]: {
        //     backgroundColor: theme.palette.common.black,
        //     color: theme.palette.common.white
        // },
        [`&.${tableCellClasses.body}`]: {
            backgroundColor: '#e0e0e0', //theme.palette.common.black,
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
            <Grid sx={{ width: '100%', p: '1rem 2rem', bgcolor: '#fff' }}>
                <Typography variant="h4">제출 서류 관리</Typography>
            </Grid>
            <Grid container className="officeinfo__content--box">
                <ContentLine container className="common__grid--rowTable filemng__table">
                    <table className="tg">
                        <thead>
                            <tr>
                                <th className="tg-0pky"></th>
                                <th className="tg-0pky">url</th>
                                <th className="tg-0pky">파일</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th className="tg-0pky">1. 거래지원신청서</th>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField
                                            id="url1"
                                            name="url1"
                                            size="medium"
                                            value={url1}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            fullWidth
                                        />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => urlSave('IPO_APPLICATION', url1)}
                                        >
                                            저장
                                        </Button>
                                    </FlexBox> */}

                                    {docList1.map((item, index) => (
                                        <div className="filemng__file--list" key={index}>
                                            {/* 사용자 아이디 */}
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                {/* url 주소 */}
                                                <p className="filemng__file--url">
                                                    <a href={item.url} target="_blank" rel="noreferrer noopener">
                                                        {item.url}
                                                    </a>
                                                </p>
                                                {/* 날짜 */}
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField
                                            type="file"
                                            id="file1"
                                            name="file1"
                                            size="medium"
                                            fullWidth
                                            onChange={fileHandleChange}
                                            placeholder="클릭하여 파일을 선택해 주세요"
                                            inputProps={{
                                                accept:
                                                    '.doc, .docx, .xlsx, .xls, .ppt, .pptx, .ai, .mov, .mp4, .avi, .mkv, .jpg, .jpeg, .png, .gif, .pdf, .txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                            }}
                                        />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="button"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => fileSave('IPO_APPLICATION', file1)}
                                        >
                                            업로드
                                        </Button>
                                    </FlexBox> */}

                                    {fileList1.map((item, index) => (
                                        <div key={index} className="filemng__file--list">
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                <button
                                                    className="filemng__file--downlaod"
                                                    type="button"
                                                    disabled={item.file_status === 'CLEAN' ? false : true}
                                                    onClick={() => fileDownload(item.file_status, item.file_key, item.file_name)}
                                                >
                                                    {item.file_name}
                                                </button>
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                            </tr>

                            <tr>
                                <th className="tg-0pky">2. [별첨-1]개인정보 요청서</th>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField
                                            id="url11"
                                            name="url11"
                                            size="medium"
                                            value={url11}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            fullWidth
                                        />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => urlSave('PERSONAL_INFO_REQ', url11)}
                                        >
                                            저장
                                        </Button>
                                    </FlexBox> */}

                                    {docList11.map((item, index) => (
                                        <div className="filemng__file--list" key={index}>
                                            {/* 사용자 아이디 */}
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                {/* url 주소 */}
                                                <p className="filemng__file--url">
                                                    <a href={item.url} target="_blank" rel="noreferrer noopener">
                                                        {item.url}
                                                    </a>
                                                </p>
                                                {/* 날짜 */}
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField
                                            type="file"
                                            id="file11"
                                            name="file11"
                                            size="medium"
                                            fullWidth
                                            onChange={fileHandleChange}
                                            placeholder="클릭하여 파일을 선택해 주세요."
                                            inputProps={{
                                                accept:
                                                    '.doc, .docx, .xlsx, .xls, .ppt, .pptx, .ai, .mov, .mp4, .avi, .mkv, .jpg, .jpeg, .png, .gif, .pdf, .txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                            }}
                                        />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="button"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => fileSave('PERSONAL_INFO_REQ', file11)}
                                        >
                                            업로드
                                        </Button>
                                    </FlexBox> */}

                                    {fileList11.map((item, index) => (
                                        <div key={index} className="filemng__file--list">
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                <button
                                                    className="filemng__file--downlaod"
                                                    type="button"
                                                    onClick={() => fileDownload(item.file_key, item.file_name)}
                                                >
                                                    {item.file_name}
                                                </button>
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                            </tr>

                            <tr>
                                <th className="tg-0pky">3. 개인정보 수집 및 이용동의서</th>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField id="url2" name="url2" fullWidth size="medium" value={url2} onChange={handleChange} />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => urlSave('COLLECT_CONFIRM', url2)}
                                        >
                                            저장
                                        </Button>
                                    </FlexBox> */}

                                    {docList2.map((item, index) => (
                                        <div className="filemng__file--list" key={index}>
                                            {/* 사용자 아이디 */}
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                {/* url 주소 */}
                                                <p className="filemng__file--url">
                                                    <a href={item.url} target="_blank" rel="noreferrer noopener">
                                                        {item.url}
                                                    </a>
                                                </p>
                                                {/* 날짜 */}
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField
                                            type="file"
                                            id="file2"
                                            name="file2"
                                            size="medium"
                                            fullWidth
                                            onChange={fileHandleChange}
                                            inputProps={{
                                                accept:
                                                    '.doc, .docx, .xlsx, .xls, .ppt, .pptx, .ai, .mov, .mp4, .avi, .mkv, .jpg, .jpeg, .png, .gif, .pdf, .txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                            }}
                                        />

                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="button"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => fileSave('COLLECT_CONFIRM', file2)}
                                        >
                                            업로드
                                        </Button>
                                    </FlexBox> */}
                                    {fileList2.map((item, index) => (
                                        <div key={index} className="filemng__file--list">
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                <button
                                                    className="filemng__file--downlaod"
                                                    type="button"
                                                    onClick={() => fileDownload(item.file_key, item.file_name)}
                                                >
                                                    {item.file_name}
                                                </button>
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                            </tr>
                            <tr>
                                <th className="tg-0pky">4. 프로젝트 백서</th>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField id="url3" name="url3" fullWidth size="medium" value={url3} onChange={handleChange} />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => urlSave('PROJECT_WHITEPAPER', url3)}
                                        >
                                            저장
                                        </Button>
                                    </FlexBox> */}

                                    {docList3.map((item, index) => (
                                        <div className="filemng__file--list" key={index}>
                                            {/* 사용자 아이디 */}
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                {/* url 주소 */}
                                                <p className="filemng__file--url">
                                                    <a href={item.url} target="_blank" rel="noreferrer noopener">
                                                        {item.url}
                                                    </a>
                                                </p>
                                                {/* 날짜 */}
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField
                                            type="file"
                                            id="file3"
                                            name="file3"
                                            size="medium"
                                            fullWidth
                                            onChange={fileHandleChange}
                                            inputProps={{
                                                accept:
                                                    '.doc, .docx, .xlsx, .xls, .ppt, .pptx, .ai, .mov, .mp4, .avi, .mkv, .jpg, .jpeg, .png, .gif, .pdf, .txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                            }}
                                        />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="button"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => fileSave('PROJECT_WHITEPAPER', file3)}
                                        >
                                            업로드
                                        </Button>
                                    </FlexBox> */}
                                    {fileList3.map((item, index) => (
                                        <div key={index} className="filemng__file--list">
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                <button
                                                    className="filemng__file--downlaod"
                                                    type="button"
                                                    onClick={() => fileDownload(item.file_key, item.file_name)}
                                                >
                                                    {item.file_name}
                                                </button>
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                            </tr>
                            <tr>
                                <th className="tg-0pky">5. 기술검토보고서</th>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField
                                            id="url4"
                                            name="url4"
                                            size="medium"
                                            value={url4}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            fullWidth
                                        />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => urlSave('TECH_REVIEW_REPORT', url4)}
                                        >
                                            저장
                                        </Button>
                                    </FlexBox> */}
                                    {docList4.map((item, index) => (
                                        <div className="filemng__file--list" key={index}>
                                            {/* 사용자 아이디 */}
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                {/* url 주소 */}
                                                <p className="filemng__file--url">
                                                    <a href={item.url} target="_blank" rel="noreferrer noopener">
                                                        {item.url}
                                                    </a>
                                                </p>
                                                {/* 날짜 */}
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField
                                            type="file"
                                            id="file4"
                                            name="file4"
                                            size="medium"
                                            fullWidth
                                            onChange={fileHandleChange}
                                            inputProps={{
                                                accept:
                                                    '.doc, .docx, .xlsx, .xls, .ppt, .pptx, .ai, .mov, .mp4, .avi, .mkv, .jpg, .jpeg, .png, .gif, .pdf, .txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                            }}
                                        />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="button"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => fileSave('TECH_REVIEW_REPORT', file4)}
                                        >
                                            업로드
                                        </Button>
                                    </FlexBox> */}
                                    {fileList4.map((item, index) => (
                                        <div key={index} className="filemng__file--list">
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                <button
                                                    className="filemng__file--downlaod"
                                                    type="button"
                                                    onClick={() => fileDownload(item.file_key, item.file_name)}
                                                >
                                                    {item.file_name}
                                                </button>
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                            </tr>
                            <tr>
                                <th className="tg-0pky">6. 토큰 분배 계획서(Token matrix)</th>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField
                                            id="url5"
                                            name="url5"
                                            size="medium"
                                            value={url5}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            fullWidth
                                        />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => urlSave('TOKEN_DIVISION_PLAN', url5)}
                                        >
                                            저장
                                        </Button>
                                    </FlexBox> */}
                                    {docList5.map((item, index) => (
                                        <div className="filemng__file--list" key={index}>
                                            {/* 사용자 아이디 */}
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                {/* url 주소 */}
                                                <p className="filemng__file--url">
                                                    <a href={item.url} target="_blank" rel="noreferrer noopener">
                                                        {item.url}
                                                    </a>
                                                </p>
                                                {/* 날짜 */}
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField
                                            type="file"
                                            id="file5"
                                            name="file5"
                                            size="medium"
                                            fullWidth
                                            onChange={fileHandleChange}
                                            inputProps={{
                                                accept:
                                                    '.doc, .docx, .xlsx, .xls, .ppt, .pptx, .ai, .mov, .mp4, .avi, .mkv, .jpg, .jpeg, .png, .gif, .pdf, .txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                            }}
                                        />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="button"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => fileSave('TOKEN_DIVISION_PLAN', file5)}
                                        >
                                            업로드
                                        </Button>
                                    </FlexBox> */}
                                    {fileList5.map((item, index) => (
                                        <div key={index} className="filemng__file--list">
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                <button
                                                    className="filemng__file--downlaod"
                                                    type="button"
                                                    onClick={() => fileDownload(item.file_key, item.file_name)}
                                                >
                                                    {item.file_name}
                                                </button>
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                            </tr>
                            <tr>
                                <th className="tg-0pky">7. 법률 검토 의견서</th>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField
                                            id="url6"
                                            name="url6"
                                            size="medium"
                                            value={url6}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            fullWidth
                                        />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => urlSave('LEGAL_REVIEW', url6)}
                                        >
                                            저장
                                        </Button>
                                    </FlexBox> */}
                                    {docList6.map((item, index) => (
                                        <div className="filemng__file--list" key={index}>
                                            {/* 사용자 아이디 */}
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                {/* url 주소 */}
                                                <p className="filemng__file--url">
                                                    <a href={item.url} target="_blank" rel="noreferrer noopener">
                                                        {item.url}
                                                    </a>
                                                </p>
                                                {/* 날짜 */}
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField
                                            type="file"
                                            id="file6"
                                            name="file6"
                                            size="medium"
                                            fullWidth
                                            onChange={fileHandleChange}
                                            inputProps={{
                                                accept:
                                                    '.doc, .docx, .xlsx, .xls, .ppt, .pptx, .ai, .mov, .mp4, .avi, .mkv, .jpg, .jpeg, .png, .gif, .pdf, .txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                            }}
                                        />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="button"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => fileSave('LEGAL_REVIEW', file6)}
                                        >
                                            업로드
                                        </Button>
                                    </FlexBox> */}
                                    {fileList6.map((item, index) => (
                                        <div key={index} className="filemng__file--list">
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                <button
                                                    className="filemng__file--downlaod"
                                                    type="button"
                                                    onClick={() => fileDownload(item.file_key, item.file_name)}
                                                >
                                                    {item.file_name}
                                                </button>
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                            </tr>
                            <tr>
                                <th className="tg-0pky">8. 사업자등록증</th>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField
                                            id="url7"
                                            name="url7"
                                            size="medium"
                                            value={url7}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            fullWidth
                                        />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => urlSave('LBUSINESS_LICENSE', url7)}
                                        >
                                            저장
                                        </Button>
                                    </FlexBox> */}
                                    {docList7.map((item, index) => (
                                        <div className="filemng__file--list" key={index}>
                                            {/* 사용자 아이디 */}
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                {/* url 주소 */}
                                                <p className="filemng__file--url">
                                                    <a href={item.url} target="_blank" rel="noreferrer noopener">
                                                        {item.url}
                                                    </a>
                                                </p>
                                                {/* 날짜 */}
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField
                                            type="file"
                                            id="file7"
                                            name="file7"
                                            size="medium"
                                            fullWidth
                                            onChange={fileHandleChange}
                                            inputProps={{
                                                accept:
                                                    '.doc, .docx, .xlsx, .xls, .ppt, .pptx, .ai, .mov, .mp4, .avi, .mkv, .jpg, .jpeg, .png, .gif, .pdf, .txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                            }}
                                        />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="button"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => fileSave('LBUSINESS_LICENSE', file7)}
                                        >
                                            업로드
                                        </Button>
                                    </FlexBox> */}
                                    {fileList7.map((item, index) => (
                                        <div key={index} className="filemng__file--list">
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                <button
                                                    className="filemng__file--downlaod"
                                                    type="button"
                                                    onClick={() => fileDownload(item.file_key, item.file_name)}
                                                >
                                                    {item.file_name}
                                                </button>
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                            </tr>

                            <tr>
                                <th className="tg-0pky">9. 주주명부</th>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField
                                            id="url9"
                                            name="url9"
                                            size="medium"
                                            value={url9}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            fullWidth
                                        />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => urlSave('REGULATORY_COMPLIANCE', url9)}
                                        >
                                            저장
                                        </Button>
                                    </FlexBox> */}
                                    {docList12.map((item, index) => (
                                        <div className="filemng__file--list" key={index}>
                                            {/* 사용자 아이디 */}
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                {/* url 주소 */}
                                                <p className="filemng__file--url">
                                                    <a href={item.url} target="_blank" rel="noreferrer noopener">
                                                        {item.url}
                                                    </a>
                                                </p>
                                                {/* 날짜 */}
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField
                                            type="file"
                                            id="file9"
                                            name="file9"
                                            size="medium"
                                            fullWidth
                                            onChange={fileHandleChange}
                                            inputProps={{
                                                accept:
                                                    '.doc, .docx, .xlsx, .xls, .ppt, .pptx, .ai, .mov, .mp4, .avi, .mkv, .jpg, .jpeg, .png, .gif, .pdf, .txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                            }}
                                        />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="button"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => fileSave('ETHICAL_WRITE_AUTH', file9)}
                                        >
                                            업로드
                                        </Button>
                                    </FlexBox> */}
                                    {fileList12.map((item, index) => (
                                        <div key={index} className="filemng__file--list">
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                <button
                                                    className="filemng__file--downlaod"
                                                    type="button"
                                                    onClick={() => fileDownload(item.file_key, item.file_name)}
                                                >
                                                    {item.file_name}
                                                </button>
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                            </tr>

                            <tr>
                                <th className="tg-0pky">10. 규제준수 확약서</th>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField
                                            id="url9"
                                            name="url9"
                                            size="medium"
                                            value={url9}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            fullWidth
                                        />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => urlSave('REGULATORY_COMPLIANCE', url9)}
                                        >
                                            저장
                                        </Button>
                                    </FlexBox> */}
                                    {docList9.map((item, index) => (
                                        <div className="filemng__file--list" key={index}>
                                            {/* 사용자 아이디 */}
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                {/* url 주소 */}
                                                <p className="filemng__file--url">
                                                    <a href={item.url} target="_blank" rel="noreferrer noopener">
                                                        {item.url}
                                                    </a>
                                                </p>
                                                {/* 날짜 */}
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField
                                            type="file"
                                            id="file9"
                                            name="file9"
                                            size="medium"
                                            fullWidth
                                            onChange={fileHandleChange}
                                            inputProps={{
                                                accept:
                                                    '.doc, .docx, .xlsx, .xls, .ppt, .pptx, .ai, .mov, .mp4, .avi, .mkv, .jpg, .jpeg, .png, .gif, .pdf, .txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                            }}
                                        />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="button"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => fileSave('ETHICAL_WRITE_AUTH', file9)}
                                        >
                                            업로드
                                        </Button>
                                    </FlexBox> */}
                                    {fileList9.map((item, index) => (
                                        <div key={index} className="filemng__file--list">
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                <button
                                                    className="filemng__file--downlaod"
                                                    type="button"
                                                    onClick={() => fileDownload(item.file_key, item.file_name)}
                                                >
                                                    {item.file_name}
                                                </button>
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                            </tr>
                            <tr>
                                <th className="tg-0pky">11. 윤리서약서</th>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField
                                            id="url8"
                                            name="url8"
                                            size="medium"
                                            value={url8}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            fullWidth
                                        />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => urlSave('ETHICAL_WRITE_AUTH', url8)}
                                        >
                                            저장
                                        </Button>
                                    </FlexBox> */}
                                    {docList8.map((item, index) => (
                                        <div className="filemng__file--list" key={index}>
                                            {/* 사용자 아이디 */}
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                {/* url 주소 */}
                                                <p className="filemng__file--url">
                                                    <a href={item.url} target="_blank" rel="noreferrer noopener">
                                                        {item.url}
                                                    </a>
                                                </p>
                                                {/* 날짜 */}
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField
                                            type="file"
                                            id="file8"
                                            name="file8"
                                            size="medium"
                                            fullWidth
                                            onChange={fileHandleChange}
                                            inputProps={{
                                                accept:
                                                    '.doc, .docx, .xlsx, .xls, .ppt, .pptx, .ai, .mov, .mp4, .avi, .mkv, .jpg, .jpeg, .png, .gif, .pdf, .txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                            }}
                                        />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="button"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => fileSave('ETHICAL_WRITE_AUTH', file8)}
                                        >
                                            업로드
                                        </Button>
                                    </FlexBox> */}
                                    {fileList8.map((item, index) => (
                                        <div key={index} className="filemng__file--list">
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                <button
                                                    className="filemng__file--downlaod"
                                                    type="button"
                                                    onClick={() => fileDownload(item.file_key, item.file_name)}
                                                >
                                                    {item.file_name}
                                                </button>
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                            </tr>

                            <tr>
                                <th className="tg-0pky">12. 기타</th>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField
                                            id="url10"
                                            name="url10"
                                            size="medium"
                                            value={url10}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            fullWidth
                                        />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => urlSave('ETC', url10)}
                                        >
                                            저장
                                        </Button>
                                    </FlexBox> */}
                                    {docList10.map((item, index) => (
                                        <div className="filemng__file--list" key={index}>
                                            {/* 사용자 아이디 */}
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                {/* url 주소 */}
                                                <p className="filemng__file--url">
                                                    <a href={item.url} target="_blank" rel="noreferrer noopener">
                                                        {item.url}
                                                    </a>
                                                </p>
                                                {/* 날짜 */}
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                                <td className="tg-0pky">
                                    {/* <FlexBox>
                                        <TextField
                                            type="file"
                                            id="file10"
                                            name="file10"
                                            size="medium"
                                            fullWidth
                                            onChange={fileHandleChange}
                                            inputProps={{
                                                accept:
                                                    '.doc, .docx, .xlsx, .xls, .ppt, .pptx, .ai, .mov, .mp4, .avi, .mkv, .jpg, .jpeg, .png, .gif, .pdf, .txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                            }}
                                        />
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="button"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => fileSave('ETC', file10)}
                                        >
                                            업로드
                                        </Button>
                                    </FlexBox> */}
                                    {fileList10.map((item, index) => (
                                        <div key={index} className="filemng__file--list">
                                            <h6 className="filemng__file--id">{item.email}</h6>
                                            <div className="filemng__file--con">
                                                <button
                                                    className="filemng__file--downlaod"
                                                    type="button"
                                                    onClick={() => fileDownload(item.file_key, item.file_name)}
                                                >
                                                    {item.file_name}
                                                </button>
                                                <p className="filemng__file--date">{item.create_date.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </ContentLine>
            </Grid>
        </Grid>
    );
};

export default FileMng;
