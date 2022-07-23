import {useLocation} from 'react-router';
import {Grid, Typography} from '@mui/material';
import OtpSimpleForm from '../../../components/AuthLogin/OtpSimpleForm';
import AuthWrapper from '../../../components/AuthLogin/AuthWrapper';


// OTP 인증
const OtpSimpleLogin = () => {
    const { state } = useLocation();

    return (
        <AuthWrapper>
            <Grid container spacing={3}>
                <Typography variant="h3">OTP 인증</Typography>

                <Grid item xs={12}>
                    <OtpSimpleForm result={state} />
                </Grid>
            </Grid>
        </AuthWrapper>
    );
};

export default OtpSimpleLogin;
