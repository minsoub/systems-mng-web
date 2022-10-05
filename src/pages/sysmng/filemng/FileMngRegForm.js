import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Checkbox, FormControlLabel, Grid, MenuItem, Select, TextField, FormControl, InputLabel } from '@mui/material';
// third party
import MainCard from 'components/Common/MainCard';
import SiteApi from 'apis/site/siteapi';
import FileMngApi from 'apis/filemng/fileMngApi';
import HeaderTitle from '../../../components/HeaderTitle';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import DropInput from '../../../components/Common/DropInput';

const FileMngRegForm = () => {
    let isSubmitting = false;

    const navigate = useNavigate();
    const { paramId, paramSiteId } = useParams();
    const [responseData, requestError, loading, { fileDetail, fileUpdate, fileInsert }] = FileMngApi();
    const [resData, reqErr, resLoading, { siteSearch }] = SiteApi();

    const [itemList, setItemList] = useState([]); // 사이트 콤보박스
    const [extension_limit, setExtensionLimit] = useState([]);
    const [selectedExt, setSelectedExt] = useState('');

    // 입력 데이터 - Default
    const [inputs, setInputs] = useState({
        site_id: '',
        size_limit: 0,
        is_use: true,
        ext: ''
    });
    const { site_id, size_limit, is_use, ext } = inputs;

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
        if (!site_id) {
            alert('사이트명을 선택하지 않았습니다.');
            return;
        }
        if (size_limit === 0) {
            alert('파일 사이즈를 입력하지 않았습니다.');
            return;
        }

        if (extension_limit.length === 0) {
            alert('확장자 정보를 입력하지 않았습니다');
            return;
        }

        if (confirm('저장하시겠습니까?')) {
            let data = {
                size_limit: size_limit,
                is_use: is_use,
                extension_limit: extension_limit
            };
            console.log(data);
            if (!paramId) {
                fileInsert(site_id, data);
            } else {
                fileUpdate(site_id, data);
            }
        }
    };
    // new
    const newClick = () => {
        setClearData();
    };

    // delete
    const deleteClick = () => {};

    // list
    const listClick = () => {
        navigate('/filemng/list');
    };

    // Clear Data
    const setClearData = () => {
        console.log('setClearData called...');
        console.log(site_id);
        setInputs({
            site_id: site_id,
            size_limit: 0,
            is_use: true,
            ext: ''
        });
        setExtensionLimit([]);
    };

    const numberCheck = (e) => {
        if (!/[0-9.]/.test(e.key)) {
            e.preventDefault();
        }
    };

    const plusClick = () => {
        if (ext) {
            console.log(ext);
            setExtensionLimit((prevRows) => [...prevRows, ext]);
            setInputs({
                ...inputs, // 기존 input 객체 복사
                ext: ''
            });
        }
    };

    const minusClick = () => {
        console.log(selectedExt);
        let data = extension_limit.filter((item) => item !== selectedExt);
        setExtensionLimit(data);
    };

    const handleChangeMultiple = (e) => {
        console.log(e.target.value);
        setSelectedExt(e.target.value);
    };

    return (
        <>
            <Grid container rowSpacing={4} columnSpacing={2.75}>
                <Grid item xs={12}>
                    <HeaderTitle
                        titleNm="파일정보 등록"
                        menuStep01="통합시스템 관리"
                        menuStep02="업로드 파일 관리"
                        menuStep03="파일정보 등록"
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
                            <DropInput title="파일사이즈(M)">
                                <TextField
                                    id="filled-hidden-label-small"
                                    type="text"
                                    size="small"
                                    value={size_limit}
                                    name="size_limit"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    onKeyPress={numberCheck}
                                    placeholder="Input the File Size(M)"
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
                    </MainCard>

                    <MainCard sx={{ mt: 2 }}>
                        <Grid container>
                            <FormControl sx={{ m: 1, minWidth: 400, maxWidth: 400 }}>
                                <InputLabel shrink htmlFor="select-multiple-native">
                                    확장자 정보
                                </InputLabel>
                                <Select
                                    native
                                    multiple
                                    //value={personName}
                                    // @ts-ignore Typings are not considering `native`
                                    onChange={handleChangeMultiple}
                                    label="Native"
                                    inputProps={{
                                        id: 'select-multiple-native'
                                    }}
                                >
                                    {extension_limit.map((name) => (
                                        <option key={name} value={name}>
                                            {name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                            <ButtonLayout>
                                <Button
                                    disableElevation
                                    size="medium"
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    onClick={plusClick}
                                >
                                    +
                                </Button>
                                <Button
                                    disableElevation
                                    size="medium"
                                    type="button"
                                    variant="contained"
                                    color="secondary"
                                    onClick={minusClick}
                                >
                                    -
                                </Button>
                                <DropInput title="파일확장자">
                                    <TextField
                                        id="filled-hidden-label-small"
                                        type="text"
                                        size="small"
                                        value={ext}
                                        name="ext"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="파일 확장자 입력"
                                        fullWidth
                                    />
                                </DropInput>
                            </ButtonLayout>
                        </Grid>
                    </MainCard>

                    <ButtonLayout>
                        <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={saveClick}>
                            저장
                        </Button>
                        <Button disableElevation size="medium" type="button" variant="contained" color="secondary" onClick={newClick}>
                            신규
                        </Button>
                        <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={listClick}>
                            리스트
                        </Button>
                    </ButtonLayout>
                </Grid>
            </Grid>
        </>
    );
};

export default FileMngRegForm;
