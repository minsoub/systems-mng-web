import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// material-ui
// eslint-disable-next-line prettier/prettier
import {
    Button,
    Grid,
    TextField,
    Typography,
    FormControl,
    Select,
    MenuItem,
    Table,
    TableCell,
    TableHead,
    TableRow,
    IconButton
} from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import MainCard from 'components/MainCard';
import DeleteIcon from '@mui/icons-material/Delete';
import FoundationApi from 'apis/lrc/project/foundationapi';
import StatusApi from 'apis/lrc/status/statusapi';
import LineApis from 'apis/lrc/line/lineapi';

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

const ProjectMng = (props) => {
    let isSubmitting = false;
    const classes = useStyles();
    const navigate = useNavigate();
    const [
        responseData,
        requestError,
        loading,
        {
            foundationSearch,
            updateFoundationInfo,
            marketingSearch,
            updateMarketingList,
            reviewSearch,
            updateReviewList,
            projectSearch,
            updateProjectInfo,
            userSearch,
            icoSearch,
            updateIcoList,
            officeSearch,
            fileReviewDownload,
            symbolKeywordSearch,
            projectConnectSave,
            projectDisconnectSave,
            projectLinkListSearch
        }
    ] = FoundationApi();
    const [resData, reqErr, resLoading, { statusSearch }] = StatusApi();
    const [resLineData, reqLineError, lineLoading, { lineSearch }] = LineApis();
    const { projectId, children, tabindex, index, ...other } = props;

    ////////////////////////////////////////////////////
    // 공통 에러 처리
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    ////////////////////////////////////////////////////

    // 출력 정보 조회 데이터
    const [officeInfo, setOfficeInfo] = useState({}); // 재단정보
    const [projecInfo, setProjectInfo] = useState({}); // 프로젝트 정보
    const [userList, setUserList] = useState([]); // User 정보
    const [icoList, setIcoList] = useState([]); // ICO 정보
    const [marketingList, setMarketingList] = useState([]); // 마켓팅 수량
    const [reviewList, setReviewList] = useState([]); // 검토평가 리스트
    const [projectList, setProjectList] = useState([]); // 프로젝트 리스트 검색 리스트

    // 콤보박스 정의
    const [statusAllList, setStatusAllList] = useState([]); // 전체 상태 리스트
    const [statusList, setStatusList] = useState([]); // 계약 상태
    const [processList, setProcessList] = useState([]); // 계약 상태 변경 시 진행상태 출력 리스트.
    const [businessList, setBusinessList] = useState([]); // 사업계열
    const [networkList, setNetworkList] = useState([]); // 네트워크 계열

    // 재단정보 입력 항목 정의
    const refProject_name = useRef(); // < HTMLInputElement > null;
    const refSymbol = useRef(); // < HTMLInputElement > null;
    const [contract_code, setContract_code] = useState('');
    //const refContract_code = useRef(); // < HTMLInputElement > null;
    //const refProcess_code = useRef(); // < HTMLInputElement > null;
    const [process_code, setProcess_code] = useState('');
    const refMemo = useRef(); //  < HTMLInputElement > null;

    // 프로젝트 정보 입력 항목 정의
    const [business_code, setBusiness_code] = useState('');
    const [network_code, setNetwork_code] = useState('');
    const refWhitepaper_link = useRef();
    const [create_date, setCreate_date] = useState('');
    const refContract_address = useRef();

    // 상장정보 입력 항목 정의
    const refPriceKRW = useRef();
    const refPriceBTC = useRef();
    const [krw_ico_date, setKrw_ico_date] = useState('');
    const [btc_ico_date, setBtc_ico_date] = useState('');

    // 프로젝트 연결 검색 항목 정의
    const refKeyword = useRef();
    const [projectSearchList, setProjectSearchList] = useState([]);
    const [projectLinkList, setProjectLinkList] = useState([]);
    // 검색 결과 메시지
    const [searchMessage, setSearchMessage] = useState('');
    // 다운로드 파일명 정의
    const [downloadFileName, setDownloadFileName] = useState('');

    // onload
    useEffect(() => {
        // 상태값 조회
        statusSearch(); // 상태 값 모두 조회
        // 프로젝트 정보의 사업계열
        lineSearch('BUSINESS');
        // 네트워크 계열
        lineSearch('NETWORK');
    }, []);

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

    // useEffect(() => {
    //     refContract_code.current.value = officeInfo.contract_code;
    //     console.log(refContract_code.current.value);
    // }, [statusList]);

    // Combobox - 사업계열, 네트워크 계열
    useEffect(() => {
        if (!resLineData) return;

        switch (resLineData.transactionId) {
            case 'getList':
                if (resLineData.data.data && resLineData.data.data.length > 0) {
                    // 계열 타입 구분
                    if (resLineData.data.data[0].type === 'BUSINESS') {
                        setBusinessList(resLineData.data.data);
                    } else {
                        setNetworkList(resLineData.data.data);
                    }
                }
                break;
            default:
                break;
        }
    }, [resLineData]);
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
                    itemData.map((item, index) => {
                        if (item.parent_code === '') {
                            const s = { id: item.id, name: item.name };
                            console.log(s);
                            list.push(s);
                        }
                    });
                    setStatusList(list);
                    // 1. 재단정보 조회
                    officeSearch(projectId);
                    // 2. 프로젝트 정보 조회
                    projectSearch(projectId);
                    // 3. 담당자 정보 조회
                    userSearch(projectId);
                    // 4. 상장 정보 조회
                    icoSearch(projectId);
                    // 5. 마케팅 수량 정보 조회
                    marketingSearch(projectId);
                    // 6. 검토 평가 조회
                    reviewSearch(projectId);
                    // 7. 프로젝트 연결 조회
                    projectLinkListSearch(projectId);
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
            case 'getFoundationInfo': // 재단정보
                if (responseData.data.data) {
                    setOfficeInfo(responseData.data.data);
                    refProject_name.current.value = responseData.data.data.project_name;
                    refSymbol.current.value = responseData.data.data.symbol;
                    //refContract_code.current.value = responseData.data.data.contract_code;
                    setContract_code(responseData.data.data.contract_code);
                    processPrint(responseData.data.data.contract_code); // 진행 상태 리스트 출력
                    //refProcess_code.current.value = responseData.data.data.progress_code;
                    setProcess_code(responseData.data.data.process_code);
                    refMemo.current.value = responseData.data.data.admin_memo;
                } else {
                    setOfficeInfo({});
                }
                break;
            case 'getProjectList': // 프로젝트 정보
                if (responseData.data.data) {
                    setProjectInfo(responseData.data.data);
                    setBusiness_code(responseData.data.data.business_code);
                    setNetwork_code(responseData.data.data.network_code);
                    refWhitepaper_link.current.value = responseData.data.data.whitepaper_link;
                    setCreate_date(responseData.data.data.create_date.substring(0, 10));
                    refContract_address.current.value = responseData.data.data.contract_address;
                } else {
                    setProjectInfo({});
                }
                break;
            case 'getUserList': // 사용자 정보
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setUserList(responseData.data.data);
                } else {
                    setUserList([]);
                }
                break;
            case 'getIcoList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setIcoList(responseData.data.data);
                    // KRW/BTC
                    let data = responseData.data.data;
                    data.map((item, indx) => {
                        if (item.market_info === 'KRW') {
                            setKrw_ico_date(item.ico_date.substring(0, 10));
                            refPriceKRW.current.value = item.price;
                        } else {
                            setBtc_ico_date(item.ico_date.substring(0, 10));
                            refPriceBTC.current.value = item.price;
                        }
                    });
                } else {
                    setIcoList([]);
                }
                break;
            case 'getMarketingList': // 마케팅 수량
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setMarketingList(responseData.data.data);
                } else {
                    setMarketingList([]);
                }
                break;
            case 'getReviewList': // 검토 평가
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setReviewList(responseData.data.data);
                } else {
                    setReviewList([]);
                }
                break;
            case 'updateFoundationInfo': // 재단 정보 업데이트
                if (responseData.data.data) {
                    alert('저장을 완료하였습니다!!!');
                    officeSearch(projectId);
                }
                break;
            case 'updateProjectInfo': // 프로젝트 정보 업데이트
                if (responseData.data.data) {
                    alert('저장을 완료하였습니다!!!');
                    projectSearch(projectId);
                }
                break;
            case 'updateIcoList': // 상장정보 업데이트
                if (responseData.data.data) {
                    alert('저장을 완료하였습니다!!!');
                    icoSearch(projectId);
                }
                break;
            case 'updateMarketingList': // 마켓팅 정보 업데이트
                if (responseData.data.data) {
                    alert('저장을 완료하였습니다!!!');
                    marketingSearch(projectId);
                }
                break;
            case 'updateReviewList': // 검토 평가 리스트 업데이트
                if (responseData.data.data) {
                    alert('저장을 완료하였습니다!!!');
                    reviewSearch(projectId);
                }
                break;
            case 'getFile':
                if (responseData.data) {
                    let res = responseData;
                    console.log('res data....');
                    console.log(res);
                    console.log(res.fileName);
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${downloadFileName}`);
                    link.style.cssText = 'display:none';
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    setDownloadFileName('');
                }
                break;
            case 'getProjectKeyList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    // 프로젝트 연결 리스트에서 이미 연결된 부분에 대해서 제회한다.
                    let origin = responseData.data.data;
                    let insertData = [];
                    origin.map((item, index) => {
                        let found = 0;
                        projectLinkList.map((itm, idx) => {
                            if (item.project_id === itm.link_project_id) {
                                found = 1;
                                return;
                            }
                        });
                        if (found === 0) {
                            insertData.push(item);
                        }
                    });
                    if (insertData.length > 0) {
                        setProjectSearchList(insertData);
                    } else {
                        setSearchMessage('연결할 프로젝트를 검색해주세요.');
                    }
                } else {
                    setProjectSearchList([]);
                }
                break;
            case 'projectConnect':
                if (responseData.data.data) {
                    alert('프로젝트 연결을 완료하였습니다!!!');
                    projectLinkListSearch(projectId);
                    setProjectSearchList([]);
                }
                break;
            case 'projectDisconnect':
                if (responseData.data.data) {
                    alert('프로젝트 연결 해제를 완료하였습니다!!!');
                    projectLinkListSearch(projectId);
                    setProjectSearchList([]);
                }
                break;
            case 'getProjectLinkList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setProjectLinkList(responseData.data.data);
                } else {
                    setProjectLinkList([]);
                }
                break;
            default:
        }
    }, [responseData]);

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

    const handleClose = () => {
        setVisible(false);
    };
    const handleBlur = (e) => {
        console.log(e);
    };
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'contract_code':
                // 진행상태 출력.
                processPrint(e.target.value);
                break;
            default:
                break;
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
        if (rowData && rowData.field && rowData.field !== '__check__') {
            let searchCondition = { site_id: site_id, is_use: is_use, type: type };

            //navigate(`/authmng/reg/${rowData.id}`);
        }
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // search
    const searchClick = () => {
        console.log('searchClick called...');
        //roleComboSearch(is_use, type, site_id);
    };
    // const clearClick = () => {};

    // const tabChange = (event, value) => {
    //     setValue(value);
    // };

    const numberCheck = (e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    };
    // 마케팅 심볼 관련 항목
    const handleSynbolChange = (evt, idx) => {
        const newData = marketingList.map((item, index) => {
            if (idx !== index) return item;
            return { ...item, symbol: evt.target.value };
        });
        setMarketingList(newData);
    };
    // 마케팅 수량 관련 항목
    const handleMinimumQuantityChange = (evt, idx) => {
        const newData = marketingList.map((item, index) => {
            if (idx !== index) return item;
            return { ...item, minimum_quantity: evt.target.value };
        });
        setMarketingList(newData);
    };
    const handleActualQuantityChange = (evt, idx) => {
        const newData = marketingList.map((item, index) => {
            if (idx !== index) return item;
            return { ...item, actual_quantity: evt.target.value };
        });
        setMarketingList(newData);
    };
    // 검토평가 - 평가 기관
    const handleOrganizationChange = (evt, idx) => {
        const newData = reviewList.map((item, index) => {
            if (idx !== index) return item;
            return { ...item, organization: evt.target.value };
        });
        setReviewList(newData);
    };
    // 검토평가 - 평가 결과
    const handleResultChange = (evt, idx) => {
        const newData = reviewList.map((item, index) => {
            if (idx !== index) return item;
            return { ...item, result: evt.target.value };
        });
        setReviewList(newData);
    };
    // 검토평가 - 평가 자료(파일)
    const fileHandleChange = (evt, idx) => {
        const newData = reviewList.map((item, index) => {
            if (idx !== index) return item;
            if (!evt.target.files[0]) {
                return { ...item, file_name: '' };
            } else {
                console.log(evt.target.files[0].name);
                return { ...item, file_name: evt.target.files[0].name, file: evt.target.files[0] };
            }
        });
        setReviewList(newData);
    };

    // // 입력 박스 입력 시 호출
    // const fileHandleChange = (e) => {
    //     if (!e.target.files[0]) {
    //         setFilePart();
    //         return;
    //     }
    //     let { name } = e.target;
    //     setInputs({
    //         ...inputs, // 기존 input 객체 복사
    //         [name]: e.target.files[0].name
    //     });
    //     setFilePart(e.target.files[0]);
    // };

    // 검토평가 - 평가 자료 (URL)
    const handleReferenceChange = (evt, idx) => {
        const newData = reviewList.map((item, index) => {
            if (idx !== index) return item;
            return { ...item, reference: evt.target.value };
        });
        setReviewList(newData);
    };

    // Marking List 추가
    const addMarketingList = () => {
        let addRow = {
            id: '',
            project_id: projectId,
            symbol: '',
            minimum_quantity: 0,
            actual_quantity: 0
        };
        setMarketingList((prevRows) => [...prevRows, addRow]);
    };
    // Makreting List remove
    const deleteMarketingList = (evt, idx) => {
        if (marketingList.length > 0) {
            marketingList.map((item, Index) => {
                if (idx === Index) {
                    setMarketingList((prevRows) => [...prevRows.slice(0, idx), ...prevRows.slice(idx + 1)]);
                    return;
                }
            });
        }
    };
    // 검토 평가 List 추가
    const addReviewgList = () => {
        let addRow = {
            id: '',
            project_id: projectId,
            organization: '',
            result: '',
            reference: ''
        };
        setReviewList((prevRows) => [...prevRows, addRow]);
    };
    // 검토 피리스 삭제
    const deleteReviewList = (evt, idx) => {
        if (reviewList.length > 0) {
            reviewList.map((item, Index) => {
                if (idx === Index) {
                    setReviewList((prevRows) => [...prevRows.slice(0, idx), ...prevRows.slice(idx + 1)]);
                    return;
                }
            });
        }
    };

    // 재단정보 저장
    const foundationSave = () => {
        if (confirm('저장하시겠습니까?')) {
            let saveData = {
                id: officeInfo.id,
                project_name: refProject_name.current.value,
                symbol: refSymbol.current.value,
                contract_code: contract_code,
                process_code: process_code,
                admin_memo: refMemo.current.value
            };
            console.log(saveData);
            updateFoundationInfo(saveData);
        }
    };
    // 프로젝트 저장
    const projectSave = () => {
        if (confirm('저장하시겠습니까?')) {
            let saveData = {
                id: projecInfo.id,
                project_id: projectId,
                business_code: business_code,
                network_code: network_code,
                whitepaper_link: refWhitepaper_link.current.value,
                create_date: create_date,
                contract_address: refContract_address.current.value
            };
            console.log(saveData);
            updateProjectInfo(saveData);
        }
    };
    // 상장정보 저장
    const icoSave = () => {
        if (confirm('저장하시겠습니까?')) {
            let ico_info_list = [];
            icoList.map((item, index) => {
                if (item.market_info === 'KRW') {
                    let ico = {
                        id: item.id,
                        project_id: projectId,
                        market_info: 'KRW',
                        price: refPriceKRW.current.value,
                        ico_date: krw_ico_date
                    };
                    ico_info_list.push(ico);
                } else if (item.market_info === 'BTC') {
                    let ico = {
                        id: item.id,
                        project_id: projectId,
                        market_info: 'BTC',
                        price: refPriceBTC.current.value,
                        ico_date: btc_ico_date
                    };
                    ico_info_list.push(ico);
                }
            });
            let saveData = { ico_info_list: ico_info_list };
            updateIcoList(projectId, saveData);
        }
    };
    // 마케팅 수량 리스트 저장
    const saveMarketingList = () => {
        if (marketingList && marketingList.length > 0) {
            if (confirm('저장하시겠습니까?')) {
                let saveData = { marketing_list: marketingList };
                updateMarketingList(projectId, saveData);
            }
        }
    };
    // 검토 평가 리스트 저장
    const reviewSaveList = () => {
        if (reviewList && reviewList.length > 0) {
            const formData = new FormData();
            if (confirm('저장하시겠습니까?')) {
                reviewList.map((item, index) => {
                    formData.append('no', index);
                    formData.append('id', item.id);
                    formData.append('projectId', projectId);
                    formData.append('organization', item.organization);
                    formData.append('result', item.result);
                    formData.append('reference', item.reference);
                    formData.append('fileKey', item.file_key);
                    formData.append('fileName', item.file_name);
                    if (item.file) {
                        formData.append('isFile', true);
                        formData.append('file', item.file, item.file_name);
                    } else {
                        formData.append('isFile', false);
                    }
                    console.log(formData);
                });
                updateReviewList(projectId, formData);
            }
        }
    };

    // 검토 파일 다운로드
    const fileDownload = (fileKey, fileName) => {
        setDownloadFileName(fileName);
        fileReviewDownload(fileKey);
    };

    // 프로젝트 (심볼) 검색
    const symbolSearch = () => {
        if (!refKeyword.current.value) {
            alert('검색 단어를 입력하세요!!!');
            return;
        }
        setSearchMessage('');
        symbolKeywordSearch(refKeyword.current.value, projectId);
    };

    // 프로젝트 연결
    const projectConnect = (link_id, link_symbol) => {
        if (confirm('프로젝트에 연결하시겠습니까?')) {
            let data = {
                id: '',
                project_id: projectId,
                symbol: refSymbol.current.value,
                link_project_id: link_id,
                link_project_symbol: link_symbol
            };
            console.log(data);
            projectConnectSave(data);
        }
    };
    // 프로젝트 연결 해제
    const projectDisconnect = (id) => {
        if (confirm('프로젝트 연결 해제하시겠습니까?')) {
            projectDisconnectSave(id);
        }
    };

    return (
        <Grid container alignItems="center" justifyContent="space-between">
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <Grid item xs={8} sm={3}>
                    <Typography variant="h3">재단정보</Typography>
                </Grid>
                <Grid item xs={8} sm={1}>
                    <FormControl sx={{ m: 0 }} size="small">
                        <Button disableElevation size="small" type="submit" variant="contained" color="primary" onClick={foundationSave}>
                            저장
                        </Button>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Grid item xs={8} sm={1.5} sx={{ mt: 1 }} color="text.secondary">
                    <Typography variant="h5">프로젝트명</Typography>
                </Grid>
                <Grid item xs={8} sm={10.5}>
                    <FormControl sx={{ m: 0 }} fullWidth>
                        <TextField id="project_name" name="project_name" inputRef={refProject_name} type="text" />
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Grid item xs={8} sm={1.5} sx={{ mt: 1 }} color="text.secondary">
                    <Typography variant="h5">심볼</Typography>
                </Grid>
                <Grid item xs={8} sm={10.5}>
                    <FormControl sx={{ m: 0 }} fullWidth>
                        <TextField id="symbol" name="symbol" inputRef={refSymbol} type="text" />
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Grid item xs={8} sm={1.5} sx={{ mt: 1 }} color="text.secondary">
                    <Typography variant="h5">계약 상태</Typography>
                </Grid>
                <Grid item xs={8} sm={10.5}>
                    <FormControl sx={{ m: 0, minWidth: 380 }} size="small">
                        <Select
                            name="contract_code"
                            label="계약상태"
                            //inputRef={refContract_code}
                            value={contract_code}
                            //defaultValue={refContract_code.current.value}
                            onChange={handleChange}
                        >
                            <MenuItem value="">전체</MenuItem>
                            {statusList.map((item, index) => (
                                <MenuItem key={index} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Grid item xs={8} sm={1.5} sx={{ mt: 1 }} color="text.secondary">
                    <Typography variant="h5">진행 상태</Typography>
                </Grid>
                <Grid item xs={8} sm={10.5}>
                    <FormControl sx={{ m: 0, minWidth: 380 }} size="small">
                        <Select name="proceess_code" label="진행상태" value={process_code} onChange={handleChange}>
                            <MenuItem value="">전체</MenuItem>
                            {processList.map((item, index) => (
                                <MenuItem key={index} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Grid item xs={8} sm={1.5} sx={{ mt: 1 }} color="text.secondary">
                    <Typography variant="h5">관리자 메모</Typography>
                </Grid>
                <Grid item xs={8} sm={10.5}>
                    <FormControl sx={{ m: 0 }} fullWidth>
                        <TextField id="outlined-multiline-static" multiline rows={3} inputRef={refMemo} />
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 3 }}>
                <Grid item xs={8} sm={3}>
                    <Typography variant="h3">프로젝트 정보</Typography>
                </Grid>
                <Grid item xs={8} sm={1}>
                    <FormControl sx={{ m: 0 }} size="small">
                        <Button disableElevation size="small" type="button" variant="contained" color="primary" onClick={projectSave}>
                            저장
                        </Button>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <MainCard sx={{ mt: 1 }} content={false} style={{ width: '100%' }}>
                    <Table
                        className={classes.table}
                        fixedHeader={false}
                        style={{ width: '100%', tableLayout: 'auto' }}
                        stickyHeader
                        aria-label="simple table"
                    >
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">사업계열</StyledTableCell>
                                <StyledTableCell align="center">네트워크 계열</StyledTableCell>
                                <StyledTableCell align="center">백서 링크</StyledTableCell>
                                <StyledTableCell align="center">최초 발행일</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <FormControl sx={{ m: 0, minWidth: 140 }} size="small">
                                    <Select name="status" value={business_code} onChange={handleChange}>
                                        <MenuItem value="true">사용</MenuItem>
                                        {businessList.map((item, index) => (
                                            <MenuItem key={index} value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <FormControl sx={{ m: 0, minWidth: 124 }} size="small">
                                    <Select name="status" value={network_code} onChange={handleChange}>
                                        <MenuItem value="true">사용</MenuItem>
                                        {networkList.map((item, index) => (
                                            <MenuItem key={index} value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <FormControl sx={{ m: 0 }} fullWidth>
                                    <TextField id="outlined-multiline-static" size="small" inputRef={refWhitepaper_link} />
                                </FormControl>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <FormControl sx={{ m: 0, minHeight: 25 }} size="small">
                                    <TextField
                                        id="start_date"
                                        name="start_date"
                                        size="small"
                                        value={create_date}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="date"
                                        sx={{ width: 140 }}
                                    />
                                </FormControl>
                            </TableCell>
                        </TableRow>
                    </Table>
                    <Table fixedHeader={false} style={{ width: '100%', tableLayout: 'auto' }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">컨텍스트 주소</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <FormControl sx={{ m: 0 }} fullWidth>
                                    <TextField id="outlined-multiline-static" size="small" inputRef={refContract_address} />
                                </FormControl>
                            </TableCell>
                        </TableRow>
                    </Table>
                </MainCard>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 3 }}>
                <Typography variant="h4">담당자 정보</Typography>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <MainCard sx={{ mt: 1 }} content={false} style={{ width: '100%' }}>
                    <Table
                        className={classes.table}
                        fixedHeader={false}
                        style={{ width: '100%', tableLayout: 'auto' }}
                        stickyHeader
                        aria-label="simple table"
                    >
                        <TableHead>
                            <TableRow>
                                <StyledTableCell style={{ width: '25%' }} align="center">
                                    이름
                                </StyledTableCell>
                                <StyledTableCell style={{ width: '25%' }} align="center">
                                    연락처
                                </StyledTableCell>
                                <StyledTableCell style={{ width: '25%' }} align="center">
                                    SNS ID
                                </StyledTableCell>
                                <StyledTableCell style={{ width: '25%' }} align="center">
                                    이메일주소
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {userList.map((item, index) => (
                            <TableRow>
                                <TableCell style={{ width: '25%' }} align="center" component="th" scope="row">
                                    {item.user_name}
                                </TableCell>
                                <TableCell style={{ width: '25%' }} align="center" component="th" scope="row">
                                    {item.phone}
                                </TableCell>
                                <TableCell style={{ width: '25%' }} align="center" component="th" scope="row">
                                    {item.sns_id}
                                </TableCell>
                                <TableCell style={{ width: '25%' }} align="center" component="th" scope="row">
                                    {item.email}
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </MainCard>
            </Grid>

            <Grid container spacing={0} sx={{ mt: 3 }}>
                <Grid item xs={8} sm={3}>
                    <Typography variant="h3">상장 정보</Typography>
                </Grid>
                <Grid item xs={8} sm={1}>
                    <FormControl sx={{ m: 0 }} size="small">
                        <Button disableElevation size="small" type="submit" variant="contained" color="primary" onClick={icoSave}>
                            저장
                        </Button>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <MainCard sx={{ mt: 1 }} content={false} style={{ width: '100%' }}>
                    <Table
                        className={classes.table}
                        fixedHeader={false}
                        style={{ width: '100%', tableLayout: 'auto' }}
                        stickyHeader
                        aria-label="simple table"
                    >
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">마켓 정보</StyledTableCell>
                                <StyledTableCell align="center">상장가</StyledTableCell>
                                <StyledTableCell align="center">상장일</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableRow>
                            <TableCell align="center" component="th" scope="row">
                                KRW
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                                <FormControl sx={{ m: 0 }} fullWidth>
                                    <TextField
                                        id="outlined-multiline-static"
                                        size="small"
                                        inputRef={refPriceKRW}
                                        onKeyPress={numberCheck}
                                    />
                                </FormControl>
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                                <FormControl sx={{ m: 0, minHeight: 25 }} size="small">
                                    <TextField
                                        id="krw_ico_date"
                                        name="krw_ico_date"
                                        size="small"
                                        value={krw_ico_date}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="date"
                                        sx={{ width: 140 }}
                                    />
                                </FormControl>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center" component="th" scope="row">
                                BTC
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                                <FormControl sx={{ m: 0 }} fullWidth>
                                    <TextField
                                        id="outlined-multiline-static"
                                        size="small"
                                        inputRef={refPriceBTC}
                                        onKeyPress={numberCheck}
                                    />
                                </FormControl>
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                                <FormControl sx={{ m: 0, minHeight: 25 }} size="small">
                                    <TextField
                                        id="btc_ico_date"
                                        name="btc_ico_date"
                                        size="small"
                                        value={btc_ico_date}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="date"
                                        sx={{ width: 140 }}
                                    />
                                </FormControl>
                            </TableCell>
                        </TableRow>
                    </Table>
                </MainCard>
            </Grid>

            <Grid container spacing={0} sx={{ mt: 3 }}>
                <Grid item xs={8} sm={3}>
                    <Typography variant="h3">마케팅 수량</Typography>
                </Grid>
                <Grid item xs={8} sm={6.9}></Grid>
                <Grid item xs={8} sm={1}>
                    <FormControl sx={{ m: 0 }} size="small">
                        <Button disableElevation size="small" type="submit" variant="contained" color="primary" onClick={addMarketingList}>
                            추가
                        </Button>
                    </FormControl>
                </Grid>
                <Grid item xs={8} sm={0.1}></Grid>
                <Grid item xs={8} sm={1}>
                    <FormControl sx={{ m: 0 }} size="small">
                        <Button disableElevation size="small" type="submit" variant="contained" color="primary" onClick={saveMarketingList}>
                            저장
                        </Button>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <MainCard sx={{ mt: 1 }} content={false} style={{ width: '100%' }}>
                    <Table
                        className={classes.table}
                        fixedHeader={false}
                        style={{ width: '100%', tableLayout: 'auto' }}
                        stickyHeader
                        aria-label="simple table"
                    >
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">심볼</StyledTableCell>
                                <StyledTableCell align="center">최소 지원 수량</StyledTableCell>
                                <StyledTableCell align="center">실제 상장 지원 수량</StyledTableCell>
                                <StyledTableCell align="center"></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {marketingList.map((item, index) => (
                            <TableRow>
                                <TableCell align="center" component="th" scope="row">
                                    <FormControl sx={{ m: 0 }} fullWidth>
                                        <TextField
                                            id="outlined-multiline-static"
                                            size="small"
                                            onChange={(e) => handleSynbolChange(e, index)}
                                            value={item.symbol}
                                        />
                                    </FormControl>
                                </TableCell>
                                <TableCell align="center" component="th" scope="row">
                                    <FormControl sx={{ m: 0 }} fullWidth>
                                        <TextField
                                            id="outlined-multiline-static"
                                            size="small"
                                            value={item.minimum_quantity}
                                            onKeyPress={numberCheck}
                                            onChange={(e) => handleMinimumQuantityChange(e, index)}
                                        />
                                    </FormControl>
                                </TableCell>
                                <TableCell align="center" component="th" scope="row">
                                    <FormControl sx={{ m: 0 }} fullWidth>
                                        <TextField
                                            id="outlined-multiline-static"
                                            size="small"
                                            value={item.actual_quantity}
                                            onKeyPress={numberCheck}
                                            onChange={(e) => handleActualQuantityChange(e, index)}
                                        />
                                    </FormControl>
                                </TableCell>
                                <TableCell align="center" component="th" scope="row">
                                    {item.id === '' && (
                                        <IconButton aria-label="delete" onClick={(e) => deleteMarketingList(e, index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                    {item.id !== '' && <div>-</div>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </MainCard>
            </Grid>

            <Grid container spacing={0} sx={{ mt: 3 }}>
                <Grid item xs={8} sm={3}>
                    <Typography variant="h3">검토 평가</Typography>
                </Grid>
                <Grid item xs={8} sm={6.9}></Grid>
                <Grid item xs={8} sm={1}>
                    <FormControl sx={{ m: 0 }} size="small">
                        <Button disableElevation size="small" type="submit" variant="contained" color="primary" onClick={addReviewgList}>
                            추가
                        </Button>
                    </FormControl>
                </Grid>
                <Grid item xs={8} sm={0.1}></Grid>
                <Grid item xs={8} sm={1}>
                    <FormControl sx={{ m: 0 }} size="small">
                        <Button disableElevation size="small" type="submit" variant="contained" color="primary" onClick={reviewSaveList}>
                            저장
                        </Button>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <MainCard sx={{ mt: 1 }} content={false} style={{ width: '100%' }}>
                    <Table
                        fixedHeader={false}
                        style={{ width: '100%', tableLayout: 'auto', border: 1 }}
                        stickyHeader
                        aria-label="simple table"
                        className={classes.table}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" className={classes.tableCell}>
                                    평가 기관
                                </TableCell>
                                <TableCell align="center" className={classes.tableCell}>
                                    평가 결과
                                </TableCell>
                                <TableCell align="center" className={classes.tableCell} colSpan="2">
                                    평가 자료
                                </TableCell>
                                <TableCell align="center" className={classes.tableCell}>
                                    &nbsp;
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {reviewList.map((item, index) => (
                            <TableRow>
                                <TableCell align="center" component="th" scope="row">
                                    <FormControl sx={{ m: 0 }} fullWidth>
                                        <TextField
                                            id="outlined-multiline-static"
                                            size="small"
                                            value={item.organization}
                                            onChange={(e) => handleOrganizationChange(e, index)}
                                        />
                                    </FormControl>
                                </TableCell>
                                <TableCell align="center" component="th" scope="row">
                                    <FormControl sx={{ m: 0 }} fullWidth>
                                        <TextField
                                            id="outlined-multiline-static"
                                            size="small"
                                            value={item.result}
                                            onChange={(e) => handleResultChange(e, index)}
                                        />
                                    </FormControl>
                                </TableCell>
                                <TableCell align="center" component="th" scope="row">
                                    <FormControl sx={{ m: 0 }}>
                                        <TextField
                                            id="outlined-multiline-static"
                                            size="small"
                                            value={item.reference}
                                            onChange={(e) => handleReferenceChange(e, index)}
                                        />
                                    </FormControl>
                                </TableCell>
                                <TableCell align="center" component="th" scope="row">
                                    <FormControl sx={{ m: 0 }}>
                                        <TextField
                                            type="file"
                                            size="small"
                                            onChange={(e) => fileHandleChange(e, index)}
                                            inputProps={{
                                                accept:
                                                    '.doc, .docx, .xlsx, .xls, .ppt, .pptx, .ai, .mov, .mp4, .avi, .mkv, .jpg, .jpeg, .png, .gif, .pdf, .txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                            }}
                                        />
                                    </FormControl>
                                    {item.file_name && (
                                        <div>
                                            <a href="#" onClick={() => fileDownload(item.file_key, item.file_name)}>
                                                {item.file_name}
                                            </a>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell align="center" component="th" scope="row">
                                    {item.id === '' && (
                                        <IconButton aria-label="delete" onClick={(e) => deleteReviewList(e, index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                    {item.id !== '' && <div>-</div>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </MainCard>
            </Grid>

            <Grid container spacing={0} sx={{ mt: 3 }}>
                <Grid item xs={8} sm={3}>
                    <Typography variant="h3">프로젝트 연결</Typography>
                </Grid>
                <Grid item xs={8} sm={6.9}></Grid>
                {/* <Grid item xs={8} sm={1}>
                    <FormControl sx={{ m: 0 }} size="small">
                        <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                            추가
                        </Button>
                    </FormControl>
                </Grid>
                <Grid item xs={8} sm={0.1}></Grid>
                <Grid item xs={8} sm={1}>
                    <FormControl sx={{ m: 0 }} size="small">
                        <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                            저장
                        </Button>
                    </FormControl>
                </Grid> */}
            </Grid>
            <Grid container spacing={0} sx={{ mt: 0 }}>
                <MainCard sx={{ mt: 1 }} content={false} style={{ width: '100%' }}>
                    <Table fixedHeader={false} style={{ width: '100%', tableLayout: 'auto' }} stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">프로젝트 선택</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableRow>
                            <TableCell align="center" component="th" scope="row">
                                <Grid container spacing={0} sx={{ mt: 0 }}>
                                    <Grid item xs={8} sm={8}>
                                        <FormControl sx={{ m: 0 }} fullWidth>
                                            <TextField id="outlined-multiline-static" name="keyword" inputRef={refKeyword} size="small" />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={8} sm={0.2}></Grid>
                                    <Grid item xs={8} sm={1}>
                                        <FormControl sx={{ m: 0 }} size="small">
                                            <Button
                                                disableElevation
                                                size="small"
                                                type="submit"
                                                variant="contained"
                                                color="secondary"
                                                onClick={symbolSearch}
                                            >
                                                검색
                                            </Button>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={8} sm={0.2}></Grid>
                                </Grid>
                            </TableCell>
                        </TableRow>
                    </Table>
                </MainCard>
            </Grid>
            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Grid container spacing={0} sx={{ mt: 0 }}>
                    <MainCard sx={{ mt: 1 }} content={false} style={{ width: '100%' }}>
                        <Table
                            fixedHeader={false}
                            style={{ width: '100%', tableLayout: 'auto', border: 1 }}
                            stickyHeader
                            aria-label="simple table"
                            className={classes.table}
                        >
                            {projectSearchList.map((item, index) => (
                                <TableRow>
                                    <StyledTableCell style={{ width: '75%', height: 30 }} align="center" component="th" scope="row">
                                        {item.project_name} ( {item.symbol} )
                                    </StyledTableCell>
                                    <StyledTableCell align="center" component="th" scope="row">
                                        <FormControl sx={{ m: 1 }} size="small">
                                            <Button
                                                disableElevation
                                                size="small"
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                onClick={() => projectConnect(item.project_id, item.symbol)}
                                            >
                                                연결
                                            </Button>
                                        </FormControl>
                                    </StyledTableCell>
                                </TableRow>
                            ))}
                            {projectLinkList.map((item, index) => (
                                <TableRow>
                                    <StyledTableCell style={{ width: '75%', height: 30 }} align="center" component="th" scope="row">
                                        {item.link_project_name} ( {item.link_project_symbol} )
                                    </StyledTableCell>
                                    <StyledTableCell align="center" component="th" scope="row">
                                        <FormControl sx={{ m: 1 }} size="small">
                                            <Button
                                                disableElevation
                                                size="small"
                                                type="submit"
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => projectDisconnect(item.id)}
                                            >
                                                연결해제
                                            </Button>
                                        </FormControl>
                                    </StyledTableCell>
                                </TableRow>
                            ))}
                        </Table>
                        {searchMessage !== '' && (
                            <Table
                                fixedHeader={false}
                                style={{ width: '100%', tableLayout: 'auto', border: 1 }}
                                stickyHeader
                                aria-label="simple table"
                                className={classes.table}
                            >
                                <TableRow>
                                    <StyledTableCell style={{ width: '100%', height: 30 }} align="center" component="th" scope="row">
                                        {searchMessage}
                                    </StyledTableCell>
                                </TableRow>
                            </Table>
                        )}
                    </MainCard>

                    {/* <Grid item xs={8} sm={8}>
                        <FormControl sx={{ m: 0 }} fullWidth>
                            <TextField id="outlined-multiline-static" size="small" defaultValue="Default Value" />
                        </FormControl>
                    </Grid>
                    <Grid item xs={8} sm={1.6}></Grid>
                    <Grid item xs={8} sm={1}>
                        <FormControl sx={{ m: 1 }} size="small">
                            <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                연결
                            </Button>
                        </FormControl>
                    </Grid>
                    <Grid item xs={8} sm={0.2}></Grid>
                    <Grid item xs={8} sm={1}>
                        <FormControl sx={{ m: 1 }} size="small">
                            <Button disableElevation size="small" type="submit" variant="contained" color="primary">
                                연결해제
                            </Button>
                        </FormControl>
                    </Grid> */}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ProjectMng;
