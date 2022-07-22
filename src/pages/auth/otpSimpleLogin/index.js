import { useLocation } from 'react-router';
import { Grid } from '@mui/material';
import OtpSimpleForm from '../../../components/AuthLogin/OtpSimpleForm';
import AuthWrapper from '../../../components/AuthLogin/AuthWrapper';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

// OTP 인증
const OtpSimpleLogin = () => {
    const { state } = useLocation();

    return (
        <AuthWrapper title="OTP 인증">
            <Grid item xs={12} className={cx('blank')}>
                <OtpSimpleForm result={state} />
            </Grid>
        </AuthWrapper>
    );
};

export default OtpSimpleLogin;
