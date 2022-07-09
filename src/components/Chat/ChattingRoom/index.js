import { Index } from '../TextInput';
import useRSocketClient from '../../../apis/chat';
import '../styles.scss';

const ChattingRoom = ({ children, sendMessage }) => {
    const [sendRequestResponse] = useRSocketClient();

    // 메시지 전송 Text 박스
    const handleSendChat = (data) => {
        console.log(data);
        sendMessage(data);
    };

    return (
        <section className="chat--room">
            <div className="chat--room__box">{children}</div>

            <Index sendChat={handleSendChat} />
        </section>
    );
};

export default ChattingRoom;
