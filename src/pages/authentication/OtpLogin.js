import { Link } from 'react-router-dom';
import { useLocation } from '../../../node_modules/react-router/index';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import OtpForm from './auth-forms/OtpForm';
import AuthWrapper from './AuthWrapper';

// ================================|| LOGIN ||================================ //

const OtpLogin = () => {
    const { state } = useLocation();
    console.log(state);

    return (
        <AuthWrapper>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                        <Typography variant="h3">OTP 설정</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <OtpForm result={state} />
                </Grid>
            </Grid>
        </AuthWrapper>
    );
};

export default OtpLogin;
