import './styles.scss';
import cx from 'classnames';
import PropTypes from 'prop-types';

// 버튼이 여러개 일 때
/**
 * @param children
 * @param buttonName ===> 상황에 맞게 레이아웃 조정하기 위한 클레스
 * @returns {JSX.Element}
 * @constructor
 */
const ButtonLayout = ({ children, buttonName, style }) => {
    ButtonLayout.defaultProps = {
        buttonName: ''
    };

    return (
        <div className={cx(`buttonLayout ${buttonName}`)} style={{ ...style }}>
            {children}
        </div>
    );
};

export default ButtonLayout;

ButtonLayout.propTypes = {
    buttonName: PropTypes.string.isRequired,
    children: PropTypes.any,
    style: PropTypes.any
};
