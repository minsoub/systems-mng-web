import React, { useEffect, useState } from 'react';

import { Button, Grid, Box, Tab, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import MainContentsApi from 'apis/cpc/mainContents/maincontentsapi';
import ErrorScreen from 'components/ErrorScreen';
import HeaderTitle from 'components/HeaderTitle';
import BoardSearchDialog from './popup';
import ButtonLayout from 'components/Common/ButtonLayout';
import './styles.module.scss';
import cx from 'classnames';
import TopInputLayout from 'components/Common/TopInputLayout/index';

const MainContents = () => {
    const [responseData, requestError, resLoading, { searchMainContents }] = MainContentsApi();

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
    const [tabIndex, setTabIndex] = useState('1');
    const [openPopup, setOpenPopup] = useState(false);
    const [boardMasterId, setBoardMasterId] = useState('');

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleClose = () => {
        setOpenPopup(false);
        searchMainContents();
    };

    const [digital_asset_basic, setDigitalAssetBasic] = useState([]);
    const [insight_column, setInsightColumn] = useState([]);
    const [digital_asset_trends, setDigitalAssetTrends] = useState([]);
    // const [blockchain_news, setBlockchainNews] = useState([]);

    // onload
    useEffect(() => {
        searchMainContents();
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
                    // setBlockchainNews(responseData.data.data.blockchain_news);
                }
                break;
            default:
        }
    }, [responseData]);

    const handleClickOpen = (boardMasterId) => {
        console.log(boardMasterId);
        setBoardMasterId(boardMasterId);
        setOpenPopup(true);
    };

    return (
        <Grid container rowSpacing={4} columnSpacing={2.75}>
            <Grid item xs={12}>
                <HeaderTitle titleNm="메인 관리" menuStep01="사이트 운영" menuStep02="메인 관리" menuStep03="컨텐츠 노출 관리" />

                <TabContext value={tabIndex}>
                    <TopInputLayout sx={{ borderBottom: 1, borderColor: 'divider' }} className="pagetab">
                        <TabList onChange={handleChange} aria-label="main contents tabs">
                            <Tab label="가상자산 동향" value="1" />
                            {/* <Tab label="블록체인 뉴스" value="2" /> */}
                            <Tab label="가상자산의 기초" value="3" />
                            <Tab label="인사이트 칼럼" value="4" />
                        </TabList>
                    </TopInputLayout>
                    {/* 가상자산 동향 */}
                    <TabPanel value="1" className={cx('mainMng')} sx={{ p: '20px 0' }}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">번호</TableCell>
                                        <TableCell align="center">제목</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell style={{ width: 160 }} align="center">
                                            1
                                        </TableCell>
                                        <TableCell align="left">
                                            {digital_asset_trends.length > 0 && digital_asset_trends[0].title}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ width: 160 }} align="center">
                                            2
                                        </TableCell>
                                        <TableCell align="left">
                                            {digital_asset_trends.length > 1 && digital_asset_trends[1].title}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ width: 160 }} align="center">
                                            3
                                        </TableCell>
                                        <TableCell align="left">
                                            {digital_asset_trends.length > 2 && digital_asset_trends[2].title}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <ButtonLayout style={{ marginTop: '20px' }}>
                            <Button variant="contained" onClick={() => handleClickOpen('CPC_TREND')}>
                                게시글 선택
                            </Button>
                        </ButtonLayout>
                    </TabPanel>
                    {/* 블록체인 뉴스 */}
                    {/* <TabPanel value="2" className={cx('mainMng')}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">번호</TableCell>
                                        <TableCell align="center">제목</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell style={{ width: 160 }} align="center">
                                            1
                                        </TableCell>
                                        <TableCell align="left">{blockchain_news.length > 0 && blockchain_news[0].title}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ width: 160 }} align="center">
                                            2
                                        </TableCell>
                                        <TableCell align="left">{blockchain_news.length > 1 && blockchain_news[1].title}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ width: 160 }} align="center">
                                            3
                                        </TableCell>
                                        <TableCell align="left">{blockchain_news.length > 2 && blockchain_news[2].title}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <ButtonLayout buttonName="layout__blank--top">
                            <Button variant="contained" onClick={() => handleClickOpen('CPC_NEWS')}>
                                게시글 선택
                            </Button>
                        </ButtonLayout>
                    </TabPanel> */}
                    {/* 가상자산의 기초 */}
                    <TabPanel value="3" className={cx('mainMng')} sx={{ p: '20px 0' }}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">번호</TableCell>
                                        <TableCell align="center">제목</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell style={{ width: 160 }} align="center">
                                            1
                                        </TableCell>
                                        <TableCell align="left">{digital_asset_basic.length > 0 && digital_asset_basic[0].title}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ width: 160 }} align="center">
                                            2
                                        </TableCell>
                                        <TableCell align="left">{digital_asset_basic.length > 1 && digital_asset_basic[1].title}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ width: 160 }} align="center">
                                            3
                                        </TableCell>
                                        <TableCell align="left">{digital_asset_basic.length > 2 && digital_asset_basic[2].title}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <ButtonLayout style={{ marginTop: '20px' }}>
                            <Button variant="contained" onClick={() => handleClickOpen('CPC_DIGITAL_ASSET')}>
                                게시글 선택
                            </Button>
                        </ButtonLayout>
                    </TabPanel>
                    {/* 인사이트 칼럼 */}
                    <TabPanel value="4" className={cx('mainMng')} sx={{ p: '20px 0' }}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">번호</TableCell>
                                        <TableCell align="center">제목</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell style={{ width: 160 }} align="center">
                                            1
                                        </TableCell>
                                        <TableCell align="left">{insight_column.length > 0 && insight_column[0].title}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ width: 160 }} align="center">
                                            2
                                        </TableCell>
                                        <TableCell align="left">{insight_column.length > 1 && insight_column[1].title}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ width: 160 }} align="center">
                                            3
                                        </TableCell>
                                        <TableCell align="left">{insight_column.length > 2 && insight_column[2].title}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <ButtonLayout style={{ marginTop: '20px' }}>
                            <Button variant="contained" onClick={() => handleClickOpen('CPC_INSIGHT_COLUMN')}>
                                게시글 선택
                            </Button>
                        </ButtonLayout>
                    </TabPanel>
                </TabContext>

                <BoardSearchDialog boardMasterId={boardMasterId} open={openPopup} onClose={handleClose} />

                {errorMessage && (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                )}
            </Grid>
        </Grid>
    );
};

export default MainContents;
