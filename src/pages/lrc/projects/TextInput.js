import React, { useEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';
import { createStyles, makeStyles, Theme } from '@mui/styles';
//import SendIcon from '@mui/icons-material';

const useStyles = makeStyles((theme) =>
    createStyles({
        wrapForm: {
            display: 'flex',
            justifyContent: 'center',
            width: '95%',
            margin: `${theme.spacing(0)} auto`
        },
        wrapText: {
            width: '100%'
        },
        button: {
            //margin: theme.spacing(1),
        }
    })
);

export const TextInput = ({ sendChat }) => {
    const classes = useStyles();
    const [value, setValue] = useState('');
    const sendData = () => {
        if (value) {
            sendChat(value);
        }
    };
    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const keyPress = (e) => {
        if (e.keyCode === 13) {
            sendData();
        }
    };

    return (
        <>
            <form className={classes.wrapForm} noValidate autoComplete="off">
                <TextField
                    id="standard-text"
                    label="채팅입력"
                    className={classes.wrapText}
                    value={value}
                    onChange={handleChange}
                    //margin="normal"
                    onKeyDown={keyPress}
                />
                <Button variant="contained" color="primary" className={classes.button} onClick={sendData}>
                    전송
                </Button>
            </form>
        </>
    );
};
