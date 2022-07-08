import React from 'react';
// material-ui
// eslint-disable-next-line prettier/prettier
import {
    Box,
    Grid,
    Typography,
    Tab,
    Tabs
} from '@mui/material';
import MainCard from 'components/MainCard';
import TabPanel from 'components/TabPanel';
import FaqContent from './faqlist';

const FaqContentsPage = () => {
    const [value, setValue] = React.useState(0);

    const tabChange = (event, value) => {
        setValue(value);
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h3">콘텐츠 관리</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">사이트 운영 &gt; FAQ 관리 &gt; 콘텐츠 관리</Typography>
                    </Grid>
                    <Grid container spacing={2}></Grid>
                </Grid>
                <MainCard sx={{ mt: 1 }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid container spacing={0} sx={{ mt: 0 }}>
                            <Box sx={{ width: '100%' }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Grid container spacing={0} sx={{ mt: 0 }}>
                                        <Grid item xs={8}>
                                            <Tabs value={value} onChange={tabChange} aria-label="basic tabs example">
                                                <Tab label="국문" />
                                                <Tab label="영문" />
                                            </Tabs>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Grid container spacing={0} sx={{ mt: 0 }}>
                                    <Grid item xs={12}>
                                        <TabPanel value={value} index={0}>
                                            <FaqContent language={'KO'} value={value} index={0} />
                                        </TabPanel>
                                        <TabPanel value={value} index={1}>
                                            <FaqContent language={'EN'} value={value} index={1} />
                                        </TabPanel>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default FaqContentsPage;