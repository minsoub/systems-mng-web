import React, { useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';
import '../styles.scss';
import ButtonLayout from '../../Common/ButtonLayout';
import InputLayout from '../../Common/InputLayout';

export const Index = ({ sendChat }) => {
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
            <Grid className="chat-message">
                <InputLayout>
                    <TextField
                        id="standard-text"
                        label="채팅입력"
                        size="small"
                        className="wrapText"
                        value={value}
                        onChange={handleChange}
                        //margin="normal"
                        onKeyDown={keyPress}
                    />
                    <ButtonLayout>
                        <Button variant="contained" color="primary" size="medium" className="button" onClick={sendData}>
                            전송
                        </Button>
                    </ButtonLayout>
                </InputLayout>
            </Grid>
        </>
    );
};
