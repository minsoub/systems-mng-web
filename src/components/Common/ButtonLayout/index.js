import './styles.scss';
import cx from 'classnames';

// 버튼이 여러개 일 때
/**
 * @param children
 * @param buttonName ===> 상황에 맞게 레이아웃 조정하기 위한 클레스
 * @returns {JSX.Element}
 * @constructor
 */
const ButtonLayout = ({ children, buttonName }) => {
    return <div className={cx(`buttonLayout ${buttonName}`)}>{children}</div>;
};

export default ButtonLayout;
