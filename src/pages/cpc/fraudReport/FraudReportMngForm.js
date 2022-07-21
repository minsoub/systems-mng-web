import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './styles.module.scss';
import { Button, Grid, TextField, FormControl, Checkbox, FormControlLabel } from '@mui/material';
import FraudReportApi from 'apis/cpc/fraudReport/fraudreportapi';
import ErrorScreen from 'components/ErrorScreen';
import HeaderTitle from 'components/HeaderTitle';
import cx from 'classnames';
import InputLayout from 'components/Common/InputLayout';
import ButtonLayout from 'components/Common/ButtonLayout';
import TopInputLayout from 'components/Common/TopInputLayout';

const FraudReportMngForm = () => {
    const navigate = useNavigate();
    const { applyId } = useParams();
    const [responseData, requestError, resLoading, { searchFraudReport, updateFraudReport, getFileDownload }] = FraudReportApi();

    ////////////////////////////////////////////////////
    // 공통 에러 처리
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    ////////////////////////////////////////////////////

    // 입력 값
    const [id, setId] = useState('');
    const [status, setStatus] = useState('');
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('');
    const [contents, setContents] = useState('');
    const [entrust_privacy, setEntrustPrivacy] = useState('');
    const [terms_privacy, setTermsPrivacy] = useState('');
    const [answer_to_contacts, setAnswerToContacts] = useState('');
    const [answer, setAnswer] = useState('');
    const [send_to_email, setSendToEmail] = useState(false);
    const [attach_file_id, setAttachFileId] = useState('');
    const [attach_file_name, setAttachFileName] = useState('');
    const [create_date, setCreateDate] = useState('');
    const [downloadFileName, setDownloadFileName] = useState('');

    // onload
    useEffect(() => {
        setId(applyId);
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

    // Transaction Return
    useEffect(() => {
        if (id) {
            searchFraudReport(id);
        }
    }, [id]);

    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getFraudReport':
                setStatus(responseData.data.data.status);
                setEmail(responseData.data.data.email);
                setTitle(responseData.data.data.title);
                setContents(responseData.data.data.contents);
                setEntrustPrivacy(responseData.data.data.entrust_privacy);
                setTermsPrivacy(responseData.data.data.terms_privacy);
                setAnswerToContacts(responseData.data.data.answer_to_contacts);
                setAnswer(responseData.data.data.answer);
                setAttachFileId(responseData.data.data.attach_file_id);
                setAttachFileName(responseData.data.data.attach_file_name);
                setCreateDate(responseData.data.data.create_date);
                break;
            case 'updateFraudReport':
                alert('저장되었습니다.');
                break;
            case 'getFileDownload':
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
            case 'answer':
                setAnswer(e.target.value);
                break;
            case 'send_to_email':
                setSendToEmail(e.target.checked);
                break;
            default:
                break;
        }
    };

    // 파일 다운로드
    const downloadClick = () => {
        if (attach_file_id) {
            setDownloadFileName(attach_file_name);
            getFileDownload(attach_file_id);
        }
    };

    // 목록
    const listClick = () => {
        console.log('listClick called...');
        navigate('/cpc/fraud-report/list');
    };

    const isValidate = () => {
        if (!answer) {
            alert('답변을 입력해주세요.');
            return false;
        }
        return true;
    };

    // 저장
    const saveClick = () => {
        console.log('saveClick called...');
        if (!isValidate()) return;
        if (confirm('저장 하시겠습니까?')) {
            const data = {
                id,
                answer,
                send_to_email
            };
            console.log(data);
            updateFraudReport(data);
        }
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle titleNm="사기신고 관리" menuStep01="사이트 운영" menuStep02="사기신고 관리" />

                <div className={cx('common-grid--layout')}>
                    <table>
                        <tbody>
                            <tr>
                                <th className={'tb--title'} style={{ minWidth: '250px' }}>
                                    상태
                                </th>
                                <td>
                                    <>
                                        {status === 'REGISTER' && '접수'}
                                        {status === 'REQUEST' && '답변요청'}
                                        {status === 'COMPLETE' && '답변완료'}
                                    </>
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>제보자</th>
                                <td>{email}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>제목</th>
                                <td>{title}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>내용</th>
                                <td>{contents}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>개인정보 취급 동의</th>
                                <td>{entrust_privacy === true ? 'Y' : 'N'}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>개인정보 수집 및 이용 동의</th>
                                <td>{terms_privacy === true ? 'Y' : 'N'}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>첨부파일</th>
                                <td>
                                    <Button onClick={downloadClick} variant="text" color="primary">
                                        {attach_file_name}
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>답변</th>
                                <td>
                                    <TextField
                                        id="filled-hidden-label-small"
                                        type="text"
                                        size="small"
                                        value={answer}
                                        name="answer"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="답변을 입력하세요."
                                        fullWidth
                                        multiline
                                        minRows={4}
                                    />

                                    {answer_to_contacts && (
                                        <Grid item xs>
                                            <FormControl sx={{ m: 0 }} size="small" required fullWidth>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox checked={send_to_email} name="send_to_email" onChange={handleChange} />
                                                    }
                                                    label="이메일로 답변하기"
                                                />
                                            </FormControl>
                                        </Grid>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>등록일시</th>
                                <td>{create_date}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <TopInputLayout>
                    <InputLayout>
                        <Button disableElevation size="small" type="submit" variant="contained" color="secondary" onClick={listClick}>
                            목록
                        </Button>
                    </InputLayout>
                    <ButtonLayout>
                        <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={saveClick}>
                            저장
                        </Button>
                    </ButtonLayout>
                </TopInputLayout>

                {errorMessage && (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                )}
            </Grid>
        </Grid>
    );
};

export default FraudReportMngForm;
