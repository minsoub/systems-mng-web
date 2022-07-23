import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// material-ui
// eslint-disable-next-line prettier/prettier
import {
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    MenuItem,
    Stack,
    Select
} from '@mui/material';
import MainCard from 'components/Common/MainCard';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import SiteApi from 'apis/site/siteapi';
import BoardMasterApi from 'apis/board/boardmasterapi';
import ErrorScreen from 'components/ErrorScreen';
import HeaderTitle from 'components/HeaderTitle';
import cx from 'classnames';
import ButtonLayout from 'components/Common/ButtonLayout';
import { setSearchData } from 'store/reducers/boardsearch';

const BoardMasterMng = () => {
    const columns = [
        {
            field: 'no',
            headerName: '번호',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 100
        },
        {
            field: 'site_id',
            headerName: '사이트명',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 200,
            valueGetter: (params) => siteList.filter(({id, name}) => id === params.row.site_id)[0].name
        },
        {
            field: 'id',
            headerName: '게시판 ID',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'name',
            headerName: '게시판명',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'type_name',
            headerName: '게시판타입',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'create_date',
            headerName: '생성일시',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 200
        },
        {
            field: 'is_use',
            headerName: '사용여부',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 100,
            valueFormatter: (params) => {
                return params.value == true ? 'Y' : 'N';
            }
        }
    ];
    const navigate = useNavigate();
    const [responseData, requestError, loading, { searchBoardMasterList }] = BoardMasterApi();
    const [resData, reqErr, resLoading, { siteSearch }] = SiteApi();

    const { reduceSiteId, reduceIsUse } = useSelector((state) => state.boardSearchReducer);
    const dispatch = useDispatch();

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);

    ////////////////////////////////////////////////////
    // 공통 에러 처리
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    ////////////////////////////////////////////////////

    // 검색 조건
    const [siteList, setSiteList] = useState([]);
    const [site_id, setSiteId] = useState('');
    const [is_use, setIsUse] = useState(true);

    // 상태 값
    const [isSearch, setIsSearch] = useState(false);

    // onload
    useEffect(() => {
        siteSearch(true, '');
    }, []);

    useEffect(() => {
        if (isSearch) {
            searchClick();
            setIsSearch(false);
        }
    }, [isSearch]);

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

    // 사이트
    useEffect(() => {
        if (!resData) {
            return;
        }
        switch (resData.transactionId) {
            case 'siteList':
                if (resData.data.data) {
                    let siteData = resData.data.data;
                    let list = [];
                    siteData.map((site) => {
                        const s = { id: site.id, name: site.name };
                        console.log(s);
                        list.push(s);
                    });
                    setSiteList(list);
                    
                    // reduce 상태값을 사용하여 검색을 수행한다.
                    if (reduceSiteId) setSiteId(reduceSiteId);
                    else setSiteId(list[0].id);

                    if (reduceIsUse) setIsUse(reduceIsUse);

                    setIsSearch(true);
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
            case 'getBoardMasters':
                const result = responseData.data.data.map((data, index) => ({
                    ...data,
                    no: index + 1
                }));
                if (result && result.length > 0) {
                    setDataGridRows(result);
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
            case 'site_id':
                setSiteId(e.target.value);
                console.log(e.target.value);
                break;
            case 'is_use':
                console.log(e.target.checked);
                setIsUse(e.target.checked);
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
        if (rowData && rowData.field) {
            navigate(`/board/reg/${rowData.id}`);
        }
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // 초기화
    const clearClick = () => {
        console.log('clearClick called...');
        setSiteId('');
        setIsUse(true);
    };

    // 검색
    const searchClick = () => {
        console.log('searchClick called...');
        const request = {
            site_id,
            is_use
        };
        searchBoardMasterList(request);

        // 검색 조건에 대해서 상태를 저장한다.
        const searchData = {
            reduceSiteId: site_id,
            reduceIsUse: is_use
        };
        dispatch(setSearchData(searchData));
    };

    // 신규
    const addClick = () => {
        console.log('addClick called...');
        navigate('/board/reg/');
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle titleNm="게시판 관리" menuStep01="통합 관리" menuStep02="통합 게시판 관리" />
                <MainCard>
                    <div className={cx('category')}>
                        <Stack spacing={10} className={cx('borderTitle')}>
                            사이트명
                        </Stack>

                        <Select name="site_id" label="사이트명" value={site_id} onChange={handleChange}>
                            {siteList.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormControlLabel
                            control={<Checkbox checked={is_use} name="is_use" onChange={handleChange} />}
                            label="사용"
                        />
                    </div>
                </MainCard>

                <Grid className={cx(' searchPointColor')}>
                    <ButtonLayout>
                        <Button disableElevation size="medium" type="submit" variant="contained" onClick={clearClick}>
                            초기화
                        </Button>

                        <Button disableElevation size="medium" type="submit" variant="contained" onClick={searchClick}>
                            검색
                        </Button>
                    </ButtonLayout>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <DefaultDataGrid
                        columns={columns}
                        rows={dataGridRows}
                        handlePageChange={handlePage}
                        handleGridClick={handleClick}
                        handleGridDoubleClick={handleDoubleClick}
                        selectionChange={handleSelectionChange}
                    />
                </MainCard>
                <Grid className={cx(' searchPointColor')}>
                    <ButtonLayout>
                        <Button
                            disableElevation
                            size="medium"
                            type="submit"
                            variant="contained"
                            color="secondary"
                            onClick={addClick}
                        >
                            신규
                        </Button>
                    </ButtonLayout>
                </Grid>
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} />
            </Grid>
        </Grid>
    );
};

export default BoardMasterMng;
