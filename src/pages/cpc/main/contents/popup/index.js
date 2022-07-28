import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import MainCard from 'components/Common/MainCard';
import { Alert, AlertTitle, Button, Collapse, Dialog, DialogContent, Grid, IconButton, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import MainContentsApi from 'apis/cpc/mainContents/maincontentsapi';
import SearchDate from 'components/ContentManage/SearchDate';
import SearchBar from 'components/ContentManage/SearchBar';
import moment from 'moment';
import ButtonLayout from 'components/Common/ButtonLayout';
import './styles.module.scss';
import ContentLine from 'components/Common/ContentLine';
import { getDateFormat } from 'utils/CommonUtils';

function BoardSearchDialog(props) {
    const listColumns = [
        {
            field: 'id',
            headerName: '번호',
            headerAlign: 'center',
            flex: 1,
            align: 'center',
            maxWidth: 100
        },
        {
            field: 'title',
            headerName: '제목',
            headerAlign: 'center',
            flex: 1
        },
        {
            field: 'create_date',
            headerName: '등록일시',
            headerAlign: 'center',
            flex: 1,
            align: 'center',
            maxWidth: 200,
            valueGetter: ({ value }) => `${getDateFormat(value)}`
        },
        {
            field: 'actions',
            headerName: '',
            width: 30,
            renderCell: (params) => <AddCircleIcon />
        }
    ];
    const selectedColumns = [
        {
            field: 'id',
            headerName: '번호',
            headerAlign: 'center',
            flex: 1,
            align: 'center',
            maxWidth: 100
        },
        {
            field: 'title',
            headerName: '제목',
            headerAlign: 'center',
            flex: 1
        },
        {
            field: 'create_date',
            headerName: '등록일시',
            headerAlign: 'center',
            flex: 1,
            align: 'center',
            maxWidth: 200,
            valueGetter: ({ value }) => `${getDateFormat(value)}`
        },
        {
            field: 'actions',
            headerName: '',
            width: 30,
            renderCell: (params) => <RemoveCircleIcon />
        }
    ];
    const { boardMasterId, onClose, open } = props;
    // 그리드 목록 데이터
    const [selectedRows, setSeletedRows] = useState({});
    const [dataGridRows, setDataGridRows] = useState([]);
    const [responseData, requestError, resLoading, { searchMainContents, searchBoardsForMain, updateMainContents }] = MainContentsApi();
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [digital_asset_basic, setDigitalAssetBasic] = useState([]);
    const [insight_column, setInsightColumn] = useState([]);
    const [digital_asset_trends, setDigitalAssetTrends] = useState([]);
    const [blockchain_news, setBlockchainNews] = useState([]);
    const [selectedBoardRows, setSelectedBoardRows] = useState([]);

    // 검색 조건
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [period, setPeriod] = useState('1');
    const [status, setStatus] = useState('');
    const [keyword, setKeyword] = useState('');

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            console.log('error requestError');
            console.log(requestError);
            setErrorTitle('Error Message');
            setErrorMessage(requestError);
            setErrorOpen(true);
        }
    }, [requestError]);

    // onload
    useEffect(() => {
        errorClear();

        searchMainContents();

        setStartDate(moment().format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));

        const request = {
            start_date: moment().format('YYYY-MM-DD'),
            end_date: moment().format('YYYY-MM-DD'),
            keyword
        };
        searchBoardsForMain(boardMasterId, request);
    }, []);

    useEffect(() => {
        searchMainContents();
    }, [open]);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getMainContents':
                if (responseData.data.data) {
                    setDigitalAssetBasic(responseData.data.data.digital_asset_basic);
                    setInsightColumn(responseData.data.data.insight_column);
                    setDigitalAssetTrends(responseData.data.data.digital_asset_trends);
                    setBlockchainNews(responseData.data.data.blockchain_news);

                    switch (boardMasterId) {
                        case 'CPC_DIGITAL_ASSET':
                            setSelectedBoardRows(responseData.data.data.digital_asset_basic);
                            break;
                        case 'CPC_INSIGHT_COLUMN':
                            setSelectedBoardRows(responseData.data.data.insight_column);
                            break;
                        case 'CPC_TREND':
                            setSelectedBoardRows(responseData.data.data.digital_asset_trends);
                            break;
                        case 'CPC_NEWS':
                            setSelectedBoardRows(responseData.data.data.blockchain_news);
                            break;
                        default:
                            break;
                    }
                }
                break;
            case 'getBoardsForMain':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setDataGridRows(responseData.data.data);
                } else {
                    setDataGridRows([]);
                }
                break;
            case 'updateMainContents':
                alert('저장되었습니다.');
                handleClose();
                break;
            default:
        }
    }, [responseData]);

    // 에러 정보를 클리어 한다.
    const errorClear = () => {
        setErrorOpen(false);
        setErrorTitle('');
        setErrorMessage('');
    };

    const handleBlur = (e) => {
        console.log(e);
    };

    const handleChange = (e) => {
        switch (e.target.name) {
            case 'start_date':
                setStartDate(e.target.value);
                setPeriod('');
                break;
            case 'end_date':
                setEndDate(e.target.value);
                setPeriod('');
                break;
            case 'period':
                setPeriod(e.target.value);
                setDateFromToSet(e.target.value);
                break;
            case 'status':
                setStatus(e.target.value);
                break;
            case 'keyword':
                setKeyword(e.target.value);
                break;
            default:
                break;
        }
    };

    // 기간 선택시 날짜 변경
    const setDateFromToSet = (periodIndex) => {
        switch (periodIndex) {
            case '1':
                setStartDate(moment().format('YYYY-MM-DD'));
                setEndDate(moment().format('YYYY-MM-DD'));
                break;
            case '2':
                setStartDate(moment().add(-1, 'days').format('YYYY-MM-DD'));
                setEndDate(moment().add(-1, 'days').format('YYYY-MM-DD'));
                break;
            case '3':
                setStartDate(moment().add(-1, 'months').format('YYYY-MM-DD'));
                setEndDate(moment().format('YYYY-MM-DD'));
                break;
            case '4':
                setStartDate(moment().add(-3, 'months').format('YYYY-MM-DD'));
                setEndDate(moment().format('YYYY-MM-DD'));
                break;
            default:
                break;
        }
    };

    // 초기화
    const clearClick = () => {
        console.log('clearClick called...');
        setStartDate('');
        setEndDate('');
        setPeriod('1');
        setKeyword('');
    };

    // 검색
    const searchClick = () => {
        console.log('searchClick called...');
        const request = {
            start_date,
            end_date,
            keyword
        };
        searchBoardsForMain(boardMasterId, request);
    };

    // 저장
    const saveClick = () => {
        console.log('saveClick called...');

        if (confirm('저장 하시겠습니까?')) {
            const data = {
                digital_asset_basic:
                    boardMasterId === 'CPC_DIGITAL_ASSET'
                        ? selectedBoardRows.map((item) => item.id)
                        : digital_asset_basic.map((item) => item.id),
                insight_column:
                    boardMasterId === 'CPC_INSIGHT_COLUMN'
                        ? selectedBoardRows.map((item) => item.id)
                        : insight_column.map((item) => item.id),
                digital_asset_trends:
                    boardMasterId === 'CPC_TREND' ? selectedBoardRows.map((item) => item.id) : digital_asset_trends.map((item) => item.id),
                blockchain_news:
                    boardMasterId === 'CPC_NEWS' ? selectedBoardRows.map((item) => item.id) : blockchain_news.map((item) => item.id)
            };
            console.log(data);
            updateMainContents(data);
        }
    };

    //체크박스 선택된 row id 저장
    const handleSelectionChange = (item) => {
        if (item) {
            setSeletedRows(item);
        }
    };
    // 페이징 변경 이벤트
    const handlePage = (page) => {};

    // 게시글 리스트 그리드 클릭
    const handleClick = (rowData) => {
        if (rowData && rowData.field) {
            if (rowData.field === 'actions') {
                const existsRows = selectedBoardRows.filter((item) => item.id === rowData.id);
                if (existsRows.length === 0) {
                    if (selectedBoardRows.length > 2) {
                        alert('게시글을 최대 3개 선택 가능합니다.');
                        return;
                    }
                    const tempRows = selectedBoardRows.slice();
                    tempRows.push(rowData.row);
                    setSelectedBoardRows(tempRows);
                } else {
                    alert('선택된 게시글입니다.');
                }
            }
        }
    };
    // 선택된 게시글 그리드 클릭
    const handleSelectedClick = (rowData) => {
        if (rowData && rowData.field) {
            if (rowData.field === 'actions') {
                const tempRows = selectedBoardRows.filter((item) => item.id !== rowData.id);
                setSelectedBoardRows(tempRows);
            }
        }
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    const handleClose = () => {
        onClose();
        clearClick();
        setDataGridRows([]);
        setSelectedBoardRows([]);
    };

    return (
        <Dialog onClose={handleClose} open={open} maxWidth={1280}>
            <DialogContent style={{ height: '1135px' }}>
                <Typography sx={{ mt: 1, mb: 0 }} variant="h4" gutterBottom component="div" className="bottom--blank">
                    게시글 선택
                </Typography>
                <MainCard>
                    {/* 기간 검색 */}
                    <SearchDate
                        start_date={start_date}
                        end_date={end_date}
                        period={period}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        startName="start_date"
                        endName="end_date"
                    />

                    {/* 검색바 */}
                    <SearchBar keyword={keyword} handleChange={handleChange} handleBlur={handleBlur} />
                </MainCard>
                <ButtonLayout>
                    <Button disableElevation size="medium" type="submit" variant="contained" onClick={clearClick}>
                        초기화
                    </Button>

                    <Button disableElevation size="medium" type="submit" color="secondary" variant="contained" onClick={searchClick}>
                        검색
                    </Button>
                </ButtonLayout>
                <Typography sx={{ mt: 1, mb: 1 }} variant="h5" gutterBottom component="div">
                    게시글 리스트
                </Typography>
                <ContentLine>
                    <DefaultDataGrid
                        height={340}
                        pageSize={4}
                        columns={listColumns}
                        rows={dataGridRows}
                        handlePageChange={handlePage}
                        handleGridClick={handleClick}
                        handleGridDoubleClick={handleDoubleClick}
                        selectionChange={handleSelectionChange}
                    />
                </ContentLine>
                <Typography sx={{ mt: 1, mb: 1 }} variant="h5" gutterBottom component="div">
                    선택된 게시글
                </Typography>
                <ContentLine>
                    <DefaultDataGrid
                        height={290}
                        columns={selectedColumns}
                        rows={selectedBoardRows}
                        handlePageChange={handlePage}
                        handleGridClick={handleSelectedClick}
                        handleGridDoubleClick={handleDoubleClick}
                        selectionChange={handleSelectionChange}
                    />
                </ContentLine>
                <ButtonLayout>
                    <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={handleClose}>
                        닫기
                    </Button>
                    <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={saveClick}>
                        저장
                    </Button>
                </ButtonLayout>
            </DialogContent>
        </Dialog>
    );
}

BoardSearchDialog.propTypes = {
    boardMasterId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};

export default BoardSearchDialog;
