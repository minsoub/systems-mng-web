import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Button,
    Grid,
    MenuItem,
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
            minWidth: 650,
            '& .MuiTableCell-root': {
                borderLeft: '1px solid rgba(224, 224, 224, 1)'
            }
        }
    });

    const StyledTableCell = withStyles((theme) => ({
        root: {
            padding: '0px 16px',
            height: 35
        }
    }))(TableCell);

    const columns = [
        {
            field: 'id',
            headerName: '프로젝트명',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'symbol',
            headerName: '심볼',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'type',
            headerName: '거래지원 현황',
            width: 300,
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            rederCell: (params) => {
                <div>
                    <Typography>{params.value.name}</Typography>
                    <Typography color="textSecondary">{params.value.title}</Typography>
                </div>;
            }
        },
        {
            field: 'business_name',
            headerName: '사업 계열',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'network_name',
            headerName: '네트워크 계열',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'valid_end_date',
            headerName: '마케팅 수량',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'project_link',
            headerName: '연결 프로젝트',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'ico_date',
            headerName: '상장일',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'create_date',
            headerName: '등록일시',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        }
    ];
    const navigate = useNavigate();
    const [resData, reqErr, resLoading, { statusSearch }] = StatusApi();
    const [responseData, requestError, Loading, { foundationSearch }] = FoundationApi();

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
    const [from_date, setStartDate] = useState(new Date());
    const [to_date, setEndDate] = useState(new Date());
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
        setDateFromToSet('3');
        setPeriod('3'); // default value
        statusSearch(); // 상태 값 모두 조회
        console.log(new Date());
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
                            console.log(s);
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
            default:
        }
    }, [responseData]);

    const handleClose = () => {
        setVisible(false);
    };
    const handleBlur = (e) => {
        console.log(e);
    };
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'keyword':
                setKeyword(e.target.value);
                break;
            // 시작
            case 'from_date':
                setStartDate(e.target.value);
                // 끝
                break;
            case 'to_date':
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
        console.log(id);
        let list = [];
        statusAllList.map((item, index) => {
            if (item.id === id && item.children && item.children.length > 0) {
                item.children.map((subitem, idx) => {
                    const s = { id: subitem.id, name: subitem.name };
                    //console.log(s);
                    list.push(s);
                });
                setProcessList(list);
                return;
            }
        });
    };
    // Business Checkbox Handler
    const checkedBusinessItemHandler = (id, isChecked) => {
        console.log(id);
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
        console.log(id);
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
        //roleComboSearch(is_use, type, site_id);
        let business_list = [];
        let network_list = [];
        Array.from(checkedBusinessItems).map((item, idx) => {
            business_list.push(item);
        });
        Array.from(checkedNetworkItems).map((item, idx) => {
            network_list.push(item);
        });
        // 검색 조건 세팅
        let data = {
            from_date: from_date,
            to_date: to_date,
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
        setPeriod('1');
        setStartDate(moment().format('YYYY-MM-DD'));
        setEndDate(moment().format('YYYY-MM-DD'));
        setSts('');
        setProcess('');
        checkedBusinessItems.clear();
        setCheckedBusinessItems(new Set());
        setCheckedNetworkItems(new Set());
        checkedNetworkItems.clear();
        setKeyword('');
        setIsAllChecked(true);
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

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
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
                        />

                        <InputLayout>
                            <DropInput title="계약상태">
                                <Select name="contract_code" label="계정상태" value={contract_code} onChange={handleChange}>
                                    <MenuItem value="">전체</MenuItem>
                                    {statusList.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </DropInput>

                            <DropInput title="진행상태">
                                <Select name="process_code" label="계정상태" value={process_code} onChange={handleChange}>
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

                <ButtonLayout buttonName="layout--button__bottom layout--button">
                    <Button disableElevation size="medium" type="submit" variant="contained" onClick={searchClick}>
                        검색
                    </Button>
                    <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={clearClick}>
                        초기화
                    </Button>
                </ButtonLayout>

                <MainCard>
                    <Grid container spacing={0}>
                        <Grid item xs={8} sm={0.7}>
                            <Typography variant="h6" color="inherit" onClick={() => filterClick(null)}>
                                전체({totalDataGridRows.length})
                            </Typography>
                        </Grid>

                        {categoryList.map((item, index) => (
                            <StsCategory key={index} id={item.id} content={item.name} count={item.count} filterClick={filterClick} />
                        ))}
                    </Grid>
                </MainCard>

                <ContentLine>
                    <Table fixedHeader={false} style={{ width: '100%', tableLayout: 'auto' }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell style={{ width: '7%' }} align="center" rowSpan={2}>
                                    프로젝트명
                                </StyledTableCell>
                                <StyledTableCell style={{ width: '5%' }} align="center" rowSpan={2}>
                                    심볼
                                </StyledTableCell>
                                <StyledTableCell style={{ width: '15%' }} align="center" colSpan={2}>
                                    거래지원 현황
                                </StyledTableCell>
                                <StyledTableCell style={{ width: '8%' }} align="center" rowSpan={2}>
                                    사업 계열
                                </StyledTableCell>
                                <StyledTableCell style={{ width: '8%' }} align="center" rowSpan={2}>
                                    네트워크 계열
                                </StyledTableCell>
                                <StyledTableCell style={{ width: '20%' }} align="center" colSpan={2}>
                                    마케팅 수량
                                </StyledTableCell>
                                <StyledTableCell style={{ width: '15%' }} align="center" rowSpan={2}>
                                    연결 프로젝트
                                </StyledTableCell>
                                <StyledTableCell style={{ width: '13%' }} align="center" rowSpan={2}>
                                    상장일
                                </StyledTableCell>
                                <StyledTableCell style={{ width: '12%' }} align="center" rowSpan={2}>
                                    등록일시
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
                                    최소
                                </StyledTableCell>
                                <StyledTableCell style={{ width: '10%' }} align="center">
                                    실제
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataGridRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                <TableRow key={index} hover onClick={() => handleClick(item)}>
                                    <TableCell style={{ width: '7%' }} align="center" component="th" scope="row">
                                        {item.project_name}
                                    </TableCell>
                                    <TableCell style={{ width: '5%' }} align="center" component="th" scope="row">
                                        {item.symbol}
                                    </TableCell>
                                    <TableCell style={{ width: '7.5%' }} align="center" component="th" scope="row">
                                        {item.contract_name}
                                    </TableCell>
                                    <TableCell style={{ width: '7.5%' }} align="center" component="th" scope="row">
                                        {item.progress_name}
                                    </TableCell>
                                    <TableCell style={{ width: '8%' }} align="center" component="th" scope="row">
                                        {item.business_name}
                                    </TableCell>
                                    <TableCell style={{ width: '8%' }} align="center" component="th" scope="row">
                                        {item.network_name}
                                    </TableCell>
                                    <TableCell style={{ width: '10%' }} align="center" component="th" scope="row">
                                        {item.minimum_quantity}
                                    </TableCell>
                                    <TableCell style={{ width: '10%' }} align="center" component="th" scope="row">
                                        {item.actual_quantity}
                                    </TableCell>
                                    <TableCell style={{ width: '15%' }} align="center" component="th" scope="row">
                                        {item.project_link}
                                    </TableCell>
                                    <TableCell style={{ width: '13%' }} align="center" component="th" scope="row">
                                        {item.ico_date}
                                    </TableCell>
                                    <TableCell style={{ width: '12%' }} align="center" component="th" scope="row">
                                        {item.create_date}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={dataGridRows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </ContentLine>

                {errorMessage && (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                )}
            </Grid>
        </Grid>
    );
};

export default ProjectsPage;
