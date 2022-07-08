import React, { useEffect, useRef, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@mui/styles';
import { Paper } from '@mui/material';
import { TextInput } from './TextInput';
import { MessageLeft, MessageRight } from './message';
import useRSocketClient from 'apis/chat/index';
import ChatApi from 'apis/chat/chatapi';
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

let authData = null;
if (localStorage.hasOwnProperty('authenticated')) {
    //console.log(localStorage.getItem('authenticated'));
    authData = JSON.parse(localStorage.getItem('authenticated'));
    console.log(authData.accessToken);
}

const Chat = (props) => {
    const classes = useStyles();
    const { projectId, children, tabindex, index, ...other } = props;
    const [resData, reqError, loading, { chatExistsAndSave }] = ChatApi();

    const [
        clientError,
        rSocket,
        createClient,
        sendJoinChat,
        connectionClose,
        sendRequestResponse,
        responseData,
        responseError
    ] = useRSocketClient();
    const [messageList, setMessageList] = useState([]);
    //     {
    //         createdDt: '2022-05-14T21:48:11.063',
    //         message:
    //             'Lorem Ipsum refers to text that the DTP (Desktop Publishing) industry use as replacement text when the real text is not',
    //         receiver: 'sendUser',
    //         sender: 'receiveUser'
    //     },
    //     {
    //         createdDt: '2022-05-14T21:48:11.063',
    //         message:
    //             'Lorem Ipsum refers to text that the DTP (Desktop Publishing) industry use as replacement text when the real text is not',
    //         receiver: 'receiveUser',
    //         sender: 'sendUser'
    //     }
    // ]);

    const domMessage = useRef();
    const [message, setMessage] = useState('');

    // 메시지 전송
    const handleSendChat = (data) => {
        // if (rSocket) {
        //     console.log(rSocket);
        //     sendJoinChat('join-chat', projectId);
        // }
        console.log(data);
        const route = 'send-chat-message';
        sendRequestResponse(route, projectId, data);
    };

    useEffect(() => {
        let data = {
            account_id: '',
            site_id: authData.siteId,
            project_id: projectId
        };
        chatExistsAndSave(data);
    }, []);

    useEffect(() => {
        if (!resData) {
            return;
        }
        switch (resData.transactionId) {
            case 'chatExists':
                if (resData.data.data) {
                    console.log(resData.data.data);
                    // ok
                    if (resData.data.data.use === true) {
                        if (!rSocket) createClient(projectId);
                    } else {
                        console.log('chat channer search Error....');
                        if (rSocket) connectionClose();
                    }
                }
                break;
        }
    }, [resData]);

    useEffect(() => {
        if (rSocket) {
            sendJoinChat('join-chat');
        }
    }, [rSocket]);

    // useEffect(() => {
    //     console.log('createClient create...');
    //     if (!rSocket) createClient(projectId);
    // }, [rSocket]);

    // useEffect(() => {
    //     console.log('rSocket is null check....');
    //     // if (rSocket) {
    //     //     console.log('sendJoinChat call....');
    //     //     sendJoinChat('join-chat');
    //     // }
    // }, [rSocket]);

    // // 프로젝트 아이디가 변경되었을 때
    // useEffect(() => {
    //     console.log('[chat] connectionClose check...');
    //     //if (rSocket) {
    //     console.log(rSocket);
    //     connectionClose();
    //     createClient(projectId);
    //     //}
    // }, [projectId]);

    // response 값 처리
    useEffect(() => {
        console.log('get response data: ', responseData);
        //console.log(responseData);
        if (responseData) {
            if (responseData.length) {
                let msg = [];
                responseData.map((item, index) => {
                    let data = {};
                    if (item.role === 'ADMIN') {
                        data = {
                            recevier: 'receiveUser',
                            sender: 'Listing Team',
                            message: item.content,
                            createdDt: item.create_date
                        };
                    } else {
                        data = {
                            recevier: 'Listing Team',
                            sender: item.email,
                            message: item.content,
                            createdDt: item.create_date
                        };
                    }
                    console.log(data);
                    msg.push(data);
                    //setMessageList([...messageList, mDataSend]);
                });
                setMessageList(msg);
            } else {
                let data = {};
                if (responseData.role === 'ADMIN') {
                    data = {
                        recevier: 'receiveUser',
                        sender: 'Listing Team',
                        message: responseData.content,
                        createdDt: responseData.create_date
                    };
                } else {
                    data = {
                        recevier: 'Listing Team',
                        sender: responseData.email,
                        message: responseData.content,
                        createdDt: responseData.create_date
                    };
                }
                console.log(data);
                setMessageList([...messageList, data]);
            }
        }
    }, [responseData]);

    // 에러처리
    useEffect(() => {
        console.log(responseError);
    }, [responseError]);

    return (
        <div className={classes.container}>
            <Paper className={classes.paper} zdepth={2}>
                <Paper id="style-1" className={classes.messagesBody}>
                    {messageList.map((item, idx) => {
                        if (item.sender === 'Listing Team') {
                            return (
                                <MessageRight
                                    key={idx}
                                    message={item.message}
                                    timestamp={item.createdDt}
                                    photoURL=""
                                    displayName={item.sender}
                                    avatarDisp={true}
                                />
                            );
                        } else {
                            return (
                                <MessageLeft
                                    key={idx}
                                    message={item.message}
                                    timestamp={item.createdDt}
                                    photoURL=""
                                    displayName={item.sender}
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
