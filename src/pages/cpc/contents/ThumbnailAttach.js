import { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardMedia, Box, Button, styled } from '@mui/material';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import DefaultThumbnail from 'assets/images/default_thumbnail.png';

const Input = styled('input')({
    display: 'none'
});
const Preview = styled('img')(
    () => `
    width: 400px;
    height: 240px;
    object-fit: contain;
    border: 1px dotted #c8c8c8;
    `
);
const CardCover = styled(Card)(
    ({ theme }) => `
    position: relative;
  
    .MuiCardMedia-root {
        height: ${theme.spacing(26)};
    }
`
);
const CardCoverAction = styled(Box)(
    ({ theme }) => `
      position: absolute;
      right: ${theme.spacing(2)};
      bottom: ${theme.spacing(2)};
  `
);

const ThumbnailAttach = ({ thumbnail, handleChange }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const dragRef = useRef(null);
    const [error, setError] = useState(false);

    const getFileSizeMB = (size) => {
        return size / 1024 / 1024;
    };

    const validateFile = (file) => {
        if (getFileSizeMB(file.size) > 10) {
            setError(true);
            alert('10MB 이하 파일만 업로드 가능합니다.');
            return false;
        }
        return true;
    };

    const onChangeFiles = useCallback(
        (e) => {
            let reader = new FileReader();
            let tempFile;
            if (e.type === 'drop') {
                tempFile = e.dataTransfer.files[0];
            } else {
                tempFile = e.target.files[0];
            }
            if (!validateFile(tempFile)) return;
            reader.onloadend = function () {
                setFile(tempFile);
                setImagePreviewUrl(reader.result);
            };
            reader.readAsDataURL(tempFile);
            handleChange(tempFile);
        },
        [file]
    );
    const handleDragIn = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    const handleDragOut = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files) {
            setIsDragging(true);
        }
    }, []);
    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            onChangeFiles(e);
            setIsDragging(false);
        },
        [onChangeFiles]
    );
    const initDragEvents = useCallback(() => {
        if (dragRef.current !== null) {
            dragRef.current.addEventListener('dragenter', handleDragIn);
            dragRef.current.addEventListener('dragleave', handleDragOut);
            dragRef.current.addEventListener('dragover', handleDragOver);
            dragRef.current.addEventListener('drop', handleDrop);
        }
    }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);
    const resetDragEvents = useCallback(() => {
        if (dragRef.current !== null) {
            dragRef.current.removeEventListener('dragenter', handleDragIn);
            dragRef.current.removeEventListener('dragleave', handleDragOut);
            dragRef.current.removeEventListener('dragover', handleDragOver);
            dragRef.current.removeEventListener('drop', handleDrop);
        }
    }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);
    useEffect(() => {
        initDragEvents();
        return () => resetDragEvents();
    }, [initDragEvents, resetDragEvents]);

    return (
        <>
            <CardCover>
                {!thumbnail && !imagePreviewUrl && <Preview src={DefaultThumbnail} />}
                {(thumbnail || imagePreviewUrl) && <Preview src={thumbnail && !imagePreviewUrl ? thumbnail : imagePreviewUrl} alt="" />}
                <CardCoverAction>
                    <Input accept="image/*" id="change-cover" type="file" onChange={onChangeFiles} />
                    <label htmlFor="change-cover">
                        <Button startIcon={<UploadTwoToneIcon />} variant="contained" component="span">
                            이미지 변경
                        </Button>
                    </label>
                </CardCoverAction>
            </CardCover>
        </>
    );
};

export default ThumbnailAttach;
