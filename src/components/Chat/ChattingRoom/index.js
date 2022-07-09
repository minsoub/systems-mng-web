import { Index } from '../TextInput';
import useRSocketClient from '../../../apis/chat';
import '../styles.scss';

const ChattingRoom = ({ children, projectId }) => {
    const [sendRequestResponse] = useRSocketClient();

    // 메시지 전송 Text 박스
    const handleSendChat = (data) => {
        // if (rSocket) {
        //     console.log(rSocket);
        //     sendJoinChat('join-chat', projectId);
        // }
        console.log(data);
        const route = 'send-chat-message';
        sendRequestResponse(route, projectId, data);
    };

    return (
        <section className="chat--room">
            <div className="chat--room__box">{children}</div>

            <Index sendChat={handleSendChat} />
        </section>
    );
};

export default ChattingRoom;
