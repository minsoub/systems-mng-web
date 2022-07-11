import PropTypes from 'prop-types';
import './styles.scss';
import { Stack } from '@mui/material';
import cx from 'classnames';

/**
 * 상세 페이지 제목과 내용
 * @param titleNm
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
const DetailBoardContent = ({ titleNm, children }) => {
    return (
        <tr className="board--content">
            <td>
                <Stack spacing={10} className={cx('board--content__title')}>
                    {titleNm}
                </Stack>
            </td>

            <td className={cx('board--content__con')}>{children}</td>
        </tr>
    );
};

export default DetailBoardContent;

DetailBoardContent.PropTypes = {
    titleNm: PropTypes.string.isRequired,
    children: PropTypes.any
};
