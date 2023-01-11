/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';

// project import
import HeaderTitle from 'components/HeaderTitle';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import ContentLine from 'components/Common/ContentLine';
import TableHeader from 'components/Table/TableHeader';
import ErrorScreen from 'components/ErrorScreen';
import CategoryModal from './popup/CategoryModal';
import CategorySearchForm from './search/CategorySearchForm';

// transition
import BoardApi from 'apis/cms/boardapi';

//etc
import { getColumsData } from '../colums';

// =============|| Category - List ||============= //

const CategoryList = () => {
    const [responseData, requestError, loading, { searchBoardList }] = BoardApi();
    const [dataGridRows, setDataGridRows] = useState([]); // 그리드 목록 데이터
    const [dataTotal, setDataTotal] = useState(0); //데이터 전체 숫자
    const [selectRowData, setSelectRowData] = useState(null); // 선택한 데이터
    const [isListRelooad, setIsListRelooad] = useState(false); // 리스트 갱신
    const columns = getColumsData('category', dataGridRows); // 데이터 그리드 컬럼

    const handleOpen = () => setOpen(true);
    const handleClose = (loadState) => {
        if (loadState === 'reload') {
            setIsListRelooad(true);
        } else {
            setSelectRowData(null);
        }
        setOpen(false);
    };
    //-- 에러 처리 부분 -S- //
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const parentErrorClear = () => {
        setOpen(false);
        setErrorTitle('');
        setErrorMessage('');
    };
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
    //-- 에러 처리 부분 -E- //

    // 목록 조회
    const listLoad = (request) => {
        setIsListRelooad(false);
        searchBoardList('notices/categories', request);
    };

    // 그리드 클릭
    const handleClick = (rowData) => {
        setSelectRowData(rowData.row);
        handleOpen();
    };
    // 페이징 변경 이벤트
    const handlePage = (page) => {};
    //체크박스 선택된 row id 저장
    const handleSelectionChange = (item) => {};
    //통신 결과 파싱
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getBoards':
                if (responseData.data.data) {
                    // console.log(responseData.data.data);
                    setDataTotal(Number(responseData.data.data.total_counts));
                    setDataGridRows(responseData.data.data.contents);
                } else {
                    setDataGridRows([]);
                }
                break;
            default:
                return;
        }
    }, [responseData]);

    return (
        <Grid container rowSpacing={4} columnSpacing={2.75} className="categoryist">
            <Grid item xs={12}>
                <HeaderTitle titleNm="카테고리 관리" menuStep01="사이트 운영" menuStep02="카테고리 관리" />
                <CategorySearchForm listLoad={listLoad} listRelooad={isListRelooad} />
                <TableHeader type="category" newAdd={handleOpen} dataTotal={dataTotal} />
                <ContentLine>
                    <DefaultDataGrid
                        columns={columns}
                        rows={dataGridRows}
                        pageSize={10}
                        height={660}
                        handlePageChange={handlePage}
                        handleGridClick={handleClick}
                        selectionChange={handleSelectionChange}
                    />
                </ContentLine>
            </Grid>
            <CategoryModal open={open} onClose={handleClose} selectRowData={selectRowData} />
            {errorMessage && (
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
            )}
        </Grid>
    );
};

export default CategoryList;
