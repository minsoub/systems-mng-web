import { Link } from 'react-router-dom';
import { Grid, Stack, Typography } from '@mui/material';
import FirebaseRegister from '../../../components/AuthLogin/SignUpForm';
import AuthWrapper from '../../../components/AuthLogin/AuthWrapper';

// 회원가입 페이지
const Signup = () => (
    <AuthWrapper>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                    <Typography variant="h3">회원가입</Typography>
                    <Typography component={Link} to="/login" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
                        이미 회원 이신가요?
                    </Typography>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <FirebaseRegister />
            </Grid>
        </Grid>
    </AuthWrapper>
);

export default Signup;
