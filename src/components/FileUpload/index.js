import React, { useCallback, useEffect } from 'react';
import { Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDropzone } from 'react-dropzone';
import { humanFileSize } from 'utils/CommonUtils';
import './styles.scss';

const FileUpload = (id, insertChatFile) => {
    const onDrop = useCallback((acceptedFiles) => {
        if (!file) {
            alert('파일을 업로드 하지 않았습니다.');
            return;
        }
        Promise.all(
            acceptedFiles.map((file) => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('projectId', id);
                formData.append('fileName', file.name);
                formData.append('fileType', file.type);
                // 3.2MB로 계산하기
                formData.append('fileSize', humanFileSize(file.size, true, 2));

                return insertChatFile(formData);
            })
        )
            .then((response) => {
                console.log({ response });
            })
            .catch((error) => {
                console.log({ error });
            });
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <p className="txt">마우스로 파일을 끌어오세요.</p>
        </div>
    );
};

export default FileUpload;
