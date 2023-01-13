import { Button, Grid, MenuItem, Select, TextField, RadioGroup, Radio, FormControlLabel, Typography } from '@mui/material';
import MainCard from 'components/Common/MainCard';
import ButtonLayout from 'components/Common/ButtonLayout';
import React, { useEffect, useState } from 'react';

const Field = ({ title, children }) => {
    return (
        <tr>
            <td className={'line-detail__table-label'}>{title}</td>
            <td className={'line-detail__table-children'}>{children}</td>
        </tr>
    );
};

const LineDetail = ({ inputs, handleBlur, handleChange, saveClick, deleteClick, isUpdate }) => {
    const { id, name, type_name, order_no, use_yn } = inputs;
    const [btnSaveTitle, setBtnSaveTitle] = useState('등록');
    const [btnCancelTitle, setBtnCancelTitle] = useState('취소');

    useEffect(() => {
        if (isUpdate) {
            setBtnSaveTitle('저장');
        } else {
            setBtnSaveTitle('등록');
        }
    }, [isUpdate]);

    return (
        <Grid item xs={8} className="blank--layout">
            <Typography variant="h3">계열등록</Typography>

            <table className="line-detail__table">
                <Field title={'계열명'}>
                    <TextField
                        id="filled-hidden-label-small"
                        type="medium"
                        size="medium"
                        value={name}
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        fullWidth
                    />
                </Field>
                <Field title="계열 위치">
                    <TextField
                        id="filled-hidden-label-small"
                        type="medium"
                        size="medium"
                        value={type_name}
                        name="type_name"
                        disabled="true"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        fullWidth
                    />
                </Field>
                <Field title="정렬 순서">
                    <TextField
                        id="filled-hidden-label-small"
                        type="medium"
                        size="medium"
                        value={order_no}
                        name="order_no"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        fullWidth
                    />
                </Field>
                <Field title="사용 여부">
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="use_yn"
                        value={use_yn}
                        style={{ justifyContent: 'flex-first' }}
                        onChange={handleChange}
                    >
                        <FormControlLabel value="true" control={<Radio />} label="사용함" />
                        <FormControlLabel value="false" control={<Radio />} label="사용안함" />
                    </RadioGroup>
                </Field>
            </table>
            <ButtonLayout buttonName="bottom--blank__small" style={{ marginBottom: '20px', justifyContent: 'flex-end' }}>
                <Button
                    disableElevation
                    disabled={!isUpdate}
                    size="medium"
                    type="submit"
                    variant="outlined_d"
                    color="secondary"
                    onClick={deleteClick}
                >
                    {btnCancelTitle}
                </Button>
                <Button disableElevation size="medium" type="submit" variant="contained" onClick={saveClick}>
                    {btnSaveTitle}
                </Button>
            </ButtonLayout>
        </Grid>
    );
};

export default LineDetail;
