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
    // ?????? ?????? ??????
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const parentErrorClear = () => {
        setOpen(false);
        setErrorTitle('');
        setErrorMessage('');
    };
    ////////////////////////////////////////////////////

    // ?????? ?????? ?????? ?????????
    const [officeInfo, setOfficeInfo] = useState({}); // ????????????
    const [projecInfo, setProjectInfo] = useState({}); // ???????????? ??????
    const [userList, setUserList] = useState([]); // User ??????
    const [icoList, setIcoList] = useState([]); // ICO ??????
    const [marketingList, setMarketingList] = useState([]); // ????????? ??????
    const [reviewList, setReviewList] = useState([]); // ???????????? ?????????
    const [projectList, setProjectList] = useState([]); // ???????????? ????????? ?????? ?????????

    // ???????????? ??????
    const [statusAllList, setStatusAllList] = useState([]); // ?????? ?????? ?????????
    const [statusList, setStatusList] = useState([]); // ?????? ??????
    const [processList, setProcessList] = useState([]); // ?????? ?????? ?????? ??? ???????????? ?????? ?????????.
    const [businessList, setBusinessList] = useState([]); // ????????????
    const [networkList, setNetworkList] = useState([]); // ???????????? ??????

    // ???????????? ?????? ?????? ??????
    const refProject_name = useRef(); // < HTMLInputElement > null;
    const refSymbol = useRef(); // < HTMLInputElement > null;
    const [contract_code, setContract_code] = useState('');
    //const refContract_code = useRef(); // < HTMLInputElement > null;
    //const refProcess_code = useRef(); // < HTMLInputElement > null;
    const [process_code, setProcess_code] = useState('');
    const refMemo = useRef(); //  < HTMLInputElement > null;

    // ???????????? ?????? ?????? ?????? ??????
    const [business_code, setBusiness_code] = useState('');
    const [network_code, setNetwork_code] = useState('');
    const refWhitepaper_link = useRef();
    const [create_date, setCreate_date] = useState('');
    const refContract_address = useRef();
    const timerRef = useRef();
    const timerCount = useRef();

    // ???????????? ?????? ?????? ??????
    const refPriceKRW = useRef();
    const refPriceBTC = useRef();
    const [krw_ico_date, setKrw_ico_date] = useState('');
    const [btc_ico_date, setBtc_ico_date] = useState('');

    // ???????????? ?????? ?????? ?????? ??????
    const refKeyword = useRef();
    const [projectSearchList, setProjectSearchList] = useState([]);
    const [projectLinkList, setProjectLinkList] = useState([]);
    // ?????? ?????? ?????????
    const [searchMessage, setSearchMessage] = useState('');

    // ????????? ?????? ??? ???????????? ??????
    const refuserKeyword = useRef();
    const [userSearchList, setUserSearchList] = useState([]);

    // ???????????? ????????? ??????
    const [downloadFileName, setDownloadFileName] = useState('');

    const [polling, setPolling] = useState(0);

    const refMasking = useRef();

    // onload
    useEffect(() => {
        // ????????? ??????
        statusSearch(false); // ?????? ??? ?????? ??????
        // ???????????? ????????? ????????????
        lineSearch('BUSINESS');
        // ???????????? ??????
        lineSearch('NETWORK');
        refMasking.current = 0; // unmasking
        setPolling(0);
        timerCount.current = 0;
        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
            timerCount.current = 0;
        };
    }, []);

    // transaction error ??????
    useEffect(() => {
        if (requestError) {
            console.log('error requestError');
            console.log(requestError);
            if (requestError.error.message === 'PROJECT_NAME_DUPLICATE') {
                alert('????????? ??? ?????? ???????????? ???????????????.');
            } else {
                alert('????????? ?????????????????????.');
            }

            // setErrorTitle('Error Message');
            // setErrorMessage(requestError);
            // setOpen(true);
            //alert(requestError.error.message);
        }
    }, [requestError]);

    // ?????? ?????? ???????????? ??????????????? ??? ????????????.
    useEffect(() => {
        // polling start
        console.log('reviewList data => ');
        console.log(reviewList);
        console.log(polling);
        if (polling === 0) {
            // ?????? ?????? ???????????? ??????????????? ?????? ???????????? ??????
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
            // start ????????????.. ????????????..
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
            // 5?????? ?????????.. ??????
            timerRef.current = setInterval(() => {
                // 6. ?????? ?????? ??????
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

    // Combobox - ????????????, ???????????? ??????
    useEffect(() => {
        if (!resLineData) return;

        switch (resLineData.transactionId) {
            case 'getList':
                if (resLineData.data.data && resLineData.data.data.length > 0) {
                    // ?????? ?????? ??????
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
                    // 1. ???????????? ??????
                    officeSearch(projectId);
                    // 2. ???????????? ?????? ??????
                    projectSearch(projectId);
                    // 3. ????????? ?????? ??????
                    userSearch(projectId);
                    // 4. ?????? ?????? ??????
                    icoSearch(projectId);
                    // 5. ????????? ?????? ?????? ??????
                    marketingSearch(projectId);
                    // 6. ?????? ?????? ??????
                    reviewSearch(projectId);
                    // 7. ???????????? ?????? ??????
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
            case 'getFoundationInfo': // ????????????
                if (responseData.data.data) {
                    console.log(responseData.data.data);
                    setOfficeInfo(responseData.data.data);
                    refProject_name.current.value = responseData.data.data.project_name;
                    refSymbol.current.value = responseData.data.data.symbol;
                    //refContract_code.current.value = responseData.data.data.contract_code;
                    setContract_code(responseData.data.data.contract_code);
                    processPrint(responseData.data.data.contract_code); // ?????? ?????? ????????? ??????
                    //refProcess_code.current.value = responseData.data.data.progress_code;
                    setProcess_code(responseData.data.data.process_code);
                    refMemo.current.value = responseData.data.data.admin_memo;
                } else {
                    setOfficeInfo({});
                }
                break;
            case 'getProjectList': // ???????????? ??????
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
            case 'getUserList': // ????????? ??????
                console.log('>>getUserList called...<<');
                if (responseData.data.data && responseData.data.data.length > 0) {
                    console.log(responseData.data.data);
                    setUserList(responseData.data.data);
                } else {
                    setUserList([]);
                    // ???????????? ?????????
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
            case 'getMarketingList': // ????????? ??????
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setMarketingList(responseData.data.data);
                } else {
                    setMarketingList([]);
                }
                break;
            case 'getReviewList': // ?????? ??????
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
            case 'updateFoundationInfo': // ?????? ?????? ????????????
                if (responseData.data.data) {
                    alert('????????? ?????????????????????.');
                    officeSearch(projectId);
                }
                break;
            case 'updateProjectInfo': // ???????????? ?????? ????????????
                if (responseData.data.data) {
                    alert('????????? ?????????????????????.');
                    projectSearch(projectId);
                }
                break;
            case 'updateIcoList': // ???????????? ????????????
                if (responseData.data.data) {
                    alert('????????? ?????????????????????.');
                    icoSearch(projectId);
                }
                break;
            case 'updateMarketingList': // ????????? ?????? ????????????
                if (responseData.data.data) {
                    alert('????????? ?????????????????????.');
                    marketingSearch(projectId);
                }
                break;
            case 'deleteMarketing': // ????????? ?????? ??????
                if (responseData.data.data) {
                    alert('????????? ?????????????????????.');
                }
                break;
            case 'updateReviewList': // ?????? ?????? ????????? ????????????
                if (responseData.data.data) {
                    alert('????????? ?????????????????????.');
                    reviewSearch(projectId);
                }
                break;
            case 'deleteReviewData': // ?????? ?????? ??????
                if (responseData.data.data) {
                    alert('????????? ?????????????????????.');
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
                    // ???????????? ?????? ??????????????? ?????? ????????? ????????? ????????? ????????????.
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
                        setSearchMessage('????????? ??????????????? ??????????????????.');
                    }
                } else {
                    setProjectSearchList([]);
                }
                break;
            case 'projectConnect':
                if (responseData.data.data) {
                    alert('???????????? ????????? ?????????????????????.');
                    projectLinkListSearch(projectId);
                    setProjectSearchList([]);
                }
                break;
            case 'projectDisconnect':
                if (responseData.data.data) {
                    alert('???????????? ?????? ????????? ?????????????????????.');
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
                    alert('????????? ????????? ?????????????????????.');
                    userSearch(projectId);
                }
                break;
            case 'delRegister':
                if (responseData.data.data) {
                    alert('?????? ????????? ?????????????????????.');
                    userSearch(projectId);
                }
                break;
            case 'userUpdate':
                if (responseData.data.data) {
                    alert('????????? ?????????????????????.');
                    userSearch(projectId);
                }
                break;
            default:
        }
    }, [responseData]);

    // ?????? ?????? ?????? ??? ???????????? ??????
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
                // ???????????? ??????.
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

    //???????????? ????????? row id ??????
    const handleSelectionChange = (item) => {
        if (item) {
            setSeletedRows(item);
        }
    };
    // ????????? ?????? ?????????
    const handlePage = (page) => {};

    // ????????? ??????
    const handleClick = (rowData) => {
        if (rowData && rowData.field && rowData.field !== '__check__') {
            let searchCondition = { site_id: site_id, is_use: is_use, type: type };

            //navigate(`/authmng/reg/${rowData.id}`);
        }
    };

    // ????????? ?????? ??????
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
    // ????????? ?????? ?????? ??????
    const handleSymbolChange = (evt, idx) => {
        const newData = marketingList.map((item, index) => {
            if (idx !== index) return item;
            return { ...item, symbol: evt.target.value };
        });
        setMarketingList(newData);
    };
    // ????????? ?????? ?????? ??????
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
    // ???????????? - ?????? ??????
    const handleOrganizationChange = (evt, idx) => {
        const newData = reviewList.map((item, index) => {
            if (idx !== index) return item;
            return { ...item, organization: evt.target.value };
        });
        setReviewList(newData);
    };
    // ???????????? - ?????? ??????
    const handleResultChange = (evt, idx) => {
        const newData = reviewList.map((item, index) => {
            if (idx !== index) return item;
            return { ...item, result: evt.target.value };
        });
        setReviewList(newData);
    };
    // ???????????? - ?????? ??????(??????)
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

    // // ?????? ?????? ?????? ??? ??????
    // const fileHandleChange = (e) => {
    //     if (!e.target.files[0]) {
    //         setFilePart();
    //         return;
    //     }
    //     let { name } = e.target;
    //     setInputs({
    //         ...inputs, // ?????? input ?????? ??????
    //         [name]: e.target.files[0].name
    //     });
    //     setFilePart(e.target.files[0]);
    // };

    // ???????????? - ?????? ?????? (URL)
    const handleReferenceChange = (evt, idx) => {
        const newData = reviewList.map((item, index) => {
            if (idx !== index) return item;
            return { ...item, reference: evt.target.value };
        });
        setReviewList(newData);
    };

    // Marking List ??????
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
    // ????????? ?????? ??????
    const deleteMarketing = (evt, idx, id) => {
        if (confirm('?????? ???????????????????')) {
            if (marketingList.length > 0) {
                marketingList.map((item, Index) => {
                    if (idx === Index) {
                        setMarketingList((prevRows) => [...prevRows.slice(0, idx), ...prevRows.slice(idx + 1)]);
                        // ?????? API ??????
                        deleteMarketingData(projectId, id);
                    }
                });
            }
        }
    };
    // ?????? ?????? List ??????
    const addReviewList = () => {
        if (reviewList.length === 3) {
            alert('3??? ????????? ????????? ???????????????!.');
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
    // ?????? ????????? ??????
    const deleteReviewList = (evt, idx) => {
        if (reviewList.length > 0) {
            reviewList.map((item, Index) => {
                if (idx === Index) {
                    setReviewList((prevRows) => [...prevRows.slice(0, idx), ...prevRows.slice(idx + 1)]);
                }
            });
        }
    };
    // ?????? ?????? ??????
    const deleteReview = (evt, idx, id) => {
        if (confirm('?????? ???????????????????')) {
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

    // ???????????? ??????
    const foundationSave = () => {
        // ?????????????????? ????????? ?????? ?????? ??????
        if (refProject_name.current.value.length === 0) {
            alert('?????????????????? ??????????????????.');
            return;
        }
        if (refSymbol.current.value.length === 0) {
            alert('????????? ??????????????????.');
            return;
        }
        const regex1 = /^[a-zA-Z0-9\s]*$/;
        if (!regex1.test(refProject_name.current.value)) {
            alert('???????????? ?????? ????????????????????????.');
            return;
        }

        const regex2 = /^[A-Z|a-z|0-9|]+$/;
        if (!regex2.test(refSymbol.current.value)) {
            alert('???????????? ?????? ???????????????.');
            return;
        }

        if (confirm('?????????????????????????')) {
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
    // ???????????? ??????
    const projectSave = () => {
        if (confirm('?????????????????????????')) {
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
    // ???????????? ??????
    const icoSave = () => {
        // const pattern = /(^\d+)[.]?\d{1,4}$/;
        // if (!pattern.test(refPriceBTC.current.value) || !pattern.test(refPriceKRW.current.value)) {
        //     alert('????????? ??????????????? ?????? ???????????????.');
        //     return;
        // }
        if (!refPriceKRW.current.value) {
            alert('KRW ???????????? ??????????????????.');
            return;
        }
        if (!krw_ico_date) {
            alert('KRW ???????????? ??????????????????.');
            return;
        }
        if (!refPriceBTC.current.value) {
            alert('BTC ???????????? ??????????????????.');
            return;
        }

        if (!btc_ico_date) {
            alert('BTC ???????????? ??????????????????.');
            return;
        }
        if (confirm('?????????????????????????')) {
            let ico_info_list = [];
            // ??????????????? ???????????? ???????????? ??????.
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
    // ????????? ?????? ????????? ??????
    const saveMarketingList = () => {
        // const pattern = /(^\d+)[.]?\d{1,4}$/;
        const pattern = /^[A-Z|a-z|0-9|]+$/;
        let found = 0;
        marketingList.map((item) => {
            const { minimum_quantity, actual_quantity } = item;
            if (!item.symbol) {
                alert('????????? ??????????????????.');
                found = 1;
                return;
            }
            if (!pattern.test(item.symbol)) {
                alert('???????????? ?????? ???????????????.');
                found = 1;
                return;
            }
        });
        if (found === 1) return;
        if (marketingList && marketingList.length > 0) {
            if (confirm('?????????????????????????')) {
                let saveData = { marketing_list: marketingList };
                updateMarketingList(projectId, saveData);
            }
        }
    };
    // ?????? ?????? ????????? ??????
    const reviewSaveList = () => {
        if (reviewList && reviewList.length > 0) {
            const formData = new FormData();
            if (confirm('?????????????????????????')) {
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

    // ?????? ?????? ????????????
    const fileDownload = (id, fileKey, fileName) => {
        setDownloadFileName(fileName);
        fileReviewDownload(projectId, id, fileKey);
    };

    // ???????????? (??????) ??????
    const symbolSearch = () => {
        if (!refKeyword.current.value) {
            alert('?????? ????????? ???????????????.');
            return;
        }
        setSearchMessage('');
        symbolKeywordSearch(refKeyword.current.value, projectId);
    };

    // ???????????? ??????
    const projectConnect = (link_id, link_symbol) => {
        if (confirm('??????????????? ?????????????????????????')) {
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
    // ???????????? ?????? ??????
    const projectDisconnect = (id) => {
        if (confirm('???????????? ?????? ?????????????????????????')) {
            projectDisconnectSave(id);
        }
    };

    // ????????? ?????? ??????
    const projectUserdSearch = () => {
        if (!refuserKeyword.current.value) {
            alert('?????? ????????? ???????????????.');
            return;
        }
        userKeywordSearch(refuserKeyword.current.value, projectId);
    };

    // ????????? ??????
    const userAdd = (id, email) => {
        let found = 0;
        userList.map((item, index) => {
            if (item.user_email.indexOf('*') !== -1) {
                found = 1;
            }
        });
        if (found === 1) {
            alert('????????? ?????? ????????? ?????? ???????????????!!!');
            return;
        }

        // ?????? ???????????? ????????? ????????????.
        found = 0;
        userList.map((item, idx) => {
            if (item.email === email) {
                found = 1;
                alert('?????? ????????? ??????????????????.');
                return;
            }
        });
        if (found === 0) lrcUserRegister(projectId, id, email);
    };
    // ????????? ?????? ??????
    const userDelete = (project_id, id) => {
        if (confirm('?????? ?????????????????????????')) {
            lrcUserDelete(project_id, id);
        }
    };

    // ????????? ?????? ??????
    const handleUserChange = (evt, type, idx) => {
        const newData = userList.map((item, index) => {
            if (idx !== index) return item;
            return { ...item, [type]: evt.target.value };
        });
        //console.log(newData);
        setUserList(newData);
    };

    // ????????? ?????? ??????
    const userSave = () => {
        if (userList.length > 0) {
            let found = 0;

            userList.map((item, index) => {
                if (item.user_email.indexOf('*') !== -1) {
                    found = 1;
                }
            });
            if (found === 1) {
                alert('????????? ?????? ????????? ?????? ???????????????!!!');
                return;
            }
            if (confirm('?????????????????????????')) {
                lrcUserSave(projectId, userList);
            }
        }
    };

    const reqUnMask = () => {
        if (userList.length > 0) {
            // ????????? ?????? ????????? ??????. (?????? ????????? ?????????????????? ???????????? ?????????)
            setOpenReason(true);
        }
    };

    const handlePopupClose = (returnData) => {
        setOpenReason(false);
        // ????????? ??????
        if (returnData.length !== 0) {
            // ????????? ??????
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
                    <Typography variant="h3">????????????</Typography>
                </TopInputLayout>

                <div className="common__grid--rowTable">
                    <table>
                        <tr>
                            <th>???????????????</th>
                            <td>
                                <TextField id="project_name" name="project_name" inputRef={refProject_name} type="text" fullWidth />
                            </td>
                        </tr>
                        <tr>
                            <th>??????</th>
                            <td>
                                <TextField id="symbol" name="symbol" inputRef={refSymbol} type="text" fullWidth />
                            </td>
                        </tr>
                        <tr>
                            <th>?????? ??????</th>
                            <td>
                                <Select
                                    name="contract_code"
                                    label="????????????"
                                    //inputRef={refContract_code}
                                    value={contract_code}
                                    //defaultValue={refContract_code.current.value}
                                    onChange={handleChange}
                                    fullWidth
                                >
                                    <MenuItem value="">??????</MenuItem>
                                    {statusList.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </td>
                        </tr>
                        <tr>
                            <th>?????? ??????</th>
                            <td>
                                <Select name="process_code" label="????????????" value={process_code} onChange={handleChange} fullWidth>
                                    <MenuItem value="">??????</MenuItem>
                                    {processList.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </td>
                        </tr>
                        <tr>
                            <th>????????? ??????</th>
                            <td>
                                <TextField id="outlined-multiline-static" multiline rows={3} inputRef={refMemo} fullWidth />
                            </td>
                        </tr>
                    </table>
                </div>
            </Grid>
            <ButtonLayout>
                <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={foundationSave}>
                    ??????
                </Button>
            </ButtonLayout>
            <Grid container className="officeinfo__content--box">
                <TopInputLayout className="officeinfo__content--align bottom--blank__small">
                    <Typography variant="h4">???????????? ??????</Typography>
                </TopInputLayout>

                <ContentLine className="common__grid--rowTable">
                    <table className="tg">
                        <thead>
                            <tr>
                                <th className="tg-0lax">????????????</th>
                                <th className="tg-0lax">???????????? ??????</th>
                                <th className="tg-0lax">Jira ??????</th>
                                <th className="tg-0lax">?????? ?????????</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="tg-0lax">
                                    <Select name="business_code" value={business_code} fullWidth onChange={handleChange}>
                                        <MenuItem value="">??????</MenuItem>
                                        {businessList.map((item, index) => (
                                            <MenuItem key={index} value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </td>
                                <td className="tg-0lax">
                                    <Select name="network_code" value={network_code} fullWidth onChange={handleChange}>
                                        <MenuItem value="">??????</MenuItem>
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
                                    ???????????? ??????
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
                    ??????
                </Button>
            </ButtonLayout>
            <Grid container className="officeinfo__content--box">
                <TopInputLayout className="officeinfo__content--align bottom--blank__small">
                    <Typography variant="h4">????????? ??????</Typography>
                </TopInputLayout>
                <ContentLine container className="common__grid--rowTable">
                    <table>
                        <thead>
                            <tr>
                                <th>??????</th>
                                <th>???????????? ??????</th>
                                <th>?????? ????????? ??????</th>
                                <th>??????</th>
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
                    ??????
                </Button>
                <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={saveMarketingList}>
                    ??????
                </Button>
            </ButtonLayout>
            <Grid container className="officeinfo__content--box">
                <TopInputLayout className="officeinfo__content--align bottom--blank__small">
                    <Typography variant="h4">?????? ??????</Typography>
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
                                <th className="tg-0lax">?????? ??????</th>
                                <th className="tg-0lax">?????? ??????</th>
                                <th className="tg-1wig" colSpan="2">
                                    ?????? ??????
                                </th>
                                <th className="tg-0lax__del">??????</th>
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
                                        {item.file_key && item.file_status === 'ING' && <div>{item.file_name} [?????????]</div>}
                                        {item.file_key && item.file_status === 'INFECTED' && <div>{item.file_name} [????????????]</div>}
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
                    ??????
                </Button>
                <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={reviewSaveList}>
                    ??????
                </Button>
            </ButtonLayout>
            <Grid container className="officeinfo__content--box">
                <TopInputLayout className="officeinfo__content--align bottom--blank__small">
                    <Typography variant="h4">?????? ??????</Typography>
                </TopInputLayout>

                <ContentLine container className="common__grid--rowTable">
                    <table>
                        <thead>
                            <tr>
                                <th>?????? ??????</th>
                                <th>?????????</th>
                                <th>?????????</th>
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
                    ??????
                </Button>
            </ButtonLayout>
            <Grid container className="officeinfo__content--box">
                <TopInputLayout className="officeinfo__content--align bottom--blank__small">
                    <Typography variant="h4">???????????? ??????</Typography>
                </TopInputLayout>
                <ContentLine container className="common__grid--rowTable">
                    <table>
                        <tr>
                            <th colSpan={2}>???????????? ??????</th>
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
                                        ??????
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
                                        ??????
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
                                        ????????????
                                    </Button>
                                </td>
                            </tr>
                        ))}

                        {/* ?????? ???????????? ??????*/}
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
                    <Typography variant="h4">????????? ??????</Typography>
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
                                            ??????
                                        </Button>
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={userSave}
                                        >
                                            ??????
                                        </Button>
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={reqUnMask}
                                        >
                                            ????????? ??????
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
                                        ??????
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </table>
                    <table>
                        <thead>
                            <tr>
                                <th>??????</th>
                                <th>??????</th>
                                <th>?????????</th>
                                <th>SNS ID</th>
                                <th>????????? ??????</th>
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
                                                ??????
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
