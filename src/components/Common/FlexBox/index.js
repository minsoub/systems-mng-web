import React from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import { Grid } from '@mui/material';
const cx = classNames.bind(styles);

const FlexBox = ({ children, classNames, sx }) => {
    return (
        <Grid className={classNames} sx={{ ...sx, display: 'flex'}}>
            {children}
        </Grid>
    );
};

export default FlexBox;