import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// material-ui
// eslint-disable-next-line prettier/prettier
import {
    OutlinedInput,
    Box,
    Button,
    Grid,
    Stack,
    TextField,
    Collapse,
    Alert,
    AlertTitle,
    Typography,
    FormControl,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Radio,
    RadioGroup
} from '@mui/material';
import LineApis from 'apis/lrc/line/lineapi';

export const NetworkCheckboxList = ({ checkedItemHandler }) => {
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
                        <Stack spacing={0}>네트워크 계열</Stack>
                    </FormControl>
                </Grid>
                {dataGridRows.map((item, index) => (
                    <FormControl key={item.id} sx={{ m: 0 }} size="small">
                        <FormControlLabel
                            key={item.id}
                            control={<Checkbox id={item.id} onChange={(e) => checkHandler(e)} />}
                            label={item.name}
                        />
                    </FormControl>
                ))}
            </Grid>
        </>
    );
};
