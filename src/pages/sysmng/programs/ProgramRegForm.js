import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Checkbox, FormControlLabel, Grid, MenuItem, Select, TextField } from '@mui/material';
// third party
import MainCard from 'components/Common/MainCard';
import SiteApi from 'apis/site/siteapi';
import ProgramApi from 'apis/programs/programapi';
import HeaderTitle from '../../../components/HeaderTitle';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import DropInput from '../../../components/Common/DropInput';

const ProgramRegForm = () => {
    let isSubmitting = false;

    const navigate = useNavigate();
    const { paramId, paramSiteId } = useParams();
    const [responseData, requestError, loading, { programDetail, programUpdate, programInsert }] = ProgramApi();
    const [resData, reqErr, resLoading, { siteSearch }] = SiteApi();

    const [itemList, setItemList] = useState([]); // 사이트 콤보박스

    // 입력 데이터 - Default
    const [inputs, setInputs] = useState({
        site_id: '',
        type: 'ADMIN',
        id: '',
        name: '',
        kind_name: '',
        action_method: '',
        action_url: '',
        is_use: true,
        description: ''
    });
    const { site_id, type, id, name, kind_name, action_method, action_url, is_use, description } = inputs;

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
    // onload
    useEffect(() => {
        // 사이트 구분 리스트 가져오기
        siteSearch(true, '');

        if (paramId) {
            // 수정 데이터 조회
            console.log('parameter is exists...');
            console.log(paramId);
            console.log(paramSiteId);
            programDetail(paramId, paramSiteId);
        }
    }, []);

    // transaction error 처리
    useEffect(() => {
        if (requestError || reqErr) {
            let err = requestError ? requestError : reqErr;
            if (err.result === 'FAIL') {
                console.log('error requestError');
                console.log(err);
                setErrorTitle('Error Message');
                setErrorMessage('[' + err.error.code + '] ' + err.error.message);
                setOpen(true);
            }
        }
    }, [requestError, reqErr]);
    // Combobox data transaction
    // 사이트
    useEffect(() => {
        if (!resData) {
            return;
        }
        switch (resData.transactionId) {
            case 'siteList':
                if (resData.data.data) {
                    let siteData = resData.data.data;
                    let siteList = [];
                    siteData.map((site, index) => {
                        const s = { id: site.id, name: site.name };
                        console.log(s);
                        siteList.push(s);
                    });
                    setItemList(siteList);
                }
                break;
            default:
        }
    }, [resData]);

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
            case 'detailData':
                if (responseData.data.data) {
                    let res = responseData.data.data;
                    setInputs({
                        site_id: res.site_id,
                        type: res.type,
                        id: res.id,
                        name: res.name,
                        kind_name: res.kind_name,
                        action_method: res.action_method,
                        action_url: res.action_url,
                        is_use: res.is_use,
                        description: res.description
                    });
                }
                break;
            case 'insertData':
                alert('등록을 완료하였습니다.');
                setClearData();
                break;
            case 'updateData':
                alert('수정을 완료하였습니다.');
                break;
            case 'deleteDatas':
                console.log('deleteData');
                alert('삭제 처리를 완료하였습니다.');
                navigate('/pgm/list');
                break;
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
    // Save
    const saveClick = () => {
        console.log(inputs);
        // Validation check
        if (!inputs.site_id) {
            setError('사이트명을 선택하지 않았습니다.');
            return;
        }
        if (!inputs.type) {
            setError('관리 메뉴를 선택하지 않았습니다.');
            return;
        }
        if (!inputs.name) {
            setError('프로그램명을 입력하지 않았습니다.');
            return;
        }
        if (!inputs.action_method) {
            setError('Action Type을 선택하지 않았습니다.');
            return;
        }
        if (!inputs.action_url) {
            setError('Action URL을 입력하지 않았습니다.');
            return;
        }
        if (confirm('저장하시겠습니까?')) {
            if (!paramId) {
                programInsert(inputs);
            } else {
                programUpdate(inputs);
            }
        }
    };
    // new
    const newClick = () => {
        navigate('/pgm/reg');
    };

    // delete
    const deleteClick = () => {};

    // list
    const listClick = () => {
        navigate('/pgm/list');
    };

    // Clear Data
    const setClearData = () => {
        console.log('setClearData called...');
        console.log(site_id);
        setInputs({
            site_id: site_id,
            type: 'ADMIN',
            id: '',
            name: '',
            kind_name: kind_name,
            action_method: '',
            action_url: '',
            is_use: true,
            description: ''
        });
    };

    return (
        <>
            <Grid container rowSpacing={4} columnSpacing={2.75}>
                <Grid item xs={12}>
                    <HeaderTitle
                        titleNm="프로그램 등록"
                        menuStep01="통합시스템 관리"
                        menuStep02="프로그램 관리"
                        menuStep03="프로그램 등록"
                    />

                    <MainCard sx={{ mt: 2 }}>
                        <Grid container>
                            <DropInput title="사이트명">
                                <Select name="site_id" label="사이트명" value={site_id} onChange={handleChange}>
                                    <MenuItem value="">
                                        <em>Choose a Site Type</em>
                                    </MenuItem>
                                    {itemList.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </DropInput>
                            <DropInput title="관리메뉴">
                                <Select name="type" label="관리메뉴" value={type} onChange={handleChange}>
                                    <MenuItem value="ADMIN">관리자용 메뉴</MenuItem>
                                    <MenuItem value="USER">사용자용 메뉴</MenuItem>
                                </Select>
                            </DropInput>
                        </Grid>

                        <Grid container className="bottom--blank__top">
                            <DropInput title="프로그램 ID">
                                <TextField
                                    id="filled-hidden-label-small"
                                    type="text"
                                    size="small"
                                    value={id}
                                    name="id"
                                    inputProps={{ readOnly: true }}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="신규 등록시 자동입력"
                                    fullWidth
                                />
                            </DropInput>

                            <DropInput title="프로그램명">
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
                                />
                            </DropInput>
                        </Grid>

                        <Grid container className="bottom--blank__top">
                            <DropInput title="분류명">
                                <TextField
                                    id="filled-hidden-label-small"
                                    type="text"
                                    size="small"
                                    value={kind_name}
                                    name="kind_name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="분류명 입력"
                                    fullWidth
                                />
                            </DropInput>
                            <DropInput title="Action Type">
                                <Select name="action_method" label="관리메뉴" value={action_method} onChange={handleChange}>
                                    <MenuItem value="GET">GET</MenuItem>
                                    <MenuItem value="POST">POST</MenuItem>
                                    <MenuItem value="PUT">PUT</MenuItem>
                                    <MenuItem value="DELETE">DELETE</MenuItem>
                                </Select>
                            </DropInput>
                        </Grid>

                        <Grid container className="bottom--blank__top">
                            <DropInput title="Action URL">
                                <TextField
                                    id="filled-hidden-label-small"
                                    type="text"
                                    size="small"
                                    value={action_url}
                                    name="action_url"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Action URL 입력"
                                    fullWidth
                                />
                            </DropInput>

                            <DropInput title="사용여부">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="is_use"
                                            value={is_use}
                                            checked={is_use}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                    }
                                    label="사용함"
                                />
                            </DropInput>
                        </Grid>

                        <Grid container className="bottom--blank__top">
                            <DropInput title="비고">
                                <TextField
                                    id="filled-hidden-label-small"
                                    type="text"
                                    size="small"
                                    value={description}
                                    name="description"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder=""
                                    fullWidth
                                />
                            </DropInput>
                        </Grid>
                    </MainCard>

                    <ButtonLayout>
                        <Button
                            disableElevation
                            disabled={isSubmitting}
                            size="medium"
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={saveClick}
                        >
                            저장
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
                            disabled={isSubmitting}
                            size="medium"
                            type="submit"
                            variant="contained"
                            color="secondary"
                            onClick={listClick}
                        >
                            리스트
                        </Button>
                    </ButtonLayout>
                </Grid>
            </Grid>
        </>
    );
};

export default ProgramRegForm;
