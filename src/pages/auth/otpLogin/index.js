import { useLocation } from 'react-router';
import { Grid, Typography } from '@mui/material';
import AuthWrapper from '../../../components/AuthLogin/AuthWrapper';
import OtpQrCodeForm from '../../../components/AuthLogin/OtpQrCodeForm';

// OTP 로그인 페이지
const OtpLogin = () => {
    const { state } = useLocation();

    return (
        <AuthWrapper title="OTP 설정">
            <Grid item xs={12}>
                <OtpQrCodeForm result={state} />
            </Grid>
        </AuthWrapper>
    );
};

export default OtpLogin;
