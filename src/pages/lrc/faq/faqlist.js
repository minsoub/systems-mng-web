import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid } from '@mui/material';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import MainCard from 'components/MainCard';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import ErrorScreen from 'components/ErrorScreen';
import FaqApis from 'apis/lrc/faq/faqapi';
import CategoryApis from 'apis/lrc/faq/categoryapi';
import CategoryContents from './categorycontents';
import TopInputLayout from '../../../components/Common/TopInputLayout';

const FaqContent = (props) => {
    let isSubmitting = false;
    const columns = [
        {
            field: 'no',
            headerName: '번호',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 100
        },
        {
            field: 'id',
            headerName: '노출순서',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 100,
            renderCell: (params) => (
                <strong>
                    <ArrowCircleUpIcon onClick={() => gridOrderClick('+', params.value)} />

                    <ArrowCircleDownIcon onClick={() => gridOrderClick('-', params.value)} />
                </strong>
            )
        },
        {
            field: 'category',
            headerName: '카테고리',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 100
        },
        {
            field: 'title',
            headerName: '제목',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'use_yn',
            headerName: '사용여부',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 100
        },
        {
            field: 'email',
            headerName: '등록자',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 200
        },
        {
            field: 'create_date',
            headerName: '등록일시',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 180
        }
    ];
    const navigate = useNavigate();
    const [responseData, requestError, loading, { faqSearch, faqOrderSave }] = FaqApis();
    const [resData, reqError, resLoading, { categorySearch }] = CategoryApis();

    const { language, children, tabindex, index, ...other } = props;

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);
    const [totalDataGridRows, setTotalDataGridRows] = useState([]);

    // 카테고리 리스트
    const [categorys, setCategoryList] = useState([]);
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
        // Category 조회
        categorySearch(language);
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

    // Category List
    useEffect(() => {
        if (!resData) {
            return;
        }
        switch (resData.transactionId) {
            case 'getList':
                if (resData.data.data && resData.data.data.length > 0) {
                    let resultData = [];
                    resData.data.data.map((item) => {
                        let data = { id: item.id, name: item.name, count: 0 };
                        resultData.push(data);
                    });
                    setCategoryList(resultData);

                    // 데이터 조회
                    faqSearch(language);
                } else {
                    setCategoryList([]);
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
        switch (responseData.transactionId) {
            case 'getList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    //setDataGridRows(responseData.data.data);
                    let result = [];
                    // 받아온 데이터에 대해서 카테고리별로 분류한다.
                    responseData.data.data.map((item, idx) => {
                        let data = {
                            no: idx + 1,
                            id: item.id,
                            user_id: item.user_id,
                            order_no: item.order_no,
                            category: item.category,
                            category_code: item.category_code,
                            title: item.title,
                            content: item.content,
                            use_yn: item.use_yn,
                            customer: item.customer,
                            email: item.email,
                            language: item.language,
                            create_date: item.create_date,
                            create_admin_account_id: item.create_admin_account_id,
                            update_date: item.update_date,
                            update_admin_account_id: item.update_admin_account_id
                        };
                        result.push(data);

                        categorys.map((category, index) => {
                            if (item.category_code === category.id) {
                                setCategoryList((current) =>
                                    current.map((obj) => {
                                        if (obj.id === category.id) {
                                            return { ...obj, count: obj.count + 1 };
                                        }
                                        return obj;
                                    })
                                );
                            }
                        });
                    });
                    console.log(categorys);
                    setDataGridRows(result);
                    setTotalDataGridRows(result);
                } else {
                    setDataGridRows([]);
                }
                break;
            case 'updateOrderData':
                alert('노출 순서를 저장하였습니다!!!');
                // 초기화
                categorys.map((category, index) => {
                    setCategoryList((current) =>
                        current.map((obj) => {
                            return { ...obj, count: 0 };
                        })
                    );
                });
                faqSearch(language);
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
        // if (rowData && rowData.field && rowData.field !== '__check__') {
        //     //let searchCondition = { site_id: site_id, is_use: is_use, type: type };
        //     navigate(`/faq/reg/${language}/${rowData.id}`);
        // }
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {
        if (rowData && rowData.field && rowData.field !== '__check__') {
            //let searchCondition = { site_id: site_id, is_use: is_use, type: type };
            navigate(`/faq/reg/${language}/${rowData.id}`);
        }
    };

    // 등록 화면
    const regClick = () => {
        navigate(`/faq/reg/${language}`);
    };
    // 노출 순서 저장.
    const orderClick = () => {
        if (dataGridRows.length === 0) {
            return;
        }
        if (confirm('저장하시겠습니까?')) {
            let order = [];
            dataGridRows.map((item, index) => {
                order.push({ id: item.id, order_no: index });
            });
            let data = { order_list: order };
            faqOrderSave(data);
        }
    };
    // 분류 클릭 시
    const filterClick = (id) => {
        console.log(id);
        let filterGridData = totalDataGridRows.filter((el) => el.category_code === id);
        setDataGridRows(filterGridData);
    };

    // Grid order click
    const gridOrderClick = (kind, id) => {
        console.log(kind);
        console.log(id);
        // index 구하기
        let index = -1;
        dataGridRows.map((item, idx) => {
            if (item.id === id) {
                index = idx;
                return;
            }
        });
        console.log(index);
        let copyGrid = [...dataGridRows];

        if (index > -1) {
            if ((index === 0 && kind === '+') || (index === copyGrid.length - 1 && kind === '-')) {
                console.log('not work...');
            } else {
                if (kind === '+') {
                    let original = copyGrid[index]; // curent
                    let copy = copyGrid[index - 1];
                    copyGrid[index] = copy; //{ ...copyGrid[index], copy };
                    copyGrid[index - 1] = original; //{ ...copyGrid[index + 1], original };
                    setDataGridRows(copyGrid);
                } else {
                    let original = copyGrid[index]; // curent
                    let copy = copyGrid[index + 1];
                    copyGrid[index] = copy; // { ...copyGrid[index], copy };
                    copyGrid[index + 1] = original; // { ...copyGrid[index + 1], original };
                    console.log(copyGrid);
                    setDataGridRows(copyGrid);
                }
            }
        }
    };

    return (
        <div>
            <MainCard sx={{ mt: 1, minHeight: 60, marginBottom: 2 }} content={false}>
                <Grid container>
                    {categorys.map((item, index) => (
                        <CategoryContents key={index} id={item.id} content={item.name} count={item.count} filterClick={filterClick} />
                    ))}
                </Grid>
            </MainCard>

            <MainCard xs={8}>
                <DefaultDataGrid
                    columns={columns}
                    rows={dataGridRows}
                    height={500}
                    handlePageChange={handlePage}
                    handleGridClick={handleClick}
                    handleGridDoubleClick={handleDoubleClick}
                    selectionChange={handleSelectionChange}
                />
            </MainCard>

            <TopInputLayout className="bottomBlank">
                <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={orderClick}>
                    노출 순서 저장
                </Button>

                <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={regClick}>
                    등록
                </Button>
            </TopInputLayout>

            {errorMessage ? (
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
            ) : null}
        </div>
    );
};

export default FaqContent;
