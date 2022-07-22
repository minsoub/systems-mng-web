import React from 'react';
import { Button } from '@mui/material';

const DefaultButton = ({ buttonType, onButtonClick, children }) => {
    return (
        <Button
            disableElevation
            disabled={false}
            fullWidth
            size="medium"
            type="button"
            variant="contained"
            color={buttonType}
            onClick={onButtonClick}
        >
            {children}
        </Button>
    );
};

export default DefaultButton;
