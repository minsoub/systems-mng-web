import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
    OutlinedInput,
    Box,
    Button,
    Grid,
    Stack,
    FormControlLabel,
    FormHelperText,
    InputLabel,
    Checkbox,
    Select,
    TextField,
    FormControl,
    Alert,
    Collapse,
    AlertTitle,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Radio,
    RadioGroup,
    MenuItem
} from '@mui/material';

import MainCard from 'components/Common/MainCard';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import { StyledTableCell, FontTableCell } from 'components/CustomTableCell/CustomTableCell';
import ErrorScreen from 'components/ErrorScreen';
import AccountApis from 'apis/account/accountapis';
import { doEncrypt } from 'utils/Crypt';

const ProfileUpdateForm = () => {
    let isSubmitting = false;

    const navigate = useNavigate();
    const [responseData, requestError, loading, { updatePasswordInfo }] = AccountApis();

    ////////////////////////////////////////////////////
    // 공통 에러 처리
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    ////////////////////////////////////////////////////

    // Form data
    // 입력 데이터 - Default
    const [inputs, setInputs] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const { current_password, new_password, confirm_password } = inputs;

    let authData = null;
    if (localStorage.hasOwnProperty('authenticated')) {
        //console.log(localStorage.getItem('authenticated'));
        authData = JSON.parse(localStorage.getItem('authenticated'));
    }

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
            case 'insertData':
                if (responseData.data) {
                    alert('저장을 완료하였습니다.');
                    listClick();
                }
                break;
            case 'detailData':
                if (responseData.data.data) {
                    // 세부 내역을 세팅하고 수정모드로 들어간다.
                    let res = responseData.data.data;
                    setInputs({
                        id: res.id,
                        category_code: res.category_code,
                        use_yn: res.use_yn,
                        title: res.title,
                        content: res.content,
                        order: res.order,
                        language: res.language
                    });
                    setIsUpdate(true);
                }
                break;
            case 'updateData':
                if (responseData.data.data) {
                    alert('수정을 완료하였습니다.');
                    listClick();
                }
                break;
            case 'deleteData':
                alert('삭제를 완료하였습니다.');
                navigate('/faq/list');
                break;
            case 'updatePasswordData':
                alert('패스워드 수정을 완료하였습니다.');
                if (authData.siteId === '62a15f4ae4129b518b133128') {
                    // 투자보호
                    navigate('/cpc/dashboard');
                } else {
                    navigate('/lrc/dashboard');
                }
            default:
        }
    }, [responseData]);

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

    const handleBlur = (e) => {
        console.log(e);
    };

    // delete
    const cancelClick = () => {
        if (authData.siteId === '62a15f4ae4129b518b133128') {
            // 투자보호
            navigate('/cpc/dashboard');
        } else {
            navigate('/lrc/dashboard');
        }
    };

    const saveClick = () => {
        if (!current_password) {
            alert('현재 비밀번호를 입력하세요.');
            return;
        }
        if (!new_password) {
            alert('신규 비밀번호를 입력하세요.');
            return;
        }
        if (!confirm_password) {
            alert('신규 비밀번호 확인을 입력하세요.');
            return;
        }
        if (new_password !== confirm_password) {
            alert('신규 비밀번호와 신규 비밀번호 확인이 일치하지 않습니다.');
            return;
        }
        // 패스워드 로직 검증
        const regex = /^.*(?=^.{8,64}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^*]).*$/; // /^(?=.*\d)(?=.*[a-zA-Z~!@#$%^&*_])[0-9a-zA-Z~!@#$%^&*_]{8,64}$/;
        if (!regex.test(new_password)) {
            alert('요청한 패스워드 형식에 일치하지 않습니다.');
            return;
        }
        let send_data = {
            email: authData.email,
            current_password: doEncrypt(current_password),
            new_password: doEncrypt(new_password),
            confirm_password: doEncrypt(confirm_password)
        };
        updatePasswordInfo(send_data);
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h3">비밀번호 재설정</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">비밀번호 재설정</Typography>
                    </Grid>
                    <Grid container spacing={2}></Grid>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <Grid container spacing={0} sx={{ mt: 1 }}>
                        <Grid item xs={8} sm={0.2}></Grid>
                        <Grid item xs={8} sm={8}>
                            <Table sx={{ width: 1000 }} stickyHeader aria-label="simple table">
                                <TableBody>
                                    <TableRow>
                                        <StyledTableCell component="th" scope="row" style={{ width: 300 }}>
                                            비밀번호를 변경 후 이용해주세요.
                                        </StyledTableCell>
                                    </TableRow>
                                    <TableRow>
                                        <StyledTableCell component="th" scope="row" style={{ width: 300 }}>
                                            현재 비밀번호 <font color="red">*</font>
                                        </StyledTableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" style={{ width: 300 }}>
                                            <FormControl sx={{ m: 0 }} fullWidth>
                                                <TextField
                                                    id="outlined-multiline-static"
                                                    type="password"
                                                    value={current_password}
                                                    name="current_password"
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <StyledTableCell component="th" scope="row" style={{ width: 200 }}>
                                            신규 비밀번호 <font color="red">*</font>
                                        </StyledTableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" style={{ width: 300 }}>
                                            <FormControl sx={{ m: 0 }} fullWidth>
                                                <TextField
                                                    id="outlined-multiline-static"
                                                    type="password"
                                                    value={new_password}
                                                    name="new_password"
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <StyledTableCell component="th" scope="row" style={{ width: 200 }}>
                                            신규 비밀번호 확인<font color="red">*</font>
                                        </StyledTableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" style={{ width: 300 }}>
                                            <FormControl sx={{ m: 0 }} fullWidth>
                                                <TextField
                                                    id="outlined-multiline-static"
                                                    type="password"
                                                    value={confirm_password}
                                                    name="confirm_password"
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" colSpan={3} style={{ height: 200, width: 680 }}>
                                            - 영문 소문자, 대문자, 특수문자를 포함하여 8자리-64자리로 만들어 주세요.<p></p>
                                            단, 허용되는 특수문자 (~!@#$%^&*_)와 다른 특수문자는 사용할 수 없습니다.<p></p>- 타 사이트와
                                            동일하거나 비슷한 암호를 설정하지 마세요.<p></p>타 사이트에서 암호가 유출될 경우 제3자가
                                            회원님의 계정에 접근할 위험이 있습니다.
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0} sx={{ mt: 1 }}>
                        <Grid item xs={8} sm={0.1}></Grid>
                        <Grid item xs={8} sm={0.7}>
                            <FormControl sx={{ m: 1 }} size="small">
                                <Button
                                    disableElevation
                                    size="small"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    onClick={cancelClick}
                                >
                                    취소
                                </Button>
                            </FormControl>
                        </Grid>
                        <Grid item xs={8} sm={0.1}></Grid>
                        <Grid item xs={8} sm={0.7}>
                            <FormControl sx={{ m: 1 }} size="small">
                                <Button disableElevation size="small" type="submit" variant="contained" color="primary" onClick={saveClick}>
                                    변경
                                </Button>
                            </FormControl>
                        </Grid>
                    </Grid>
                </MainCard>

                {errorMessage && (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                )}
            </Grid>
        </Grid>
    );
};

export default ProfileUpdateForm;
