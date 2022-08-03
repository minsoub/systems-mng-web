import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useSelector } from 'react-redux';
import useRSocketClient from 'apis/chat/index';
import ChatApi from 'apis/chat/chatapi';
import MessageLeft from 'components/Chat/MessageLeft';
import MessageRight from 'components/Chat/MessageRight';
import ChattingRoom from 'components/Chat/ChattingRoom';
import { Button, FormControl, TextField } from '@mui/material';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import DownloadIcon from '@mui/icons-material/Download';
import jwt from 'jsonwebtoken';
import { nl2brToString } from 'utils/CommonUtils';
import { Index } from '../../../components/Chat/TextInput';
const Chat = forwardRef((props, ref) => {
    const { projectId, fileList, fileDownload, children, tabindex, index, ...other } = props;
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

    useImperativeHandle(ref, () => ({
        sendRequest,
        getMailSendAddress
    }));
    // 가짜 데이터
    const [messageList, setMessageList] = useState([]);
    const refChatArea = useRef(null);

    const domMessage = useRef();
    const [message, setMessage] = useState('');

    const refKeyword = useRef(); // < HTMLInputElement > null;

    let searchPosNow = 0;
    let prevSearchKeyword = '';
    let sendMailaddress = '';

    const getMailSendAddress = () => {
        return sendMailaddress;
    };

    const initChatScroll = () => {
        // 채팅영역 스크롤
        console.log('initChatScroll called...');
        if (refChatArea.current) {
            console.log('refChatArea current...');
            refChatArea.current.scrollTop = refChatArea.current.scrollHeight;
        }
        // // 첨부파일 스크롤
        // if (refFileArea.current) {
        //     refFileArea.current.scrollTop = refFileArea.current.scrollHeight;
        // }
    };

    useEffect(() => {
        let authData = null;
        if (localStorage.hasOwnProperty('authenticated')) {
            authData = JSON.parse(localStorage.getItem('authenticated'));
            let decodePayload = jwt.decode(authData.accessToken);
            console.log(decodePayload);
            let data = {
                account_id: decodePayload.account_id,
                site_id: siteId,
                project_id: projectId
            };
            console.log(data);
            chatExistsAndSave(data);
        }
        prevSearchKeyword = '';
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
                        // setMessageList([]);
                        // sendJoinChat('join-chat');
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
        if (!responseData) return;

        if (responseData) {
            if (responseData.length > 1) {
                console.log('here');
                let msg = [];
                let data = {};
                responseData.map((item, index) => {
                    let data = {};

                    if (item.role === 'ADMIN') {
                        data = {
                            id: item.id,
                            recevier: 'receiveUser',
                            sender: 'Listing Team',
                            message: item.content,
                            createdDt: item.create_date,
                            fileKey: '',
                            fileName: '',
                            fileSize: '',
                            fileType: ''
                        };
                    } else {
                        data = {
                            id: item.id,
                            recevier: 'Listing Team',
                            sender: item.email,
                            message: item.content,
                            createdDt: item.create_date,
                            fileKey: '',
                            fileName: '',
                            fileSize: '',
                            fileType: ''
                        };
                        sendMailaddress = item.email;
                        console.log('>> found sendMail address : %s', sendMailaddress);
                    }
                    console.log(data);
                    if (item.content.indexOf('FILE_MESSAGE::') === 0) {
                        const fileKey = item.content.replace('FILE_MESSAGE::', '');
                        const fileInfo = fileList.find((file) => {
                            return file.id === fileKey;
                        });
                        if (fileInfo) {
                            data.fileKey = fileInfo.id;
                            data.fileName = fileInfo.file_name;
                            data.fileSize = fileInfo.file_size;
                            data.fileType = fileInfo.file_type;
                            data.message = `첨부파일 : ${data.fileName}`;
                        }
                    }
                    msg.push(data);
                    //setMessageList([...messageList, mDataSend]);
                });
                setMessageList(msg);
            } else {
                if (responseData.id) {
                    console.log('called....');
                    let data = {};
                    if (responseData.role === 'ADMIN') {
                        data = {
                            id: responseData.id,
                            recevier: 'receiveUser',
                            sender: 'Listing Team',
                            message: responseData.content,
                            createdDt: responseData.create_date,
                            fileKey: '',
                            fileName: '',
                            fileSize: '',
                            fileType: ''
                        };
                    } else {
                        data = {
                            id: responseData.id,
                            recevier: 'Listing Team',
                            sender: responseData.email,
                            message: responseData.content,
                            createdDt: responseData.create_date,
                            fileKey: '',
                            fileName: '',
                            fileSize: '',
                            fileType: ''
                        };
                        sendMailaddress = responseData.email;
                    }
                    let item = responseData.content;
                    if (item.indexOf('FILE_MESSAGE::') === 0) {
                        const fileKey = item.replace('FILE_MESSAGE::', '');
                        const fileInfo = fileList.find((file) => {
                            return file.id === fileKey;
                        });
                        if (fileInfo) {
                            data.fileKey = fileInfo.id;
                            data.fileName = fileInfo.file_name;
                            data.fileSize = fileInfo.file_size;
                            data.fileType = fileInfo.file_type;
                            data.message = `첨부파일 : ${data.fileName}`;
                        }
                    }
                    console.log(data);
                    setMessageList([...messageList, data]);
                }
            }
        }
    }, [responseData]);

    // 에러처리
    useEffect(() => {
        console.log(responseError);
    }, [responseError]);

    useEffect(() => {
        initChatScroll();
    }, [messageList]);

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
        messageList.map((item, idx) => {
            if (id === item.id) {
                setMessageList((prevRows) => [...prevRows.slice(0, idx), ...prevRows.slice(idx + 1)]);
                return;
            }
        });
    };
    const searchClick = () => {
        console.log(refKeyword.current.value);
        const keyword = refKeyword.current.value;

        if (refKeyword.current.value === '') {
            setClearSearchHighlight();
            return;
        }
        if (prevSearchKeyword === keyword) {
            searchPosNow += 1;
        } else {
            setClearSearchHighlight();
            searchPosNow = 0;
            prevSearchKeyword = keyword;
        }

        setSearchItemPos(keyword);
    };

    const setSearchItemPos = (keyword) => {
        let checker = 0;
        let matchCount = 0;

        const comments = document.querySelectorAll('.message');

        comments.forEach((item) => {
            //console.log(item);
            const comment = item.innerHTML;
            //console.log(comment);
            if (comment.indexOf(keyword) !== -1) {
                //console.log(item.getAttribute('data-message-id'));
                //console.log('found keyword');
                //console.log(comment);
                if (comment.indexOf('<em') === -1) {
                    item.innerHTML = nl2brToString(comment.replaceAll(keyword, `<em class="kwd">${keyword}</em>`));
                }

                /* 포커스 이동 처리 */
                const article = item.parentElement; // ?.parentElement.parentElement.parentElement;
                console.log(article);
                const top = article.offsetTop;
                console.log(refChatArea.current);
                console.log(
                    'top : %s, current scrollHeight : %s, current scrollTop : %s',
                    top,
                    refChatArea.current.scrollHeight,
                    refChatArea.current.scrollTop
                );
                if (searchPosNow === checker) {
                    // 해당 위치로 스크롤바 이동
                    console.log('found here...');
                    refChatArea.current.scrollTo(0, top - 300);
                }
                matchCount += 1;
                checker += 1;
            } else {
                console.log(comment);
                item.innerHTML = nl2brToString(comment);
            }
        });

        /* 마지막라인까지 검색이 끝나면 초기화하여 다시 검색할 수 있도록 한다. */
        if (searchPosNow + 1 >= matchCount) {
            prevSearchKeyword = '';
        }
    };

    // 검색 하일라이트 초기화
    const setClearSearchHighlight = () => {
        const comments = document.querySelectorAll('.message');
        // clear
        comments.forEach((item) => {
            let key = item.getAttribute('data-message-id');
            messageList.map((data, index) => {
                if (data.id === key) {
                    item.innerHTML = nl2brToString(data.message);
                }
            });
        });
        prevSearchKeyword = '';
        searchPosNow = 0;
    };

    // 내역 다운로드
    const excelDownload = () => {
        chatExcelDownload(projectId);
    };

    // 메시지 전송 Text 박스
    const handleSendChat = (data) => {
        console.log(data);
        sendRequest(data);
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
            <div className="chat--room">
                <div className="chat--room__box" id="scrollId" ref={refChatArea}>
                    <ChattingRoom>
                        {messageList.length > 0 &&
                            messageList.map((item, idx) => {
                                const key = `key_${idx}`;
                                if (item.sender === 'Listing Team') {
                                    return (
                                        <MessageRight
                                            key={item.id}
                                            id={item.id}
                                            message={item}
                                            timestamp={item.createdDt}
                                            displayName={item.sender}
                                            fileList={fileList}
                                            fileDownload={fileDownload}
                                            deleteChatMessage={deleteChatMessage}
                                        />
                                    );
                                } else {
                                    return (
                                        <MessageLeft
                                            key={item.id}
                                            id={item.id}
                                            message={item}
                                            timestamp={item.createdDt}
                                            displayName={item.sender}
                                            fileList={fileList}
                                            fileDownload={fileDownload}
                                        />
                                    );
                                }
                            })}
                    </ChattingRoom>
                </div>
                <Index sendChat={handleSendChat} />
            </div>
        </div>
    );
});

export default Chat;
