import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FormControl, FormControlLabel, Grid, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material';
import MainCard from 'components/Common/MainCard';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import CategoryApis from 'apis/lrc/faq/categoryapi';
import ErrorScreen from 'components/ErrorScreen';
import HeaderTitle from '../../../components/HeaderTitle';
import TopInputLayout from '../../../components/Common/TopInputLayout';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import './styles.scss';
import DropInput from '../../../components/Common/DropInput';
import ContentLine from '../../../components/Common/ContentLine';
import FlexBox from '../../../components/Common/FlexBox';
import { getDateFormat } from '../../../utils/CommonUtils';

const FaqCategoryPage = () => {
    let isSubmitting = false;
    const columns = [
        {
            field: 'language',
            headerName: '언어구분',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'name',
            headerName: '카테고리명',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'order_no',
            headerName: '노출 순서',
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
    const [responseData, requestError, loading, { categorySearch, categoryInsert, categoryUpdate, categoryDelete }] = CategoryApis();

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

    const [search_language, setSearchLanguage] = useState('KO');
    const [isUpdate, setIsUpdate] = useState(false);

    // 입력 데이터 - Default
    const [inputs, setInputs] = useState({
        id: '',
        name: '',
        order_no: 1,
        language: 'KO',
        use_yn: 'true'
    });
    const { id, name, order_no, language, use_yn } = inputs;

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
        categorySearch('KO');
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
                    alert('저장을 완료하였습니다.');
                    newClick();
                    categorySearch(search_language);
                }
                break;
            case 'updateData':
                if (responseData.data.data) {
                    alert('수정을 완료하였습니다.');
                    newClick();
                    categorySearch(search_language);
                }
                break;
            case 'deleteData':
                console.log('deleteData');
                alert('삭제 처리를 완료하였습니다.');
                newClick();
                categorySearch(search_language);
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
                language: rowData.row.language,
                order_no: rowData.row.order_no
            });
        }
    };

    const searchLanguageChanged = (e) => {
        setSearchLanguage(e.target.value);
        categorySearch(e.target.value);
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // search
    const searchClick = () => {
        categorySearch(search_language);
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
            language: 'KO',
            order_no: 1,
            use_yn: true
        });
        setIsUpdate(false);
    };

    // save
    const saveClick = () => {
        if (!name) {
            alert('명칭을 입력하지 않았습니다.');
            return;
        }
        if (!order_no) {
            alert('노출 순서를 입력하지 않았습니다.');
            return;
        }
        if (!isUpdate) {
            categoryInsert(inputs);
        } else {
            categoryUpdate(inputs);
        }
    };
    // delete
    const deleteClick = () => {
        if (!isUpdate) {
            alert('삭제할 데이터가 없습니다.');
            return;
        }
        if (confirm('선택한 데이터에 대해서 삭제를 하시겠습니까?')) {
            // 선택한 계정에 대해서 삭제를 수행한다.
            categoryDelete(inputs);
        }
    };

    return (
        <Grid container rowSpacing={4} columnSpacing={2.75} className="faqCategorylist">
            <Grid item xs={12}>
                <HeaderTitle titleNm="카테고리 관리" menuStep01="사이트 운영" menuStep02="FAQ 관리" menuStep03="카테고리 관리" />

                <MainCard>
                    <TopInputLayout>
                        <FormControl size="medium" sx={{ minWidth: 250 }}>
                            <Select name="search_language" label="계열타입" value={search_language} onChange={searchLanguageChanged}>
                                <MenuItem value="KO">국문</MenuItem>
                                <MenuItem value="EN">영문</MenuItem>
                            </Select>
                        </FormControl>

                        <ButtonLayout>
                            {/* <Button
                                disableElevation
                                size="medium"
                                type="submit"
                                variant="contained"
                                color="secondary"
                                onClick={searchClick}
                            >
                                검색
                            </Button> */}
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
                        height={350}
                    />
                </ContentLine>
                <MainCard sx={{ mt: 2.5 }} content={false}>
                    <div className="bottom--item">
                        <DropInput title="언어 구분" className="bottom--blank" titleWidth={70}>
                            <Select name="language" label="언어선택" value={language} onChange={handleChange}>
                                <MenuItem value="KO">국문</MenuItem>
                                <MenuItem value="EN">영문</MenuItem>
                            </Select>
                        </DropInput>

                        <DropInput title="카테고리명" titleWidth={70}>
                            <TextField
                                id="filled-hidden-label-small"
                                type="text"
                                size="medium"
                                value={name}
                                name="name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="Enter the Name"
                                fullWidth
                            />
                        </DropInput>
                    </div>

                    <div className="bottom--item">
                        <DropInput title="사용여부" titleWidth={70}>
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

                        <DropInput title="노출순서" titleWidth={70}>
                            <TextField
                                id="filled-hidden-label-small"
                                type="number"
                                size="medium"
                                value={order_no}
                                name="order_no"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="정렬 순서"
                                fullWidth
                            />
                        </DropInput>
                    </div>
                </MainCard>
                <ButtonLayout style={{ marginTop: '1rem', marginBottom: '2rem' }}>
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

export default FaqCategoryPage;
