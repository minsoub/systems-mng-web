import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Grid, MenuItem, Select, TextField } from '@mui/material';
import BoardMasterApi from 'apis/cpc/board/boardmasterapi';
import BoardApi from 'apis/cpc/board/boardapi';
import ErrorScreen from 'components/ErrorScreen';
import JoditEditor from 'jodit-react';
import ButtonLayout from 'components/Common/ButtonLayout';
import TopInputLayout from 'components/Common/TopInputLayout';
import HeaderTitle from 'components/HeaderTitle';
import cx from 'classnames';
import '../BoardList.module.scss';
import './style.scss';

const Post = () => {
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
    const parentErrorClear = () => {
        setOpen(false);
        setErrorTitle('');
        setErrorMessage('');
    };
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
                setCreateAccountName(responseData.data.data.create_account_name);
                break;
            case 'createBoard':
                alert('등록되었습니다.');
                setId(responseData.data.data.id);
                setCreateAccountName(responseData.data.data.create_account_name);
                listClick();
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
            alert('카테고리를 선택해 주세요.');
            return false;
        }
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
        <Grid container rowSpacing={4} columnSpacing={2.75} className="cpcContentsDamageReg">
            <Grid item xs={12}>
                <HeaderTitle titleNm="피해사례" menuStep01="사이트 운영" menuStep02="컨텐츠 관리" menuStep03="피해사례" />

                <div className={cx('common-grid--layout')}>
                    <table>
                        <tbody>
                            <tr>
                                <th className={'tb--title'}>카테고리</th>
                                <td>
                                    <Select name="category" label="카테고리" value={category} onChange={handleChange}>
                                        <MenuItem value="">선택</MenuItem>
                                        <MenuItem value="피싱">피싱</MenuItem>
                                        <MenuItem value="폰지">폰지</MenuItem>
                                        <MenuItem value="스캠">스캠</MenuItem>
                                        <MenuItem value="도용">도용</MenuItem>
                                        <MenuItem value="기타">기타</MenuItem>
                                    </Select>
                                </td>
                            </tr>
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
                    <Button disableElevation size="medium" type="submit" variant="outlined_d" color="secondary" onClick={listClick}>
                        목록
                    </Button>
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
