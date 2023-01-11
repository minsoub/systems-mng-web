/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';

// project import
import HeaderTitle from 'components/HeaderTitle';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import ContentLine from 'components/Common/ContentLine';
import TableHeader from 'components/Table/TableHeader';
import ErrorScreen from 'components/ErrorScreen';
import SearchForm from './search/SearchForm';

// transition
import BoardApi from 'apis/cms/boardapi';

//utils
import { getDateFormat } from 'utils/CommonUtils';

// =============|| Pressrelease - List ||============= //

const PressreleaseList = () => {
    const columns = [
        {
            field: 'id',
            headerName: 'No.',
            flex: 1,
            headerAlign: 'center',
            maxWidth: 80,
            align: 'center',
            valueGetter: (value) => {
                const { is_draft } = value.row;
                if (is_draft) {
                    return '-';
                }
                return dataGridRows.length - dataGridRows.findIndex((row) => row.id === value.id);
            }
        },
        {
            field: 'title',
            headerName: '제목',
            flex: 1,
            headerAlign: 'center',
            align: 'left'
        },
        {
            field: 'is_show',
            headerName: '상태',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 80,
            valueGetter: ({ value }) => {
                if (value) {
                    return '공개';
                } else {
                    return '비공개';
                }
            }
        },
        {
            field: 'create_date',
            headerName: '등록일시',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 200,
            valueGetter: ({ value }) => `${getDateFormat(value)}`
        },
        {
            field: 'update_date',
            headerName: '업데이트일시',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 200,
            valueGetter: ({ value }) => {
                return value ? `${getDateFormat(value)}` : '-';
            }
        },
        {
            field: 'create_account_email',
            headerName: '작성자',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 200
        },
        {
            field: 'read_count',
            headerName: '조회수',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 100,
            valueGetter: ({ value }) => {
                return value ? `${(value).toLocaleString('ko-KR')}` : '-';
            }
        }
    ];

    const navigate = useNavigate();
    const [responseData, requestError, loading, { searchBoardList }] = BoardApi();

    const [dataGridRows, setDataGridRows] = useState([]); // 그리드 목록 데이터
    const [dataTotal, setDataTotal] = useState(0); //데이터 전체 숫자
    const [isListRelooad, setIsListRelooad] = useState(false); // 리스트 갱신

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

    // 페이징 변경 이벤트
    const handlePage = (page) => {};
    // 그리드 클릭
    const handleClick = (e) => {
        console.log(e);
        navigate(`/cms/press-release/reg/${e.id}`);
    };
    //선택된 row id
    const handleSelectionChange = (item) => {};
    // 목록 조회
    const listLoad = (request) => {
        setIsListRelooad(false);
        searchBoardList('press-releases', request);
    };

    // 연동 결과
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
                break;
            default:
                return;
        }
    }, [responseData]);

    return (
        <Grid container rowSpacing={4} columnSpacing={2.75} className="pressreleaseList">
            <Grid item xs={12}>
                <HeaderTitle titleNm="보도자료 관리" menuStep01="사이트 운영" menuStep02="보도자료 관리" />
                <SearchForm listLoad={listLoad} listRelooad={isListRelooad} />
                <TableHeader type="press-release" dataTotal={dataTotal} />
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
            {errorMessage && (
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
            )}
        </Grid>
    );
};

export default PressreleaseList;
