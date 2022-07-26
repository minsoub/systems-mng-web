import React from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const FlexBox = ({ children, classNames }) => {
    return (
        <div className={classNames}>
            <div className={cx('flex--layout')}>{children}</div>
        </div>
    );
};

export default FlexBox;
