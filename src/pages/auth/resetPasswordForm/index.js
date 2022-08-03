import { Grid, Typography } from '@mui/material';
import AuthWrapper from '../../../components/AuthLogin/AuthWrapper';
import ResetPasswordForm from "../../../components/AuthLogin/ResetPasswordForm";

// 로그인 페이지
const Login = () => (
    <AuthWrapper title="임시 비밀번호 발급">
        <Grid item xs={12}>
            <ResetPasswordForm />
        </Grid>
    </AuthWrapper>
);

export default Login;
