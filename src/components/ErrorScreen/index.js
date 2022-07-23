import React, { useEffect, useState } from 'react';
// material-ui
import { Alert, AlertTitle, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentLine from '../Common/ContentLine';

const ErrorScreen = ({ open, errorTitle, errorMessage, parentErrorClear }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const errorClear = () => {
        setTitle('');
        setMessage('');
        setIsOpen(false);
        parentErrorClear();
    };

    useEffect(() => {
        console.log('called ErrorScan...1');
        console.log(open);
        setIsOpen(open);
    }, [open]);

    useEffect(() => {
        console.log('called ErrorScan...2');
        if (errorTitle) {
            setTitle(errorTitle);
        }
        if (errorMessage) {
            setMessage(errorMessage);
        }
    }, [errorTitle, errorMessage]);

    return (
        <ContentLine>
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
        </ContentLine>
    );
};

export default ErrorScreen;
