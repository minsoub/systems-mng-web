import React, { useEffect, useRef, useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';
import JoditEditor from 'jodit-react';
import '../styles.scss';
import ButtonLayout from '../../Common/ButtonLayout';
import InputLayout from '../../Common/InputLayout';
import FlexBox from 'components/Common/FlexBox/index';

export const Index = ({ sendChat }) => {
    const editorRef = useRef(null);
    const [value, setValue] = useState('');

    const config = {
        language: 'ko',
        readonly: false,
        placeholder: '내용을 입력하세요.',
        enableDragAndDropFileToEditor: true,
        imageDefaultWidth: null,
        width: '100%',
        height: 300
    };

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
                {/*<textarea rows="5" id="standard-text" label="텍스트 입력" value={value} onChange={handleChange} />*/}
                <JoditEditor ref={editorRef} value={value} config={config} onBlur={(newContent) => setValue(newContent)} />
                <ButtonLayout style={{ width: '100%', justifyContent: 'center', marginTop: 30 }}>
                    <Button variant="contained" color="primary" size="medium" className="button" onClick={sendData}>
                        전송하기
                    </Button>
                </ButtonLayout>
            </Grid>
        </>
    );
};
