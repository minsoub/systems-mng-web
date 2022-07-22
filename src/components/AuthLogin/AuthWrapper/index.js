import PropTypes from 'prop-types';
import { Box, Grid } from '@mui/material';
import AuthCard from 'components/AuthLogin/AuthCard';
import Logo from 'components/Logo';
import AuthFooter from 'components/cards/AuthFooter';
import AuthBackground from 'assets/images/auth/AuthBackground';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const AuthWrapper = ({ children }) => (
    <Box sx={{ minHeight: '100vh' }}>
        <AuthBackground />
        <Grid
            container
            direction="column"
            justifyContent="flex-end"
        >
            <Grid item xs={12} sx={{ ml: 3, mt: 3 }}>
                <Logo />
            </Grid>

            <Grid
                item
                xs={12}
                className={cx('layOut')}
                sx={{ minHeight: { xs: 'calc(100vh - 134px)', md: 'calc(100vh - 112px)' } }}
            >
                <AuthCard>{children}</AuthCard>
            </Grid>

            {/* Footer */}
            <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                <AuthFooter />
            </Grid>
        </Grid>
    </Box>
);

AuthWrapper.propTypes = {
    children: PropTypes.node
};

export default AuthWrapper;
