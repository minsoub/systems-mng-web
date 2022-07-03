import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// material-ui
// eslint-disable-next-line prettier/prettier
import {
    Button,
    Grid,
    Stack,
    TextField,
    Typography,
    FormControl,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import MainCard from 'components/MainCard';
import FraudReportApi from 'apis/cpc/fraudReport/fraudreportapi';
import ErrorScreen from 'components/ErrorScreen';

const FraudReportMngForm = () => {
    const navigate = useNavigate();
    const { applyId } = useParams();
    const [responseData, requestError, resLoading, { searchFraudReport, updateFraudReport }] = FraudReportApi();

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
    const [terms_privacy, setTermsPrivacy] = useState('');
    const [answer_to_contacts, setAnswerToContacts] = useState('');
    const [answer, setAnswer] = useState('');
    const [send_to_email, setSendToEmail] = useState(false);
    const [attach_file_id, setAttachFileId] = useState('');
    const [attach_file_name, setAttachFileName] = useState('');
    const [create_date, setCreateDate] = useState('');

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
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h3">사고신고 관리</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">Home &gt; 사이트 운영 &gt; 사고신고 관리</Typography>
                    </Grid>
                    <Grid container spacing={2}></Grid>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <Grid container spacing={3} mt={1}>
                        <Grid item xs={8} sm={1.5}>
                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                <Stack spacing={0}>상태</Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs mr={1}>
                            {status === 'REGISTER' && '접수'}
                            {status === 'REQUEST' && '답변요청'}
                            {status === 'COMPLETE' && '답변완료'}
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={8} sm={1.5}>
                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                <Stack spacing={0}>제보자</Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs mr={1}>
                            {email}
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={8} sm={1.5}>
                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                <Stack spacing={0}>제목</Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs mr={1}>
                            {title}
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={8} sm={1.5}>
                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                <Stack spacing={0}>내용</Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs mr={1}>
                            {contents}
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={8} sm={1.5}>
                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                <Stack spacing={0}>개인정보 수집 및 이용 동의</Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs mr={1}>
                            {terms_privacy === true ? 'Y' : 'N'}
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={8} sm={1.5}>
                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                <Stack spacing={0}>첨부파일</Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs mr={1}>
                            {attach_file_name}
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={8} sm={1.5}>
                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                <Stack spacing={0}>답변</Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs mr={1}>
                            <Grid item xs>
                                <FormControl sx={{ m: 0 }} size="small" required fullWidth>
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
                                </FormControl>
                            </Grid>
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
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={8} sm={1.5}>
                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                <Stack spacing={0}>등록일시</Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs mr={1}>
                            {create_date}
                        </Grid>
                    </Grid>
                </MainCard>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={8} sm={0.8}>
                        <FormControl sx={{ m: 1 }} size="small">
                            <Button disableElevation size="small" type="submit" variant="contained" color="secondary" onClick={listClick}>
                                목록
                            </Button>
                        </FormControl>
                    </Grid>
                    <Grid container xs={8} direction="row" justifyContent="flex-end" alignItems="center">
                        <Grid item xs={8} sm={1}>
                            <FormControl sx={{ m: 1 }} size="small">
                                <Button disableElevation size="small" type="submit" variant="contained" color="primary" onClick={saveClick}>
                                    저장
                                </Button>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} />
            </Grid>
        </Grid>
    );
};

export default FraudReportMngForm;
