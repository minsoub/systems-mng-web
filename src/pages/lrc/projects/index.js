import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
    Button,
    Grid,
    MenuItem,
    InputLabel,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import MainCard from 'components/Common/MainCard';
import StatusApi from 'apis/lrc/status/statusapi';
import FoundationApi from 'apis/lrc/project/foundationapi';
import ErrorScreen from 'components/ErrorScreen';
import { BusinessCheckboxList } from './component/business';
import { NetworkCheckboxList } from './component/network';
import StsCategory from './component/stscategory';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchData } from 'store/reducers/projectsearch';
import HeaderTitle from '../../../components/HeaderTitle';
import SearchDate from '../../../components/ContentManage/SearchDate';
import DropInput from '../../../components/Common/DropInput';
import SearchBar from '../../../components/ContentManage/SearchBar';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import cx from 'classnames';
import InputLayout from '../../../components/Common/InputLayout';
import './styles.scss';
import ContentLine from '../../../components/Common/ContentLine';
import { getDateFormatSecond } from 'utils/CommonUtils';
import { stubFalse } from 'lodash';
import { PlusOutlined } from '@ant-design/icons';
import ScrollX from 'components/Common/ScrollX';

const ProjectsPage = () => {
    let isSubmitting = false;
    const useStyles = makeStyles({
        tableRow: {
            height: 25
        },
        tableCell: {
            padding: '0px 16px',
            height: 35
        },
        table: {
            '& .MuiTableCell-root': {
                borderLeft: '1px solid rgba(224, 224, 224, 1)'
            }
        }
    });

    const StyledTableCell = withStyles((theme) => ({
        root: {
            padding: '0px 16px',
            height: 35,
            whiteSpace: 'nowrap'
        }
    }))(TableCell);

    const navigate = useNavigate();
    const { paramId1, paramId2 } = useParams();
    const [resData, reqErr, resLoading, { statusSearch }] = StatusApi();
    const [responseData, requestError, loading, { foundationSearch, foundationExcelDownload }] = FoundationApi();

    const {
        reduceFromDate,
        reduceToDate,
        reducePeriod,
        reduceContractCode,
        reduceProcessCode,
        reduceBusinessList,
        reduceNetworkList,
        reduceKeyword
    } = useSelector((state) => state.projectSearchReducer);
    const dispatch = useDispatch();

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);
    const [totalDataGridRows, setTotalDataGridRows] = useState([]);

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

    // 검색 조건
    const [keyword, setKeyword] = useState('');
    const [from_date, setStartDate] = useState(''); // new Date());
    const [to_date, setEndDate] = useState(''); // new Date());
    const [period, setPeriod] = useState('1');
    const [contract_code, setSts] = useState('');
    const [process_code, setProcess] = useState('');

    const [checkedBusinessItems, setCheckedBusinessItems] = useState(new Set()); // 비즈니스 체크박스 리스트
    const [checkedNetworkItems, setCheckedNetworkItems] = useState(new Set()); // Network 체크박스 리스트
    const [statusAllList, setStatusAllList] = useState([]); // 전체 상태 리스트
    const [statusList, setStatusList] = useState([]); // 계약 상태
    const [processList, setProcessList] = useState([]); // 계약 상태 변경 시 진행상태 출력 리스트.

    // 진행상태
    const [categoryList, setCategoryList] = useState([]);

    const [isAllChecked, setIsAllChecked] = useState(false);
    // reduce search mode
    const [isSearch, setIsSearch] = useState(false);
    // onload
    useEffect(() => {
        // setStartDate(moment().format('YYYY-MM-DD'));
        // setEndDate(moment().format('YYYY-MM-DD'));
        setDateFromToSet('5');
        setPeriod('5'); // default value
        statusSearch(false); // 상태 값 모두 조회
        console.log(new Date());
        if (!paramId1 && !paramId2) {
            setIsSearch(true);
        }
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
    useEffect(() => {
        if (isSearch) {
            searchClick();
            setIsSearch(false);
        }
    }, [isSearch]);

    // 계약상태 데이터 변경
    useEffect(() => {
        if (paramId1) {
            setSts(paramId1);
            processPrint(paramId1);
            setDateFromToSet('5');
            setPeriod('5'); // default value
        }
    }, [statusList]);
    // 진행상태 변경
    useEffect(() => {
        if (paramId2) {
            setProcess(paramId2);
        }

        if (paramId1 || paramId2) {
            //searchClick();
            setIsSearch(true);
        }
    }, [processList]);

    // Combobox data transaction
    useEffect(() => {
        if (!resData) {
            return;
        }
        switch (resData.transactionId) {
            case 'getList':
                if (resData.data.data) {
                    setStatusAllList(resData.data.data);

                    let itemData = resData.data.data;
                    let list = [];
                    let category = [];
                    itemData.map((item, index) => {
                        if (item.parent_code === '') {
                            const s = { id: item.id, name: item.name };
                            //console.log(s);
                            list.push(s);

                            const s1 = { id: item.id, name: item.name, count: 0 };
                            category.push(s1);
                        }
                    });
                    setStatusList(list);
                    setCategoryList(category);
                    // reduce 상태값을 사용하여 검색을 수행한다.
                    if (reduceFromDate) setStartDate(reduceFromDate);
                    if (reduceToDate) setEndDate(reduceToDate);
                    if (reduceKeyword) setKeyword(reduceKeyword);
                    if (reducePeriod) setPeriod(reducePeriod);
                    if (reduceContractCode) setSts(reduceContractCode);
                    if (reduceProcessCode) setProcess(reduceProcessCode);

                    // 사업계열, 네트워크 계열
                    if (reduceFromDate && reduceToDate) setIsSearch(true);
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
                    setDataGridRows(responseData.data.data);
                    setTotalDataGridRows(responseData.data.data);

                    responseData.data.data.map((item, idx) => {
                        categoryList.map((category, index) => {
                            if (item.contract_code === category.id) {
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
                } else {
                    setDataGridRows([]);
                }
                break;
            case 'excelDownload':
                if (responseData.data) {
                    let res = responseData;
                    console.log('res data....');
                    console.log(res);
                    console.log(res.fileName);
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', '거래지원.xlsx');
                    link.style.cssText = 'display:none';
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                }
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
    const resetPeriod = () => {
        setPeriod(0);
    };
    const changeDate = (type, e) => {
        switch (type) {
            case 'start':
                setStartDate(e);
                break;
            case 'end':
                setEndDate(e);
                break;
            default:
                break;
        }
    };
    const handleChange = (e /*, name */) => {
        switch (e.target.name) {
            case 'keyword':
                setKeyword(e.target.value);
                break;
            // 시작
            case 'from_date':
                setStartDate(e.target.value);
                break;
            case 'to_date':
                if (from_date > e.target.value) {
                    alert('기간 검색에서 종료일이 시작일보다 작을 수 없습니다.');
                    return;
                }
                setEndDate(e.target.value);
                break;
            case 'period':
                setPeriod(e.target.value);
                setDateFromToSet(e.target.value);
                break;
            case 'contract_code':
                setSts(e.target.value);
                // 진행상태 출력.
                processPrint(e.target.value);
                break;
            case 'process_code':
                setProcess(e.target.value);
                break;
            case 'start_picker':
                console.log(e.target.value);
                break;
            case 'end_picker':
                console.log(e.target.value);
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
                setStartDate(moment().add(-30, 'days').format('YYYY-MM-DD'));
                setEndDate(moment().format('YYYY-MM-DD'));
                break;
            case '4':
                setStartDate(moment().add(-90, 'days').format('YYYY-MM-DD'));
                setEndDate(moment().format('YYYY-MM-DD'));
                break;
            default:
                break;
        }
    };
    // 계약 상태 변경 시 진행상태 출력
    const processPrint = (id) => {
        setProcessList([]);
        let list = [];
        statusAllList.map((item, index) => {
            if (item.id === id && item.children && item.children.length > 0) {
                item.children.map((subitem, idx) => {
                    const s = { id: subitem.id, name: subitem.name };
                    list.push(s);
                });
                setProcessList(list);
                return;
            }
        });
    };
    // Business Checkbox Handler
    const checkedBusinessItemHandler = (id, isChecked) => {
        setIsAllChecked(false);
        if (isChecked) {
            checkedBusinessItems.add(id);
            setCheckedBusinessItems(checkedBusinessItems);
        } else if (!isChecked && checkedBusinessItems.has(id)) {
            checkedBusinessItems.delete(id);
            setCheckedBusinessItems(checkedBusinessItems);
        }
    };
    // Network Checkbox Handler
    const checkedNetworkItemHandler = (id, isChecked) => {
        setIsAllChecked(false);
        if (isChecked) {
            checkedNetworkItems.add(id);
            setCheckedNetworkItems(checkedNetworkItems);
        } else if (!isChecked && checkedNetworkItems.has(id)) {
            checkedNetworkItems.delete(id);
            setCheckedNetworkItems(checkedNetworkItems);
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

    // 그리드 클릭
    const handleClick = (rowData) => {
        //if (rowData && rowData.field && rowData.field !== '__check__') {
        navigate(`/projects/detail/${rowData.id}`);
        //}
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // search
    const searchClick = () => {
        console.log('searchClick called...');
        setDataGridRows([]);
        setTotalDataGridRows([]);
        setSeletedRows([]);
        setPage(0);
        setRowsPerPage(10);
        // categorylist clear
        clearCategory();
        //roleComboSearch(is_use, type, site_id);
        let business_list = [];
        let network_list = [];
        Array.from(checkedBusinessItems).map((item, idx) => {
            business_list.push(item);
        });
        Array.from(checkedNetworkItems).map((item, idx) => {
            network_list.push(item);
        });
        let start_date = from_date;
        let end_date = to_date;

        if (period === '5') {
            start_date = '2022-01-01';
            end_date = '2099-12-31';
        }
        // 검색 조건 세팅
        let data = {
            from_date: start_date,
            to_date: end_date,
            contract_code: contract_code,
            progress_code: process_code,
            business_list: business_list,
            network_list: network_list,
            keyword: keyword
        };
        console.log(data);
        foundationSearch(data);
        // 검색 조건에 대해서 상태를 저장한다.
        const searchData = {
            reduceFromDate: from_date,
            reduceToDate: to_date,
            reducePeriod: period,
            reduceContractCode: contract_code,
            reduceProcessCode: process_code,
            reduceBusinessList: business_list,
            reduceNetworkList: network_list,
            reduceKeyword: keyword
        };
        dispatch(setSearchData(searchData));
    };
    const clearClick = () => {
        setPage(0);
        setRowsPerPage(10);
        setPeriod('5');
        setDateFromToSet('5');
        clearCategory();
        // setStartDate(moment().format('YYYY-MM-DD'));
        // setEndDate(moment().format('YYYY-MM-DD'));
        setSts('');
        setProcess('');
        checkedBusinessItems.clear();
        setCheckedBusinessItems(new Set());
        setCheckedNetworkItems(new Set());
        checkedNetworkItems.clear();
        setKeyword('');
        setIsAllChecked(true);

        setDataGridRows([]);
        setTotalDataGridRows([]);
        setSeletedRows([]);

        searchClick();
    };
    const clearCategory = () => {
        categoryList.map((category, index) => {
            setCategoryList((current) =>
                current.map((obj) => {
                    if (obj.id === category.id) {
                        return { ...obj, count: 0 };
                    }
                    return obj;
                })
            );
        });
    };

    // 분류 클릭 시
    const filterClick = (id) => {
        if (id) {
            console.log(id);
            let filterGridData = totalDataGridRows.filter((el) => el.contract_code === id);
            setDataGridRows(filterGridData);
        } else {
            setDataGridRows(totalDataGridRows);
        }
    };

    // 엑셀 다운로드 클릭 시
    const ExcelDownloadClick = () => {
        console.log('ExcelDownloadClick called...');
        //roleComboSearch(is_use, type, site_id);
        let business_list = [];
        let network_list = [];
        Array.from(checkedBusinessItems).map((item, idx) => {
            business_list.push(item);
        });
        Array.from(checkedNetworkItems).map((item, idx) => {
            network_list.push(item);
        });
        let start_date = from_date;
        let end_date = to_date;

        if (period === '5') {
            start_date = '2022-01-01';
            end_date = '2099-12-31';
        }
        // 검색 조건 세팅
        let data = {
            from_date: start_date,
            to_date: end_date,
            contract_code: contract_code,
            progress_code: process_code,
            business_list: business_list,
            network_list: network_list,
            keyword: keyword
        };
        console.log(data);
        foundationExcelDownload(data);
    };

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // const currencyFormat = (num) => {
    //     return num.toFixed(4).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    // };

    return (
        <Grid container rowSpacing={4} columnSpacing={2.75} className="projectList">
            <Grid item xs={12}>
                <HeaderTitle titleNm="거래지원 관리" menuStep01="사이트 운영" menuStep02="거래지원 관리" />

                <MainCard>
                    <Grid>
                        {/* 기간 검색 */}
                        <SearchDate
                            start_date={from_date}
                            end_date={to_date}
                            period={period}
                            handleBlur={handleBlur}
                            handleChange={handleChange}
                            startName="from_date"
                            endName="to_date"
                            addAll={true}
                            changeDate={changeDate}
                            resetPeriod={resetPeriod}
                        />

                        <InputLayout>
                            <DropInput title="계약상태" titleWidth={120}>
                                <InputLabel id="contract_code">계약상태</InputLabel>
                                <Select
                                    labelId="contract_code"
                                    id="contract_code"
                                    name="contract_code"
                                    value={contract_code}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">전체</MenuItem>
                                    {statusList.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </DropInput>

                            <DropInput title="진행상태" titleWidth={60}>
                                <InputLabel id="process_code">진행상태</InputLabel>
                                <Select
                                    labelId="process_code"
                                    id="process_code"
                                    name="process_code"
                                    value={process_code}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">전체</MenuItem>
                                    {processList.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </DropInput>
                        </InputLayout>

                        <div className="orderLayout">
                            <BusinessCheckboxList checkedItemHandler={checkedBusinessItemHandler} isAllChecked={isAllChecked} />
                            <NetworkCheckboxList checkedItemHandler={checkedNetworkItemHandler} isAllChecked={isAllChecked} />
                        </div>

                        <SearchBar handleBlur={handleBlur} handleChange={handleChange} keyword={keyword} />
                    </Grid>
                </MainCard>

                <ButtonLayout style={{ marginBottom: '2.5rem' }}>
                    <Button disableElevation size="medium" type="submit" variant="contained" onClick={searchClick}>
                        검색
                    </Button>
                    <Button disableElevation size="medium" type="submit" variant="outlined_d" color="secondary" onClick={clearClick}>
                        초기화
                    </Button>
                    <Button disableElevation size="medium" type="submit" variant="outlined" color="primary" onClick={ExcelDownloadClick}>
                        <PlusOutlined style={{ marginRight: '0.6rem' }} /> Excel 엑셀 다운로드
                    </Button>
                </ButtonLayout>

                <MainCard bgcolor="#e5e5e5" addClass="tabs">
                    <Grid container spacing={0}>
                        <Grid item xs={1.8} sm={1.2} md={1.1}>
                            <Typography variant="h6" color="inherit" onClick={() => filterClick(null)}>
                                <a href="#">전체({totalDataGridRows.length})</a>
                            </Typography>
                        </Grid>

                        {categoryList.map((item, index) => (
                            <StsCategory key={index} id={item.id} content={item.name} count={item.count} filterClick={filterClick} />
                        ))}
                    </Grid>
                </MainCard>

                <ContentLine>
                    <ScrollX>
                        <Table style={{ tableLayout: 'auto' }} stickyHeader aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center" rowSpan={2}>
                                        프로젝트명
                                    </StyledTableCell>
                                    <StyledTableCell align="center" rowSpan={2}>
                                        심볼
                                    </StyledTableCell>
                                    <StyledTableCell align="center" colSpan={2}>
                                        거래지원 현황
                                    </StyledTableCell>
                                    <StyledTableCell align="center" rowSpan={2}>
                                        사업 계열
                                    </StyledTableCell>
                                    <StyledTableCell align="center" rowSpan={2}>
                                        네트워크 계열
                                    </StyledTableCell>
                                    <StyledTableCell align="center" colSpan={2}>
                                        마케팅 수량
                                    </StyledTableCell>
                                    <StyledTableCell align="center" rowSpan={2}>
                                        연결 프로젝트
                                    </StyledTableCell>
                                    <StyledTableCell align="center" rowSpan={2}>
                                        상장일
                                    </StyledTableCell>
                                    <StyledTableCell align="center" rowSpan={2}>
                                        등록일시
                                    </StyledTableCell>
                                    <StyledTableCell align="center" rowSpan={2}>
                                        최근 수정일시
                                    </StyledTableCell>
                                </TableRow>
                                <TableRow>
                                    <StyledTableCell style={{ width: '7.5%' }} align="center">
                                        계약 상태
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: '7.5%' }} align="center">
                                        진행 상태
                                    </StyledTableCell>

                                    <StyledTableCell style={{ width: '10%' }} align="center">
                                        제안
                                    </StyledTableCell>
                                    <StyledTableCell style={{ width: '10%' }} align="center">
                                        입금
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dataGridRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                    <TableRow key={index} hover className="link" onClick={() => handleClick(item)}>
                                        <TableCell style={{ width: '7%' }} align="center" component="td" scope="row">
                                            {item.project_name}
                                        </TableCell>
                                        <TableCell style={{ width: '5%' }} align="center" component="td" scope="row">
                                            {item.symbol}
                                        </TableCell>
                                        <TableCell style={{ width: '7.5%' }} align="center" component="td" scope="row">
                                            {item.contract_name}
                                        </TableCell>
                                        <TableCell style={{ width: '7.5%' }} align="center" component="td" scope="row">
                                            {item.progress_name}
                                        </TableCell>
                                        <TableCell style={{ width: '6%' }} align="center" component="td" scope="row">
                                            {item.business_name}
                                        </TableCell>
                                        <TableCell style={{ width: '7%' }} align="center" component="td" scope="row">
                                            {item.network_name}
                                        </TableCell>
                                        <TableCell style={{ width: '10%' }} align="center" component="td" scope="row">
                                            {item.minimum_quantity}
                                        </TableCell>
                                        <TableCell style={{ width: '10%' }} align="center" component="td" scope="row">
                                            {item.actual_quantity}
                                        </TableCell>
                                        <TableCell style={{ width: '10%' }} align="center" component="td" scope="row">
                                            {item.project_link}
                                        </TableCell>
                                        <TableCell style={{ width: '10%' }} align="center" component="td" scope="row">
                                            {item.ico_date}
                                        </TableCell>
                                        <TableCell style={{ width: '10%' }} align="center" component="td" scope="row">
                                            {getDateFormatSecond(item.create_date)}
                                        </TableCell>
                                        <TableCell style={{ width: '10%' }} align="center" component="td" scope="row">
                                            {getDateFormatSecond(item.create_date)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollX>
                </ContentLine>
                <TablePagination
                    sx={{
                        border: '1px solid #e6ebf1',
                        borderTop: 'none',
                        boxShadow: 'none',
                        borderRadius: '0 0 2px 2px'
                    }}
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={dataGridRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                {errorMessage && (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                )}
            </Grid>
        </Grid>
    );
};

export default ProjectsPage;
