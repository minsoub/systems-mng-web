import { FormControl, Stack } from '@mui/material';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import StackLabel from '../../Common/StackLabel';
const cx = classNames.bind(styles);

// 드롭형식 input 박스
const DropInput = ({ title, children, className }) => {
    return (
        <div className={cx(className)}>
            <div className={cx(`dropList`)}>
                <StackLabel title={title} />

                <div className={cx('dropList--input')}>
                    <FormControl sx={{ minWidth: 250, boxSizing: 'border-box', width: '100%' }} size="medium">
                        {children}
                    </FormControl>
                </div>
            </div>
        </div>
    );
};

export default DropInput;
