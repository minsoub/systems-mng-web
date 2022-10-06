import { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import AnalyticLrcForm from 'components/cards/statistics/AnalyticLrcForm';
import AnalyticLrcCharts from 'components/cards/statistics/AnalyticLrcCharts';
import DashboardApi from 'apis/lrc/dashboard/index';

// avatar style
const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
};

// action style
const actionSX = {
    mt: 0.75,
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',
    transform: 'none'
};

// sales report status
const status = [
    {
        value: 'today',
        label: 'Today'
    },
    {
        value: 'month',
        label: 'This Month'
    },
    {
        value: 'year',
        label: 'This Year'
    }
];

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const LrcDashboard = () => {
    const [responseData, requestError, Loading, { foundationSearch, lineSearch }] = DashboardApi();
    const [dataStatus, setDataGridRows] = useState([]);
    const [dataLine, setDataGridLineRows] = useState([]);
    const [value, setValue] = useState('today');
    const [slot, setSlot] = useState('week');

    // onload
    useEffect(() => {
        setDataGridLineRows([]);
        foundationSearch();
        lineSearch();
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
        console.log(responseData);
        switch (responseData.transactionId) {
            case 'getList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    setDataGridRows(responseData.data.data);
                    let items = responseData.data.data;
                    let dataList = [];
                    items.map((item, index) => {
                        dataList.push({ argument: item.name, value: item.count });
                    });
                    setDataGridLineRows((arr) => [...arr, { name: '거래지원 상태', order: 3, data: dataList }]);
                } else {
                    setDataGridRows([]);
                }
                break;
            case 'getLineList':
                if (responseData.data.data && responseData.data.data.length > 0) {
                    let items = responseData.data.data;
                    let businessList = [];
                    let networkList = [];
                    items.map((item, index) => {
                        if (item.type === 'BUSINESS') {
                            businessList.push({ argument: item.name, value: item.count });
                        } else if (item.type === 'NETWORK') {
                            networkList.push({ argument: item.name, value: item.count });
                        }
                    });
                    //let totalList = [];
                    //totalList.push({ name: '사업계열', order: 1, data: businessList });
                    //totalList.push({ name: '네트워크 계열', order: 2, data: networkList });
                    setDataGridLineRows((arr) => [...arr, { name: '사업계열', order: 1, data: businessList }]);
                    setDataGridLineRows((arr) => [...arr, { name: '네트워크 계열', order: 2, data: networkList }]);
                } else {
                    setDataGridLineRows([]);
                }
                break;
            default:
        }
    }, [responseData]);

    return (
        <Grid container rowSpacing={4} columnSpacing={2.75} className="lrcDashboard">
            <Grid item xs={12}>
                <Grid sx={{ p: '1.625rem 1.5rem', bgcolor: '#fff' }}>
                    <Typography variant="h3" sx={{ fontWeight: '700' }}>거래지원 현황</Typography>
                </Grid>
            </Grid>
            {dataStatus.map((item, index) => (
                <Grid key={index} item xs={4}>
                    <AnalyticLrcForm id={item.id} title={item.name} count={item.count} child={item.children} />
                </Grid>
            ))}

            <Grid item xs={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

            <Grid item xs={12}>
                <Typography variant="h3">재단 통계</Typography>
            </Grid>
            {dataLine
                .sort((a, b) => (a.order > b.order ? 1 : -1))
                .map((item, index) => (
                    <Grid key={index} item xs={4}>
                        <AnalyticLrcCharts title={item.name} data={item.data} />
                    </Grid>
                ))}
        </Grid>
    );
};

export default LrcDashboard;
