import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// material-ui
// eslint-disable-next-line prettier/prettier
import { Button, Grid, Stack, TextField, Typography, FormControl, Select, MenuItem } from '@mui/material';
import MainCard from 'components/MainCard';
import BoardMasterApi from 'apis/cpc/board/boardmasterapi';
import BoardApi from 'apis/cpc/board/boardapi';
import ErrorScreen from 'components/ErrorScreen';
import JoditEditor from 'jodit-react';
import ButtonLayout from 'components/Common/ButtonLayout';
import TopInputLayout from 'components/Common/TopInputLayout';
import HeaderTitle from '../../../components/HeaderTitle';
import cx from 'classnames';
import './BoardList.css';

const DamageCaseMngForm = () => {
    const navigate = useNavigate();
    const { boardId } = useParams();
    const boardMasterId = 'CPC_DAMAGE_CASE';
    const [resBoardMaster, boardMasterError, loading, { searchBoardMaster }] = BoardMasterApi();
    const [responseData, requestError, resLoading, { searchBoard, createBoard, updateBoard, deleteBoard }] = BoardApi();
    const [categories, setCategories] = useState([]);

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
    const [createAccountName, setCreateAccountName] = useState('');

    let authData = null;
    if (localStorage.hasOwnProperty('authenticated')) {
        authData = JSON.parse(localStorage.getItem('authenticated'));
    }
    let Authorization = `Bearer ${authData.accessToken}`;

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
        if (resBoardMaster.data.data.is_use_category) {
            setCategories(resBoardMaster.data.data.categories);
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
                setContent(responseData.data.data.contents);
                setCreateAccountName(responseData.data.data.createAccountName);
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
        navigate('/cpc/contents/damage-case/list');
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
            const data = {
                title,
                contents: content,
                category
            };
            const formData = new FormData();
            formData.append('boardRequest', new Blob([JSON.stringify(data)], { type: 'application/json' }));
            console.log(data);
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
            const data = {
                id,
                title,
                contents: content,
                category
            };
            const formData = new FormData();
            formData.append('boardRequest', new Blob([JSON.stringify(data)], { type: 'application/json' }));
            console.log(data);
            updateBoard(boardMasterId, data.id, formData);
        }
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle titleNm="피해사례" menuStep01="사이트 운영" menuStep02="콘텐츠 관리" menuStep03="피해사례" />

                <MainCard sx={{ mt: 2 }} content={false}>
                    <Grid container spacing={3}>
                        <Grid item xs={8} sm={1.5}>
                            <Stack spacing={10} className={cx('borderTitle')}>
                                카테고리
                            </Stack>
                        </Grid>

                        <Grid item xs={8} sm={4}>
                            <FormControl sx={{ maxWidth: 250 }} size="medium" required fullWidth>
                                <Select name="category" label="카테고리" value={category} onChange={handleChange}>
                                    <MenuItem value="">선택</MenuItem>
                                    <MenuItem value="피싱">피싱</MenuItem>
                                    <MenuItem value="폰지">폰지</MenuItem>
                                    <MenuItem value="스캠">스캠</MenuItem>
                                    <MenuItem value="도용">도용</MenuItem>
                                    <MenuItem value="기타">기타</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={8} sm={1.5}>
                            <FormControl size="medium">
                                <Stack spacing={10} className={cx('borderTitle')}>
                                    제목
                                </Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs>
                            <TextField
                                id="filled-hidden-label-small"
                                type="text"
                                size="medium"
                                value={title}
                                name="title"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="제목을 입력하세요."
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={8} sm={1.5}>
                            <FormControl size="medium">
                                <Stack spacing={10} className={cx('borderTitle')}>
                                    내용
                                </Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs>
                            <FormControl>
                                <JoditEditor
                                    ref={editorRef}
                                    value={content}
                                    config={config}
                                    onBlur={(newContent) => setContent(newContent)}
                                    className="editor"
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    {createAccountName && (
                        <Grid container spacing={3}>
                            <Grid item xs={8} sm={1.5}>
                                <FormControl sx={{ m: 1, minHeight: 30 }} size="medium">
                                    <Stack spacing={0}>등록자</Stack>
                                </FormControl>
                            </Grid>
                            <Grid item xs mr={1}>
                                <FormControl sx={{ m: 0, minWidth: 180, maxHeight: 30 }} size="medium" required fullWidth>
                                    {createAccountName}
                                </FormControl>
                            </Grid>
                        </Grid>
                    )}
                </MainCard>
                <TopInputLayout>
                    <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={listClick}>
                        목록
                    </Button>
                    {!id && (
                        <Grid item xs={8}>
                            <ButtonLayout>
                                <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={addClick}>
                                    등록
                                </Button>
                            </ButtonLayout>
                        </Grid>
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
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} />
            </Grid>
        </Grid>
    );
};

export default DamageCaseMngForm;
