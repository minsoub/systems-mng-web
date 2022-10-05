import React, { useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';
import '../styles.scss';
import ButtonLayout from '../../Common/ButtonLayout';
import InputLayout from '../../Common/InputLayout';
import FlexBox from 'components/Common/FlexBox/index';

export const Index = ({ sendChat }) => {
    const [value, setValue] = useState('');
    const sendData = () => {
        if (value) {
            let data = value;
            sendChat(data);
            setValue('');
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
                <FlexBox sx={{ justifyContent: 'space-between' }}>
                    <textarea rows="5" id="standard-text" label="텍스트 입력" value={value} onChange={handleChange} />

                    <ButtonLayout>
                        <Button variant="contained" color="primary" size="medium" className="button" onClick={sendData}>
                            전송
                        </Button>
                    </ButtonLayout>
                </FlexBox>
            </Grid>
        </>
    );
};
