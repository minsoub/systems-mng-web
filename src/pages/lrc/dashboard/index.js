import { useEffect, useState } from 'react';

// material-ui
import {
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Grid,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Stack,
    TextField,
    Typography
} from '@mui/material';

// project import
import OrdersTable from '../../dashboard/OrdersTable';
import IncomeAreaChart from '../../dashboard/IncomeAreaChart';
import MonthlyBarChart from '../../dashboard/MonthlyBarChart';
import ReportAreaChart from '../../dashboard/ReportAreaChart';
import SalesColumnChart from '../../dashboard/SalesColumnChart';
import MainCard from 'components/MainCard';
import AnalyticLrcForm from 'components/cards/statistics/AnalyticLrcForm';
import AnalyticLrcCharts from 'components/cards/statistics/AnalyticLrcCharts';

// assets
import { GiftOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';

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
                // setErrorTitle('Error Message');
                // setErrorMessage('[' + requestError.error.code + '] ' + requestError.error.message);
                // setOpen(true);
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
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Typography variant="h3">거래지원 현황</Typography>
            </Grid>
            {dataStatus.map((item, index) => (
                <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                    <AnalyticLrcForm title={item.name} count={item.count} child={item.children} />
                </Grid>
            ))}

            <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Typography variant="h3">재단 통계</Typography>
            </Grid>
            {dataLine
                .sort((a, b) => (a.order > b.order ? 1 : -1))
                .map((item, index) => (
                    <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                        <AnalyticLrcCharts title={item.name} data={item.data} />
                    </Grid>
                ))}
        </Grid>
    );
};

export default LrcDashboard;
