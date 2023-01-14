import { useEffect, useMemo, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';

import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import AnalyticLrcForm from 'components/cards/statistics/AnalyticLrcForm';
import AnalyticLrcFoundationForm from 'components/cards/statistics/AnalyticLrcFoundationForm';
import AnalyticLrcFoundationStatusForm from 'components/cards/statistics/AnalyticLrcFoundationStatusForm';

import DashboardSearchDate from './components/DashboardSearchDate';

import DashboardApi from 'apis/lrc/dashboard/index';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const LrcDashboard = () => {
    const [responseData, requestError, Loading, { foundationSearch, lineSearch }] = DashboardApi();

    const [dataStatus, setDataGridRows] = useState([]);
    const [foundationsStatus, setFoundationsStatus] = useState([]);
    const [start_date, setStartDate] = useState(moment().format('YYYY-MM-DD'));
    const [end_date, setEndDate] = useState(moment().format('YYYY-MM-DD'));
    const [period, setPeriod] = useState('1');

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
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'start_date':
                setStartDate(e.target.value);
                setPeriod('');
                break;
            case 'end_date':
                setEndDate(e.target.value);
                setPeriod('');
                break;
            case 'period':
                setPeriod(e.target.value);
                setDateFromToSet(e.target.value);
                break;
            case 'category':
                setCategory(e.target.value);
                break;
            case 'keyword':
                setKeyword(e.target.value);
                break;
            default:
                break;
        }
    };

    // search
    const searchClick = () => {
        console.log('searchClick called...');
        const request = {
            start_date,
            end_date
        };
        foundationSearch(request);
    };

    // 기간 선택시 날짜 변경
    const setDateFromToSet = (periodIndex) => {
        switch (periodIndex) {
            case '1':
                setStartDate(moment().format('YYYY-MM-DD'));
                setEndDate(moment().format('YYYY-MM-DD'));
                break;
            case '2':
                setStartDate(moment().add(-1, 'weeks').format('YYYY-MM-DD'));
                setEndDate(moment().format('YYYY-MM-DD'));
                break;
            case '3':
                setStartDate(moment().add(-1, 'months').format('YYYY-MM-DD'));
                setEndDate(moment().format('YYYY-MM-DD'));
                break;
            case '4':
                setStartDate(undefined);
                setEndDate(undefined);
                break;
            default:
                break;
        }
    };
    // onload
    useEffect(() => {
        const request = {
            start_date,
            end_date
        };
        foundationSearch(request);
    }, []);

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            if (requestError.result === 'FAIL') {
                console.log('error requestError');
                console.log(requestError);
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
                    let items = responseData.data.data;
                    let dataList = [];
                    items.map((item) => {
                        dataList.push({ argument: item.name, value: item.count });
                    });
                } else {
                    setDataGridRows([]);
                }
                lineSearch();
                break;
            case 'getLineList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    console.log('계열리스트', responseData.data.data);
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
                            start_date={start_date}
                            end_date={end_date}
                            period={period}
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
        </Grid>
    );
};

export default LrcDashboard;
