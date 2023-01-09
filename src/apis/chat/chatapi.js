import axiosInstanceDefault from '../axiosDefault';
import axiosInstanceUpload from 'apis/axiosUpload';
import axiosInstanceDownload from 'apis/axiosDownload';
import useAxios from '../useAxios';
import { useSelector } from 'react-redux';

const ChatApi = () => {
    const [resData, reqError, loading, callApi] = useAxios();
    const { siteId, name } = useSelector((state) => state.auth);

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
            url: `/mng/lrc/service/chat/file/${key}`,
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
    // 채팅 내역 다운로드
    const chatExcelDownload = (project_id) => {
        callApi('getExcel', {
            axiosInstance: axiosInstanceDownload,
            method: 'get',
            url: `/mng/lrc/service/chat/excel/export?id=${project_id}`,
            requestConfig: {}
        });
    };

    // 파일 세부 조회
    const getFileDetailData = (project_id, fileKey) => {
        callApi('getFileData', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/service/chat/files/${project_id}/${fileKey}`,
            requestConfig: {}
        });
    };

    // 채팅 리스트
    const getChatList = (siteId, projectId) => {
        callApi('chatList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/service/chat/${siteId}/${projectId}`,
            requestConfig: {}
        });
    };

    // 채팅쓰기
    const postCreateChat = (siteId, projectId, content) => {
        callApi('chatCreate', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: `/mng/lrc/service/chat/${siteId}/${projectId}`,
            requestConfig: {
                content,
                site_id: siteId,
                name
            }
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
            deleteChat: deleteChatMessage,
            chatExcelDownload: chatExcelDownload,
            fileDetailSearch: getFileDetailData,
            getChatList: getChatList,
            postCreateChat: postCreateChat
        }
    ];
};

export default ChatApi;
