import '../styles.scss';

const MessageLeft = ({ id, message, timestamp, displayName, fileList, fileDownload }) => {
    //const checkFile = (data) => {
    //    console.log(data);
    //     if (data.indexOf('FILE_MESSAGE::') !== -1) {
    //         let found = 0;
    //         let id, name;
    //         fileList.map((item, index) => {
    //             if (item.id === data.split('::')[1]) {
    //                 found = 1;
    //                 console.log('found.........');
    //                 console.log(item);
    //                 id = item.id;
    //                 name = item.file_name;
    //             }
    //         });
    //         if (found === 1) {
    //             return (
    //                 <a href="#" onClick={() => fileDownload(id, name)}>
    //                     첨부파일 업로드 {name}
    //                 </a>
    //             );
    //         } else {
    //             return null;
    //         }
    //     } else {
    //         return data;
    //     }
    // };

    return (
        <>
            <div className="msg--left">
                {/* 보낸이는 바로 너 */}

                <h5 className="message-data-time">
                    {/* 메시지 전송한 시간 */}
                    <span className="message-data-name">{displayName}</span>
                    <span className="msg--left__time">{timestamp}</span>
                </h5>
                {/* 말풍선 */}
                <div className="msg--left__speechBubble">
                    {/* 메시지 내용물 */}
                    {message.fileKey ? (
                        <div key={id} className="message other-message" data-message-id={id}>
                            <a href="#" onClick={() => fileDownload(message.fileKey, message.fileName)}>
                                {message.message}
                            </a>
                        </div>
                    ) : (
                        <div key={id} className="message other-message" data-message-id={id}>
                            {message.message}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MessageLeft;
