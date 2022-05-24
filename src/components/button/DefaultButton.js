import React from 'react';
import AnimateButton from 'components/@extended/AnimateButton';
// material-ui
import { Button } from '@mui/material';

const DefaultButton = ({ buttonType, onButtonClick, children }) => {
    return (
        <>
            <AnimateButton>
                <Button
                    disableElevation
                    disabled={false}
                    fullWidth
                    size="small"
                    type="button"
                    variant="contained"
                    color={buttonType}
                    onClick={onButtonClick}
                >
                    {children}
                </Button>
            </AnimateButton>
        </>
    );
};

export default DefaultButton;
