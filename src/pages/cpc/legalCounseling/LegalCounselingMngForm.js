import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './styles.scss';
import { Button, Grid, TextField, FormControl, Checkbox, FormControlLabel } from '@mui/material';
import LegalCounselingApi from 'apis/cpc/legalCounseling/regalcounselingapi';
import ErrorScreen from 'components/ErrorScreen';
import HeaderTitle from 'components/HeaderTitle';
import cx from 'classnames';
import DetailBoardContent from 'components/DetailBoard/Content';
import ButtonLayout from 'components/Common/ButtonLayout';

const LegalCounselingMngForm = () => {
    const navigate = useNavigate();
    const { applyId } = useParams();
    const [
        responseData,
        requestError,
        resLoading,
        { searchLegalCounseling, updateLegalCounseling, getFileDownload }
    ] = LegalCounselingApi();

    ////////////////////////////////////////////////////
    // 공통 에러 처리
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    ////////////////////////////////////////////////////

    // 입력 값
    const [id, setId] = useState('');
    const [status, setStatus] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cell_phone, setCellPhone] = useState('');
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
            searchLegalCounseling(id);
        }
    }, [id]);

    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getLegalCounseling':
                setStatus(responseData.data.data.status);
                setName(responseData.data.data.name);
                setEmail(responseData.data.data.email);
                setCellPhone(responseData.data.data.cell_phone);
                setContents(responseData.data.data.contents);
                setEntrustPrivacy(responseData.data.data.entrust_privacy);
                setTermsPrivacy(responseData.data.data.terms_privacy);
                setAnswerToContacts(responseData.data.data.answer_to_contacts);
                setAnswer(responseData.data.data.answer);
                setAttachFileId(responseData.data.data.attach_file_id);
                setAttachFileName(responseData.data.data.attach_file_name);
                setCreateDate(responseData.data.data.create_date);
                break;
            case 'updateLegalCounseling':
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
        navigate('/cpc/legal-counseling/list');
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
            updateLegalCounseling(data);
        }
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle titleNm="법률 상담 관리" menuStep01="사이트 운영" menuStep02="법률 상담 관리" />

                <table className={cx('content--table')}>
                    <DetailBoardContent
                        titleNm="상태"
                        children={
                            <>
                                {status === 'REGISTER' && '접수'}
                                {status === 'REQUEST' && '답변요청'}
                                {status === 'COMPLETE' && '답변완료'}
                            </>
                        }
                    />
                    <DetailBoardContent titleNm="이름" children={name} />
                    <DetailBoardContent titleNm="이메일주소" children={email} />
                    <DetailBoardContent titleNm="전화번호" children={cell_phone} />
                    <DetailBoardContent titleNm="내용" children={contents} />
                    <DetailBoardContent titleNm="개인정보 취급 동의" children={entrust_privacy === true ? 'Y' : 'N'} />
                    <DetailBoardContent titleNm="개인정보 수집 및 이용 동의" children={terms_privacy === true ? 'Y' : 'N'} />
                    <DetailBoardContent
                        titleNm="첨부파일"
                        children={
                            <Button onClick={downloadClick} variant="text" color="primary">
                                {attach_file_name}
                            </Button>
                        }
                    />
                    <DetailBoardContent
                        titleNm="답변"
                        children={
                            <>
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
                                                control={<Checkbox checked={send_to_email} name="send_to_email" onChange={handleChange} />}
                                                label="이메일로 답변하기"
                                            />
                                        </FormControl>
                                    </Grid>
                                )}
                            </>
                        }
                    />
                    <DetailBoardContent titleNm="등록일시" children={create_date} />
                </table>

                <ButtonLayout buttonName="content--right__button">
                    <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={listClick}>
                        목록
                    </Button>

                    <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={saveClick}>
                        저장
                    </Button>
                </ButtonLayout>
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} />
            </Grid>
        </Grid>
    );
};

export default LegalCounselingMngForm;
