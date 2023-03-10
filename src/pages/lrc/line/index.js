import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Button,
    FormControl,
    Grid,
    MenuItem,
    Select,
    Stack,
    TextField,
    RadioGroup,
    Radio,
    Typography,
    FormControlLabel
} from '@mui/material';
import MainCard from 'components/Common/MainCard';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import LineApis from 'apis/lrc/line/lineapi';
import ErrorScreen from 'components/ErrorScreen';
import './styles.scss';
import InputLayout from '../../../components/Common/InputLayout';
import TopInputLayout from '../../../components/Common/TopInputLayout';
import cx from 'classnames';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import HeaderTitle from '../../../components/HeaderTitle';
import ContentLine from '../../../components/Common/ContentLine';
import DropInput from '../../../components/Common/DropInput';
import { getDateFormat } from 'utils/CommonUtils';

const LineMngPage = () => {
    let isSubmitting = false;
    const columns = [
        {
            field: 'type',
            headerName: '계열 타입',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'name',
            headerName: '계열 명칭',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'use_yn',
            headerName: '사용여부',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'create_date',
            headerName: '등록 일시',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: ({ value }) => `${getDateFormat(value)}`
        }
    ];

    const navigate = useNavigate();
    const [responseData, requestError, loading, { lineSearch, lineInsert, lineUpdate, lineDelete }] = LineApis();

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

    const [search_line_type, setSearchLineType] = useState(' ');
    const [isUpdate, setIsUpdate] = useState(false);

    // 입력 데이터 - Default
    const [inputs, setInputs] = useState({
        id: '',
        name: '',
        type: '',
        use_yn: true
    });
    const { id, name, type, use_yn } = inputs;

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
        // 리스트 가져오기
        lineSearch('');
        setIsUpdate(false);
    }, []);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getList':
                if (responseData.data.data) {
                    setDataGridRows(responseData.data.data);
                } else {
                    setDataGridRows([]);
                }
                break;
            case 'insertData':
                if (responseData.data.data) {
                    alert('저장되였습니다.');
                    newClick();
                    lineSearch(search_line_type);
                }
                break;
            case 'updateData':
                if (responseData.data.data) {
                    alert('수정을 완료하였습니다.');
                    newClick();
                    lineSearch(search_line_type);
                }
                break;
            case 'deleteData':
                console.log('deleteData');
                alert('삭제 처리를 완료하였습니다.');
                newClick();
                lineSearch(search_line_type);
                break;
            default:
        }
    }, [responseData]);

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
        console.log(rowData);
        if (rowData && rowData.field && rowData.field !== '__check__') {
            setIsUpdate(true);
            setInputs({
                id: rowData.row.id,
                name: rowData.row.name,
                use_yn: rowData.row.use_yn,
                type: rowData.row.type
            });
        }
    };

    const searchLineChanged = (e) => {
        setSearchLineType(e.target.value);
        lineSearch(e.target.value);
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // search
    const searchClick = () => {
        lineSearch(search_line_type);
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
    const handleBlur = (e) => {
        console.log(e);
    };
    // new
    const newClick = () => {
        console.log('called register form');
        //navigate('/account/reg');
        setInputs({
            id: '',
            name: '',
            type: '',
            use_yn: true
        });
        setIsUpdate(false);
    };

    // save
    const saveClick = () => {
        if (!name) {
            alert('계열 명칭을 입력하지 않았습니다.');
            return;
        }
        if (!type) {
            alert('계열 타입을 선택하지 않았습니다.');
            return;
        }
        console.log(inputs);
        if (confirm('저장하시겠습니까?')) {
            if (!isUpdate) {
                lineInsert(inputs);
            } else {
                lineUpdate(inputs);
            }
        }
    };
    // delete
    const deleteClick = () => {
        if (!isUpdate) {
            alert('삭제할 데이터가 없습니다.');
            return;
        }
        if (confirm('삭제하시겠습니까?')) {
            // 선택한 계정에 대해서 삭제를 수행한다.
            lineDelete(inputs);
        }
    };

    return (
        <Grid container rowSpacing={4} columnSpacing={2.75} className="lineList">
            <Grid item xs={12}>
                <HeaderTitle titleNm="계열 관리" menuStep01="사이트 운영" menuStep02="상태값 관리" menuStep03="계열 관리" />

                <MainCard>
                    <TopInputLayout>
                        <DropInput title="계열 구분">
                            <Select name="search_line_type" label="계열타입" value={search_line_type} onChange={searchLineChanged}>
                                <MenuItem value=" ">전체</MenuItem>
                                <MenuItem value="BUSINESS">사업계열</MenuItem>
                                <MenuItem value="NETWORK">네트워크계열</MenuItem>
                            </Select>
                        </DropInput>

                        <ButtonLayout>
                            <Button
                                disableElevation
                                size="medium"
                                type="submit"
                                variant="outlined_d"
                                color="secondary"
                                onClick={searchClick}
                            >
                                검색
                            </Button>

                            <Button disableElevation size="medium" type="submit" variant="outlined_d" color="secondary" onClick={newClick}>
                                신규
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
                        height={450}
                    />
                </ContentLine>

                <MainCard sx={{ mt: 2.5 }}>
                    <InputLayout>
                        <DropInput title="계열 타입">
                            <Select name="type" label="계얄타입" value={type} onChange={handleChange}>
                                <MenuItem value="BUSINESS">사업계열</MenuItem>
                                <MenuItem value="NETWORK">네트워크계열</MenuItem>
                            </Select>
                        </DropInput>

                        <DropInput title="계열 명칭">
                            <TextField
                                id="filled-hidden-label-small"
                                type="medium"
                                size="medium"
                                value={name}
                                name="name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                fullWidth
                            />
                        </DropInput>
                    </InputLayout>
                    <InputLayout>
                        <DropInput title="사용여부">
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="use_yn"
                                value={use_yn}
                                onChange={handleChange}
                            >
                                <FormControlLabel value="true" control={<Radio />} label="사용함" />
                                <FormControlLabel value="false" control={<Radio />} label="사용안함" />
                            </RadioGroup>
                        </DropInput>
                    </InputLayout>
                </MainCard>
                <ButtonLayout>
                    <Button disableElevation size="medium" type="submit" variant="contained" onClick={saveClick}>
                        저장
                    </Button>
                    <Button
                        disableElevation
                        disabled={!isUpdate}
                        size="medium"
                        type="submit"
                        variant="outlined_d"
                        color="secondary"
                        onClick={deleteClick}
                    >
                        삭제
                    </Button>
                </ButtonLayout>

                {errorMessage && (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                )}
            </Grid>
        </Grid>
    );
};

export default LineMngPage;
