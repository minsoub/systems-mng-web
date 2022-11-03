import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Grid, TextField } from '@mui/material';
import BlockChainNewsApi from 'apis/cpc/board/newsapi';
import ErrorScreen from 'components/ErrorScreen';
import InputLayout from 'components/Common/InputLayout';
import ButtonLayout from 'components/Common/ButtonLayout';
import TopInputLayout from 'components/Common/TopInputLayout';
import HeaderTitle from 'components/HeaderTitle';
import cx from 'classnames';

// 블록체인 뉴스 게시물 등록 페이지
const Post = () => {
    const navigate = useNavigate();
    const { newsId } = useParams();
    const [responseData, requestError, resLoading, { searchNews, createNews, updateNews, deleteNews }] = BlockChainNewsApi();

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
    const [newspaper, setNewspaper] = useState('');
    const [title, setTitle] = useState('');
    const [thumbnail_url, setThumbnailUrl] = useState('');
    const [posting_date, setPostingDate] = useState('');
    const [link_url, setLinkUrl] = useState('');
    const [createAccountName, setCreateAccountName] = useState('');

    // onload
    useEffect(() => {
        setId(newsId);
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
                setCreateAccountName(responseData.data.data.create_account_name);
                break;
            case 'createNews':
                alert('등록되었습니다.');
                setId(responseData.data.data.id);
                setCreateAccountName(responseData.data.data.create_account_name);
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
            alert('언론사를 입력해 주세요.');
            return false;
        }
        if (!title) {
            alert('제목을 입력해 주세요.');
            return false;
        }
        if (!posting_date) {
            alert('뉴스 게시일을 선택해 주세요.');
            return false;
        }
        if (!link_url) {
            alert('뉴스 링크를 입력해 주세요.');
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
        <Grid container rowSpacing={4} columnSpacing={2.75}>
            <Grid item xs={12}>
                <HeaderTitle titleNm="블록체인 뉴스" menuStep01="사이트 운영" menuStep02="콘텐츠 관리" menuStep03="블록체인 뉴스" />

                <div className={cx('common-grid--layout')}>
                    <table>
                        <tbody>
                            <tr>
                                <th className={'tb--title'}>언론사</th>
                                <td>
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
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>뉴스 제목</th>
                                <td>
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
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>썸네일 이미지 링크</th>
                                <td>
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
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>뉴스 게시일</th>
                                <td>
                                    <TextField
                                        id="posting_date"
                                        name="posting_date"
                                        value={posting_date}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="date"
                                        defaultValue=""
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>뉴스 링크</th>
                                <td>
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
                                </td>
                            </tr>
                            {createAccountName && (
                                <tr>
                                    <th className={'tb--title'}>등록자</th>
                                    <td>{createAccountName}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TopInputLayout>
                    <InputLayout>
                        <Button disableElevation size="small" type="submit" variant="contained" color="secondary" onClick={listClick}>
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
                            <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={deleteClick}>
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
