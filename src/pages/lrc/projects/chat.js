import React, { useEffect, useRef, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@mui/styles';
import { Paper } from '@mui/material';
import { TextInput } from './TextInput';
import { MessageLeft, MessageRight } from './message';
import useRSocketClient from 'apis/chat/index';

const useStyles = makeStyles((theme) =>
    createStyles({
        paper: {
            width: '80vw',
            height: '80vh',
            maxWidth: '500px',
            maxHeight: '700px',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            position: 'relative'
        },
        paper2: {
            width: '80vw',
            maxWidth: '500px',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            position: 'relative'
        },
        container: {
            width: '400',
            //height: '50vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        messagesBody: {
            width: 'calc( 100% - 20px )',
            margin: 10,
            overflowY: 'scroll',
            height: 'calc( 100% - 80px )'
        }
    })
);

const Chat = (props) => {
    const classes = useStyles();
    const { projectId, children, tabindex, index, ...other } = props;
    const [clientError, sendRequestResponse, responseData, responseError] = useRSocketClient();
    const [messageList, setMessageList] = useState([
        {
            createdDt: '2022-05-14T21:48:11.063',
            message:
                'Lorem Ipsum refers to text that the DTP (Desktop Publishing) industry use as replacement text when the real text is not',
            receiver: 'sendUser',
            sender: 'receiveUser'
        },
        {
            createdDt: '2022-05-14T21:48:11.063',
            message:
                'Lorem Ipsum refers to text that the DTP (Desktop Publishing) industry use as replacement text when the real text is not',
            receiver: 'receiveUser',
            sender: 'sendUser'
        }
    ]);

    const domMessage = useRef();
    const [message, setMessage] = useState('');

    // 메시지 전송
    const handleSendChat = (data) => {
        console.log(data);
        const route = 'message';
        sendRequestResponse(route, data);
    };

    // response 값 처리
    useEffect(() => {
        console.log('get response data: ', responseData);
        if (responseData) {
            const mDataSend = { recevier: 'receiveUser', sender: 'sendUser', message: responseData, createdDt: '2022-05-14T21:48:11.063' };
            console.log(mDataSend);
            setMessageList([...messageList, mDataSend]);
        }
    }, [responseData]);

    // response Error 처리
    useEffect(() => {
        if (clientError || responseError) {
            console.log('Fail');
        }
    }, [clientError, responseError]);

    return (
        <div className={classes.container}>
            <Paper className={classes.paper} zdepth={2}>
                <Paper id="style-1" className={classes.messagesBody}>
                    {messageList.map((item, idx) => {
                        if (item.sender === 'sendUser') {
                            return (
                                <MessageLeft
                                    message="상장 신청하려고 파일을 업로드하려고 합니다."
                                    timestamp="2022.02.01 11:10"
                                    photoURL=""
                                    displayName="minsoub"
                                    avatarDisp={true}
                                />
                            );
                        } else {
                            return (
                                <MessageLeft
                                    message="상장 신청서 업로드했습니다."
                                    timestamp="2022.02.01 11:10"
                                    photoURL=""
                                    displayName="minsoub"
                                    avatarDisp={false}
                                />
                            );
                        }
                    })}
                    {/* 
                    <MessageRight
                        message="업로드 확인하였습니다."
                        timestamp="2022.02.01 11:10"
                        photoURL=""
                        displayName="Listing Team"
                        avatarDisp={true}
                    />
                    <MessageRight
                        message="서류 검토는 최소 5일정도 소요될 수 있습니다."
                        timestamp="2022.02.01 11:10"
                        photoURL=""
                        displayName="Listing Team"
                        avatarDisp={false}
                    /> */}
                </Paper>
                <TextInput sendChat={handleSendChat} />
            </Paper>
        </div>
    );
};

export default Chat;
