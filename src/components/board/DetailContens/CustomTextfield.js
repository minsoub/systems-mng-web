import { useEffect, useState } from 'react';
import { TextField } from '@mui/material';

// library
import PropTypes from 'prop-types';

// =============|| DetailContens - CustomTextfield ||============= //

const CustomTextfield = ({ typeNum, editMode, value, name, change, holder, accessWap }) => {
    const [isDisAble, setIsDisAble] = useState(false);

    useEffect(() => {
        if (accessWap.indexOf(Number(typeNum)) > -1) {
            setIsDisAble(false);
        } else {
            setIsDisAble(true);
        }
    }, [typeNum]);

    return editMode ? (
        <TextField disabled={isDisAble} type="text" size="small" value={value} name={name} onChange={change} placeholder={holder} fullWidth />
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
