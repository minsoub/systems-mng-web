import {useLocation} from 'react-router';
import {Grid, Typography} from '@mui/material';
import AuthWrapper from '../../../components/AuthLogin/AuthWrapper';
import OtpQrCodeForm from "../../../components/AuthLogin/OtpQrCodeForm";

// OTP 로그인 페이지
const OtpLogin = () => {
    const { state } = useLocation();

    return (
        <AuthWrapper>
            <Grid container spacing={3}>
                <Typography variant="h3">OTP 설정</Typography>
                <Grid item xs={12}>
                    <OtpQrCodeForm result={state} />
                </Grid>
            </Grid>
        </AuthWrapper>
    );
};

export default OtpLogin;
