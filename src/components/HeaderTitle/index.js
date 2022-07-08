import PropTypes from 'prop-types';
import { Breadcrumb } from 'antd';
import './styles.scss';

// 타이틀 명, 메뉴 경로
const HeaderTitle = ({ titleNm, menuStep01, menuStep02, menuStep03 }) => {
    return (
        <div className="admin--title">
            <h3>{titleNm}</h3>

            <Breadcrumb>
                <Breadcrumb.Item>
                    <a href="">{menuStep01}</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="">{menuStep02}</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{menuStep03 ? menuStep03 : ''}</Breadcrumb.Item>
            </Breadcrumb>
        </div>
    );
};

export default HeaderTitle;

HeaderTitle.PropTypes = {
    titleNm: PropTypes.string.isRequired,
    menuStep01: PropTypes.string.isRequired,
    menuStep02: PropTypes.string.isRequired,
    menuStep03: PropTypes.string.isRequired
};
