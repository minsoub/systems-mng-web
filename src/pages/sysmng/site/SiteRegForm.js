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
import SiteApi from 'apis/site/siteapi';
import UserSearchDialog from 'pages/popup/UserSearchPopup';
import HeaderTitle from '../../../components/HeaderTitle';
import DropInput from '../../../components/Common/DropInput';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import SearchDate from '../../../components/ContentManage/SearchDate';
import './styles.module.scss';

const SiteRegForm = () => {
    let isSubmitting = false;

    const navigate = useNavigate();
    const { paramId } = useParams();
    const [responseData, requestError, loading, { siteInsert, siteDetail, siteDelete, siteUpdate }] = SiteApi();

    // Alert Dialog
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // User Search Dialog
    const [openUserSearch, setOpenUserSearch] = useState(false);
    const [selectedValue, setSelectedValue] = useState([]);

    // Form data
    // 담당자ID, 전화번호, 메일주소 상태값
    const [adminId, setAdminId] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [is_use, setIsUse] = useState(true);
    const [valid_start_date, setValidStartDate] = useState('');
    const [valid_end_date, setValidEndDate] = useState('');
    const [adminPhone, setAdminPhone] = useState('');
    const [description, setDescritpion] = useState('');

    const [readOnlyId, setReadonlyId] = useState(false);
    const [isDeleted, setDisabledButton] = useState(true);

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            if (requestError.result === 'FAIL') {
                console.log('error requestError');
                console.log(requestError);
                setErrorTitle('Error Message');
                setErrorMessage('[' + requestError.error.code + '] ' + requestError.error.message);
                setOpen(true);
            }
        }
    }, [requestError]);

    // onload
    useEffect(() => {
        console.log('paramId');
        console.log(paramId);
        errorClear();
        if (paramId) {
            console.log(paramId);
            siteDetail(paramId);
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
        switch (responseData.transactionId) {
            case 'insertData':
                if (responseData.data) {
                    alert('저장을 완료하였습니다');
                    listClick();
                }
                break;
            case 'detailData':
                if (responseData.data.data) {
                    // 세부 내역을 세팅하고 수정모드로 들어간다.
                    setId(responseData.data.data.id);
                    setName(responseData.data.data.name);
                    setIsUse(responseData.data.data.is_use);
                    setValidStartDate(validDateSplit(responseData.data.data.valid_start_date));
                    setValidEndDate(validDateSplit(responseData.data.data.valid_end_date));
                    setDescritpion(responseData.data.data.description);
                    setAdminId(responseData.data.data.admin_account_id);
                    setAdminEmail(responseData.data.data.admin_account_email);
                    setAdminPhone(responseData.data.data.admin_account_phone);
                    setReadonlyId(true);
                    setDisabledButton(false); // delete button enable
                }
                break;
            case 'updateData':
                if (responseData.data.data) {
                    alert('수정을 완료하였습니다');
                    // 세부 내역을 세팅하고 수정모드로 들어간다.
                    setId(responseData.data.data.id);
                    setName(responseData.data.data.name);
                    setIsUse(responseData.data.data.is_use);
                    setValidStartDate(validDateSplit(responseData.data.data.valid_start_date));
                    setValidEndDate(validDateSplit(responseData.data.data.valid_end_date));
                    setDescritpion(responseData.data.data.description);
                    setAdminId(responseData.data.data.admin_account_id);
                    setAdminEmail(responseData.data.data.admin_account_email);
                    setAdminPhone(responseData.data.data.admin_account_phone);
                    setReadonlyId(true);
                    setDisabledButton(false); // delete button enable
                }
                break;
            case 'deleteData':
                console.log('deleteData');
                navigate('/site/list');
                break;
            default:
        }
    }, [responseData]);

    const validDateSplit = (data) => {
        if (data !== null) {
            let d = data.substring(0, 10);
            console.log(d);
            return d;
        } else {
            console.log(data);
            return data;
        }
    };

    const closePopup = () => {
        // Close Popup
    };

    const handleClose = (returnData) => {
        setOpenUserSearch(false);
        console.log(requestError);
        // 데이터 처리
        if (returnData.length !== 0) {
            // 데이터 처리
            console.log(returnData);
            setAdminId(returnData.row.id);
            setAdminEmail(returnData.row.email);
        }
    };

    const handleChange = (e) => {
        switch (e.target.name) {
            case 'id':
                setId(e.target.value);
                break;
            case 'name':
                setName(e.target.value);
                break;
            case 'is_use':
                setIsUse(e.target.value);
                break;
            case 'valid_start_date':
                setValidStartDate(e.target.value);
                break;
            case 'valid_end_date':
                setValidEndDate(e.target.value);
                break;
            case 'description':
                setDescritpion(e.target.value);
                break;
            case 'admin_account_id':
                setAdminId(e.target.value);
                break;
            case 'admin_account_phone':
                setAdminPhone(e.target.value);
                break;
            case 'admin_account_email':
                setAdminEmail(e.target.value);
                break;
            default:
                break;
        }
    };
    const handleBlur = (e) => {
        console.log(e);
    };

    // new
    const newClick = () => {
        // data clear
        setReadonlyId(false);
        setId('');
        setName('');
        setIsUse(false);
        setValidStartDate('');
        setValidEndDate('');
        setDescritpion('');
        setAdminId('');
        setAdminEmail('');
        setAdminPhone('');
        setDisabledButton(true);
    };

    // delete
    const deleteClick = () => {
        if (confirm('삭제를 하시겠습니까')) {
            const requestData = {
                id: id,
                name: name,
                is_use: false,
                valid_start_date: valid_start_date,
                valid_end_date: valid_end_date,
                description: description,
                admin_account_id: adminId,
                admin_account_phone: adminPhone,
                admin_account_email: adminEmail
            };
            siteDelete(id, requestData);
        }
    };

    // list
    const listClick = () => {
        navigate('/site/list');
    };
    // 사용자 검색
    const accountSearch = () => {
        // search
        setOpenUserSearch(true);
    };

    return (
        <>
            <Formik
                initialValues={{
                    id: '',
                    name: '',
                    is_use: true,
                    valid_start_date: '',
                    valid_end_date: '',
                    description: '',
                    admin_account_id: '',
                    admin_account_email: '',
                    admin_account_phone: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    //id: Yup.string().max(36).required('Role ID is required'),
                    //name: Yup.string().max(50).required('Role Name is required')
                    // site_id: Yup.object().shape({
                    //     value: Yup.string().required('Site ID is not selected')
                    // })
                    //valid_start_date: Yup.string().required('유효기간을 입력해야 합니다'),
                    //valid_end_date: Yup.string().required('유효기간을 입력해야 합니다')
                    //site_id: Yup.string().required('SITE ID is required'),
                    //type: Yup.string().required('Type is required')
                })}
                onSubmit={async (values, { setStatus, setSubmitting }) => {
                    try {
                        // Validation check
                        if (id === '') {
                            setErrorTitle('입력 오류');
                            setErrorMessage('Site 아이디를 입력하지 않았습니다');
                            setOpen(true);
                            return;
                        }
                        if (name === '') {
                            setErrorTitle('입력 오류');
                            setErrorMessage('Site Name을 입력하지 않았습니다');
                            setOpen(true);
                            return;
                        }
                        // Data 가공
                        setOpen(false);
                        const requestData = {
                            id: id,
                            name: name,
                            is_use: is_use,
                            valid_start_date: valid_start_date,
                            valid_end_date: valid_end_date,
                            description: description,
                            admin_account_id: adminId,
                            admin_account_phone: adminPhone,
                            admin_account_email: adminEmail
                        };
                        console.log('called onSubmit...');
                        console.log(requestData);
                        setStatus({ success: false });
                        setSubmitting(true);
                        if (paramId) {
                            siteUpdate(paramId, requestData);
                        } else {
                            siteInsert(requestData);
                        }
                    } catch (err) {
                        console.log(err);
                        setErrorTitle('Error Message');
                        setErrorMessage(err.message);
                        setOpen(true);
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                            <Grid item xs={12} md={7} lg={12}>
                                <HeaderTitle
                                    titleNm="사이트 등록"
                                    menuStep01="통합 시스템관리"
                                    menuStep02="사이트 관리"
                                    menuStep03="사이트 등록"
                                />

                                <MainCard sx={{ mt: 2 }}>
                                    <div className="inputLayout">
                                        <DropInput title="사이트 ID">
                                            <TextField
                                                id="filled-hidden-label-small"
                                                type="text"
                                                size="medium"
                                                value={id}
                                                name="id"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{ readOnly: readOnlyId }}
                                                placeholder="사이트 ID를 등록하세요!!!"
                                                fullWidth
                                                error={Boolean(touched.id && errors.id)}
                                            />
                                        </DropInput>
                                        <DropInput title="사이트명">
                                            <TextField
                                                id="filled-hidden-label-small"
                                                type="text"
                                                size="medium"
                                                value={name}
                                                name="name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="사이트명를 등록하세요!!!"
                                                fullWidth
                                                error={Boolean(touched.name && errors.name)}
                                            />
                                        </DropInput>

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    defaultChecked
                                                    name="is_use"
                                                    value={is_use}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                            }
                                            label="사용함"
                                        />
                                    </div>

                                    <div className="inputLayout layout--out">
                                        {/* 기간 검색 */}
                                        <SearchDate
                                            start_date={valid_start_date}
                                            end_date={valid_end_date}
                                            handleBlur={handleBlur}
                                            handleChange={handleChange}
                                            noneChecked="noneChecked"
                                            startName="from_date"
                                            endName="to_date"
                                        />
                                    </div>

                                    <div className="inputLayout layout--out">
                                        <DropInput title="비고">
                                            <TextField
                                                id="filled-hidden-label-small"
                                                type="text"
                                                size="medium"
                                                value={description}
                                                name="description"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Input the Description"
                                                fullWidth
                                            />
                                        </DropInput>
                                        <div className="inputLayout">
                                            <DropInput title="담당자 ID">
                                                <TextField
                                                    id="filled-hidden-label-small"
                                                    type="text"
                                                    size="medium"
                                                    value={adminId}
                                                    name="admin_account_name"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    error={Boolean(touched.admin_account_name && errors.admin_account_name)}
                                                />
                                            </DropInput>
                                            <Button
                                                disableElevation
                                                size="medium"
                                                type="button"
                                                variant="contained"
                                                color="secondary"
                                                onClick={accountSearch}
                                            >
                                                검색
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="inputLayout">
                                        <DropInput title="전화번호">
                                            <TextField
                                                id="filled-hidden-label-small"
                                                type="text"
                                                size="medium"
                                                value={adminPhone}
                                                name="admin_account_phone"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                fullWidth
                                            />
                                        </DropInput>

                                        <DropInput title="이메일 주소">
                                            <TextField
                                                id="filled-hidden-label-small"
                                                type="text"
                                                size="medium"
                                                value={adminEmail}
                                                name="admin_account_email"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                fullWidth
                                            />
                                        </DropInput>
                                    </div>
                                </MainCard>

                                <ButtonLayout buttonName="layout--button">
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        size="medium"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        저장하기
                                    </Button>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        size="medium"
                                        type="button"
                                        variant="contained"
                                        color="secondary"
                                        onClick={newClick}
                                    >
                                        신규
                                    </Button>
                                    <Button
                                        disableElevation
                                        disabled={isDeleted}
                                        size="medium"
                                        type="button"
                                        variant="contained"
                                        color="secondary"
                                        onClick={deleteClick}
                                    >
                                        삭제
                                    </Button>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        size="medium"
                                        type="button"
                                        variant="contained"
                                        color="secondary"
                                        onClick={listClick}
                                    >
                                        리스트
                                    </Button>
                                </ButtonLayout>

                                {/* 에러처리 */}
                                {errors.submit && (
                                    <Grid item xs={12}>
                                        <FormHelperText error>{errors.submit}</FormHelperText>
                                    </Grid>
                                )}

                                {errorMessage && (
                                    <MainCard sx={{ mt: 3 }} content={false}>
                                        <Stack>
                                            {touched.id && errors.id && (
                                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                                    <FormControl sx={{ m: 2, minHeight: 20 }} size="medium">
                                                        <li>{errors.id}</li>
                                                    </FormControl>
                                                </FormHelperText>
                                            )}
                                            {touched.name && errors.name && (
                                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                                    <FormControl sx={{ m: 2, minHeight: 20 }} size="medium">
                                                        <li>{errors.name}</li>
                                                    </FormControl>
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                        <Collapse in={open}>
                                            <Alert
                                                severity="error"
                                                action={
                                                    <IconButton
                                                        aria-label="close"
                                                        color="inherit"
                                                        size="medium"
                                                        onClick={() => {
                                                            errorClear();
                                                        }}
                                                    >
                                                        <CloseIcon fontSize="inherit" />
                                                    </IconButton>
                                                }
                                                sx={{ mb: 2 }}
                                            >
                                                <AlertTitle>{errorTitle}</AlertTitle>
                                                {errorMessage}
                                            </Alert>
                                        </Collapse>
                                    </MainCard>
                                )}
                            </Grid>
                        </Grid>
                        <UserSearchDialog selectedValue={selectedValue} open={openUserSearch} onClose={handleClose} />
                    </form>
                )}
            </Formik>
        </>
    );
};

export default SiteRegForm;
