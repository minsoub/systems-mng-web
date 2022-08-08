import HeaderTitle from '../../../components/HeaderTitle';
import { Grid } from '@mui/material';
import MainCard from '../../../components/Common/MainCard';

const IpRegForm = () => {
    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle titleNm="접근 IP 등록" menuStep01="통합시스템 관리" menuStep02="접근 IP 관리" menuStep03="접근 IP 등록" />

                <MainCard></MainCard>
            </Grid>
        </Grid>
    );
};

export default IpRegForm;
