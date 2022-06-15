import React, { useEffect, useState } from 'react';
// material-ui
import { Button } from '@mui/material';
import { SettingsOutlined, SettingsPowerRounded } from '../../node_modules/@mui/icons-material/index';
import MainCard from './MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Collapse, Alert, AlertTitle } from '@mui/material';

const ErrorScreen = ({ open, errorTitle, errorMessage }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const errorClear = () => {
        setTitle('');
        setMessage('');
        setIsOpen(false);
    };

    useEffect(() => {
        if (errorTitle) {
            setTitle(errorTitle);
        }
        if (errorMessage) {
            setMessage(errorMessage);
        }
        setIsOpen(open);
        console.log(open);
    }, [open, errorTitle, errorMessage]);

    return (
        <>
            <MainCard sx={{ mt: 3 }} content={false}>
                <Collapse in={isOpen}>
                    <Alert
                        severity="error"
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    errorClear();
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                    >
                        <AlertTitle>{title}</AlertTitle>
                        {message}
                    </Alert>
                </Collapse>
            </MainCard>
        </>
    );
};

export default ErrorScreen;
