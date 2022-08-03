import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, IconButton, MenuItem, Select, TableCell, TextField, Typography } from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import FoundationApi from 'apis/lrc/project/foundationapi';
import StatusApi from 'apis/lrc/status/statusapi';
import LineApis from 'apis/lrc/line/lineapi';
import FlexBox from '../../../components/Common/FlexBox';
import ContentLine from '../../../components/Common/ContentLine';
import TopInputLayout from '../../../components/Common/TopInputLayout';
import ButtonLayout from '../../../components/Common/ButtonLayout';
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
    const parentErrorClear = () => {
        setOpen(false);
        setErrorTitle('');
        setErrorMessage('');
    };
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
        statusSearch(false); // 상태 값 모두 조회
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
            // setErrorTitle('Error Message');
            // setErrorMessage(requestError);
            // setOpen(true);
            alert(requestError.error.message);
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
                    if (responseData.data.data.create_date) setCreate_date(responseData.data.data.create_date.substring(0, 10));
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
                            if (item.ico_date) setKrw_ico_date(item.ico_date.substring(0, 10));
                            refPriceKRW.current.value = item.price;
                        } else {
                            if (item.ico_date) setBtc_ico_date(item.ico_date.substring(0, 10));
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
                    alert('저장을 완료하였습니다.');
                    officeSearch(projectId);
                }
                break;
            case 'updateProjectInfo': // 프로젝트 정보 업데이트
                if (responseData.data.data) {
                    alert('저장을 완료하였습니다.');
                    projectSearch(projectId);
                }
                break;
            case 'updateIcoList': // 상장정보 업데이트
                if (responseData.data.data) {
                    alert('저장을 완료하였습니다.');
                    icoSearch(projectId);
                }
                break;
            case 'updateMarketingList': // 마켓팅 정보 업데이트
                if (responseData.data.data) {
                    alert('저장을 완료하였습니다.');
                    marketingSearch(projectId);
                }
                break;
            case 'updateReviewList': // 검토 평가 리스트 업데이트
                if (responseData.data.data) {
                    alert('저장을 완료하였습니다.');
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
                    alert('프로젝트 연결을 완료하였습니다.');
                    projectLinkListSearch(projectId);
                    setProjectSearchList([]);
                }
                break;
            case 'projectDisconnect':
                if (responseData.data.data) {
                    alert('프로젝트 연결 해제를 완료하였습니다.');
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
        console.log(e.target.name);
        console.log(e.target.value);
        switch (e.target.name) {
            case 'contract_code':
                // 진행상태 출력.
                setContract_code(e.target.value);
                processPrint(e.target.value);
                break;
            case 'process_code':
                console.log(e.target.value);
                setProcess_code(e.target.value);
                break;
            case 'business_code':
                setBusiness_code(e.target.value);
                break;
            case 'network_code':
                setNetwork_code(e.target.value);
                break;
            case 'create_date':
                setCreate_date(e.target.value);
                break;
            case 'btc_ico_date':
                setBtc_ico_date(e.target.value);
                break;
            case 'krw_ico_date':
                setKrw_ico_date(e.target.value);
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
        const pattern = /(^\d*)(.)\d{0,3}$/;
        if (!pattern.test(e.target.value) && !(e.target.value === '')) {
            e.preventDefault();
        }
        console.log(e.target.value);
        if (!/[0-9.]/.test(e.key)) {
            e.preventDefault();
        }
    };
    // 마케팅 심볼 관련 항목
    const handleSymbolChange = (evt, idx) => {
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
        if (reviewList.length === 3) {
            alert('3개 까지만 입력이 가능합니다!.');
            return;
        } else {
            let addRow = {
                id: '',
                project_id: projectId,
                organization: '',
                result: '',
                reference: '',
                file_key: '',
                file_name: ''
            };
            setReviewList((prevRows) => [...prevRows, addRow]);
        }
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
        const pattern = /(^\d+)[.]?\d{1,4}$/;
        if (!pattern.test(refPriceBTC.current.value) || !pattern.test(refPriceKRW.current.value)) {
            alert('소수점 네자리까지 입력 가능합니다.');
            return;
        }
        if (confirm('저장하시겠습니까?')) {
            let ico_info_list = [];
            // 상장정보가 초기에는 데이터가 없다.
            if (icoList.length === 0) {
                let ico = {
                    id: '',
                    project_id: projectId,
                    market_info: 'KRW',
                    price: refPriceKRW.current.value,
                    ico_date: krw_ico_date
                };
                ico_info_list.push(ico);
                ico = {
                    id: '',
                    project_id: projectId,
                    market_info: 'BTC',
                    price: refPriceBTC.current.value,
                    ico_date: btc_ico_date
                };
                ico_info_list.push(ico);
            } else {
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
            }
            let saveData = { ico_info_list: ico_info_list };
            console.log(saveData);
            updateIcoList(projectId, saveData);
        }
    };
    // 마케팅 수량 리스트 저장
    const saveMarketingList = () => {
        const pattern = /(^\d+)[.]?\d{1,4}$/;
        marketingList.map((item) => {
            const { minimum_quantity, actual_quantity } = item;
            if (!pattern.test(minimum_quantity) || !pattern.test(actual_quantity)) {
                alert('소수점 네자리까지 입력 가능합니다.');
                return;
            }
        });
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
                    console.log(item);
                    //console.log(index);
                    formData.append('no', index);
                    formData.append('id', item.id === '' ? '' : item.id);
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
            alert('검색 단어를 입력하세요.');
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
            <Grid container spacing={0} sx={{ mt: 1 }} className="officeinfo__content--box">
                <TopInputLayout className="officeinfo__content--align bottom--blank__small">
                    <Typography variant="h3">재단정보</Typography>
                    <ButtonLayout>
                        <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={foundationSave}>
                            저장
                        </Button>
                    </ButtonLayout>
                </TopInputLayout>

                <div className="common-grid--layout">
                    <table>
                        <tr>
                            <th>프로젝트명</th>
                            <td>
                                <TextField id="project_name" name="project_name" inputRef={refProject_name} type="text" fullWidth />
                            </td>
                        </tr>
                        <tr>
                            <th>심볼</th>
                            <td>
                                <TextField id="symbol" name="symbol" inputRef={refSymbol} type="text" fullWidth />
                            </td>
                        </tr>
                        <tr>
                            <th>계약 상태</th>
                            <td>
                                <Select
                                    name="contract_code"
                                    label="계약상태"
                                    //inputRef={refContract_code}
                                    value={contract_code}
                                    //defaultValue={refContract_code.current.value}
                                    onChange={handleChange}
                                    fullWidth
                                >
                                    <MenuItem value="">전체</MenuItem>
                                    {statusList.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </td>
                        </tr>
                        <tr>
                            <th>진행 상태</th>
                            <td>
                                <Select name="process_code" label="진행상태" value={process_code} onChange={handleChange} fullWidth>
                                    <MenuItem value="">전체</MenuItem>
                                    {processList.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </td>
                        </tr>
                        <tr>
                            <th>관리자 메모</th>
                            <td>
                                <TextField id="outlined-multiline-static" multiline rows={3} inputRef={refMemo} fullWidth />
                            </td>
                        </tr>
                    </table>
                </div>
            </Grid>

            <Grid container className="officeinfo__content--box">
                <TopInputLayout className="officeinfo__content--align bottom--blank__small">
                    <Typography variant="h4">프로젝트 정보</Typography>

                    <Button disableElevation size="medium" type="button" variant="contained" color="primary" onClick={projectSave}>
                        저장
                    </Button>
                </TopInputLayout>

                <ContentLine className="common__grid--rowTable">
                    <table className="tg">
                        <thead>
                            <tr>
                                <th className="tg-0lax">사업계열</th>
                                <th className="tg-0lax">네트워크 계열</th>
                                <th className="tg-0lax">백서 링크</th>
                                <th className="tg-0lax">최초 발행일</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="tg-0lax">
                                    <Select name="business_code" value={business_code} fullWidth onChange={handleChange}>
                                        <MenuItem value="">선택</MenuItem>
                                        {businessList.map((item, index) => (
                                            <MenuItem key={index} value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </td>
                                <td className="tg-0lax">
                                    <Select name="network_code" value={network_code} fullWidth onChange={handleChange}>
                                        <MenuItem value="">선택</MenuItem>
                                        {networkList.map((item, index) => (
                                            <MenuItem key={index} value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </td>
                                <td className="tg-0lax">
                                    <TextField id="outlined-multiline-static" size="medium" fullWidth inputRef={refWhitepaper_link} />
                                </td>
                                <td className="tg-0lax">
                                    <TextField
                                        id="create_date"
                                        name="create_date"
                                        size="medium"
                                        value={create_date}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="date"
                                        fullWidth
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className="tg-0lax" colSpan="4">
                                    컨트랙트 주소
                                </th>
                            </tr>
                            <tr>
                                <td className="tg-0lax-left" colSpan="4">
                                    <TextField id="outlined-multiline-static" size="medium" inputRef={refContract_address} fullWidth />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </ContentLine>
            </Grid>

            <Grid container className="officeinfo__content--box">
                <Grid className="bottom--blank__small">
                    <Typography variant="h4">담당자 정보</Typography>
                </Grid>
                <ContentLine className="common__grid--rowTable">
                    <table>
                        <thead>
                            <tr>
                                <th>이름</th>
                                <th>연락처</th>
                                <th>SNS ID</th>
                                <th>이메일 주소</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList.length > 0 ? (
                                userList.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.user_name}</td>
                                        <td>{item.phone}</td>
                                        <td>{item.sns_id}</td>
                                        <td>{item.email}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </ContentLine>
            </Grid>

            <Grid container className="officeinfo__content--box">
                <TopInputLayout className="officeinfo__content--align bottom--blank__small">
                    <Typography variant="h4">상장 정보</Typography>

                    <ButtonLayout>
                        <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={icoSave}>
                            저장
                        </Button>
                    </ButtonLayout>
                </TopInputLayout>

                <ContentLine container className="common__grid--rowTable">
                    <table>
                        <thead>
                            <tr>
                                <th>마켓 정보</th>
                                <th>상장가</th>
                                <th>상장일</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>KRW</th>
                                <td>
                                    <TextField
                                        id="outlined-multiline-static"
                                        size="medium"
                                        inputRef={refPriceKRW}
                                        onKeyPress={numberCheck}
                                        fullWidth
                                    />
                                </td>
                                <td>
                                    <TextField
                                        id="krw_ico_date"
                                        name="krw_ico_date"
                                        size="medium"
                                        value={krw_ico_date}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="date"
                                        fullWidth
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>BTC</th>
                                <td>
                                    <TextField
                                        id="outlined-multiline-static"
                                        size="medium"
                                        inputRef={refPriceBTC}
                                        onKeyPress={numberCheck}
                                        fullWidth
                                    />
                                </td>
                                <td>
                                    <TextField
                                        id="btc_ico_date"
                                        name="btc_ico_date"
                                        size="medium"
                                        value={btc_ico_date}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="date"
                                        fullWidth
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </ContentLine>
            </Grid>

            <Grid container className="officeinfo__content--box">
                <TopInputLayout className="officeinfo__content--align bottom--blank__small">
                    <Typography variant="h3">마케팅 수량</Typography>
                    <ButtonLayout>
                        <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={addMarketingList}>
                            추가
                        </Button>
                        <Button
                            disableElevation
                            size="medium"
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={saveMarketingList}
                        >
                            저장
                        </Button>
                    </ButtonLayout>
                </TopInputLayout>

                <ContentLine container className="common__grid--rowTable">
                    <table>
                        <thead>
                            <tr>
                                <th>심볼</th>
                                <th>최소 지원 수량</th>
                                <th>실제 상장 지원 수량</th>
                                <th>-</th>
                            </tr>
                        </thead>
                        <tbody>
                            {marketingList.map((item, index) => (
                                <tr>
                                    <td>
                                        <TextField
                                            id="outlined-multiline-static"
                                            size="medium"
                                            fullWidth
                                            onChange={(e) => handleSymbolChange(e, index)}
                                            value={item.symbol}
                                        />
                                    </td>
                                    <td>
                                        <TextField
                                            id="outlined-multiline-static"
                                            size="medium"
                                            value={item.minimum_quantity}
                                            onKeyPress={numberCheck}
                                            fullWidth
                                            onChange={(e) => handleMinimumQuantityChange(e, index)}
                                        />
                                    </td>
                                    <td>
                                        <TextField
                                            id="outlined-multiline-static"
                                            size="medium"
                                            value={item.actual_quantity}
                                            onKeyPress={numberCheck}
                                            fullWidth
                                            onChange={(e) => handleActualQuantityChange(e, index)}
                                        />
                                    </td>
                                    <td>
                                        {item.id === '' && (
                                            <IconButton aria-label="delete" onClick={(e) => deleteMarketingList(e, index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                        {item.id !== '' && <div>-</div>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </ContentLine>
            </Grid>

            <Grid container className="officeinfo__content--box">
                <TopInputLayout className="officeinfo__content--align bottom--blank__small">
                    <Typography variant="h3">검토 평가</Typography>
                    <ButtonLayout>
                        <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={addReviewgList}>
                            추가
                        </Button>
                        <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={reviewSaveList}>
                            저장
                        </Button>
                    </ButtonLayout>
                </TopInputLayout>
            </Grid>
            <ContentLine container className="common__grid--rowTable">
                <table className="projectmng__evaluation">
                    <thead>
                        <tr>
                            <th className="tg-0lax">평가 기관</th>
                            <th className="tg-0lax">평가 결과</th>
                            <th className="tg-1wig" colSpan="2">
                                평가 자료
                            </th>
                            <th className="tg-0lax__del">&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviewList.map((item, index) => (
                            <tr>
                                <td className="tg-0lax">
                                    <TextField
                                        id="outlined-multiline-static"
                                        size="medium"
                                        fullWidth
                                        value={item.organization}
                                        onChange={(e) => handleOrganizationChange(e, index)}
                                    />
                                </td>
                                <td className="tg-0lax">
                                    <TextField
                                        id="outlined-multiline-static"
                                        size="medium"
                                        value={item.result}
                                        fullWidth
                                        onChange={(e) => handleResultChange(e, index)}
                                    />
                                </td>
                                <td className="tg-0lax">
                                    <TextField
                                        id="outlined-multiline-static"
                                        size="medium"
                                        fullWidth
                                        value={item.reference}
                                        onChange={(e) => handleReferenceChange(e, index)}
                                    />
                                </td>
                                <td className="tg-0lax">
                                    <TextField
                                        type="file"
                                        size="medium"
                                        fullWidth
                                        onChange={(e) => fileHandleChange(e, index)}
                                        inputProps={{
                                            accept:
                                                '.doc, .docx, .xlsx, .xls, .ppt, .pptx, .ai, .mov, .mp4, .avi, .mkv, .jpg, .jpeg, .png, .gif, .pdf, .txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                        }}
                                    />
                                    {item.file_name && (
                                        <div>
                                            <a href="#" onClick={() => fileDownload(item.file_key, item.file_name)}>
                                                {item.file_name}
                                            </a>
                                        </div>
                                    )}
                                </td>
                                <td className="tg-0lax">
                                    {item.id === '' && (
                                        <IconButton aria-label="delete" onClick={(e) => deleteReviewList(e, index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                    {item.id !== '' && <div>-</div>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </ContentLine>

            <Grid container className="officeinfo__content--box">
                <TopInputLayout className="officeinfo__content--align bottom--blank__small">
                    <Typography variant="h3">프로젝트 연결</Typography>
                </TopInputLayout>
                <ContentLine container className="common__grid--rowTable">
                    <table>
                        <tr>
                            <th colSpan={2}>프로젝트 선택</th>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <FlexBox classNames="projectmng__select">
                                    <TextField id="outlined-multiline-static" fullWidth name="keyword" inputRef={refKeyword} size="small" />

                                    <Button
                                        disableElevation
                                        size="medium"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        onClick={symbolSearch}
                                    >
                                        검색
                                    </Button>
                                </FlexBox>
                            </td>
                        </tr>
                        {projectSearchList.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    {item.project_name} ( {item.symbol} )
                                </td>
                                <td>
                                    <Button
                                        disableElevation
                                        size="medium"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => projectConnect(item.project_id, item.symbol)}
                                    >
                                        연결
                                    </Button>
                                </td>
                            </tr>
                        ))}

                        {projectLinkList.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    {item.link_project_name} ( {item.link_project_symbol} )
                                </td>
                                <td>
                                    <Button
                                        disableElevation
                                        size="medium"
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => projectDisconnect(item.id)}
                                    >
                                        연결해제
                                    </Button>
                                </td>
                            </tr>
                        ))}

                        {/* 검색 실패했을 경우*/}
                        {searchMessage !== '' && (
                            <tr>
                                <td colSpan={2}>{searchMessage}</td>
                            </tr>
                        )}
                    </table>
                </ContentLine>
            </Grid>
        </Grid>
    );
};

export default ProjectMng;
