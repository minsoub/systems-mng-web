import { useEffect, useState } from 'react';
import { TextField } from '@mui/material';

// library
import PropTypes from 'prop-types';

// =============|| DetailContens - CustomTextfield ||============= //

const CustomTextfield = ({ typeNum, editMode, value, name, change, holder, accessWap }) => {
    const [isDisAble, setIsDisAble] = useState(false);

    useEffect(() => {
        if (accessWap.indexOf(typeNum) > -1) {
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
    typeNum: 'DEFAULT',
    accessWap: ['DEFAULT']
};

CustomTextfield.propTypes = {
    typeNum: PropTypes.string,
    editMode: PropTypes.bool,
    value: PropTypes.string,
    name: PropTypes.string,
    change: PropTypes.func,
    holder: PropTypes.string,
    accessWap: PropTypes.array
};
