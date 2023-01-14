import { useEffect, useMemo, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
// library
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
// project import
import AnalyticLrcForm from 'components/cards/statistics/AnalyticLrcForm';
import AnalyticLrcFoundationForm from 'components/cards/statistics/AnalyticLrcFoundationForm';
import AnalyticLrcFoundationStatusForm from 'components/cards/statistics/AnalyticLrcFoundationStatusForm';
import ErrorScreen from 'components/ErrorScreen';
import DashboardSearchDate from './components/DashboardSearchDate';

// transition
import DashboardApi from 'apis/lrc/dashboard/index';

// utils
import { setSearchData } from 'store/reducers/lrc/DashboardSearch';

// style

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const LrcDashboard = () => {
    const [responseData, requestError, Loading, { foundationSearch, lineSearch }] = DashboardApi();

    // 검색 조건 Reduce
    const { reduceFromDate, reduceToDate, reducePeriod } = useSelector((state) => state.lrcDashboardSearchReducer);
    const dispatch = useDispatch();

    const [dataStatus, setDataGridRows] = useState([]);
    const [foundationsStatus, setFoundationsStatus] = useState([]);
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

    const mockData = useMemo(() => {
        return [
            {
                count: 4,
                id: uuidv4(),
                name: 'mockData1',
                type: 'BUSINESS',
                use_yn: true
            },
            {
                count: 2,
                id: uuidv4(),
                name: 'mockData2',
                type: 'BUSINESS',
                use_yn: true
            },
            {
                count: 5,
                id: uuidv4(),
                name: 'mockData3',
                type: 'BUSINESS',
                use_yn: true
            }
        ];
    }, []);

    const handleBlur = (e) => {
        console.log(e);
    };

    const resetPeriod = () => {
        dispatch(setSearchData({ reducePeriod: '1' }));
    };

    const changeDate = (type, e) => {
        switch (type) {
            case 'start':
                dispatch(setSearchData({ reduceFromDate: e }));
                break;
            case 'end':
                dispatch(setSearchData({ reduceToDate: e }));
                break;
            default:
                break;
        }
    };

    const handleChange = (e) => {
        switch (e.target.name) {
            case 'start_date':
                dispatch(setSearchData({ reduceFromDate: e.target.value, reducePeriod: '' }));
                break;
            case 'end_date':
                dispatch(setSearchData({ reduceToDate: e.target.value, reducePeriod: '' }));
                break;
            case 'period':
                dispatch(setSearchData({ reducePeriod: e.target.value }));
                setDateFromToSet(e.target.value);
                break;
            default:
                break;
        }
    };

    // search
    const searchClick = () => {
        foundationSearch({
            start_date: reduceFromDate,
            end_date: reduceToDate
        });
    };

    // 기간 선택시 날짜 변경
    const setDateFromToSet = (periodIndex) => {
        switch (periodIndex) {
            case '1':
                dispatch(
                    setSearchData({
                        reduceFromDate: moment().format('YYYY-MM-DD'),
                        reduceToDate: moment().format('YYYY-MM-DD')
                    })
                );
                break;
            case '2':
                dispatch(
                    setSearchData({
                        reduceFromDate: moment().add(-1, 'weeks').format('YYYY-MM-DD'),
                        reduceToDate: moment().format('YYYY-MM-DD')
                    })
                );
                break;
            case '3':
                dispatch(
                    setSearchData({
                        reduceFromDate: moment().add(-1, 'months').format('YYYY-MM-DD'),
                        reduceToDate: moment().format('YYYY-MM-DD')
                    })
                );
                break;
            case '4':
                dispatch(
                    setSearchData({
                        reduceFromDate: undefined,
                        reduceToDate: undefined
                    })
                );
                break;
            default:
                break;
        }
    };

    // onload
    useEffect(() => {
        searchClick();
    }, []);

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            console.log({ requestError });
            if (requestError.result === 'FAIL') {
                setErrorTitle('Error Message');
                setErrorMessage('[' + requestError.error.code + '] ' + requestError.error.message);
                setOpen(true);
            }
        }
    }, [requestError]);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setDataGridRows(responseData.data.data);
                } else {
                    setDataGridRows([]);
                }
                lineSearch();
                break;
            case 'getLineList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setFoundationsStatus(responseData.data.data);
                } else {
                    setFoundationsStatus([]);
                }
                break;
            default:
        }
    }, [responseData]);

    return (
        <Grid container rowSpacing={3} columnSpacing={2.75} className="lrcDashboard">
            <Grid item xs={12}>
                <Grid
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '1.625rem 1.5rem', bgcolor: '#fff' }}
                >
                    <Typography variant="h3" sx={{ fontWeight: '700' }}>
                        거래지원 현황
                    </Typography>
                    {/* 기간 검색 */}
                    <div style={{ display: 'flex', gap: 60 }}>
                        <DashboardSearchDate
                            start_date={reduceFromDate}
                            end_date={reduceToDate}
                            period={reducePeriod}
                            handleBlur={handleBlur}
                            handleChange={handleChange}
                            startName="start_date"
                            endName="end_date"
                            changeDate={changeDate}
                            resetPeriod={resetPeriod}
                            style={{ margin: 0 }}
                        />
                        <Button disableElevation size="medium" type="submit" variant="contained" onClick={searchClick}>
                            검색
                        </Button>
                    </div>
                </Grid>
            </Grid>
            {dataStatus.map((item) => (
                <Grid key={item.id} item xs={3}>
                    <AnalyticLrcForm id={item.id} title={item.name} count={item.count} child={item.children} />
                </Grid>
            ))}

            <Grid item xs={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

            <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h3" sx={{ background: '#fff', p: '1.625rem 1.5rem' }}>
                    재단 현황
                </Typography>
            </Grid>

            {mockData.map((item) => (
                <Grid key={item.id} item xs={3} sx={{ minWidth: '19%' }}>
                    <AnalyticLrcFoundationStatusForm id={item.id} title={item.name} count={item.count} />
                </Grid>
            ))}
            <div style={{ width: '100%' }}>
                <Typography variant="h3" sx={{ p: '1.625rem 1.625rem ' }}>
                    사업 계열
                </Typography>
            </div>
            <div style={{ width: '100%', display: 'flex', margin: '0 1.6rem', gap: '22px', whiteSpace: 'nowrap', overflowX: 'auto' }}>
                {foundationsStatus
                    .filter((item) => item.type === 'BUSINESS')
                    .map((item) => (
                        <Grid key={item.id} item xs={3} sx={{ minWidth: '19%' }}>
                            <AnalyticLrcFoundationForm id={item.id} title={item.name} count={item.count} child={item.children} />
                        </Grid>
                    ))}
            </div>
            <div style={{ width: '100%' }}>
                <Typography variant="h3" sx={{ p: '1.625rem  1.625rem' }}>
                    네트워크 계열
                </Typography>
            </div>
            <div style={{ width: '100%', display: 'flex', margin: '0 1.6rem', gap: '22px', whiteSpace: 'nowrap', overflowX: 'auto' }}>
                {foundationsStatus
                    .filter((item) => item.type === 'NETWORK')
                    .map((item) => (
                        <Grid key={item.id} item xs={3} sx={{ minWidth: '19%' }}>
                            <AnalyticLrcFoundationForm id={item.id} title={item.name} count={item.count} child={item.children} />
                        </Grid>
                    ))}
            </div>
            {errorMessage && (
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
            )}
        </Grid>
    );
};

export default LrcDashboard;
