import React, { useEffect, useRef, useState } from 'react';
import useRSocketClient from 'apis/chat/index';
import ChatApi from 'apis/chat/chatapi';
import MessageLeft from 'components/Chat/MessageLeft';
import MessageRight from 'components/Chat/MessageRight';
import ChattingRoom from 'components/Chat/ChattingRoom';

let authData = null;
if (localStorage.hasOwnProperty('authenticated')) {
    //console.log(localStorage.getItem('authenticated'));
    authData = JSON.parse(localStorage.getItem('authenticated'));
    console.log(authData.accessToken);
}

const Chat = (props) => {
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
    // 가짜 데이터
    const [messageList, setMessageList] = useState([
        {
            createdDt: '2022-05-14T21:48:11.063',
            message:
                'Lorem Ipsum refers to text that the DTP (Desktop Publishing) industry use as replacement text when the real text is not',
            receiver: 'test Team',
            sender: 'Listing Team'
        },
        {
            createdDt: '2022-05-14T21:48:11.063',
            message: 'Lorem Ipsum refers tt',
            receiver: 'receiveUser',
            sender: 'sendUser'
        },
        {
            createdDt: '2022-05-14T21:48:11.063',
            message: 'Lorem Ipsum refers1 ',
            receiver: 'test Team',
            sender: 'Listing Team'
        },
        {
            createdDt: '2022-05-14T21:48:11.063',
            message: 'Lorem Ipsum refersdfafasfsadf ',
            receiver: 'test Team',
            sender: 'Listing Team'
        },
        {
            createdDt: '2022-05-14T21:48:11.063',
            message: 'Lorem Ipsum refers ',
            receiver: 'test Team',
            sender: 'Listing Team'
        },
        {
            createdDt: '2022-05-14T21:48:11.063',
            message: 'Lorem Ipsum refers afdasfsafasfsaf',
            receiver: 'test Team',
            sender: 'Listing Team'
        },
        {
            createdDt: '2022-05-14T21:48:11.063',
            message: 'Lorem Ipsum refers afadsfasdfasf',
            receiver: 'test Team',
            sender: 'Listing Team'
        }
    ]);

    const domMessage = useRef();
    const [message, setMessage] = useState('');

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

    // response 값 처리
    useEffect(() => {
        console.log('get response data: ', responseData);
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

    // 메시지 전송 Text 박스
    const sendRequest = (data) => {
        // if (rSocket) {
        //     console.log(rSocket);
        //     sendJoinChat('join-chat', projectId);
        // }
        console.log(data);
        const route = 'send-chat-message';
        sendRequestResponse(route, projectId, data);
    };

    return (
        <div className="chatting--container">
            <ChattingRoom sendMessage={sendRequest}>
                {messageList.map((item, idx) => {
                    if (item.sender === 'Listing Team') {
                        return <MessageRight key={idx} message={item.message} timestamp={item.createdDt} displayName={item.sender} />;
                    } else {
                        return <MessageLeft key={idx} message={item.message} timestamp={item.createdDt} displayName={item.sender} />;
                    }
                })}
            </ChattingRoom>
        </div>
    );
};

export default Chat;
