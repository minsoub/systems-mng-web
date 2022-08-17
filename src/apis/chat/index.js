import {
    APPLICATION_JSON,
    BufferEncoders,
    encodeBearerAuthMetadata,
    encodeCompositeMetadata,
    encodeRoute,
    MESSAGE_RSOCKET_AUTHENTICATION,
    MESSAGE_RSOCKET_COMPOSITE_METADATA,
    MESSAGE_RSOCKET_ROUTING,
    RSocketClient
} from 'rsocket-core';
import RSocketWebsocketClient from 'rsocket-websocket-client';
import { useSelector } from 'react-redux';
import { Flowable } from 'rsocket-flowable';
import { useEffect, useRef, useState } from 'react';
//import WebSocket from 'ws';
//const WebSocket = require('ws');

const serverURL = process.env.REACT_APP_CHAT_SERVER_URL ? process.env.REACT_APP_CHAT_SERVER_URL : 'ws://localhost:9090';

const useRScoketClient = () => {
    const connection = useRef();
    const [rSocket, setRSocket] = useState();
    const [clientError, setClientError] = useState();
    const [responseData, setResponseData] = useState();
    const [responseError, setResponseError] = useState();
    const [projectId, setProjectId] = useState('');
    const { siteId, name } = useSelector((state) => state.auth);

    const getMetadata = (route) => {
        let authData = null;
        if (localStorage.hasOwnProperty('authenticated')) {
            //console.log(localStorage.getItem('authenticated'));
            authData = JSON.parse(localStorage.getItem('authenticated'));
            console.log(authData.accessToken);
        }

        const socketAuthProvider = encodeBearerAuthMetadata(
            authData.accessToken
            //'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIiwiYXVkIjoiaGVsbG8tc2VydmljZSIsImFjY291bnRfaWQiOiJyaWhvbmdvIiwicm9sZSI6IlVTRVIiLCJpc3MiOiJoZWxsby1zZXJ2aWNlLWRlbW8iLCJleHAiOjE2NTY1MDk0NjEsImp0aSI6ImQzMWUwMWEzLWZlMWUtNDU1Yi04ZTUwLWQ0MTkyODhhODY2NiJ9.061X4m386ISFNdnn5XLZSySu_ryc1LYoIqDl8YfL_Yc'
        );
        const metadata = encodeCompositeMetadata([
            [MESSAGE_RSOCKET_ROUTING.string, encodeRoute(route)],
            [MESSAGE_RSOCKET_AUTHENTICATION.string, socketAuthProvider]
        ]);
        return metadata;
    };
    const createClient = async (projectId) => {
        console.log('>>createClient called..<<');
        setProjectId(projectId);
        const client = new RSocketClient({
            setup: {
                dataMimeType: APPLICATION_JSON.string,
                keepAlive: 5000, // avoid sending during test
                lifetime: 100000,
                metadataMimeType: MESSAGE_RSOCKET_COMPOSITE_METADATA.string
            },
            transport: new RSocketWebsocketClient(
                {
                    debug: true,
                    url: serverURL,
                    wsCreator: (url) => {
                        return new WebSocket(url);
                    }
                },
                BufferEncoders
            ),
            errorHandler: (e) => {
                console.log('>> RSocketClient error <<');
                setClientError(e);
            }
        });

        connection.current = await client;
        const returnSocket = await client.connect();
        setRSocket(returnSocket);
    };

    useEffect(() => {
        console.log('>> RsocketConnection <<');
        //createClient();
        // return () => {
        //     if (connection && connection.current) {
        //         console.log('useRSocketClient clean up');
        //         connection.current.close();
        //     }
        // };
    }, []);

    const connectionClose = () => {
        console.log('connectionClose called....');
        if (connection && connection.current) {
            console.log('connection closed....');
            connection.current.close();
        }
    };

    const sendRequestResponse = (route, project_id, message) => {
        console.log('sendRequest called...');
        console.log('>> sendRequestResponse <<', route, message);
        const messageRequest = {
            content: message,
            chat_room: project_id,
            site_id: siteId,
            name: name
        };
        console.log(messageRequest);

        if (rSocket && rSocket) {
            console.log(rSocket);
            rSocket
                .requestResponse({
                    data: Buffer.from(JSON.stringify(messageRequest)),
                    metadata: getMetadata(route)
                })
                .subscribe({
                    onComplete: (response) => {
                        if (response && response.data) {
                            const text = response.data.toString();
                            const data = JSON.parse(text);
                            console.log(text);
                            console.log(data);
                        }
                    },
                    onError: (error) => {
                        console.log(`onError: ${error}`);
                        setResponseError(error);
                    },
                    // onNext: (payload) => {
                    //     const json = payload.data.toString();
                    //     console.log(json);
                    //     setResponseData(JSON.parse(json).content);
                    // },
                    onSubscribe: (cancel) => {
                        console.log(cancel);
                        //subscription.request(2147483647);
                    }
                });
        }
    };

    const sendRequestChannel = (route) => {
        console.log('sendRequestChannel called...');
        const channelRequest = {
            chat_room: projectId,
            site_id: siteId
        };
        console.log(channelRequest);
        if (rSocket) {
            rSocket
                .requestChannel(
                    Flowable.just({
                        data: Buffer.from(JSON.stringify(channelRequest)),
                        metadata: getMetadata(route)
                    })
                )
                .subscribe({
                    onComplete: () => console.log('complete'),
                    onError: (error) => {
                        //console.debug(`onError: ${error}`);
                        setResponseError(error);
                    },
                    onNext: (payload) => {
                        const text = payload.data.toString();
                        const data = JSON.parse(text);
                        setResponseData(data);
                    },
                    onSubscribe: (subscription) => {
                        // console.log(subscription);
                        subscription.request(10031);
                    }
                });
        }
    };

    // 기존 채팅 리스트 가져오기
    const sendJoinChat = (route, pId) => {
        if (rSocket) {
            setProjectId(pId);
            const message = {
                chat_room: pId,
                site_id: siteId
            };
            rSocket
                .requestResponse({
                    data: Buffer.from(JSON.stringify(message)),
                    metadata: getMetadata(route)
                })
                .subscribe({
                    onComplete: (response) => {
                        if (response && response.data) {
                            const text = response.data.toString();
                            const data = JSON.parse(text);
                            setResponseData(data);
                        }
                    },
                    onError: (error) => {
                        //console.log(`onError: ${error}`);
                        setResponseError(error);
                    },
                    onSubscribe: (cancel) => {
                        sendRequestChannel('channel-chat-message');
                        // console.log('onSubscribe');
                    }
                });
        }
    };

    const sendDataJoinChat = (route, pId) => {
        if (rSocket) {
            setProjectId(pId);
            const message = {
                chat_room: pId,
                site_id: siteId
            };
            rSocket
                .requestResponse({
                    data: Buffer.from(JSON.stringify(message)),
                    metadata: getMetadata(route)
                })
                .subscribe({
                    onComplete: (response) => {
                        if (response && response.data) {
                            const text = response.data.toString();
                            const data = JSON.parse(text);
                            setResponseData(data);
                        }
                    },
                    onError: (error) => {
                        //console.log(`onError: ${error}`);
                        setResponseError(error);
                    },
                    onSubscribe: (cancel) => {
                        //sendRequestChannel('channel-chat-message');
                        // console.log('onSubscribe');
                    }
                });
        }
    };

    return [
        clientError,
        rSocket,
        createClient,
        sendJoinChat,
        connectionClose,
        sendRequestChannel,
        sendRequestResponse,
        sendDataJoinChat,
        responseData,
        responseError
    ];
};

export default useRScoketClient;
