import { Grid, Typography } from '@mui/material';
import AuthLogin from '../../../components/AuthLogin/LoginForm';
import AuthWrapper from '../../../components/AuthLogin/AuthWrapper';

// 로그인 페이지
const Login = () => (
    <AuthWrapper title="로그인">
        <Grid item xs={12}>
            <AuthLogin />
        </Grid>
    </AuthWrapper>
);

export default Login;
