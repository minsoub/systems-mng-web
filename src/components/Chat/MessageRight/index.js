import { useEffect } from 'react';
import '../styles.scss';
import { nl2br } from 'utils/CommonUtils';
import FileDown from '../../../assets/images/icons/filedown.svg';

const MessageRight = ({ id, message, timestamp, displayName, deleteChatMessage, fileList, fileDownload }) => {
    const deleteMessage = (id) => {
        if (confirm('삭제하시겠습니까?')) {
            deleteChatMessage(id);
        }
    };

    // const checkFile = (data) => {
    //     console.log(data);
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
            <div className="msg--right">
                {/* 보낸이는 나 */}
                {/* 말풍선 */}
                <div className="msg--right__speechBubble">
                    {/* 메시지 내용물 */}
                    {message.fileKey ? (
                        <div key={id} className="message my-message" data-message-id={id}>
                            <a href="#" onClick={() => fileDownload(message.fileKey, message.fileName)}>
                                <img src={FileDown} alt="file download icon" />
                                {message.message}
                            </a>
                        </div>
                    ) : (
                        <div key={id} className="message my-message" data-message-id={id}>
                            <p dangerouslySetInnerHTML={{ __html: message.message }}></p>
                        </div>
                    )}
                    <h5 className="message-data-time">
                        {/* 메시지 전송한 시간 */}
                        <span className="message-data-name">{displayName}</span>
                        <span className="msg--right__time">{timestamp}</span>
                        <button className="my-message__delete" onClick={() => deleteMessage(id)}>
                            삭제
                        </button>
                    </h5>
                </div>
            </div>
        </>
    );
};

export default MessageRight;
