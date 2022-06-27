import React, { useEffect, useState } from 'react';
// material-ui
// eslint-disable-next-line prettier/prettier
import {
    Grid,
    Stack,
    FormControl} from '@mui/material';
import LineApis from 'apis/lrc/line/lineapi';
import { StsCheckbox } from './StsCheckbox';

export const BusinessCheckboxList = ({ checkedItemHandler, isAllChecked }) => {
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

    useEffect(() => allCheckHandler(), [isAllChecked]);

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
                <Grid item xs={8} sm={1.2}>
                    <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                        <Stack spacing={0}>사업 계열</Stack>
                    </FormControl>
                </Grid>
                <Grid item xs={8} sm={10}>
                    {dataGridRows.map((item, index) => (
                        <StsCheckbox checkedItemHandler={checkedItemHandler} isAllChecked={isAllChecked} item={item} />
                        // <FormControl key={item.id} sx={{ m: 0 }} size="small">
                        //     <FormControlLabel
                        //         key={item.id}
                        //         control={<Checkbox id={item.id} onChange={(e) => checkHandler(e)} />}
                        //         label={item.name}
                        //     />
                        // </FormControl>
                    ))}
                </Grid>
            </Grid>
        </>
    );
};
