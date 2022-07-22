import React from 'react';

import { Box, Grid, Typography, Tab, Tabs } from '@mui/material';
import MainCard from 'components/Common/MainCard';
import TabPanel from 'components/TabPanel';
import FaqContent from './faqlist';
import HeaderTitle from '../../../components/HeaderTitle';

const FaqContentsPage = () => {
    const [value, setValue] = React.useState(0);

    const tabChange = (event, value) => {
        setValue(value);
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle titleNm="콘텐츠 관리" menuStep01="사이트 운영" menuStep02="FAQ 관리" menuStep03="콘텐츠 관리" />

                <MainCard sx={{ mt: 1 }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item xs={8}>
                            <Tabs value={value} onChange={tabChange} aria-label="basic tabs example">
                                <Tab label="국문" />
                                <Tab label="영문" />
                            </Tabs>
                        </Grid>

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
                    </Grid>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default FaqContentsPage;
