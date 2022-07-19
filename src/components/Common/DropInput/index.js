import cx from 'classnames';
import { FormControl, Stack } from '@mui/material';
import './styles.scss';

// 드롭형식 input 박스
const DropInput = ({ title, children }) => {
    return (
        <div className="dropList">
            <Stack spacing={10} className={cx('borderTitle')}>
                {title}
            </Stack>

            <div className="drop__list--input">
                <FormControl sx={{ minWidth: 250 }} size="medium">
                    {children}
                </FormControl>
            </div>
        </div>
    );
};

export default DropInput;
