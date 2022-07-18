import '../styles.scss';

const MessageRight = ({ id, message, timestamp, displayName, deleteChatMessage }) => {
    const deleteMessage = (id) => {
        if (confirm('삭재하시겠습니까?')) {
            deleteChatMessage(id);
        }
    };
    return (
        <>
            <div className="msg--right">
                {/* 보낸이는 나 */}

                <h5 className="message-data-time">
                    {/* 메시지 전송한 시간 */}
                    <span className="msg--right__time">{timestamp}</span>
                    <span className="message-data-name">{displayName}</span>
                </h5>

                {/* 말풍선 */}
                <div className="msg--right__speechBubble">
                    {/* 메시지 내용물 */}
                    <div className="message my-message">{message}</div>
                    <div className="my-message__delete">
                        <button onClick={() => deleteMessage(id)}>삭제</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MessageRight;
