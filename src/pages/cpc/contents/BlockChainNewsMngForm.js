import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// material-ui
// eslint-disable-next-line prettier/prettier
import {
    Button,
    Grid,
    Stack,
    TextField,
    Typography,
    FormControl
} from '@mui/material';
import MainCard from 'components/MainCard';
import BlockChainNewsApi from 'apis/cpc/board/newsapi';
import ErrorScreen from 'components/ErrorScreen';

const BlockChainNewsMngForm = () => {
    const navigate = useNavigate();
    const { newsId } = useParams();
    const [responseData, requestError, resLoading, { searchNews, createNews, updateNews, deleteNews }] = BlockChainNewsApi();

    ////////////////////////////////////////////////////
    // 공통 에러 처리
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    ////////////////////////////////////////////////////

    // 입력 값
    const [id, setId] = useState('');
    const [newspaper, setNewspaper] = useState('');
    const [title, setTitle] = useState('');
    const [thumbnail_url, setThumbnailUrl] = useState('');
    const [posting_date, setPostingDate] = useState('');
    const [link_url, setLinkUrl] = useState('');

    // onload
    useEffect(() => {
        setId(newsId);
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
        if (id) {
            searchNews(id);
        }
    }, [id]);

    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getNews':
                setNewspaper(responseData.data.data.newspaper);
                setTitle(responseData.data.data.title);
                setThumbnailUrl(responseData.data.data.thumbnail_url);
                setPostingDate(responseData.data.data.posting_date);
                setLinkUrl(responseData.data.data.link_url);
                break;
            case 'createNews':
                alert('등록되었습니다.');
                setId(responseData.data.data.id);
                break;
            case 'updateNews':
                alert('저장되었습니다.');
                break;
            case 'deleteNews':
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
            case 'newspaper':
                setNewspaper(e.target.value);
                break;
            case 'title':
                setTitle(e.target.value);
                break;
            case 'thumbnail_url':
                setThumbnailUrl(e.target.value);
                break;
            case 'posting_date':
                setPostingDate(e.target.value);
                break;
            case 'link_url':
                setLinkUrl(e.target.value);
                break;
            default:
                break;
        }
    };

    // 목록
    const listClick = () => {
        console.log('listClick called...');
        navigate('/cpc/contents/blockchain-news/list');
    };

    const isValidate = () => {
        if (!newspaper) {
            alert('언론사를 입력해주세요.');
            return false;
        }
        if (!title) {
            alert('제목을 입력해주세요.');
            return false;
        }
        if (!posting_date) {
            alert('뉴스 게시일을 선택해주세요.');
            return false;
        }
        if (!link_url) {
            alert('뉴스 링크를 입력해주세요.');
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
                newspaper,
                title,
                thumbnail_url,
                posting_date,
                link_url
            };
            console.log(data);
            createNews(data);
        }
    };

    // 삭제
    const deleteClick = () => {
        console.log('deleteClick called...');
        if (confirm('삭제 하시겠습니까?')) {
            deleteNews(id);
        }
    };

    // 저장
    const saveClick = () => {
        console.log('saveClick called...');

        if (!isValidate()) return;
        if (confirm('저장 하시겠습니까?')) {
            const data = {
                id,
                newspaper,
                title,
                thumbnail_url,
                posting_date,
                link_url
            };
            console.log(data);
            updateNews(data);
        }
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h3">콘텐츠 관리(블록체인 뉴스)</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">Home &gt; 사이트 운영 &gt; 콘텐츠 관리 &gt; 블록체인 뉴스</Typography>
                    </Grid>
                    <Grid container spacing={2}></Grid>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <Grid container spacing={3} mt={1}>
                        <Grid item xs={8} sm={1.5}>
                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                <Stack spacing={0}>언론사</Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs mr={1}>
                            <FormControl sx={{ m: 0, minWidth: 180, maxHeight: 30 }} size="small" required fullWidth>
                                <TextField
                                    id="filled-hidden-label-small"
                                    type="text"
                                    size="small"
                                    value={newspaper}
                                    name="newspaper"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="언론사를 입력하세요."
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={8} sm={1.5}>
                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                <Stack spacing={0}>뉴스 제목</Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs mr={1}>
                            <FormControl sx={{ m: 0, minWidth: 180, maxHeight: 30 }} size="small" required fullWidth>
                                <TextField
                                    id="filled-hidden-label-small"
                                    type="text"
                                    size="small"
                                    value={title}
                                    name="title"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="뉴스 제목을 입력하세요."
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={8} sm={1.5}>
                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                <Stack spacing={0}>썸네일 이미지 링크</Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs mr={1}>
                            <FormControl sx={{ m: 0, minWidth: 180, maxHeight: 30 }} size="small" required fullWidth>
                                <TextField
                                    id="filled-hidden-label-small"
                                    type="text"
                                    size="small"
                                    value={thumbnail_url}
                                    name="thumbnail_url"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="썸네일 이미지 링크를 입력하세요."
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={8} sm={1.5}>
                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                <Stack spacing={0}>뉴스 게시일</Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs mr={1}>
                            <FormControl sx={{ m: 0, minWidth: 180, maxHeight: 30 }} size="small" required fullWidth>
                                <TextField
                                    id="posting_date"
                                    name="posting_date"
                                    value={posting_date}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="date"
                                    defaultValue=""
                                    sx={{ width: 140 }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={8} sm={1.5}>
                            <FormControl sx={{ m: 1, minHeight: 30 }} size="small">
                                <Stack spacing={0}>뉴스 링크</Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs mr={1}>
                            <FormControl sx={{ m: 0, minWidth: 180, maxHeight: 30 }} size="small" required fullWidth>
                                <TextField
                                    id="filled-hidden-label-small"
                                    type="text"
                                    size="small"
                                    value={link_url}
                                    name="link_url"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="뉴스 링크를 입력하세요."
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
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

export default BlockChainNewsMngForm;
