import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    MenuItem, Radio,
    RadioGroup,
    Select,
    Stack
} from '@mui/material';
import MainCard from 'components/Common/MainCard';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import RoleApi from 'apis/roles/roleapi';
import SiteApi from 'apis/site/siteapi';
import ErrorScreen from 'components/ErrorScreen';
import TopInputLayout from 'components/Common/TopInputLayout';
import InputLayout from 'components/Common/InputLayout';
import ButtonLayout from 'components/Common/ButtonLayout';
import HeaderTitle from 'components/HeaderTitle';
import cx from 'classnames';
import ContentLine from '../../../components/Common/ContentLine';
import DropInput from '../../../components/Common/DropInput';
import SearchDate from "../../../components/ContentManage/SearchDate";
import SearchBar from "../../../components/ContentManage/SearchBar";

const SiteRoleManagementPage = () => {
    let isSubmitting = false;
    const columns = [
        {
            field: 'id',
            headerName: 'Role ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'name',
            headerName: 'Role Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'type',
            headerName: 'Type',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'is_use',
            headerName: '사용여부',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'valid_start_date',
            headerName: '유효기간(from)',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'valid_end_date',
            headerName: '유효기간(to)',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'create_date',
            headerName: '등록일자',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        }
    ];
    const navigate = useNavigate();
    const { siteId } = useSelector((state) => state.auth);
    const [responseData, requestError, loading, { roleSearch, roleList }] = RoleApi();
    const [resData, reqErr, resLoading, { siteSearch }] = SiteApi();

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);

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

    const [site_id, setSiteId] = useState(siteId);
    const [is_use, setIsUse] = useState(true);
    const [keyword, setKeyword] = useState('');

    // onload
    useEffect(() => {
        roleSearch(true, siteId);
    }, []);

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

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'roleList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setDataGridRows(responseData.data.data);
                } else {
                    setDataGridRows([]);
                }
                break;
            case 'deleteData':
                console.log('deleteData');
                roleList();
                break;
            default:
        }
    }, [responseData]);

    const handleClose = () => {
        setVisible(false);
    };

    //체크박스 선택된 row id 저장
    const handleSelectionChange = (item) => {
        if (item) {
            setSeletedRows(item);
        }
    };
    // 페이징 변경 이벤트
    const handlePage = (page) => {};

    // 그리드 클릭
    const handleClick = (rowData) => {
        if (rowData && rowData.field && rowData.field !== '__check__') {
            navigate(`/siteroles/reg/${rowData.id}`);
        }
    };

    const searchClick = () => {
        console.log('searchClick called...');
        if (!site_id) {
            alert('사이트명을 선택하세요!!!');
            return;
        }
        roleSearch(is_use, site_id, keyword);
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // new
    const newClick = () => {
        navigate('/siteroles/reg');
    };

    const listClick = () => {
        setKeyword('');
        roleSearch(true, siteId);
    };

    const isUseChange = (e) => {
        let { value } = e.target;
        if (e.target.type === 'checkbox') {
            value = e.target.checked;
        }
        setIsUse(value);
    };

    const handleChange = (e) => {
        setKeyword(e.target.value);
    };


    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle titleNm="Role 리스트" menuStep01="사이트 관리" menuStep02="Role 관리" menuStep03="Role 리스트" />

                <MainCard>
                    {/* 검색바 */}
                    <SearchBar keyword={keyword} handleChange={handleChange} />
                    <Grid item xs={12}>
                        <Stack spacing={1}>&nbsp;</Stack>
                    </Grid>
                    <TopInputLayout>
                        <InputLayout>
                            <DropInput title="사용여부">
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="is_use"
                                    value={is_use}
                                    onChange={isUseChange}
                                >
                                    <FormControlLabel value="true" control={<Radio />} label="사용함" />
                                    <FormControlLabel value="false" control={<Radio />} label="사용안함" />
                                </RadioGroup>
                            </DropInput>
                        </InputLayout>
                        <ButtonLayout>
                            <Button
                                disableElevation
                                size="medium"
                                type="submit"
                                variant="contained"
                                onClick={searchClick}
                                color="secondary"
                            >
                                검색
                            </Button>
                            <Button disableElevation size="medium" type="submit" variant="contained" onClick={newClick} color="primary">
                                등록
                            </Button>
                            <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={listClick}>
                                초기화
                            </Button>
                        </ButtonLayout>
                    </TopInputLayout>
                </MainCard>

                <ContentLine>
                    <DefaultDataGrid
                        columns={columns}
                        rows={dataGridRows}
                        handlePageChange={handlePage}
                        handleGridClick={handleClick}
                        handleGridDoubleClick={handleDoubleClick}
                        selectionChange={handleSelectionChange}
                        height={700}
                    />
                </ContentLine>

                {errorMessage && (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                )}
            </Grid>
        </Grid>
    );
};

export default SiteRoleManagementPage;
