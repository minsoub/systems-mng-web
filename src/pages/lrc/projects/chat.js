import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import useRSocketClient from 'apis/chat/index';
import ChatApi from 'apis/chat/chatapi';
import MessageLeft from 'components/Chat/MessageLeft';
import MessageRight from 'components/Chat/MessageRight';
import ChattingRoom from 'components/Chat/ChattingRoom';
import { Button, FormControl, TextField } from '@mui/material';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import DownloadIcon from '@mui/icons-material/Download';

const Chat = (props) => {
    const { projectId, children, tabindex, index, ...other } = props;
    const [resData, reqError, loading, { chatExistsAndSave, deleteChat, chatExcelDownload }] = ChatApi();
    const { siteId } = useSelector((state) => state.auth);
    const [clientError, rSocket, createClient, sendJoinChat, connectionClose, sendRequestResponse, responseData, responseError] =
        useRSocketClient();
    // 가짜 데이터
    const [messageList, setMessageList] = useState([]);

    const domMessage = useRef();
    const [message, setMessage] = useState('');

    const refKeyword = useRef(); // < HTMLInputElement > null;

    useEffect(() => {
        let data = {
            account_id: '',
            site_id: siteId,
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
            case 'deleteChatMessage':
                if (resData.data.data) {
                    console.log(resData.data.data);
                    if (resData.data.data.use === true) {
                        setMessageList([]);
                        sendJoinChat('join-chat');
                    }
                }
                break;
            case 'getExcel':
                if (resData.data) {
                    let res = resData;
                    console.log('res data....');
                    console.log(res);
                    console.log(res.fileName);
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'ChatMessage.xlsx');
                    link.style.cssText = 'display:none';
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
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
                            id: item.id,
                            recevier: 'receiveUser',
                            sender: 'Listing Team',
                            message: item.content,
                            createdDt: item.create_date
                        };
                    } else {
                        data = {
                            id: item.id,
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
                        id: responseData.id,
                        recevier: 'receiveUser',
                        sender: 'Listing Team',
                        message: responseData.content,
                        createdDt: responseData.create_date
                    };
                } else {
                    data = {
                        id: responseData.id,
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

    const deleteChatMessage = (id) => {
        console.log(id);
        deleteChat(id);
    };
    const searchClick = () => {
        console.log(refKeyword.current.value);
        if (refKeyword.current.value) {
            // message에서 단어 포함 검색해서 <b>처리한다.
            let list = messageList;
            list.map((item, index) => {
                if (item.message.includes(refKeyword.current.value) && !item.message.includes('<b>')) {
                    console.log('find...');
                    item.message = item.message.replace(refKeyword.current.value, `<b>${refKeyword.current.value}</b>`);
                    console.log(item.message);
                }
            });
            console.log(list);
            setMessageList([]);
            setMessageList(list);
        }
    };

    // 내역 다운로드
    const excelDownload = () => {
        chatExcelDownload(projectId);
    };

    return (
        <div className="chatting--container">
            <ButtonLayout>
                <button type="button" color="primary" className="list__download" onClick={excelDownload}>
                    <DownloadIcon /> 내역 다운로드
                </button>
                <FormControl sx={{ minWidth: 250, boxSizing: 'border-box', marginRight: '0.5rem' }} size="medium">
                    <TextField id="symbol" name="symbol" inputRef={refKeyword} type="text" />
                </FormControl>

                <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={searchClick}>
                    검색
                </Button>
            </ButtonLayout>

            <ChattingRoom sendMessage={sendRequest}>
                {messageList.map((item, idx) => {
                    if (item.sender === 'Listing Team') {
                        return (
                            <MessageRight
                                key={idx}
                                id={item.id}
                                message={item.message}
                                timestamp={item.createdDt}
                                displayName={item.sender}
                                deleteChatMessage={deleteChatMessage}
                            />
                        );
                    } else {
                        return (
                            <MessageLeft
                                key={idx}
                                id={item.id}
                                message={item.message}
                                timestamp={item.createdDt}
                                displayName={item.sender}
                            />
                        );
                    }
                })}
            </ChattingRoom>
        </div>
    );
};

export default Chat;
