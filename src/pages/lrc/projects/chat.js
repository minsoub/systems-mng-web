import React, { useCallback, useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useSelector } from 'react-redux';
import useRSocketClient from 'apis/chat/index';
import ChatApi from 'apis/chat/chatapi';
import MessageLeft from 'components/Chat/MessageLeft';
import MessageRight from 'components/Chat/MessageRight';
import ChattingRoom from 'components/Chat/ChattingRoom';
import { Button, Box, TextField, Typography, IconButton } from '@mui/material';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import DownloadIcon from '@mui/icons-material/Download';
import { MailOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import jwt from 'jsonwebtoken';
import { nl2brToString } from 'utils/CommonUtils';
import { Index } from 'components/Chat/TextInput';
import { getDateFormatSecond } from 'utils/CommonUtils';
import FlexBox from 'components/Common/FlexBox/index';
import FoundationApi from 'apis/lrc/project/foundationapi';

const Chat = forwardRef((props, ref) => {
    const { projectId, fileList, fileDownload, chatStart, fileSearch, children, tabindex, index, ...other } = props;
    const [resData, reqError, loading, { chatExistsAndSave, deleteChat, chatExcelDownload, getChatList, postCreateChat }] = ChatApi();
    const [responseDataC, requestError, loadingData, { sendEmailToProjectUser }] = FoundationApi();
    const { siteId } = useSelector((state) => state.auth);
    // const [
    //     clientError,
    //     rSocket,
    //     createClient,
    //     sendJoinChat,
    //     connectionClose,
    //     sendRequestChannel,
    //     sendRequestResponse,
    //     sendDataJoinChat,
    //     responseData,
    //     responseError
    // ] = useRSocketClient();

    useImperativeHandle(ref, () => ({
        sendRequest,
        getMailSendAddress,
        chatClose
    }));
    // 가짜 데이터
    const [messageList, setMessageList] = useState([]);
    const [realMessageList, setRealMessageList] = useState([]);
    const refChatArea = useRef(null);

    const domMessage = useRef();
    const [message, setMessage] = useState('');
    const [fileItem, setFileItem] = useState('');

    const refKeyword = useRef(); // < HTMLInputElement > null;

    let searchPosNow = 0;
    let prevSearchKeyword = '';
    const sendMailaddress = useRef('');

    const getMailSendAddress = () => {
        return sendMailaddress.current;
    };

    const initChatScroll = () => {
        // 채팅영역 스크롤
        //console.log('initChatScroll called...');
        if (refChatArea.current) {
            //console.log('refChatArea current...');
            refChatArea.current.scrollTop = refChatArea.current.scrollHeight;
        }
        // // 첨부파일 스크롤
        // if (refFileArea.current) {
        //     refFileArea.current.scrollTop = refFileArea.current.scrollHeight;
        // }
    };

    const fileInfo = useCallback(
        (content) => {
            const isFile = content.indexOf('FILE_MESSAGE::') !== -1 ? true : false;

            if (isFile) {
                const fileKey = content.replace('FILE_MESSAGE::', '');
                return fileList.find((file) => {
                    return file.id === fileKey;
                });
            } else {
                return false;
            }
        },
        [fileList]
    );

    const parsingChatData = (chat) => {
        const file = fileInfo(chat.content);
        if (chat.role === 'ADMIN') {
            return {
                id: chat.id,
                receiver: 'receiveUser',
                sender: chat.name ? chat.name : 'Listing Team',
                message: file ? `첨부파일 : ${file.file_name}` : chat.content,
                type: chat.role,
                createdDt: getDateFormatSecond(chat.create_date),
                fileKey: file ? file.id : '',
                fileName: file ? file.file_name : '',
                fileSize: file ? file.file_size : '',
                fileType: file ? file.file_type : ''
            };
        } else {
            return {
                id: chat.id,
                receiver: 'Listing Team',
                sender: chat.email,
                message: file ? `첨부파일 : ${file.file_name}` : chat.content,
                type: chat.role,
                createdDt: getDateFormatSecond(chat.create_date),
                fileKey: file ? file.id : '',
                fileName: file ? file.file_name : '',
                fileSize: file ? file.file_size : '',
                fileType: file ? file.file_type : ''
            };
            sendMailaddress.current = chat.email;
            //console.log('>> found sendMail address : %s', sendMailaddress.current);
        }
    };

    const chatClose = () => {
        setMessageList([]);
        // try {
        //     connectionClose();
        // } catch (e) {
        //     console.log(e);
        // }
    };

    useEffect(() => {
        // //chatExistCheckSend();
        // prevSearchKeyword = '';
        //
        // return () => {
        //     // hit endpoint to end show
        //     if (rSocket) {
        //         console.log('rSocket disconnect call');
        //         connectionClose();
        //     }
        // };
    }, []);

    // 메일전송 결과
    /*
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'sendEmail':
                console.log(responseData.data);
                alert('전송을 완료하였습니다.');
                break;
            default:
                break;
        }
    }, [responseData]);
    */

    useEffect(() => {
        console.log({ responseDataC });
    }, [responseDataC]);

    const chatExistCheckSend = () => {
        let authData = null;
        if (localStorage.hasOwnProperty('authenticated')) {
            authData = JSON.parse(localStorage.getItem('authenticated'));
            let decodePayload = jwt.decode(authData.accessToken);
            //console.log(decodePayload);
            let data = {
                account_id: decodePayload.account_id,
                site_id: siteId,
                project_id: projectId
            };
            //console.log(data);
            chatExistsAndSave(data);
        }
    };

    useEffect(() => {
        if (!resData) {
            return;
        }
        switch (resData.transactionId) {
            // case 'chatExists':
            //     if (resData.data.data) {
            //         console.log(resData.data.data);
            //         // ok
            //         if (resData.data.data.use === true) {
            //             console.log(rSocket);
            //             if (!rSocket) createClient(projectId);
            //         } else {
            //             console.log('chat channel search Error....');
            //             if (rSocket) connectionClose();
            //         }
            //     }
            //     break;
            case 'deleteChatMessage':
                if (resData.data.data) {
                    console.log(resData.data.data);
                    if (resData.data.data.use === true) {
                        setMessageList([]);
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
            case 'chatList':
                if (resData.data) {
                    if (resData.data.data.length) {
                        setMessageList(
                            resData.data.data.map((item) => {
                                if (item.id === null) return;
                                return parsingChatData(item);
                                //setMessageList([...messageList, mDataSend]);
                            })
                        );
                    }
                }
                break;
            case 'chatCreate':
                if (resData.data && resData.data.data) {
                    console.log('chatCreate', resData.data.data);
                    initMessage();

                    const chatData = parsingChatData(resData.data.data);
                    // 채팅 리스트에서 새로 생성된 채팅 추가
                    setMessageList((prev) => [...prev, chatData]);
                    initChatScroll();
                }
                break;
        }
    }, [resData]);

    useEffect(() => {
        console.log({ reqError });
        setMessageList([]);
    }, [reqError]);

    useEffect(() => {
        chatExistCheckSend();
        getChatList(siteId, projectId);
    }, [projectId, fileList, chatStart]);

    // useEffect(() => {
    // console.log({ fileList });
    // if (messageList.length) {
    //     if (chatStart) {
    //         const newMessageList = messageList.map((message) => {
    //             const file = fileInfo(message.message);
    //             if (file) {
    //                 return {
    //                     ...message,
    //                     fileKey: file.id,
    //                     fileName: file.file_name,
    //                     fileSize: file.file_size,
    //                     fileType: file.file_type,
    //                     message: `첨부파일 : ${file.file_name}`
    //                 };
    //             }
    //             return message;
    //         });
    //         console.log({ newMessageList });
    //         setRealMessageList(newMessageList);
    //     }
    // }
    // if (rSocket) {
    //     console.log(chatStart);
    //     if (chatStart === true) {
    //         console.log('>> file id is changed.....');
    //         console.log(projectId);
    //         //setMessageList([]);
    //         if (fileItem) {
    //             let data = fileItem;
    //             const fileKey = data.message.replace('FILE_MESSAGE::', '');
    //             const fileInfo = fileList.find((file) => {
    //                 return file.id === fileKey;
    //             });
    //             if (fileInfo) {
    //                 data.fileKey = fileInfo.id;
    //                 data.fileName = fileInfo.file_name;
    //                 data.fileSize = fileInfo.file_size;
    //                 data.fileType = fileInfo.file_type;
    //                 data.message = `첨부파일 : ${data.fileName}`;
    //
    //                 setMessageList([...messageList, data]);
    //             }
    //             setFileItem('');
    //         } else {
    //             // sendDataJoinChat('join-chat', projectId);
    //         }
    //     }
    // }
    // }, [fileList, chatStart]);

    // response 값 처리
    // useEffect(() => {
    //     if (!responseData) return;
    //     console.log('>> get response data: ', responseData);
    // if (responseData) {
    //     if (responseData.length > 0) {
    //         console.log('here');
    //         let msg = [];
    //         let data = {};
    //         console.log(`>> chat list data << `);
    //         responseData.map((item, index) => {
    //             if (item.id === null) return;
    //             let data = {};
    //             //console.log(item);
    //
    //             if (item.role === 'ADMIN') {
    //                 data = {
    //                     id: item.id,
    //                     receiver: 'receiveUser',
    //                     sender: item.name ? item.name : 'Listing Team',
    //                     message: item.content,
    //                     type: item.role,
    //                     createdDt: getDateFormatSecond(item.create_date),
    //                     fileKey: '',
    //                     fileName: '',
    //                     fileSize: '',
    //                     fileType: ''
    //                 };
    //             } else {
    //                 data = {
    //                     id: item.id,
    //                     receiver: 'Listing Team',
    //                     sender: item.email,
    //                     message: item.content,
    //                     type: item.role,
    //                     createdDt: getDateFormatSecond(item.create_date),
    //                     fileKey: '',
    //                     fileName: '',
    //                     fileSize: '',
    //                     fileType: ''
    //                 };
    //                 sendMailaddress.current = item.email;
    //                 //console.log('>> found sendMail address : %s', sendMailaddress.current);
    //             }
    //
    //             if (item.content.indexOf('FILE_MESSAGE::') !== -1) {
    //                 console.log('>> found file data => FILE_MESSAGE');
    //                 const fileKey = item.content.replace('FILE_MESSAGE::', '');
    //                 const fileInfo = fileList.find((file) => {
    //                     return file.id === fileKey;
    //                 });
    //                 if (fileInfo) {
    //                     data.fileKey = fileInfo.id;
    //                     data.fileName = fileInfo.file_name;
    //                     data.fileSize = fileInfo.file_size;
    //                     data.fileType = fileInfo.file_type;
    //                     data.message = `첨부파일 : ${data.fileName}`;
    //                 }
    //             }
    //             //console.log(data);
    //             msg.push(data);
    //             //setMessageList([...messageList, mDataSend]);
    //         });
    //         setMessageList(msg);
    //     } else {
    //         if (responseData.id) {
    //             console.log('called....');
    //             if (responseData.operation_type !== 'REPLACE') {
    //                 let data = {};
    //                 if (responseData.role === 'ADMIN') {
    //                     data = {
    //                         id: responseData.id,
    //                         receiver: 'receiveUser',
    //                         sender: responseData.name ? responseData.name : 'Listing Team',
    //                         message: responseData.content,
    //                         type: responseData.role,
    //                         createdDt: getDateFormatSecond(responseData.create_date),
    //                         fileKey: '',
    //                         fileName: '',
    //                         fileSize: '',
    //                         fileType: ''
    //                     };
    //                 } else {
    //                     data = {
    //                         id: responseData.id,
    //                         receiver: 'Listing Team',
    //                         sender: responseData.email,
    //                         message: responseData.content,
    //                         type: responseData.role,
    //                         createdDt: getDateFormatSecond(responseData.create_date),
    //                         fileKey: '',
    //                         fileName: '',
    //                         fileSize: '',
    //                         fileType: ''
    //                     };
    //                     sendMailaddress.current = responseData.email;
    //                 }
    //                 let item = responseData.content;
    //                 if (item.indexOf('FILE_MESSAGE::') !== -1) {
    //                     const fileKey = item.replace('FILE_MESSAGE::', '');
    //                     const fileInfo = fileList.find((file) => {
    //                         return file.id === fileKey;
    //                     });
    //                     if (fileInfo) {
    //                         data.fileKey = fileInfo.id;
    //                         data.fileName = fileInfo.file_name;
    //                         data.fileSize = fileInfo.file_size;
    //                         data.fileType = fileInfo.file_type;
    //                         data.message = `첨부파일 : ${data.fileName}`;
    //
    //                         setMessageList([...messageList, data]);
    //                     } else {
    //                         if (item.indexOf('FILE_MESSAGE::') !== -1) {
    //                             setFileItem(data);
    //                             fileSearch(projectId, fileKey);
    //                         }
    //                     }
    //                 } else {
    //                     setMessageList([...messageList, data]);
    //                 }
    //             }
    //         }
    //     }
    // }
    // }, [responseData]);

    // 에러처리
    // useEffect(() => {
    //     console.log(responseError);
    //     if (!responseError) return;
    //
    //     if (responseError.toString().indexOf('Socket close') !== -1 || responseError.toString().indexOf('connection was closed') !== -1) {
    //         //if (!rSocket) {
    //         console.log('>> chat error occured...rSocket closed. timer start => createClient call...');
    //         createClient(projectId);
    //         // let timer = setTimeout(() => {
    //         //     createClient(projectId);
    //         // }, 2000);
    //
    //         // return () => {
    //         //     clearTimeout(timer);
    //         // };
    //     } else {
    //         console.log('>> chat error occured...rSocket is connected.... => join-chat call...');
    //         setMessageList([]);
    //         sendDataJoinChat('join-chat', projectId);
    //         // let timer = setTimeout(() => {
    //         //     setMessageList([]);
    //         //     sendJoinChat('join-chat', projectId);
    //         // }, 2000);
    //
    //         // return () => {
    //         //     clearTimeout(timer);
    //         // };
    //     }
    // }, [responseError]);

    useEffect(() => {
        initChatScroll();
    }, [messageList]);

    // 메시지 초기화
    const initMessage = () => {
        if (ref.current) {
            ref.current.value = '';
        }
    };

    // 메시지 전송 Text 박스
    const sendRequest = (data) => {
        console.log('>> sendRequest : ', data);
        const route = 'send-chat-message';
        // sendRequestResponse(route, projectId, data);

        postCreateChat(siteId, projectId, data);
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
    const sendEmail = (param) => {
        console.log(param);
        if (param === 'KOR') {
            if (confirm('국문 알림 메일을 발송하시겠습니까?')) {
                sendEmailToProjectUser(projectId, param);
            }
        } else if (param === 'EN') {
            if (confirm('영문 알림 메일을 발송하시겠습니까?')) {
                sendEmailToProjectUser(projectId, param);
            }
        }
    };
    return (
        <div className="chatting--container">
            <FlexBox sx={{ p: '1rem 2rem', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff' }}>
                <Typography variant="h4">커뮤니케이션</Typography>
                <ButtonLayout buttonName="communicate">
                    <Button color="secondary" variant="outlined" className="list__download" onClick={excelDownload}>
                        <DownloadOutlined /> 내역 다운로드
                    </Button>
                    <Box sx={{ display: 'flex', minWidth: 100, boxSizing: 'border-box' }} size="medium">
                        <TextField
                            id="symbol"
                            name="symbol"
                            inputRef={refKeyword}
                            type="search"
                            size="small"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    searchClick();
                                }
                            }}
                        />
                        <IconButton size="medium" type="submit" variant="outlined" color="secondary" onClick={searchClick}>
                            <SearchOutlined />
                        </IconButton>
                    </Box>
                </ButtonLayout>
            </FlexBox>
            <div className="chat--room">
                <p className="chat--room__search-result">
                    총 <strong>6</strong>건의 검색결과가 있습니다.
                </p>
                <div className="chat--room__box" id="scrollId" ref={refChatArea}>
                    <ChattingRoom>
                        {messageList.length > 0 &&
                            messageList.map((item, idx) => {
                                const key = `key_${idx}`;
                                if (item.type === 'ADMIN') {
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

                <Index sendChat={handleSendChat} ref={ref} sendMail={sendEmail} />
            </div>
        </div>
    );
});

export default Chat;
