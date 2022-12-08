import { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';
const CustomTextfield = ({ typeNum, editMode, value, name, change, holder, accessWap }) => {
    const [disAble, setDisAble] = useState(false);
    useEffect(() => {
        // console.log(typeNum, accessWap.indexOf(Number(typeNum)));
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
CustomTextfield.defaultProps = {
    typeNum: 0,
    accessWap: [0]
};

CustomTextfield.propTypes = {
    typeNum: PropTypes.number,
    editMode: PropTypes.bool,
    value: PropTypes.string,
    name: PropTypes.string,
    change: PropTypes.func,
    holder: PropTypes.string,
    accessWap: PropTypes.array
};
