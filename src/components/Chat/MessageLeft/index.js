import '../styles.scss';

const MessageLeft = ({ key, id, message, timestamp, displayName }) => {
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
                    <div className="message other-message" data-message-id={key}>
                        {message}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MessageLeft;
