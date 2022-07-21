import React, { useEffect, useState } from 'react';
import { Grid, Stack, FormControl } from '@mui/material';
import LineApis from 'apis/lrc/line/lineapi';
import { StsCheckbox } from './StsCheckbox';
import cx from 'classnames';
import './styles.scss';

export const BusinessCheckboxList = ({ checkedItemHandler, isAllChecked }) => {
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
        lineSearch('BUSINESS');
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
        <>
            <Grid container spacing={0} sx={{ mt: 1 }}>
                <Stack spacing={10} className={cx('borderTitle')}>
                    사업 계열
                </Stack>
                <Grid>
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
        </>
    );
};
