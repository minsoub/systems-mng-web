import React, { useEffect, useState } from 'react';
import './styles.scss';

import { Checkbox, FormControlLabel, Grid, Stack } from '@mui/material';
import { StsCheckbox } from './StsCheckbox';
import LineApis from 'apis/lrc/line/lineapi';
import cx from 'classnames';

export const NetworkCheckboxList = ({ checkedItemHandler, isAllChecked }) => {
    const [responseData, requestError, loading, { lineSearch }] = LineApis();
    const [dataGridRows, setDataGridRows] = useState([]);

    // checkbox
    const [bChecked, setChecked] = useState(false);

    const checkHandler = (e) => {
        setChecked(!bChecked);
        //handleChange(e);
        checkedItemHandler(e.target.id, e.target.checked);
    };
    // onload
    useEffect(() => {
        // 리스트 가져오기
        lineSearch('NETWORK');
    }, []);

    useEffect(() => {
        console.log('isAllChecked called...');
        if (isAllChecked === true) {
            // clear 수행
            setChecked(false);
        }
    }, [isAllChecked]);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getList':
                if (responseData.data.data) {
                    setDataGridRows(responseData.data.data);
                } else {
                    setDataGridRows([]);
                }
                break;
            default:
        }
    }, [responseData]);
    return (
        <Grid container spacing={0} sx={{ mt: 1 }}>
            <Stack spacing={10} className={cx('borderTitle')}>
                네트워크 계열
            </Stack>
            <Grid item xs={8} sm={10}>
                {dataGridRows.map((item, index) => (
                    <StsCheckbox
                        className="checkedBox--width"
                        checkedItemHandler={checkedItemHandler}
                        isAllChecked={isAllChecked}
                        item={item}
                        key={index}
                    />
                ))}
            </Grid>
        </Grid>
    );
};
