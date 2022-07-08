import React, { useEffect, useState } from 'react';
import { TextField, Button, FormControl, Grid } from '@mui/material';
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
        console.log(e.keyCode);
        if (e.keyCode === 13) {
            sendData();
        }
    };

    return (
        <>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid container spacing={0} sx={{ mt: 0 }}>
                    <Grid item xs={8} sm={10}>
                        <TextField
                            id="standard-text"
                            label="채팅입력"
                            size="small"
                            className={classes.wrapText}
                            value={value}
                            onChange={handleChange}
                            //margin="normal"
                            onKeyDown={keyPress}
                        />
                    </Grid>
                    <Grid item xs={8} sm={0.1}></Grid>
                    <Grid item xs={8} sm={1}>
                        <FormControl sx={{ m: 0, minHeight: 25 }} size="small">
                            <Button variant="contained" color="primary" size="small" className={classes.button} onClick={sendData}>
                                전송
                            </Button>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>

            {/* <FormControl sx={{ m: 0 }} size="small">
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
            </FormControl> */}
        </>
    );
};
