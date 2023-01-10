import React, { useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';
import { Button, Grid, TextField, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import '../styles.scss';
import ButtonLayout from '../../Common/ButtonLayout';
import InputLayout from '../../Common/InputLayout';
import FlexBox from 'components/Common/FlexBox/index';

export const Index = forwardRef(({ sendChat, sendMail }, ref) => {
    const editorRef = useRef(null);
    const [value, setValue] = useState('');
    const [emailValue, setEmailValue] = useState('');

    const config = {
        language: 'ko',
        readonly: false,
        placeholder: '무엇이든 입력하세요..',
        enableDragAndDropFileToEditor: true,
        imageDefaultWidth: null,
        width: '100%',
        height: 188,
        minHeight: 100,
        buttons: [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            '|',
            'ul',
            'ol',
            '|',
            'font',
            'fontsize',
            'paragraph',
            '|',
            'table',
            'link',
            'brush'
        ]
    };
    const sendData = () => {
        if (value) {
            let data = value;
            sendChat(data);
            setValue('');
        }
    };
    const handleChangeEmail = (e) => {
        setEmailValue(e.target.value);
    };
    const sendEmailData = () => {
        if (emailValue) {
            let emailData = emailValue;
            sendMail(emailData);
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
                <JoditEditor ref={editorRef} value={value} config={config} onBlur={(newContent) => setValue(newContent)} />
                <ButtonLayout style={{ width: '184px' }}>
                    <Button variant="contained" color="primary" size="medium" className="button" onClick={sendData}>
                        전송
                    </Button>
                    <RadioGroup name="sendMail" className="button-box">
                        <FormControlLabel onChange={handleChangeEmail} value="KOR" control={<Radio size="small" />} label="국문 메일" />
                        <FormControlLabel onChange={handleChangeEmail} value="EN" control={<Radio size="small" />} label="영문 메일" />
                    </RadioGroup>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="medium"
                        className="button-mail"
                        onClick={() => {
                            sendEmailData(emailValue);
                        }}
                    >
                        알림 메일 발송하기
            </Grid>
        </>
    );
};
