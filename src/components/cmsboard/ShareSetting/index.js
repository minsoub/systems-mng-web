import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, TextField, Button } from '@mui/material';

// library
import cx from 'classnames';

// project import
import TopInputLayout from 'components/Common/TopInputLayout';

// transition
import BoardApi from 'apis/cms/boardapi';
import { activeShareTitle, activeShareDesc, activeShareBtnName, activeShareFileId } from 'store/reducers/cms/DetailData';

//style
import styles from './styles.module.scss';

const ShareSetting = ({ editMode, shareData }) => {
    const [responseData, requestError, loading, { fileInfo, downloadFileData }] = BoardApi();
    const dispatch = useDispatch();
    // 인풋 관리
    const [inputs, setInputs] = useState({
        shareTitle: '',
        shareDesc: '',
        shareBtnName: '',
        shareFileName: ''
    });
    const { shareTitle, shareDesc, shareBtnName, shareFileName } = inputs;
    const [fileID, setFileID] = useState(''); // 첨부파일

    const handleBlur = () => {};
    const onChange = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
        switch (name) {
            case 'shareTitle':
                dispatch(activeShareTitle({ reduceShareTitle: value }));
                break;
            case 'shareDesc':
                dispatch(activeShareDesc({ reduceShareDesc: value }));
                break;
            case 'shareBtnName':
                dispatch(activeShareBtnName({ reduceShareBtnName: value }));
                break;
        }
    };

    // 입력 박스 입력 시 호출
    const fileHandleChange = (e) => {
        setInputs({
            ...inputs,
            ['shareFileName']: e.target.files[0].name
        });
    };
    const fileDeleteClickHandler = () => {
        setInputs({
            ...inputs,
            ['shareFileName']: ''
        });
        setFileID('');
        document.getElementById('shareFile').value = '';
        dispatch(activeShareFileId({ reduceShareFileId: '' }));
    };
    const fileDownloadClickHandler = () => {
        downloadFileData(fileID);
    };
    // 연동결과 파싱
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'fileInfo':
                const extension = responseData.data.data.extension.toLowerCase();
                setInputs({
                    ...inputs,
                    ['shareFileName']: responseData.data.data.name + '.' + extension.toLowerCase()
                });
                break;
            case 'downloadFile':
                if (responseData.data) {
                    let res = responseData;
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${shareFileName}`);
                    link.style.cssText = 'display:none';
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                }
                break;
            default:
                return;
        }
    }, [responseData]);
    useEffect(() => {
        if (!shareData) return;
        setInputs({
            ...inputs,
            ['shareTitle']: shareData.share_title ? shareData.share_title : '',
            ['shareDesc']: shareData.share_description ? shareData.share_description : '',
            ['shareBtnName']: shareData.share_button_name ? shareData.share_button_name : ''
        });
        setFileID(shareData.share_file_id);
        dispatch(activeShareTitle({ reduceShareTitle: shareData.share_title }));
        dispatch(activeShareDesc({ reduceShareDesc: shareData.share_description }));
        dispatch(activeShareBtnName({ reduceShareBtnName: shareData.share_button_name }));
    }, [shareData]);
    useEffect(() => {
        return () => {
            dispatch(activeShareTitle({ reduceShareTitle: '' }));
            dispatch(activeShareDesc({ reduceShareDesc: '' }));
            dispatch(activeShareBtnName({ reduceShareBtnName: '' }));
            dispatch(activeShareFileId({ reduceShareFileId: '' }));
        };
    },[]);
    useEffect(() => {
        if (!fileID) return;
        dispatch(activeShareFileId({ reduceShareFileId: fileID }));
        fileInfo(fileID);
    }, [fileID]);

    return (
        <>
            <div className="board--layout__title">
                <Typography variant="h4" className="title">
                    ■ 공유 태그
                </Typography>
            </div>
            <div className={cx('common-board--layout')}>
                <table>
                    <tbody>
                        <tr>
                            <th className={'tb--title'}>타이틀</th>
                            <td>
                                {editMode ? (
                                    <TextField
                                        type="text"
                                        size="small"
                                        value={shareTitle}
                                        name="shareTitle"
                                        onBlur={handleBlur}
                                        onChange={onChange}
                                        inputProps={{ maxLength: 50 }}
                                        placeholder="공유할 페이지 제목을 입력하세요."
                                        fullWidth
                                    />
                                ) : (
                                    <>{shareTitle ? shareTitle : '-'}</>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th className={'tb--title'}>설명</th>
                            <td>
                                {editMode ? (
                                    <TextField
                                        type="text"
                                        size="small"
                                        value={shareDesc}
                                        name="shareDesc"
                                        onBlur={handleBlur}
                                        onChange={onChange}
                                        multiline
                                        rows={3}
                                        inputProps={{ maxLength: 100 }}
                                        placeholder="공유할 페이지 설명을 입력하세요."
                                        fullWidth
                                    />
                                ) : (
                                    <>{shareDesc ? shareDesc : '-'}</>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th className={'tb--title'}>이미지</th>
                            <td className="add_file">
                                {editMode ? (
                                    <TopInputLayout className={`${styles.inputWrap} file__upload--box`}>
                                        <input
                                            accept="image/*"
                                            id="shareFile"
                                            type="file"
                                            name="shareFile"
                                            onChange={fileHandleChange}
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="shareFile">
                                            <Button size="medium" type="button" variant="contained" color="primary" component="span">
                                                파일선택
                                            </Button>
                                        </label>
                                        <div className={`${styles.file_name}`}>{shareFileName ? shareFileName : '-'}</div>
                                        {shareFileName && (
                                            <Button
                                                size="medium"
                                                type="button"
                                                variant="contained"
                                                color="primary"
                                                component="span"
                                                onClick={fileDeleteClickHandler}
                                            >
                                                삭제
                                            </Button>
                                        )}
                                    </TopInputLayout>
                                ) : (
                                    <>
                                        {shareFileName ? (
                                            <Button className={styles.file_download} onClick={fileDownloadClickHandler}>
                                                {shareFileName}
                                            </Button>
                                        ) : (
                                            '-'
                                        )}
                                    </>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th className={'tb--title'}>버튼명</th>
                            <td>
                                {editMode ? (
                                    <TextField
                                        type="text"
                                        size="small"
                                        value={shareBtnName}
                                        name="shareBtnName"
                                        onBlur={handleBlur}
                                        onChange={onChange}
                                        inputProps={{ maxLength: 10 }}
                                        placeholder="공유 버튼명을 입력해 주세요."
                                        fullWidth
                                    />
                                ) : (
                                    <>{shareBtnName ? shareBtnName : '-'}</>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )};
export default ShareSetting;
