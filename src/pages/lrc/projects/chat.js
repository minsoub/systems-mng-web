import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useRSocketClient from 'apis/chat/index';
import ChatApi from 'apis/chat/chatapi';
import MessageLeft from 'components/Chat/MessageLeft';
import MessageRight from 'components/Chat/MessageRight';
import ChattingRoom from 'components/Chat/ChattingRoom';
import { Box, Button, FormControl, Grid, Tab, Table, TableBody, TableCell, TableRow, Tabs, TextField, Typography } from '@mui/material';

const Chat = (props) => {
    const { projectId, children, tabindex, index, ...other } = props;
    const [resData, reqError, loading, { chatExistsAndSave, deleteChat, chatExcelDownload }] = ChatApi();
    const { siteId } = useSelector((state) => state.auth);
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
    const searchClick = () => {};

    // 내역 다운로드
    const excelDownload = () => {
        chatExcelDownload(projectId);
    };

    return (
        <div className="chatting--container">
            <Table fixedHeader={false} style={{ width: '100%', tableLayout: 'auto' }} stickyHeader aria-label="simple table">
                <TableRow>
                    <TableCell component="th" scope="row">
                        <a href="#" onClick={excelDownload}>
                            내역 다운로드
                        </a>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        <TextField id="symbol" name="symbol" inputRef={refKeyword} type="text" />
                    </TableCell>
                    <TableCell align="right" component="th" scope="row">
                        <FormControl sx={{ m: 0 }} size="small">
                            <Button disableElevation size="small" type="submit" variant="contained" color="secondary" onClick={searchClick}>
                                검색
                            </Button>
                        </FormControl>
                    </TableCell>
                </TableRow>
            </Table>
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
