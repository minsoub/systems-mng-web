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
import axiosInstanceDefault from '../../../apis/axiosDefault';
import { doEncrypt } from '../../../utils/Crypt';
import PrivateReasonDialog from '../../popup/PrivateResonPopup';

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
            foundationExcelDownload,
            updateFoundationInfo,
            marketingSearch,
            updateMarketingList,
            deleteMarketingData,
            reviewSearch,
            updateReviewList,
            deleteReviewData,
            projectSearch,
            updateProjectInfo,
            userSearch,
            userUnMaskingSearch,
            createUserSearch,
            icoSearch,
            updateIcoList,
            officeSearch,
            fileReviewDownload,
            symbolKeywordSearch,
            projectConnectSave,
            projectDisconnectSave,
            projectLinkListSearch,
            userKeywordSearch,
            lrcUserRegister,
            lrcUserDelete,
            lrcUserSave
        }
    ] = FoundationApi();
    const [resData, reqErr, resLoading, { statusSearch }] = StatusApi();
    const [resLineData, reqLineError, lineLoading, { lineSearch }] = LineApis();
    const { projectId, children, tabindex, index, ...other } = props;

    // Log reason Dialog
    const [openReason, setOpenReason] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');

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
    const timerRef = useRef();
    const timerCount = useRef();

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

    // 사용자 검색 및 등록항목 정의
    const refuserKeyword = useRef();
    const [userSearchList, setUserSearchList] = useState([]);

    // 다운로드 파일명 정의
    const [downloadFileName, setDownloadFileName] = useState('');

    const [polling, setPolling] = useState(0);

    const refMasking = useRef();

    // onload
    useEffect(() => {
        // 상태값 조회
        statusSearch(false); // 상태 값 모두 조회
        // 프로젝트 정보의 사업계열
        lineSearch('BUSINESS');
        // 네트워크 계열
        lineSearch('NETWORK');
        refMasking.current = 0; // unmasking
        setPolling(0);
        timerCount.current = 0;
    }, []);

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            console.log('error requestError');
            console.log(requestError);
            // setErrorTitle('Error Message');
            // setErrorMessage(requestError);
            // setOpen(true);
            //alert(requestError.error.message);
            alert('에러가 발생하였습니다.');
        }
    }, [requestError]);

    // 검토 평가 리스트가 변경되었을 때 호출된다.
    useEffect(() => {
        // polling start
        console.log('reviewList data => ');
        console.log(reviewList);
        console.log(polling);
        if (polling === 0) {
            // 검토 평가 리스트에 파일정보가 아직 검사중인 경우
            console.log('review file data search...');
            let found = 0;
            reviewList.map((item) => {
                console.log(item.file_key);
                console.log(item.file_status);
                if (item.file_status === 'ING') {
                    found = 1;
                    console.log('review file found...');
                    setPolling(1);
                    //return;
                }
            });
            console.log(found);
            if (found === 0) {
                setPolling(0);
            }
        } else {
            // start 중이지만.. 끝났다면..
            let found = 0;
            console.log(timerCount.current);
            if (timerCount.current > 100) {
                setPolling(0);
                return;
            }
            reviewList.map((item) => {
                if (item.file_status === 'ING') {
                    found = 1;
                    //return;
                }
            });
            if (found === 0) {
                setPolling(0);
            }
        }
    }, [reviewList]);

    // Polling Start
    useEffect(() => {
        console.log(polling);
        if (polling === 1 && timerCount.current < 100) {
            // timer start
            // 5초에 한번씩.. 조회
            timerRef.current = setInterval(() => {
                // 6. 검토 평가 조회
                console.log('timer start...');
                reviewSearch(projectId);
            }, 8000);
        } else {
            // timer stop
            clearInterval(timerRef.current);
            timerRef.current = null;
            timerCount.current = 0;
        }
    }, [polling]);

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
                    console.log(responseData.data.data);
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
                console.log('>>getUserList called...<<');
                if (responseData.data.data && responseData.data.data.length > 0) {
                    console.log(responseData.data.data);
                    setUserList(responseData.data.data);
                } else {
                    setUserList([]);
                    // 담당자가 없으면
                    console.log('>>createUserSearch called...<<');
                    createUserSearch(projectId);
                }
                break;
            case 'getCreateUser':
                if (responseData.data.data) {
                    setUserList((prevRows) => [...prevRows, responseData.data.data]);
                } else {
                    setUserList([]);
                }
                break;
            case 'getIcoList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setIcoList(responseData.data.data);
                    // KRW/BTC
                    let data = responseData.data.data;
                    data.map((item) => {
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
                console.log(responseData.data.data);
                if (responseData.data.data && responseData.data.data.length > 0) {
                    console.log(responseData.data.data);
                    setReviewList(responseData.data.data);
                    let found = 0;

                    responseData.data.data.map((item) => {
                        console.log(item.file_key);
                        console.log(item.file_status);
                        if (item.file_status === 'ING') {
                            found = 1;
                            console.log('review file found...');
                            setPolling(1);
                        }
                    });
                    console.log(found);
                    if (found === 0) {
                        setPolling(0);
                    }
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
            case 'deleteMarketing': // 마케팅 정보 삭제
                if (responseData.data.data) {
                    alert('삭제를 완료하였습니다.');
                }
                break;
            case 'updateReviewList': // 검토 평가 리스트 업데이트
                if (responseData.data.data) {
                    alert('저장을 완료하였습니다.');
                    reviewSearch(projectId);
                }
                break;
            case 'deleteReviewData': // 검토 평가 삭제
                if (responseData.data.data) {
                    alert('삭제를 완료하였습니다.');
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
                    origin.map((item) => {
                        let found = 0;
                        projectLinkList.map((itm) => {
                            if (item.project_id === itm.link_project_id) {
                                found = 1;
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
            case 'getUserSearchList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setUserSearchList(responseData.data.data);
                } else {
                    setUserSearchList([]);
                }
                break;
            case 'userRegister':
                if (responseData.data.data) {
                    alert('사용자 추가를 완료하였습니다.');
                    userSearch(projectId);
                }
                break;
            case 'delRegister':
                if (responseData.data.data) {
                    alert('탈퇴 처리를 완료하였습니다.');
                    userSearch(projectId);
                }
                break;
            case 'userUpdate':
                if (responseData.data.data) {
                    alert('저장을 완료하였습니다.');
                    userSearch(projectId);
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
        // const pattern = /(^\d*)(.)\d{0,3}$/;
        // if (!pattern.test(e.target.value) && !(e.target.value === '')) {
        //     e.preventDefault();
        // }
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
            minimum_quantity: '',
            actual_quantity: ''
        };
        setMarketingList((prevRows) => [...prevRows, addRow]);
    };
    // Marketing List remove
    const deleteMarketingList = (evt, idx) => {
        if (marketingList.length > 0) {
            marketingList.map((item, Index) => {
                if (idx === Index) {
                    setMarketingList((prevRows) => [...prevRows.slice(0, idx), ...prevRows.slice(idx + 1)]);
                }
            });
        }
    };
    // 마켓팅 수량 삭제
    const deleteMarketing = (evt, idx, id) => {
        if (confirm('삭제 하시겠습니까?')) {
            if (marketingList.length > 0) {
                marketingList.map((item, Index) => {
                    if (idx === Index) {
                        setMarketingList((prevRows) => [...prevRows.slice(0, idx), ...prevRows.slice(idx + 1)]);
                        // 삭제 API 호출
                        deleteMarketingData(projectId, id);
                    }
                });
            }
        }
    };
    // 검토 평가 List 추가
    const addReviewList = () => {
        if (reviewList.length === 3) {
            alert('3개 까지만 입력이 가능합니다!.');
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
                }
            });
        }
    };
    // 검토 평가 삭제
    const deleteReview = (evt, idx, id) => {
        if (confirm('삭제 하시겠습니까?')) {
            if (reviewList.length > 0) {
                reviewList.map((item, Index) => {
                    if (idx === Index) {
                        setReviewList((prevRows) => [...prevRows.slice(0, idx), ...prevRows.slice(idx + 1)]);
                        deleteReviewData(projectId, id);
                    }
                });
            }
        }
    };

    // 재단정보 저장
    const foundationSave = () => {
        // 프로젝트명과 심벌의 경우 필수 조건
        if (refProject_name.current.value.length === 0) {
            alert('프로젝트명을 입력해주세요.');
            return;
        }
        if (refSymbol.current.value.length === 0) {
            alert('심볼을 입력해주세요.');
            return;
        }
        const regex1 = /^[a-zA-Z0-9\s]*$/;
        if (!regex1.test(refProject_name.current.value)) {
            alert('유효하지 않은 프로젝트명입니다.');
            return;
        }

        const regex2 = /^[A-Z|a-z|0-9|]+$/;
        if (!regex2.test(refSymbol.current.value)) {
            alert('유효하지 않은 심볼입니다.');
            return;
        }

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
        // const pattern = /(^\d+)[.]?\d{1,4}$/;
        // if (!pattern.test(refPriceBTC.current.value) || !pattern.test(refPriceKRW.current.value)) {
        //     alert('소수점 네자리까지 입력 가능합니다.');
        //     return;
        // }
        if (!refPriceKRW.current.value) {
            alert('KRW 상장가를 입력해주세요.');
            return;
        }
        if (!krw_ico_date) {
            alert('KRW 상장일을 입력해주세요.');
            return;
        }
        if (!refPriceBTC.current.value) {
            alert('BTC 상장가를 입력해주세요.');
            return;
        }

        if (!btc_ico_date) {
            alert('BTC 상장일을 입력해주세요.');
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
        // const pattern = /(^\d+)[.]?\d{1,4}$/;
        const pattern = /^[A-Z|a-z|0-9|]+$/;
        let found = 0;
        marketingList.map((item) => {
            const { minimum_quantity, actual_quantity } = item;
            if (!item.symbol) {
                alert('심볼을 입력해주세요.');
                found = 1;
                return;
            }
            if (!pattern.test(item.symbol)) {
                alert('유효하지 않은 심볼입니다.');
                found = 1;
                return;
            }
        });
        if (found === 1) return;
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
    const fileDownload = (id, fileKey, fileName) => {
        setDownloadFileName(fileName);
        fileReviewDownload(projectId, id, fileKey);
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

    // 당당자 정보 검색
    const projectUserdSearch = () => {
        if (!refuserKeyword.current.value) {
            alert('검색 단어를 입력하세요.');
            return;
        }
        userKeywordSearch(refuserKeyword.current.value, projectId);
    };

    // 담당자 추가
    const userAdd = (id, email) => {
        let found = 0;
        userList.map((item, index) => {
            if (item.user_email.indexOf('*') !== -1) {
                found = 1;
            }
        });
        if (found === 1) {
            alert('마스킹 해제 요청을 하지 않았습니다!!!');
            return;
        }

        // 이미 등록되어 있는지 체크한다.
        found = 0;
        userList.map((item, idx) => {
            if (item.email === email) {
                found = 1;
                alert('이미 등록된 사용자입니다.');
                return;
            }
        });
        if (found === 0) lrcUserRegister(projectId, id, email);
    };
    // 담당자 탈퇴 처리
    const userDelete = (project_id, id) => {
        if (confirm('탈퇴 처리하시겠습니까?')) {
            lrcUserDelete(project_id, id);
        }
    };

    // 담당자 정보 수정
    const handleUserChange = (evt, type, idx) => {
        const newData = userList.map((item, index) => {
            if (idx !== index) return item;
            return { ...item, [type]: evt.target.value };
        });
        //console.log(newData);
        setUserList(newData);
    };

    // 담당자 정보 저장
    const userSave = () => {
        if (userList.length > 0) {
            let found = 0;

            userList.map((item, index) => {
                if (item.user_email.indexOf('*') !== -1) {
                    found = 1;
                }
            });
            if (found === 1) {
                alert('마스킹 해제 요청을 하지 않았습니다!!!');
                return;
            }
            if (confirm('저장하시겠습니까?')) {
                lrcUserSave(projectId, userList);
            }
        }
    };

    const reqUnMask = () => {
        if (userList.length > 0) {
            // 마스킹 해제 요청을 한다. (해당 요청은 내부망에서만 이루어질 것이다)
            setOpenReason(true);
        }
    };

    const handlePopupClose = (returnData) => {
        setOpenReason(false);
        // 데이터 처리
        if (returnData.length !== 0) {
            // 데이터 처리
            console.log(returnData);
            let reason = returnData;
            userUnMaskingSearch(projectId, reason);
            refMasking.current = 1;
        }
    };

    return (
        <Grid container alignItems="center" justifyContent="space-between" className="officeinfo__grid">
            <Grid container spacing={0} sx={{ mt: 1 }} className="officeinfo__content--box">
                <TopInputLayout className="officeinfo__content--align bottom--blank__small">
                    <Typography variant="h3">재단정보</Typography>
                </TopInputLayout>

                <div className="common__grid--rowTable">
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
            <ButtonLayout>
                <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={foundationSave}>
                    저장
                </Button>
            </ButtonLayout>
            <Grid container className="officeinfo__content--box">
                <TopInputLayout className="officeinfo__content--align bottom--blank__small">
                    <Typography variant="h4">프로젝트 정보</Typography>
                </TopInputLayout>

                <ContentLine className="common__grid--rowTable">
                    <table className="tg">
                        <thead>
                            <tr>
                                <th className="tg-0lax">사업계열</th>
                                <th className="tg-0lax">네트워크 계열</th>
                                <th className="tg-0lax">Jira 번호</th>
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
            <ButtonLayout>
                <Button disableElevation size="medium" type="button" variant="contained" color="primary" onClick={projectSave}>
                    저장
                </Button>
            </ButtonLayout>
            <Grid container className="officeinfo__content--box">
                <TopInputLayout className="officeinfo__content--align bottom--blank__small">
                    <Typography variant="h4">마케팅 수량</Typography>
                </TopInputLayout>
                <ContentLine container className="common__grid--rowTable">
                    <table>
                        <thead>
                            <tr>
                                <th>심볼</th>
                                <th>제안받은 수량</th>
                                <th>입금 완료된 수량</th>
                                <th>삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {marketingList.map((item, index) => (
                                <tr key={index}>
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
                                    <td style={{ width: '100px' }}>
                                        {item.id === '' && (
                                            <IconButton aria-label="delete" onClick={(e) => deleteMarketingList(e, index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                        {item.id !== '' && (
                                            <IconButton aria-label="delete" onClick={(e) => deleteMarketing(e, index, item.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </ContentLine>
            </Grid>
            <ButtonLayout>
                <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={addMarketingList}>
                    추가
                </Button>
                <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={saveMarketingList}>
                    저장
                </Button>
            </ButtonLayout>
            <Grid container className="officeinfo__content--box">
                <TopInputLayout className="officeinfo__content--align bottom--blank__small">
                    <Typography variant="h4">검토 평가</Typography>
                </TopInputLayout>
                <ContentLine container className="common__grid--reviewRowTable">
                    <table className="projectmng__evaluation">
                        <colgroup>
                            <col />
                            <col />
                            <col />
                            <col width="30%" />
                            <col width="100" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className="tg-0lax">평가 기관</th>
                                <th className="tg-0lax">평가 결과</th>
                                <th className="tg-1wig" colSpan="2">
                                    평가 자료
                                </th>
                                <th className="tg-0lax__del">삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviewList.map((item, index) => (
                                <tr key={index}>
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
                                    <td
                                        className="tg-0lax"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '1.5rem 2rem'
                                        }}
                                    >
                                        <TextField
                                            type="file"
                                            size="medium"
                                            onChange={(e) => fileHandleChange(e, index)}
                                            inputProps={{
                                                accept:
                                                    '.doc, .docx, .xlsx, .xls, .ppt, .pptx, .ai, .mov, .mp4, .avi, .mkv, .jpg, .jpeg, .png, .gif, .pdf, .txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                            }}
                                        />
                                        {item.file_key && item.file_status === 'CLEAN' && (
                                            <div>
                                                <a href="#" onClick={() => fileDownload(item.id, item.file_key, item.file_name)}>
                                                    {item.file_name}
                                                </a>
                                            </div>
                                        )}
                                        {item.file_key && item.file_status === 'ING' && <div>{item.file_name} [검사중]</div>}
                                        {item.file_key && item.file_status === 'INFECTED' && <div>{item.file_name} [감염파일]</div>}
                                    </td>
                                    <td style={{ width: '100px' }} className="tg-0lax">
                                        {item.id === '' && (
                                            <IconButton aria-label="delete" onClick={(e) => deleteReviewList(e, index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                        {item.id !== '' && (
                                            <div>
                                                <IconButton aria-label="delete" onClick={(e) => deleteReview(e, index, item.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </ContentLine>
            </Grid>
            <ButtonLayout>
                <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={addReviewList}>
                    추가
                </Button>
                <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={reviewSaveList}>
                    저장
                </Button>
            </ButtonLayout>
            <Grid container className="officeinfo__content--box">
                <TopInputLayout className="officeinfo__content--align bottom--blank__small">
                    <Typography variant="h4">상장 정보</Typography>
                </TopInputLayout>

                <ContentLine container className="common__grid--rowTable">
                    <table>
                        <thead>
                            <tr>
                                <th>마켓 정보</th>
                                <th>상장일</th>
                                <th>상장가</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>KRW</th>
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
                                <td>
                                    <TextField
                                        id="outlined-multiline-static"
                                        size="medium"
                                        inputRef={refPriceKRW}
                                        onKeyPress={numberCheck}
                                        fullWidth
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>BTC</th>
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
                                <td>
                                    <TextField
                                        id="outlined-multiline-static"
                                        size="medium"
                                        inputRef={refPriceBTC}
                                        onKeyPress={numberCheck}
                                        fullWidth
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </ContentLine>
            </Grid>
            <ButtonLayout>
                <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={icoSave}>
                    저장
                </Button>
            </ButtonLayout>
            <Grid container className="officeinfo__content--box">
                <TopInputLayout className="officeinfo__content--align bottom--blank__small">
                    <Typography variant="h4">프로젝트 연결</Typography>
                </TopInputLayout>
                <ContentLine container className="common__grid--rowTable">
                    <table>
                        <tr>
                            <th colSpan={2}>프로젝트 선택</th>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <FlexBox classNames="projectmng__select">
                                    <TextField
                                        id="outlined-multiline-static"
                                        fullWidth
                                        name="keyword"
                                        inputRef={refKeyword}
                                        size="small"
                                        sx={{ marginRight: '2rem' }}
                                    />
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
                                <td width="93%">
                                    {item.link_project_name} ( {item.link_project_symbol} )
                                </td>
                                <td>
                                    <Button
                                        disableElevation
                                        size="medium"
                                        type="submit"
                                        variant="outlined"
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

            <Grid container className="officeinfo__content--box">
                <Grid className="officeinfo__content--align bottom--blank__small">
                    <Typography variant="h4">담당자 정보</Typography>
                </Grid>
                <ContentLine className="common__grid--userrowTable">
                    <table style={{ border: 0 }}>
                        <tr>
                            <td colSpan={2}>
                                <FlexBox classNames="projectmng__select">
                                    <TextField
                                        id="outlined-multiline-static"
                                        fullWidth
                                        name="userKeyword"
                                        inputRef={refuserKeyword}
                                        size="small"
                                    />
                                    <div className="button_group buton2ea">
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={projectUserdSearch}
                                        >
                                            검색
                                        </Button>
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={userSave}
                                        >
                                            저장
                                        </Button>
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={reqUnMask}
                                        >
                                            마스킹 해제
                                        </Button>
                                    </div>
                                </FlexBox>
                            </td>
                        </tr>
                        {userSearchList.map((item, index) => (
                            <tr key={index}>
                                <td>{item.email}</td>
                                <td>
                                    <Button
                                        disableElevation
                                        size="medium"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => userAdd(item.user_account_id, item.email)}
                                    >
                                        선택
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </table>
                    <table>
                        <thead>
                            <tr>
                                <th>계정</th>
                                <th>이름</th>
                                <th>연락처</th>
                                <th>SNS ID</th>
                                <th>이메일 주소</th>
                                <th>&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList.length > 0 ? (
                                userList.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.user_email}</td>
                                        <td>
                                            <TextField
                                                id="outlined-multiline-static"
                                                size="medium"
                                                fullWidth
                                                value={item.user_name}
                                                onChange={(e) => handleUserChange(e, 'user_name', index)}
                                            />
                                        </td>
                                        <td>
                                            <TextField
                                                id="outlined-multiline-static"
                                                size="medium"
                                                fullWidth
                                                value={item.phone}
                                                onChange={(e) => handleUserChange(e, 'phone', index)}
                                            />
                                        </td>
                                        <td>
                                            <TextField
                                                id="outlined-multiline-static"
                                                size="medium"
                                                fullWidth
                                                value={item.sns_id}
                                                onChange={(e) => handleUserChange(e, 'sns_id', index)}
                                            />
                                        </td>
                                        <td>
                                            <TextField
                                                id="outlined-multiline-static"
                                                size="medium"
                                                fullWidth
                                                value={item.email}
                                                onChange={(e) => handleUserChange(e, 'email', index)}
                                            />
                                        </td>
                                        <td style={{ width: '100px' }}>
                                            <Button
                                                disableElevation
                                                size="medium"
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                onClick={() => userDelete(item.project_id, item.id)}
                                                sx={{ mx: 1 }}
                                            >
                                                탈퇴
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td>-</td>
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
            <PrivateReasonDialog selectedValue={selectedValue} open={openReason} onClose={handlePopupClose} />
        </Grid>
    );
};

export default ProjectMng;
