
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FormControl, TextField, Typography } from '@mui/material';
import DefaultDataGrid from '../../../components/DataGrid/DefaultDataGrid';
import HistoryApi from 'apis/lrc/project/historyapi';
import ContentLine from '../../../components/Common/ContentLine';
import TopInputLayout from '../../../components/Common/TopInputLayout';
import ButtonLayout from '../../../components/Common/ButtonLayout';

const ProjectHistory = (props) => {
    let isSubmitting = false;
    const columns = [
        {
            field: 'menu',
            headerName: '메뉴',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'subject',
            headerName: '항목',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'task_history',
            headerName: '작업내역',
            width: 300,
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'customer',
            headerName: '수정자',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'update_date',
            headerName: '변경일시',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        }
    ];
    const navigate = useNavigate();
    const [responseData, requestError, loading, { historySearch }] = HistoryApi();
    const { projectId, children, tabindex, index, ...other } = props;

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);

    ////////////////////////////////////////////////////
    // 공통 에러 처리
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    ////////////////////////////////////////////////////

    // 검색 조건
    const refKeyword = useRef();

    // onload
    useEffect(() => {
        historySearch(projectId, null);
    }, [projectId]);

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
            case 'historyList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setDataGridRows(responseData.data.data);
                } else {
                    setDataGridRows([]);
                }
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
            //let searchCondition = { site_id: site_id, is_use: is_use, type: type };
            //navigate(`/authmng/reg/${rowData.id}`);
        }
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // search
    const searchClick = () => {
        console.log('searchClick called...');
        //roleComboSearch(is_use, type, site_id);
        if (refKeyword.current.value === '') {
            alert('검색 단어를 입력하세요.');
            return;
        }
        historySearch(projectId, refKeyword.current.value);
    };

    return (
        <>
            <TopInputLayout className="bottom--blank__small">
                <Typography variant="h4">변경 히스토리</Typography>

                <ButtonLayout>
                    <FormControl sx={{ minWidth: 250, boxSizing: 'border-box' }} size="medium">
                        <TextField size="medium" id="outlined-multiline-static" inputRef={refKeyword} />
                    </FormControl>

                    <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={searchClick}>
                        검색
                    </Button>
                </ButtonLayout>
            </TopInputLayout>

            <ContentLine sx={{ mt: 2 }} content={false}>
                <DefaultDataGrid
                    columns={columns}
                    rows={dataGridRows}
                    handlePageChange={handlePage}
                    handleGridClick={handleClick}
                    handleGridDoubleClick={handleDoubleClick}
                    selectionChange={handleSelectionChange}
                />
            </ContentLine>
        </>
    );
};

export default ProjectHistory;
