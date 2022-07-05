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
import React, { useEffect, useRef, useState } from 'react';

const useRScoketClient = () => {
    const connection = useRef();
    const [rSocket, setRSocket] = useState();
    const [clientError, setClientError] = useState();
    const [responseData, setResponseData] = useState();
    const [responseError, setResponseError] = useState();

    const getMetadata = (route) => {
        const socketAuthProvider = encodeBearerAuthMetadata(
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIiwiYXVkIjoiaGVsbG8tc2VydmljZSIsImFjY291bnRfaWQiOiJyaWhvbmdvIiwicm9sZSI6IlVTRVIiLCJpc3MiOiJoZWxsby1zZXJ2aWNlLWRlbW8iLCJleHAiOjE2NTY1MDk0NjEsImp0aSI6ImQzMWUwMWEzLWZlMWUtNDU1Yi04ZTUwLWQ0MTkyODhhODY2NiJ9.061X4m386ISFNdnn5XLZSySu_ryc1LYoIqDl8YfL_Yc'
        );
        const metadata = encodeCompositeMetadata([
            [MESSAGE_RSOCKET_ROUTING.string, encodeRoute(route)],
            [MESSAGE_RSOCKET_AUTHENTICATION.string, socketAuthProvider]
        ]);
        return metadata;
    };

    const createClient = async () => {
        const client = new RSocketClient({
            setup: {
                dataMimeType: 'applicaton/json',
                keepAlive: 5000, // avoid sending during test
                lifetime: 100000,
                metadataMimeType: MESSAGE_RSOCKET_COMPOSITE_METADATA
            },
            transport: new RSocketWebsocketClient(
                {
                    debug: true,
                    url: 'ws://localhost:9090',
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

        // const transportOptions = {
        //     url: 'ws://127.0.0.1:9898',
        //     wsCreator: (url) => {
        //         return new WebSocket(url);
        //     }
        // };
        // const setup = {
        //     keepAlive: 1000000,
        //     lifetime: 100000,
        //     dataMimeType: APPLICATION_JSON.string,
        //     metadataMimeType: MESSAGE_RSOCKET_COMPOSITE_METADATA.string
        // };
        // const transport = new RSocketWebsocketClient(transportOptions, BufferEncoders);
        // const client = new RSocketClient({ setup, transport });

        // connection.current = await client;
        // const returnSocket = await client.connect();
        // setRSocket(returnSocket);
    };

    useEffect(() => {
        console.log('>> RsocketConnection <<');
        createClient();
        return () => {
            if (connection && connection.current) {
                console.log('useRSocketClient clean up');
                connection.current.close();
            }
        };
    }, []);

    const connectionClose = () => {
        if (connection && connection.current) {
            connection.current.client();
        }
    };

    const sendRequestResponse = (route, message) => {
        console.log('>> sendRequestResponse <<', route, message);
        const messageRequest = {
            content: message,
            chat_room: 'chat1',
            site_id: 'lrc'
        };

        if (rSocket && rSocket) {
            rSocket
                .requestResponse({
                    data: Buffer.from(JSON.stringify(messageRequest)),
                    metadata: getMetadata(route)
                })
                .subscribe({
                    onComplete: () => console.log('complete'),
                    onError: (error) => {
                        console.debug(`onError: ${error}`);
                        setResponseError(error);
                    },
                    onNext: (payload) => {
                        const json = payload.data.toString();
                        console.debug(json);
                        setResponseData(JSON.parse(json).content);
                    },
                    onSubscribe: (subscription) => {
                        subscription.request(2147483647);
                    }
                });
        }
    };

    const sendJoinChat = (route, chatRoom, siteId) => {
        console.log('>> joinChat <<', route);
        console.log(rSocket);
        if (rSocket) {
            const message = {
                chat_room: chatRoom,
                site_id: siteId
            };
            // rSocket
            //     .requestResponse({
            //         data: Buffer.from(JSON.stringify(message)),
            //         metadata: getMetadata("create-chat"),
            //     })
            //     .subscribe({
            //         onComplete: (response: any) => {
            //             console.log(`onComplete: ${response.data}`, response.data);
            //             if (response && response.data) {
            //                 const data = response.data.toString();
            //                 console.log(data);
            //             }
            //         },
            //         onError: (error: Error) => {
            //             console.log(`onError: ${error}`);
            //             setResponseError(error);
            //         },
            //         onSubscribe: (cancel: any) => {
            //             console.log("onSubscribe");
            //         },
            //     });

            rSocket
                .requestResponse({
                    data: Buffer.from(JSON.stringify(message)),
                    metadata: getMetadata(route)
                })
                .subscribe({
                    onComplete: (response) => {
                        // console.log(`onComplete: ${response.data}`, response.data);
                        if (response && response.data) {
                            const data = response.data.toString();
                            console.log(data);
                            // setResponseData(data);
                        }
                    },
                    onError: (error) => {
                        console.log(`onError: ${error}`);
                        setResponseError(error);
                    },
                    onSubscribe: (cancel) => {
                        sendRequestResponse('send-chat-message', '');
                        console.log('onSubscribe');
                    }
                });
        }
    };

    return [clientError, rSocket, sendJoinChat, sendRequestResponse, responseData, responseError];
};

export default useRScoketClient;
