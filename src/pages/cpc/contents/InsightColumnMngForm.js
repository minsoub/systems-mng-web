import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// material-ui
// eslint-disable-next-line prettier/prettier
import {
    Button,
    Grid,
    Stack,
    TextField,
    Typography,
    FormControl,
    Select,
    MenuItem
} from '@mui/material';
import MainCard from 'components/MainCard';
import BoardMasterApi from 'apis/cpc/board/boardmasterapi';
import BoardApi from 'apis/cpc/board/boardapi';
import ErrorScreen from 'components/ErrorScreen';
import ThumbnailAttach from './ThumbnailAttach';
import JoditEditor from 'jodit-react';
import { WithContext as ReactTags } from 'react-tag-input';
import './ReactTags.css';

const InsightColumnMngForm = () => {
    const navigate = useNavigate();
    const { boardId } = useParams();
    const boardMasterId = 'CPC_INSIGHT_COLUMN';
    const [resBoardMaster, boardMasterError, loading, { searchBoardMaster }] = BoardMasterApi();
    const [responseData, requestError, resLoading, { searchBoard, createBoard, updateBoard, deleteBoard }] = BoardApi();
    const boardThumbnailUrl = process.env.REACT_APP_BOARD_SERVER_URL;

    ////////////////////////////////////////////////////
    // 공통 에러 처리
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    ////////////////////////////////////////////////////

    // 입력 값
    const [id, setId] = useState('');
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [contributor, setContributor] = useState('');
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
    const [content, setContent] = useState('');
    const config = {
        language: 'ko',
        readonly: false,
        placeholder: '내용을 입력하세요.',
        enableDragAndDropFileToEditor: true,
        imageDefaultWidth: null,
        uploader: {
            insertImageAsBase64URI: false,
            url: process.env.REACT_APP_DEFAULT_API_URL + '/mng/cpc/board/upload',
            headers: { Authorization: `${Authorization}`, site_id: process.env.REACT_APP_DEFAULT_SITE_ID },
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
            console.log('error requestError');
            console.log(requestError);
            setErrorTitle('Error Message');
            setErrorMessage(requestError);
            setOpen(true);
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
                setCategory(responseData.data.data.category);
                setTitle(responseData.data.data.title);
                setThumbnail(responseData.data.data.thumbnail);
                setDescription(responseData.data.data.description);
                setContent(responseData.data.data.contents);
                setContributor(responseData.data.data.contributor);
                setCreateAccountName(responseData.data.data.createAccountName);

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
                setCreateAccountName(responseData.data.data.createAccountName);
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
            case 'category':
                setCategory(e.target.value);
                break;
            case 'thumbnail':
                setThumbnail(e.target.value);
                break;
            case 'description':
                setDescription(e.target.value);
                break;
            case 'title':
                setTitle(e.target.value);
                break;
            case 'contributor':
                setContributor(e.target.value);
                break;
            default:
                break;
        }
    };

    // 목록
    const listClick = () => {
        console.log('listClick called...');
        navigate('/cpc/contents/insight-column/list');
    };

    const isValidate = () => {
        if (!category) {
            alert('카테고리를 선택해주세요.');
            return false;
        }
        if (!title) {
            alert('제목을 입력해주세요.');
            return false;
        }
        if (!content) {
            alert('내용을 입력해주세요.');
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
                category,
                title,
                description,
                thumbnail,
                contents: content,
                tags: inputTags,
                contributor
            };
            const formData = new FormData();
            formData.append('boardRequest', new Blob([JSON.stringify(data)], { type: 'application/json' }));
            thumbnailFile && formData.append('file', thumbnailFile, { type: 'multipart/form-data' });
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
                category,
                title,
                description,
                thumbnail,
                contents: content,
                tags: inputTags,
                contributor
            };
            const formData = new FormData();
            formData.append('boardRequest', new Blob([JSON.stringify(data)], { type: 'application/json' }));
            thumbnailFile && formData.append('file', thumbnailFile, { type: 'multipart/form-data' });
            console.log(formData);
            updateBoard(boardMasterId, data.id, formData);
        }
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h3">콘텐츠 관리(인사이트 칼럼)</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">Home &gt; 사이트 운영 &gt; 콘텐츠 관리 &gt; 인사이트 칼럼</Typography>
                    </Grid>
                    <Grid container spacing={2}></Grid>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <Grid container spacing={3}>
                        <Grid item xs={8} sm={1.5}>
                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                <Stack spacing={0}>카테고리</Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs={8} sm={4}>
                            <FormControl sx={{ m: 0, minWidth: 160 }} size="small" required fullWidth>
                                <Select name="category" label="카테고리" value={category} onChange={handleChange}>
                                    <MenuItem value="">선택</MenuItem>
                                    <MenuItem value="전문가 칼럼">전문가 칼럼</MenuItem>
                                    <MenuItem value="오피니언 칼럼">오피니언 칼럼</MenuItem>
                                    <MenuItem value="빗썸경제연구소">빗썸경제연구소</MenuItem>
                                    {/* {categories.map((category, index) => {
                                        <MenuItem key={index} value={category}>
                                            {category}
                                        </MenuItem>;
                                    })} */}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={8} sm={1.5}>
                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                <Stack spacing={0}>제목</Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs>
                            <FormControl sx={{ m: 0 }} size="small" required fullWidth>
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
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={8} sm={1.5}>
                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                <Stack spacing={0}>썸네일 이미지</Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs>
                            <ThumbnailAttach
                                thumbnail={
                                    thumbnail && (thumbnail.indexOf('http') === -1 ? `${boardThumbnailUrl}/${thumbnail}` : thumbnail)
                                }
                                handleChange={handleFileChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={8} sm={1.5}>
                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                <Stack spacing={0}>요약 설명</Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs>
                            <FormControl sx={{ mt: 1, mb: 1 }} size="small" required fullWidth>
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
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={8} sm={1.5}>
                            <FormControl sx={{ m: 1 }} size="small">
                                <Stack spacing={0}>내용</Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs>
                            <FormControl sx={{ m: 0 }} fullWidth>
                                <JoditEditor
                                    ref={editorRef}
                                    value={content}
                                    config={config}
                                    onBlur={(newContent) => setContent(newContent)}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={8} sm={1.5}>
                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                <Stack spacing={0}>해시태그</Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs>
                            <FormControl sx={{ mt: 1 }} size="small" required fullWidth>
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
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={8} sm={1.5}>
                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                <Stack spacing={0}>기고자 정보</Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs={8} sm={4}>
                            <FormControl sx={{ m: 0, minWidth: 160 }} size="small" required fullWidth>
                                <Select name="contributor" label="기고자 정보" value={contributor} onChange={handleChange}>
                                    <MenuItem value="">선택</MenuItem>
                                    <MenuItem value="김상겸 변호사">김상겸 변호사</MenuItem>
                                    <MenuItem value="김휘강 교수">김휘강 교수</MenuItem>
                                    <MenuItem value="박상혁 기자">박상혁 기자</MenuItem>
                                    <MenuItem value="이데일리 부국장">이데일리 부국장</MenuItem>
                                    <MenuItem value="하종은 병원장">하종은 병원장</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    {createAccountName && (
                        <Grid container spacing={3}>
                            <Grid item xs={8} sm={1.5}>
                                <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                    <Stack spacing={0}>등록자</Stack>
                                </FormControl>
                            </Grid>
                            <Grid item xs mr={1}>
                                <FormControl sx={{ m: 0, minWidth: 180, maxHeight: 30 }} size="small" required fullWidth>
                                    {createAccountName}
                                </FormControl>
                            </Grid>
                        </Grid>
                    )}
                </MainCard>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={8} sm={0.8}>
                        <FormControl sx={{ m: 1 }} size="small">
                            <Button disableElevation size="small" type="submit" variant="contained" color="secondary" onClick={listClick}>
                                목록
                            </Button>
                        </FormControl>
                    </Grid>
                    {!id && (
                        <Grid item xs={8} sm={0.6}>
                            <FormControl sx={{ m: 1 }} size="small">
                                <Button disableElevation size="small" type="submit" variant="contained" color="primary" onClick={addClick}>
                                    등록
                                </Button>
                            </FormControl>
                        </Grid>
                    )}
                    {id && (
                        <Grid container xs={8} direction="row" justifyContent="flex-end" alignItems="center">
                            <Grid item xs={8} sm={1}>
                                <FormControl sx={{ m: 1 }} size="small">
                                    <Button
                                        disableElevation
                                        size="small"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        onClick={deleteClick}
                                    >
                                        삭제
                                    </Button>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8} sm={0.1}></Grid>
                            <Grid item xs={8} sm={1}>
                                <FormControl sx={{ m: 1 }} size="small">
                                    <Button
                                        disableElevation
                                        size="small"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        onClick={saveClick}
                                    >
                                        저장
                                    </Button>
                                </FormControl>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} />
            </Grid>
        </Grid>
    );
};

export default InsightColumnMngForm;
