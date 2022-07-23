import {useLocation} from 'react-router';
import {Grid, Stack, Typography} from '@mui/material';
import TmpUpdatePasswordForm from '../../../components/AuthLogin/TmpUpdatePasswordForm';
import AuthWrapper from '../../../components/AuthLogin/AuthWrapper';

// 임시 패스워드 변경 페이지
const TmpPasswordForm = () => {
    const { state } = useLocation();

    return (
        <AuthWrapper>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                        <Typography variant="h3">임시 패스워드 변경</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <TmpUpdatePasswordForm result={state} />
                </Grid>
            </Grid>
        </AuthWrapper>
    );
};

export default TmpPasswordForm;
