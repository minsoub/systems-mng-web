import React, {useEffect, useState} from 'react';

import {Checkbox, FormControl, FormControlLabel} from '@mui/material';
import LineApis from 'apis/lrc/line/lineapi';

export const StsCheckbox = ({ checkedItemHandler, isAllChecked, item }) => {
    const [responseData, requestError, loading, { lineSearch }] = LineApis();
    const [dataGridRows, setDataGridRows] = useState([]);

    // checkbox
    const [bChecked, setChecked] = useState(false);

    const allCheckHandler = () => setChecked(isAllChecked);

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
        allCheckHandler();
        console.log(isAllChecked);
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
            <FormControl key={item.id} sx={{ m: 0 }} size="medium">
                <FormControlLabel
                    key={item.id}
                    control={<Checkbox id={item.id} checked={bChecked} onChange={(e) => checkHandler(e)} />}
                    label={item.name}
                    className="checkedBox--width"
                />
            </FormControl>
        </>
    );
};
