import './styles.scss';
import cx from 'classnames';
import PropTypes from 'prop-types';

// input 여러개 일 때
const InputLayout = ({ children, gridClass }) => {
    InputLayout.defaultProps = {
        gridClass: null
    };

    return <div className={cx(`inputLayout ${gridClass}`)}>{children}</div>;
};

export default InputLayout;

InputLayout.propTypes = {
    gridClass: PropTypes.string,
    children: PropTypes.any
};
