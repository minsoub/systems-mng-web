import PropTypes from 'prop-types';
import { Breadcrumb } from 'antd';
import './styles.scss';
import { StarOutlined } from '@ant-design/icons';
import { IconButton } from '@mui/material';

// 타이틀 명, 메뉴 경로
const HeaderTitle = ({ titleNm, menuStep01, menuStep02, menuStep03 }) => {
    return (
        <div className="admin--title">
            <div className='title'>
                <h3>{titleNm}</h3>
                {/* <IconButton variant="text" size="small"  sx={{ width: 'auto', minWidth: 'auto'}}>
                    <StarOutlined />
                </IconButton> */}
            </div>

            <Breadcrumb>
                <Breadcrumb.Item>
                    <span>{menuStep01}</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <span>{menuStep02}</span>
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
