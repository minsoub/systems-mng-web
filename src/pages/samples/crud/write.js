import React, { useRef } from 'react';
import { useParams } from 'react-router';
import MUIRichTextEditor from 'mui-rte';
import { useEffect, useState } from 'react';
// material-ui
import { Button, Grid, Typography, OutlinedInput, InputLabel, Stack } from '@mui/material';
import MainCard from 'components/MainCard';
import DefaultButton from 'components/button/DefaultButton';
import { useNavigate } from 'react-router-dom';
import useFetchCrud from 'apis/crud/useFetchCrud';

const Write = () => {
    const refFormData = useRef();
    const { id } = useParams();
    const [responseData, requestError, loading, { actionDetail, actionInsert, actionUpdate }] = useFetchCrud();
    const refEditor = useRef(null);
    const refTitle = useRef();
    const navgate = useNavigate();
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');

    // 취소 버튼 클릭
    const handleCancelButton = () => {
        navgate('/crud/list');
    };

    // onload 아이디가 있는 경우 데이터 조회
    useEffect(() => {
        if (id) {
            actionDetail(id);
        }
    }, []);

    // transaction callBack 처리
    useEffect(() => {
        if (responseData) {
            switch (responseData.transactionId) {
                case 'getData':
                    if (responseData && responseData.data) {
                        if (responseData.data.title) {
                            setSubject(responseData.data.title);
                        }
                        if (responseData.data.content) {
                            setContent(responseData.data.content);
                        }
                        refFormData.current = responseData.data;
                    }
                    break;
                case 'insertData':
                    navgate('/crud/list');
                    break;
                case 'updateData':
                    navgate('/crud/list');
                    break;
                default:
            }
        }
    }, [responseData]);

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            console.log('>> requestError <<');
            alert('error');
        }
    }, [requestError]);

    // 저장 버튼 클릭 -> 에디터 데이터 추출 -> 에디터 콜백함수 실행( <MUIRichTextEditor ... onSave={editorDataCallback} .... )
    const handleSaveButton = () => {
        console.log('handleSaveButton');
        refEditor.current?.save();
    };

    // 에디터 데이터 추출 후 저장
    const editorDataCallback = (editorValue) => {
        console.log('editorDataCallback');
        const title = refTitle.current.value;

        if (refFormData && refFormData.current) {
            const data = refFormData.current;
            data.title = title;
            data.content = editorValue;
            actionUpdate(data);
        } else {
            const data = {
                userId: 'tester',
                order: '1',
                category: '',
                title: title,
                content: editorValue,
                useYn: true,
                customer: 'cust',
                language: 'ko'
            };
            actionInsert(data);
        }
    };

    return (
        <Grid container rowSpacing={2} columnSpacing={0.75}>
            <Grid item xs={12} md={12} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Board Write Sample</Typography>
                    </Grid>
                </Grid>
                <Stack spacing={1}>
                    <InputLabel htmlFor="lastname-signup">Title*</InputLabel>
                    <OutlinedInput
                        fullWidth
                        id="lastname-signup"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        inputRef={refTitle}
                    />
                </Stack>
                <MainCard sx={{ mt: 2, minHeight: 300 }} content={false}>
                    <MUIRichTextEditor label="" onSave={editorDataCallback} inlineToolbar={true} defaultValue={content} ref={refEditor} />
                </MainCard>
            </Grid>
            <Grid item xs={8} md={10} lg={10}></Grid>
            <Grid item xs={2} md={1} lg={1}>
                <DefaultButton buttonType="primary" onButtonClick={handleSaveButton}>
                    Save
                </DefaultButton>
            </Grid>
            <Grid item xs={2} md={1} lg={1}>
                <DefaultButton buttonType="secondary" onButtonClick={handleCancelButton}>
                    cancel
                </DefaultButton>
            </Grid>
        </Grid>
    );
};

export default Write;
