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
import JoditEditor from 'jodit-react';

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

    // 웹에디터
    const editorRef = useRef(null);
    const [content, setContent] = useState('');
    const config = {
        readonly: false,
        placeholder: '내용을 입력하세요.',
        uploader: {
            insertImageAsBase64URI: true
        },
        width: '100%',
        height: 700
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
            updateBoard(boardMasterId, formData);
        }
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h3">콘텐츠 관리(피해사례)</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">Home &gt; 사이트 운영 &gt; 콘텐츠 관리 &gt; 피해사례</Typography>
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
                                    <MenuItem value="피싱">피싱</MenuItem>
                                    <MenuItem value="폰지">폰지</MenuItem>
                                    <MenuItem value="스캠">스캠</MenuItem>
                                    <MenuItem value="도용">도용</MenuItem>
                                    <MenuItem value="기타">기타</MenuItem>
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
                            <FormControl sx={{ m: 0, minWidth: 180, maxHeight: 30 }} size="small" required fullWidth>
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

export default DamageCaseMngForm;