import { Grid, Typography } from '@mui/material';
import AuthWrapper from '../../../components/AuthLogin/AuthWrapper';
import ResetPasswordForm from "../../../components/AuthLogin/ResetPasswordForm";

// 로그인 페이지
const Login = () => (
    <AuthWrapper title="본인 확인">
        <Grid item xs={12}>
            <ResetPasswordForm />
        </Grid>
    </AuthWrapper>
);

export default Login;
