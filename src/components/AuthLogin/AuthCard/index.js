import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import MainCard from 'components/Common/MainCard';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const AuthCard = ({ children, title }) => (
    <div className={cx('authWidth')}>
        <MainCard title={title}>
            <Box className={cx('blank')}>{children}</Box>
        </MainCard>
    </div>
);

AuthCard.propTypes = {
    children: PropTypes.node
};

export default AuthCard;
