import {Grid, Stack, Typography} from '@mui/material';
import AuthLogin from '../../../components/AuthLogin/LoginForm';
import AuthWrapper from '../../../components/AuthLogin/AuthWrapper';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

// 로그인 페이지
const Login = () => (
    <AuthWrapper>
        <Grid container spacing={3}>
            <Typography variant="h3" className={cx('loginTitle')}>로그인</Typography>
            <Grid item xs={12}>
                <AuthLogin />
            </Grid>
        </Grid>
    </AuthWrapper>
);

export default Login;
