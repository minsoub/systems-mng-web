import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Grid, TextField } from '@mui/material';
import BoardMasterApi from 'apis/cpc/board/boardmasterapi';
import BoardApi from 'apis/cpc/board/boardapi';
import ErrorScreen from 'components/ErrorScreen';
import ThumbnailAttach from 'components/ThumbnailAttach';
import JoditEditor from 'jodit-react';
import { WithContext as ReactTags } from 'react-tag-input';
import '../ReactTags.module.scss';
import './style.scss';
import InputLayout from 'components/Common/InputLayout';
import ButtonLayout from 'components/Common/ButtonLayout';
import TopInputLayout from 'components/Common/TopInputLayout';
import HeaderTitle from 'components/HeaderTitle';
import cx from 'classnames';

const Post = () => {
    const navigate = useNavigate();
    const { boardId } = useParams();
    const boardMasterId = 'CPC_COINTING';
    const [resBoardMaster, boardMasterError, loading, { searchBoardMaster }] = BoardMasterApi();
    const [responseData, requestError, resLoading, { searchBoard, createBoard, updateBoard, deleteBoard }] = BoardApi();
    const boardThumbnailUrl = process.env.REACT_APP_BOARD_SERVER_URL;

    ////////////////////////////////////////////////////
    // 공통 에러 처리
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const parentErrorClear = () => {
        setOpen(false);
        setErrorTitle('');
        setErrorMessage('');
    };
    ////////////////////////////////////////////////////

    // 입력 값
    const [id, setId] = useState('');
    // 제목
    const [title, setTitle] = useState('');
    // 썸네일 이미지
    const [thumbnail, setThumbnail] = useState('');
    // 설명
    const [description, setDescription] = useState('');
    // 태그
    const [tags, setTags] = useState([]);
    const [createAccountName, setCreateAccountName] = useState('');

    let authData = null;
    if (localStorage.hasOwnProperty('authenticated')) {
        authData = JSON.parse(localStorage.getItem('authenticated'));
    }
    let Authorization = `Bearer ${authData.accessToken}`;

    // 파일
    const [thumbnailFile, setThumbnailFile] = useState('');
    const handleFileChange = (file) => {
        console.log(file);
        if (file != null) {
            setThumbnailFile(file);
        }
    };

    // 웹에디터
    const editorRef = useRef(null);
    const [content, setContent] = useState(null);
    const config = {
        language: 'ko',
        readonly: false,
        placeholder: '내용을 입력하세요.',
        enableDragAndDropFileToEditor: true,
        imageDefaultWidth: null,
        uploader: {
            insertImageAsBase64URI: false,
            url: process.env.REACT_APP_DEFAULT_API_URL + '/mng/cpc/board/upload',
            headers: {
                Authorization: `${Authorization}`,
                site_id: process.env.REACT_APP_DEFAULT_SITE_ID,
                my_site_id: authData.siteId,
                active_role: authData.roleId
            },
            filesVariableName() {
                return 'files';
            }
        },
        width: '100%',
        height: 500
    };

    // 태그
    const [suggestions, setSuggestions] = useState([]);
    const KeyCodes = {
        comma: 188,
        enter: 13
    };
    const delimiters = [KeyCodes.comma, KeyCodes.enter];
    const handleDelete = (i) => {
        setTags(tags.filter((tag, index) => index !== i));
    };
    const handleAddition = (tag) => {
        setTags([...tags, tag]);
    };
    const handleDrag = (tag, currPos, newPos) => {
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        setTags(newTags);
    };
    const handleTagClick = (index) => {
        console.log(`The tag at index ${index} was clicked`);
    };

    // onload
    useEffect(() => {
        searchBoardMaster(boardMasterId);
        setId(boardId);
    }, []);

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            if (requestError.result === 'FAIL') {
                console.log('error requestError');
                console.log(requestError);
                setErrorTitle('Error Message');
                setErrorMessage('[' + requestError.error.code + '] ' + requestError.error.message);
                setOpen(true);
            }
        }
    }, [requestError]);

    // Transaction Return
    useEffect(() => {
        if (!resBoardMaster) {
            return;
        }
        if (resBoardMaster.data.data.is_use_tag) {
            const masterTags = resBoardMaster.data.data.tags;
            if (masterTags) {
                const tempSuggestions = masterTags.map((tag) => {
                    return {
                        id: tag,
                        text: tag
                    };
                });
                setSuggestions(tempSuggestions);
            }
        }
    }, [resBoardMaster]);

    useEffect(() => {
        if (id) {
            searchBoard(boardMasterId, id);
        }
    }, [id]);

    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getBoard':
                setTitle(responseData.data.data.title);
                setThumbnail(responseData.data.data.thumbnail);
                setDescription(responseData.data.data.description);
                setContent(responseData.data.data.contents);
                setCreateAccountName(responseData.data.data.create_account_name);

                if (responseData.data.data.tags) {
                    const tempTags = responseData.data.data.tags.map((tag) => {
                        return {
                            id: tag,
                            text: tag
                        };
                    });
                    setTags(tempTags);
                }
                break;
            case 'createBoard':
                alert('등록되었습니다.');
                setId(responseData.data.data.id);
                setCreateAccountName(responseData.data.data.create_account_name);
                break;
            case 'updateBoard':
                alert('저장되었습니다.');
                break;
            case 'deleteBoard':
                alert('삭제되었습니다.');
                listClick();
                break;
            default:
        }
    }, [responseData]);

    const handleClose = () => {
        setVisible(false);
    };
    const handleBlur = (e) => {
        console.log(e);
    };
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'thumbnail':
                setThumbnail(e.target.value);
                break;
            case 'description':
                setDescription(e.target.value);
                break;
            case 'title':
                setTitle(e.target.value);
                break;
            default:
                break;
        }
    };

    // 목록
    const listClick = () => {
        console.log('listClick called...');
        navigate('/cpc/contents/cointing/list');
    };

    const isValidate = () => {
        if (!title) {
            alert('제목을 입력해 주세요.');
            return false;
        }
        if (!content) {
            alert('내용을 입력해 주세요.');
            return false;
        }
        return true;
    };

    // 등록
    const addClick = () => {
        console.log('addClick called...');

        if (!isValidate()) return;
        if (confirm('등록 하시겠습니까?')) {
            const inputTags = tags.map((tag) => {
                return tag.text;
            });
            const data = {
                title,
                description,
                thumbnail,
                contents: content,
                tags: inputTags
            };
            const formData = new FormData();
            formData.append('boardRequest', new Blob([JSON.stringify(data)], { type: 'application/json' }));
            thumbnailFile && formData.append('file', thumbnailFile);
            console.log(formData);
            createBoard(boardMasterId, formData);
        }
    };

    // 삭제
    const deleteClick = () => {
        console.log('deleteClick called...');
        if (confirm('삭제 하시겠습니까?')) {
            deleteBoard(boardMasterId, id);
        }
    };

    // 저장
    const saveClick = () => {
        console.log('saveClick called...');

        if (!isValidate()) return;
        if (confirm('저장 하시겠습니까?')) {
            const inputTags = tags.map((tag) => {
                return tag.text;
            });
            const data = {
                id,
                title,
                description,
                thumbnail,
                contents: content,
                tags: inputTags
            };
            const formData = new FormData();
            formData.append('boardRequest', new Blob([JSON.stringify(data)], { type: 'application/json' }));
            thumbnailFile && formData.append('file', thumbnailFile);
            console.log(formData);
            updateBoard(boardMasterId, data.id, formData);
        }
    };

    return (
        <Grid container rowSpacing={4} columnSpacing={2.75} className="cpcContentsCampaignReg">
            <Grid item xs={12}>
                <HeaderTitle titleNm="코인팅" menuStep01="사이트 운영" menuStep02="콘텐츠 관리" menuStep03="코인팅" />

                <div className={cx('common-grid--layout')}>
                    <table>
                        <tbody>
                            <tr>
                                <th className={'tb--title'}>제목</th>
                                <td>
                                    <TextField
                                        id="filled-hidden-label-small"
                                        type="text"
                                        size="small"
                                        value={title}
                                        name="title"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="제목을 입력하세요."
                                        fullWidth
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>썸네일 이미지</th>
                                <td>
                                    <ThumbnailAttach
                                        thumbnail={
                                            thumbnail &&
                                            (thumbnail.indexOf('http') === -1 ? `${boardThumbnailUrl}/${thumbnail}` : thumbnail)
                                        }
                                        handleChange={handleFileChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>요약 설명</th>
                                <td>
                                    <TextField
                                        id="filled-hidden-label-small"
                                        type="text"
                                        size="small"
                                        value={description}
                                        name="description"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="썸네일 하단에 표시될 요약 설명을 입력하세요."
                                        fullWidth
                                        multiline
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>내용</th>
                                <td>
                                    <JoditEditor
                                        ref={editorRef}
                                        value={content}
                                        config={config}
                                        onBlur={(newContent) => setContent(newContent)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>해시태그</th>
                                <td>
                                    <ReactTags
                                        tags={tags}
                                        suggestions={suggestions}
                                        delimiters={delimiters}
                                        handleDelete={handleDelete}
                                        handleAddition={handleAddition}
                                        handleDrag={handleDrag}
                                        handleTagClick={handleTagClick}
                                        inputFieldPosition="inline"
                                        placeholder="태그 입력 후 엔터"
                                        autocomplete
                                        className={{
                                            tags: 'tagsClass'
                                        }}
                                    />
                                </td>
                            </tr>
                            {createAccountName ? (
                                <tr>
                                    <th className={'tb--title'}>등록자</th>
                                    <td>{createAccountName}</td>
                                </tr>
                            ) : (
                                <></>
                            )}
                        </tbody>
                    </table>
                </div>

                <TopInputLayout>
                    <InputLayout>
                        <Button disableElevation size="small" type="submit" variant="outlined_d" color="secondary" onClick={listClick}>
                            목록
                        </Button>
                    </InputLayout>
                    {!id && (
                        <ButtonLayout>
                            <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={addClick}>
                                등록
                            </Button>
                        </ButtonLayout>
                    )}
                    {id && (
                        <ButtonLayout>
                            <Button
                                disableElevation
                                size="medium"
                                type="submit"
                                variant="contained"
                                color="secondary"
                                onClick={deleteClick}
                            >
                                삭제
                            </Button>
                            <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={saveClick}>
                                저장
                            </Button>
                        </ButtonLayout>
                    )}
                </TopInputLayout>

                {errorMessage && (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                )}
            </Grid>
        </Grid>
    );
};

export default Post;
