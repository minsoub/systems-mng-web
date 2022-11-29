/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
const CustomTextfield = ({ typeNum=0, editMode, value, name, change, holder, accessWap=[0] }) => {
    const [disAble, setDisAble] = useState(false);
    useEffect(() => {
        // console.log(typeNum, accessWap.indexOf(Number(typeNum)));
        // eslint-disable-next-line react/prop-types
        if (accessWap.indexOf(Number(typeNum)) > -1) {
            setDisAble(false);
        } else {
            setDisAble(true);
        }
    }, [typeNum]);
    return editMode ? (
        <TextField disabled={disAble} type="text" size="small" value={value} name={name} onChange={change} placeholder={holder} fullWidth />
    ) : (
        <>{value}</>
    );
};

export default CustomTextfield;
