import axiosInstanceDefault from '../axiosDefault';
import axiosInstanceUpload from 'apis/axiosUpload';
import axiosInstanceDownload from 'apis/axiosDownload';
import useAxios from '../useAxios';

const ChatApi = () => {
    const [resData, reqError, loading, callApi] = useAxios();

    // 체크 및 수정
    const chatExists = (data) => {
        callApi('chatExists', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/mng/lrc/service/chat`,
            requestConfig: data
        });
    };

    // 파일 업로드
    const insertFileData = (data) => {
        callApi('insertData', {
            axiosInstance: axiosInstanceUpload,
            method: 'post',
            url: '/mng/lrc/service/chat/file',
            requestConfig: data
        });
    };

    // 파일 다운로드
    const getFile = (key) => {
        callApi('getFile', {
            axiosInstance: axiosInstanceDownload,
            method: 'get',
            url: `/mng/lrc/files/download/s3/${key}`,
            requestConfig: {}
        });
    };
    // 파일 목록 조회
    const getFileListData = (project_id) => {
        callApi('getFileList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/service/chat/files/${project_id}`,
            requestConfig: {}
        });
    };
    // 채팅 대화 삭제
    const deleteChatMessage = (id) => {
        callApi('deleteChatMessage', {
            axiosInstance: axiosInstanceDefault,
            method: 'delete',
            url: `/mng/lrc/service/chat/${id}`,
            requestConfig: {}
        });
    };
    return [
        resData,
        reqError,
        loading,
        {
            chatExistsAndSave: chatExists,
            insertChatFile: insertFileData,
            getChatFile: getFile,
            getChatFileList: getFileListData,
            deleteChat: deleteChatMessage
        }
    ];
};

export default ChatApi;
