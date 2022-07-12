import './styles.scss';
import cx from 'classnames';
import PropTypes from 'prop-types';
import InputLayout from '../InputLayout';

// input과 button을 두루는 레이아웃
const TopInputLayout = ({ children, className }) => {
    TopInputLayout.defaultProps = {
        className: null
    };

    return <div className={cx(`topInputLayout ${className}`)}>{children}</div>;
};

export default TopInputLayout;

InputLayout.propTypes = {
    className: PropTypes.string | PropTypes.any,
    children: PropTypes.any
};
