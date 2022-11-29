/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import styles from './styles.module.scss';
const CustomSelectBox = ({ editMode, value, name, change, selectList=[] }) => {
    const [viewValue, setViewValue] = useState('');
    useEffect(() => {
        selectList.map((item) => {
            if (Number(item.value) === value) setViewValue(item.name);
        });
    }, [value, selectList]);
    return editMode ? (
        <Select className={styles.detail_select} name={name} label={name} value={value} onChange={change}>
            {selectList.map((item, index) => {
                return (
                    <MenuItem value={item.value} key={item.value}>
                        {item.name}
                    </MenuItem>
                );
            })}
        </Select>
    ) : (
        <>{viewValue}</>
    )
};

export default CustomSelectBox;
