import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import MainCard from 'components/MainCard';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const AuthCard = ({ children }) => (
    <MainCard
        border={false}
        boxShadow
        shadow={(theme) => theme.customShadows.z1}
        className={styles.authCard}
    >
        <Box className={cx('blank')}>{children}</Box>
    </MainCard>
);

AuthCard.propTypes = {
    children: PropTypes.node
};

export default AuthCard;
