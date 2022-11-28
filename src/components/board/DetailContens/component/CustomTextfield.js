/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
const CustomTextfield = ({ typeNum=0, editMode, value, name, change, holder, accessWap=[0] }) => {
    const [filedAble, setFiledAbled] = useState(false);
    useEffect(() => {
        // console.log(typeNum, accessWap.indexOf(Number(typeNum)));
        // eslint-disable-next-line react/prop-types
        if (accessWap.indexOf(Number(typeNum)) > -1) {
            setFiledAbled(false);
        } else {
            setFiledAbled(true);
        }
    }, [typeNum]);
    return editMode ? (
        filedAble ? (
            <TextField disabled type="text" size="small" value={value} name={name} onChange={change} placeholder={holder} fullWidth />
        ) : (
            <TextField type="text" size="small" value={value} name={name} onChange={change} placeholder={holder} fullWidth />
        )
    ) : (
        <>{value}</>
    );
};

export default CustomTextfield;
