import React, { useRef } from 'react';
import { useParams } from 'react-router';
import MUIRichTextEditor from 'mui-rte';
import { useEffect, useState } from 'react';

// material-ui
import { Button, Grid, Typography, OutlinedInput, InputLabel, Stack } from '@mui/material';
import MainCard from 'components/MainCard';
import DefaultButton from 'components/button/DefaultButton';
import { useNavigate } from 'react-router-dom';
import axiosInstanceDefault from '../../../apis/axiosDefault';
import useAxios from '../../../apis/useAxios';

const Write = () => {
    const { id } = useParams();
    const [responseData, requestError, loading, callApi] = useAxios();
    const refEditor = useRef(null);
    const refTitle = useRef();
    const navgate = useNavigate();
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');

    const handleSaveButton = () => {
        refEditor.current?.save();
    };

    // 데이터 등록
    const insertCrudData = (data) => {
        const title = refTitle.current.value;
        const postData = {
            userId: 'tester',
            order: '1',
            category: '',
            title: title,
            content: data,
            useYn: true,
            customer: 'cust',
            language: 'ko'
        };
        callApi('insertData', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: '/faq_content',
            requestConfig: postData
        });
    };

    // 데이터 상세 조회
    const getCrudData = (id) => {
        callApi('getData', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/faq_content/${id}`,
            requestConfig: {}
        });
    };

    // 에디터 데이터 추출 후 저장
    const editorDataCallback = (data) => {
        insertCrudData(data);
    };

    // 취소 버튼 클릭
    const handleCancelButton = () => {
        navgate(-1);
    };

    // onload 아이디가 있는 경우 데이터 조회
    useEffect(() => {
        if (id) {
            getCrudData(id);
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
                    }
                    break;
                case 'insertData':
                    navgate('/crud/list');
                    break;
                case 'modifyData':
                    navgate('/crud/list');
                    break;
                default:
            }
        }
    }, [responseData]);

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
