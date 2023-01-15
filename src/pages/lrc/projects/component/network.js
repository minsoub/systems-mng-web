import React, { useEffect, useState } from 'react';
import './styles.scss';

import { Checkbox, FormControlLabel, Grid, Stack } from '@mui/material';
import { StsCheckbox } from './StsCheckbox';
import LineApis from 'apis/lrc/line/lineapi';
import cx from 'classnames';
import StackLabel from 'components/Common/StackLabel';

export const NetworkCheckboxList = ({ networkLineList, checkedItemHandler, isAllChecked }) => {
    열; // checkbox
    const [bChecked, setChecked] = useState(false);

    const checkHandler = (e) => {
        setChecked(!bChecked);
        //handleChange(e);
        checkedItemHandler(e.target.id, e.target.checked);
    };

    useEffect(() => {
        console.log('isAllChecked called...');
        if (isAllChecked === true) {
            // clear 수행
            setChecked(false);
        }
    }, [isAllChecked]);

    return (
        <Grid container spacing={0} sx={{ mt: 1, alignItems: 'center' }}>
            <StackLabel title="네트워크 계열" titleWidth={120} />
            <Grid item xs={8} sm={10}>
                {networkLineList.map((item, index) => (
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
