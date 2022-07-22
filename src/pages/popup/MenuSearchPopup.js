import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DefaultDataGrid from '../../components/DataGrid/DefaultDataGrid';
import MainCard from 'components/Common/MainCard';
import { blue } from '@mui/material/colors';
import {
    OutlinedInput,
    Box,
    Button,
    Grid,
    Stack,
    DialogTitle,
    Dialog,
    Alert,
    AlertTitle,
    Typography,
    TextField,
    FormControl,
    Collapse,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountApis from 'apis/account/accountapis';

function MenuSearchDialog(props) {
    const columns = [
        {
            field: 'name',
            headerName: '사용자명',
            flex: 1
        },
        {
            field: 'email',
            headerName: '이메일주소',
            flex: 1
        }
    ];
    const { onClose, selectedValue, open } = props;
    // 그리드 목록 데이터
    const [selectedRows, setSeletedRows] = useState({});
    const [dataGridRows, setDataGridRows] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [responseData, requestError, loading, { accountSearch }] = AccountApis();
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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
    }, []);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getList':
                if (responseData.data.data) {
                    setDataGridRows(responseData.data.data);
                } else {
                    setDataGridRows([]);
                }
                break;
            default:
        }
    }, [responseData]);

    const handleChange = (event) => {
        setKeyword(event.target.value);
    };

    // 에러 정보를 클리어 한다.
    const errorClear = () => {
        setErrorOpen(false);
        setErrorTitle('');
        setErrorMessage('');
    };

    // 사용자 검색하기
    const searchClick = () => {
        // 사용자 검색
        console.log(keyword);
        if (keyword === '') {
            alert('검색단어를 입력하세요');
        } else {
            accountSearch(keyword);
        }
    };

    const handleKey = (e) => {
        if (e.key === 'Enter') {
            searchClick();
        }
    };

    const handleClose = () => {
        onClose(selectedRows);
        clearData();
    };
    const closePopup = () => {
        onClose([]);
        clearData();
    };

    const clearData = () => {
        setKeyword('');
        setDataGridRows([]);
    };
    // TreeView Event Call
    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    // TreeView 메뉴를 선택했을 때 연결된 프로그램 목록 조회와 메뉴 아이디를 상태에 보관해야 한다.
    const handleSelect = (nodeIds) => {
        console.log(nodeIds);
        setSelected(nodeIds);
        setExpanded(nodeIds);
        // 선택한 노드에 대해서 상세 데이터를 조회한다.
        programMappingSearch(nodeIds, site_id);
    };

    const renderTreeItem = (items) => {
        //console.log(items);
        const menu = items.map((item) => {
            if (item.child_menu && item.child_menu.length) {
                return (
                    <CustomTreeItem key={item.id} nodeId={item.id} dataMsg={item.id} labelText={item.name} nodeSelect={handleSelect}>
                        {renderTreeItem(item.child_menu)}
                    </CustomTreeItem>
                );
            } else {
                return <CustomTreeItem key={item.id} nodeId={item.id} dataMsg={item.id} labelText={item.name} nodeSelect={handleSelect} />;
            }
            return null;
        });
        return menu;
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>사용자 검색 팝업</DialogTitle>

            <MainCard sx={{ mt: 0 }}>
                <Stack direction="row" spacing={1}>
                    <FormControl sx={{ m: 0, maxHeight: 30 }} size="small">
                        <TextField
                            id="filled-hidden-label-small"
                            type="text"
                            size="small"
                            value={keyword}
                            name="keyword"
                            onKeyPress={handleKey}
                            onChange={handleChange}
                            placeholder="Input the Description"
                            fullWidth
                        />
                    </FormControl>
                    <Button disableElevation size="small" type="submit" variant="contained" color="primary" onClick={searchClick}>
                        검색
                    </Button>
                    <Button disableElevation size="small" type="submit" variant="contained" color="secondary" onClick={handleClose}>
                        적용
                    </Button>
                    <Button disableElevation size="small" type="submit" variant="contained" color="secondary" onClick={closePopup}>
                        닫기
                    </Button>
                </Stack>
            </MainCard>

            <MainCard sx={{ mt: 0 }} content={false}>
                <TreeView
                    aria-label="controlled"
                    // defaultExpanded={expanded}
                    defaultCollapseIcon={<MinusSquare />}
                    defaultExpandIcon={<PlusSquare />}
                    defaultEndIcon={<CloseSquare />}
                    sx={{ height: 320, flexGrow: 1, overflowY: 'auto' }}
                    //expanded={expanded}
                    //selected={selected}
                    onNodeToggle={handleToggle}
                    //onNodeSelect={handleSelect}
                >
                    {renderTreeItem(menudata)}
                </TreeView>
            </MainCard>
            <MainCard sx={{ mt: 1 }} content={false}>
                <Collapse in={errorOpen}>
                    <Alert
                        severity="error"
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    errorClear();
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                    >
                        <AlertTitle>{errorTitle}</AlertTitle>
                        {errorMessage}
                    </Alert>
                </Collapse>
            </MainCard>
        </Dialog>
    );
}

MenuSearchDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};

export default MenuSearchDialog;
