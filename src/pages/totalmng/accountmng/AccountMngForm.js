import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
    Alert,
    AlertTitle,
    Button,
    Checkbox,
    Collapse,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    Stack,
    TextField
} from '@mui/material';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import MainCard from 'components/Common/MainCard';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AccountApis from 'apis/account/accountapis';
import SiteApi from 'apis/site/siteapi';
import HeaderTitle from '../../../components/HeaderTitle';
import DropInput from '../../../components/Common/DropInput';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import './styles.scss';
import cx from 'classnames';
import SearchDate from '../../../components/ContentManage/SearchDate';

const AccountMngForm = () => {
    let isSubmitting = false;

    const navigate = useNavigate();
    const { paramId } = useParams();
    const [
        responseData,
        requestError,
        loading,
        { accountSearch, accountMngInsert, accountMngDetail, accountMngUpdate, accountDeletes }
    ] = AccountApis();
    const [resData, reqErr, resLoading, { siteSearch }] = SiteApi();

    // Alert Dialog
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Form data
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [is_use, setIsUse] = useState(true);
    const [id, setId] = useState('');
    const [status, setStatus] = useState('');
    const [valid_start_date, setValidStartDate] = useState('');
    const [valid_end_date, setValidEndDate] = useState('');

    // Email 작성 여부
    const [emailStatus, setEmailStatus] = useState(false);

    // Email 중복 체크
    const [emailChk, setEmailChk] = useState(false);

    // 중복 체크 버튼 제어
    const [isUpdate, setIsUpdate] = useState(false);

    // transaction error 처리
    useEffect(() => {
        if (requestError || reqErr) {
            let er = requestError ? requestError : reqErr;
            console.log('error requestError');
            console.log(er);
            setErrorTitle('Error Message');
            setErrorMessage(requestError);
            setOpen(true);
        }
    }, [requestError, reqErr]);

    // onload
    useEffect(() => {
        errorClear();
        // detail search - 수정모드이면
        if (paramId) {
            // 수정 데이터 조회
            accountMngDetail(paramId);
        } else {
            setIsUpdate(false);
            setValidStartDate(currentDate);
        }
    }, []);

    // 에러 정보를 클리어 한다.
    const errorClear = () => {
        setOpen(false);
        setErrorTitle('');
        setErrorMessage('');
    };

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        console.log(responseData);
        console.log(responseData.transactionId);
        switch (responseData.transactionId) {
            case 'getList': // Email 중복 체크
                if (responseData.data.data.length > 0) {
                    // 중복이다.
                    alert('이미 등록된 메일 주소입니다.');
                    setEmailChk(false);
                } else {
                    // 중복이 아니다.
                    alert('사용 가능한 이메일 주소입니다.');
                    setEmailChk(true);
                }
                break;
            case 'insertData':
                alert('등록을 완료하였습니다.');
                navigate('/accountmng/list');
                break;
            case 'updateData':
                alert('수정을 완료하였습니다.');
                navigate('/accountmng/list');
                break;
            case 'getData': // 수정 모드
                if (responseData.data.data) {
                    let res = responseData.data.data;
                    setId(res.id);
                    setEmail(res.email);
                    setName(res.name);
                    //setPassword(res.password);
                    setIsUse(res.is_use);
                    setStatus(res.status);
                    setEmailStatus(true);
                    setIsUpdate(true);
                    setEmailChk(true);
                    setValidStartDate(res.valid_start_date);
                    setValidEndDate(res.valid_end_date);
                }
                break;
            case 'deleteDatas':
                console.log('deleteData');
                alert('삭제 처리를 완료하였습니다.');
                navigate('/accountmng/list');
                break;
            default:
        }
    }, [responseData]);
    const resetPeriod = () => {
        //setPeriod(0);
    };
    const changeDate = (type, e) => {
        switch (type) {
            case 'start':
                setValidStartDate(e);
                break;
            case 'end':
                setValidEndDate(e);
                break;
            default:
                break;
        }
    };
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'name':
                setName(e.target.value);
                break;
            case 'is_use':
                setIsUse(e.target.checked);
                break;
            case 'email':
                setEmail(e.target.value);
                setEmailChk(false);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
            case 'valid_start_date':
                setValidStartDate(e.target.value);
                break;
            case 'valid_end_date':
                setValidEndDate(e.target.value);
                break;
            default:
                break;
        }
    };
    const handleBlur = (e) => {
        console.log(e);
    };

    const handleClose = () => {
        setVisible(false);
    };

    // new
    const newClick = () => {
        setEmail('');
        setName('');
        setPassword('');
        setIsUse(true);
        setId('');
        setStatus('');
        setEmailStatus(false);
        setEmailChk(false);
        setIsUpdate(false);
        setValidStartDate(currentDate);
        navigate('/accountmng/reg');
    };

    const currentDate = () => {
        const date = new Date();
        return `${String(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    // list
    const listClick = () => {
        navigate('/accountmng/list');
    };

    const deleteClick = () => {
        if (confirm('삭제를 하시겠습니까?')) {
            // 선택한 계정에 대해서 삭제를 수행한다.
            accountDeletes(id);
        }
    };

    // Email Duplicate Check
    const emailDuplicateCheck = () => {
        const regEmail = /^[a-zA-Z0-9._!#$%&*+-/=?^{}~]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]+$/i; //  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
        if (regEmail.test(email) === false) {
            alert('정확한 메일주소를 입력해 주세요.');
            return;
        }
        // 메일 주소 중복 체크를 한다.
        if (email === '') {
            alert('메일 주소를 입력 후 중복 체크 해주시기 바랍니다.');
            return;
        }
        accountSearch(null, email);
    };

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    name: '',
                    password: '',
                    is_use: true,
                    submit: null
                }}
                validationSchema={Yup.object().shape({})}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        // Validation check
                        if (email === '') {
                            // setErrorTitle('입력 오류');
                            // setErrorMessage('Email주소를 입력하지 않았습니다');
                            // setOpen(true);
                            alert('이메일 주소를 입력해 주세요.');
                            return;
                        }
                        if (emailChk === false) {
                            // setErrorTitle('입력 오류');
                            // setErrorMessage('Email주소를 입력하지 않았습니다');
                            // setOpen(true);
                            alert('이메일 주소 중복체크를 선택해 주세요.');
                            return;
                        }
                        if (name === '') {
                            // setErrorTitle('입력 오류');
                            // setErrorMessage('Name을 입력하지 않았습니다');
                            // setOpen(true);
                            alert('이름을 입력해 주세요.');
                            return;
                        }
                        // 패스워드는 수정 모드일 때 생략이 가능하다. 다른 정보 저장 목적.
                        if (password === '' && !paramId) {
                            // setErrorTitle('입력 오류');
                            // setErrorMessage('Password를 입력하지 않았습니다');
                            // setOpen(true);
                            alert('비밀번호를 입력해 주세요.');
                            return;
                        }
                        // 비밀번호 입력 시 유효성 체크
                        if (password.length > 0) {
                            // 비밀번호 로직 체크
                            const regex = /^.*(?=^.{8,64}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^*]).*$/; // /^(?=.*\d)(?=.*[a-zA-Z~!@#$%^&*_])[0-9a-zA-Z~!@#$%^&*_]{8,64}$/;
                            if (!regex.test(password)) {
                                alert('패스워드 형식에 일치하지 않습니다.');
                                return;
                            }
                        }
                        if (valid_start_date === '' || valid_end_date === '') {
                            alert('계정의 유효기간을 선택해 주세요.');
                            return;
                        }
                        if (valid_start_date > valid_end_date) {
                            alert('종료 기간을 시작 기간 이전으로 선택할 수 없습니다.');
                            return;
                        }
                        // Data 가공
                        setOpen(false);
                        const requestData = {
                            email: email,
                            name: name,
                            password: password,
                            status: 'INIT_REGISTER',
                            is_use: is_use,
                            valid_start_date: valid_start_date,
                            valid_end_date: valid_end_date
                        };
                        console.log(requestData);
                        setSubmitting(true);
                        if (paramId) {
                            requestData.id = id;
                            requestData.status = status;
                            console.log(requestData);
                            accountMngUpdate(id, requestData);
                        } else {
                            accountMngInsert(requestData);
                        }
                        //actionLogin(values.email, values.password);
                    } catch (err) {
                        console.log('here is error called...');
                        console.log(err);
                        setErrorTitle('Error Message');
                        setErrorMessage(err.message);
                        setOpen(true);
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} className="accountmng_reg">
                        <Grid container rowSpacing={4} columnSpacing={2.75}>
                            <Grid item xs={12}>
                                <HeaderTitle titleNm="계정 관리" menuStep01="통합 관리" menuStep02="계정 관리" />

                                <MainCard sx={{ mt: 2 }}>
                                    <div className="layout--aline account--blank">
                                        <DropInput title="이메일 주소" titleWidth={70}>
                                            <TextField
                                                id="filled-hidden-label-small"
                                                type="text"
                                                size="medium"
                                                value={email}
                                                name="email"
                                                inputProps={{ readOnly: emailStatus }}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Enter Email ID"
                                                error={Boolean(touched.email && errors.email)}
                                            />
                                        </DropInput>

                                        <ButtonLayout>
                                            <Button
                                                disableElevation
                                                size="medium"
                                                type="button"
                                                disabled={isUpdate}
                                                variant="contained"
                                                color="secondary"
                                                onClick={emailDuplicateCheck}
                                            >
                                                중복체크
                                            </Button>
                                        </ButtonLayout>
                                    </div>

                                    <div className="account--blank">
                                        <DropInput title="이름" titleWidth={70}>
                                            <TextField
                                                id="filled-hidden-label-small"
                                                type="text"
                                                size="small"
                                                value={name}
                                                name="name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Input the name"
                                                fullWidth
                                                error={Boolean(touched.name && errors.name)}
                                            />
                                        </DropInput>
                                    </div>

                                    <div className="account--blank">
                                        <DropInput title="비밀번호" titleWidth={70} className="account--blank">
                                            <TextField
                                                id="filled-hidden-label-small"
                                                type="password"
                                                size="small"
                                                value={password}
                                                name="password"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Input the password."
                                                fullWidth
                                                error={Boolean(touched.password && errors.password)}
                                            />
                                        </DropInput>
                                    </div>
                                    <Grid>
                                        {/* 기간 검색 */}
                                        <SearchDate
                                            start_date={valid_start_date}
                                            end_date={valid_end_date}
                                            handleBlur={handleBlur}
                                            handleChange={handleChange}
                                            noneChecked="noneChecked"
                                            startName="valid_start_date"
                                            endName="valid_end_date"
                                            title="유효 기간"
                                            addAll={true}
                                            changeDate={changeDate}
                                            resetPeriod={resetPeriod}
                                            titleWidth={70}
                                        />
                                    </Grid>
                                    <DropInput title="사용여부" titleWidth={70} className="account--blank">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="is_use"
                                                    checked={is_use}
                                                    value={is_use}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                            }
                                            label="사용함"
                                        />
                                    </DropInput>
                                </MainCard>

                                <ButtonLayout>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        size="medium"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        저장
                                    </Button>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        size="medium"
                                        type="button"
                                        variant="outlined_d"
                                        color="secondary"
                                        onClick={newClick}
                                    >
                                        신규
                                    </Button>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        size="medium"
                                        type="button"
                                        variant="contained"
                                        color="error"
                                        onClick={deleteClick}
                                    >
                                        삭제
                                    </Button>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        size="medium"
                                        type="submit"
                                        variant="outlined_d"
                                        color="secondary"
                                        onClick={listClick}
                                    >
                                        리스트
                                    </Button>
                                </ButtonLayout>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AccountMngForm;
