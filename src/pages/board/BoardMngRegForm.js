import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { experimentalStyled as styled } from '@mui/material/styles';
// material-ui
// eslint-disable-next-line prettier/prettier
import {
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Paper,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import SiteApi from 'apis/site/siteapi';
import BoardMasterApi from 'apis/board/boardmasterapi';
import ErrorScreen from 'components/ErrorScreen';
import HeaderTitle from 'components/HeaderTitle';
import cx from 'classnames';
import InputLayout from 'components/Common/InputLayout';
import ButtonLayout from 'components/Common/ButtonLayout';
import TopInputLayout from 'components/Common/TopInputLayout';
import { WithContext as ReactTags } from 'react-tag-input';
import './ReactTags.scss';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const BoardMngRegForm = () => {
    const navigate = useNavigate();
    const { boardMasterId } = useParams();
    const [responseData, requestError, loading,
        {
            searchBoardTypes,
            searchPaginationTypes,
            searchAuthTypes,
            searchBoardMaster,
            createBoardMaster,
            updateBoardMaster
        }] = BoardMasterApi();
    const [resData, reqErr, resLoading, { siteSearch }] = SiteApi();

    ////////////////////////////////////////////////////
    // 공통 에러 처리
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    ////////////////////////////////////////////////////

    // 코드 데이터
    const [siteList, setSiteList] = useState([]);
    const [boardTypes, setBoardTypes] = useState([]);
    const [paginationTypes, setPaginationTypes] = useState([]);
    const [authTypes, setAuthTypes] = useState([]);

    // 입력 값
    const [id, setId] = useState('');
    const [site_id, setSiteId] = useState('');
    const [name, setName] = useState('');
    const [is_use, setIsUse] = useState(true);
    const [type, setType] = useState('CARD');

    const [is_allow_comment, setIsAllowComment] = useState(false);
    const [is_allow_reply, setIsAllowReply] = useState(false);
    const [is_allow_attach_file, setIsAllowAttachFile] = useState(false);
    const [is_use_secret, setIsUseSecret] = useState(false);

    const [is_use_category, setIsUseCategory] = useState(false);
    const [categories, setCategories] = useState([]);
    
    const [pagination_type, setPaginationType] = useState('MORE');
    const [count_per_page, setCountPerPage] = useState(6);
    
    const [is_use_tag, setIsUseTag] = useState(true);
    const [tags, setTags] = useState([]);

    const [sns_share, setSnsShare] = useState('');
    const [sns_kakaotalk, setSnsKakaotalk] = useState(true);
    const [sns_facebook, setSnsFacebook] = useState(true);
    const [sns_twitter, setSnsTwitter] = useState(true);
    const [sns_url, setSnsUrl] = useState(true);

    const [auth, setAuth] = useState('');
    const [auth_list, setAuthList] = useState('ALL_USER');
    const [auth_read, setAuthRead] = useState('ALL_USER');
    const [auth_write, setAuthWrite] = useState('ALL_USER');
    const [auth_comment, setAuthComment] = useState('ALL_USER');
    
    // 카테고리
    const KeyCodes = {
        comma: 188,
        enter: 13
    };
    const delimiters = [KeyCodes.comma, KeyCodes.enter];
    const handleCategoryDelete = (i) => {
        setCategories(categories.filter((category, index) => index !== i));
    };
    const handleCategoryAddition = (category) => {
        setCategories([...categories, category]);
    };
    const handleCategoryDrag = (category, currPos, newPos) => {
        const newCategories = categories.slice();

        newCategories.splice(currPos, 1);
        newCategories.splice(newPos, 0, category);

        // re-render
        setCategories(newCategories);
    };
    const handleCategoryClick = (index) => {
        console.log(`The category at index ${index} was clicked`);
    };

    // 태그
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
        siteSearch(true, '');
        searchBoardTypes();
        searchPaginationTypes();
        searchAuthTypes();
    }, []);

    useEffect(() => {
        if (boardMasterId) {
            setId(boardMasterId);
            searchBoardMaster(boardMasterId);
        }
    }, [boardMasterId]);

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

    // 사이트
    useEffect(() => {
        if (!resData) {
            return;
        }
        switch (resData.transactionId) {
            case 'siteList':
                if (resData.data.data) {
                    let siteData = resData.data.data;
                    let list = [];
                    siteData.map((site) => {
                        const s = { id: site.id, name: site.name };
                        list.push(s);
                    });
                    setSiteList(list);
                }
                break;
            default:
        }
    }, [resData]);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getBoardTypes':
                if (responseData.data.data) {
                    let codeData = responseData.data.data[0];
                    let list = [];
                    codeData.map((info) => {
                        const s = { code: info.code, title: info.title };
                        list.push(s);
                    });
                    setBoardTypes(list);
                }
                break;

            case 'getPaginationTypes':
                if (responseData.data.data) {
                    let codeData = responseData.data.data[0];
                    let list = [];
                    codeData.map((info) => {
                        const s = { code: info.code, title: info.title };
                        list.push(s);
                    });
                    setPaginationTypes(list);
                }
                break;

            case 'getAuthTypes':
                if (responseData.data.data) {
                    let codeData = responseData.data.data[0];
                    let list = [];
                    codeData.map((info) => {
                        const s = { code: info.code, title: info.title };
                        list.push(s);
                    });
                    setAuthTypes(list);
                }
                break;

            case 'getBoardMaster':
                if (!responseData.data.data) {
                    alert(`게시판 ID[${boardMasterId}]의 데이터가 없습니다.`);
                    navigate(`/board/list`);
                    return;
                }

                setId(responseData.data.data.id);
                setSiteId(responseData.data.data.site_id);
                setName(responseData.data.data.name);
                setIsUse(responseData.data.data.is_use);
                setType(responseData.data.data.type);
                setIsAllowComment(responseData.data.data.is_allow_comment);
                setIsAllowReply(responseData.data.data.is_allow_reply);
                setIsAllowAttachFile(responseData.data.data.is_allow_attach_file);
                setIsUseCategory(responseData.data.data.is_use_category);
                setPaginationType(responseData.data.data.pagination_type);
                setCountPerPage(responseData.data.data.count_per_page);
                setIsUseTag(responseData.data.data.is_use_tag);
                setIsUseSecret(responseData.data.data.is_use_secret);
                setSnsShare(responseData.data.data.sns_share);
                setSnsKakaotalk(responseData.data.data.sns_share.kakaotalk);
                setSnsFacebook(responseData.data.data.sns_share.facebook);
                setSnsTwitter(responseData.data.data.sns_share.twitter);
                setSnsUrl(responseData.data.data.sns_share.url);

                if (responseData.data.data.auth) {
                    setAuth(responseData.data.data.auth);
                    setAuthList(responseData.data.data.auth.list);
                    setAuthRead(responseData.data.data.auth.read);
                    setAuthWrite(responseData.data.data.auth.write);
                    setAuthComment(responseData.data.data.auth.comment);
                }

                if (responseData.data.data.categories) {
                    const tempCategories = responseData.data.data.categories.map((category) => {
                        return {
                            id: category,
                            text: category
                        };
                    });
                    setCategories(tempCategories);
                }

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

            case 'createBoardMaster':
                alert('등록되었습니다.');
                setId(responseData.data.data.id);
                navigate(`/board/reg/${responseData.data.data.id}`);
                break;

            case 'updateBoardMaster':
                alert('저장되었습니다.');
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
            case 'id':
                setId(e.target.value);
                break;
            case 'site_id':
                setSiteId(e.target.value);
                break;
            case 'name':
                setName(e.target.value);
                break;
            case 'is_use':
                setIsUse(e.target.checked);
                break;
            case 'type':
                setType(e.target.value);
                break;
            case 'is_allow_comment':
                setIsAllowComment(e.target.checked);
                break;
            case 'is_allow_reply':
                setIsAllowReply(e.target.checked);
                break;
            case 'is_allow_attach_file':
                setIsAllowAttachFile(e.target.checked);
                break;
            case 'is_use_category':
                setIsUseCategory(e.target.checked);
                break;
            case 'pagination_type':
                setPaginationType(e.target.value);
                break;
            case 'count_per_page':
                setCountPerPage(e.target.value);
                break;
            case 'is_use_tag':
                setIsUseTag(e.target.checked);
                break;
            case 'is_use_secret':
                setIsUseSecret(e.target.checked);
                break;
            case 'sns_kakaotalk':
                setSnsKakaotalk(e.target.checked);
                break;
            case 'sns_facebook':
                setSnsFacebook(e.target.checked);
                break;
            case 'sns_twitter':
                setSnsTwitter(e.target.checked);
                break;
            case 'sns_url':
                setSnsUrl(e.target.checked);
                break;
            case 'auth_list':
                setAuthList(e.target.value);
                break;
            case 'auth_read':
                setAuthRead(e.target.value);
                break;
            case 'auth_write':
                setAuthWrite(e.target.value);
                break;
            case 'auth_comment':
                setAuthComment(e.target.value);
                break;
            default:
                break;
        }
    };

    // 목록
    const listClick = () => {
        console.log('listClick called...');
        navigate('/board/list');
    };

    const isValidate = () => {
        if (!site_id) {
            alert('사이트명을 선택해주세요.');
            return false;
        }
        if (!id) {
            alert('게시판 ID를 입력해주세요.');
            return false;
        }
        if (!name) {
            alert('게시판명을 입력해주세요.');
            return false;
        }
        if (!type) {
            alert('게시판 타입을 선택해주세요.');
            return false;
        }
        return true;
    };

    // 등록
    const addClick = () => {
        console.log('addClick called...');

        if (!isValidate()) return;
        if (confirm('등록 하시겠습니까?')) {
            const inputCategories = categories.map((tag) => {
                return tag.text;
            });
            const inputTags = tags.map((tag) => {
                return tag.text;
            });
            const data = {
                id,
                site_id,
                name,
                is_use,
                type,
                is_allow_comment,
                is_allow_reply,
                is_allow_attach_file,
                is_use_secret,
                is_use_category,
                categories: inputCategories,
                pagination_type,
                count_per_page,
                is_use_tag,
                tags: inputTags,
                sns_share: {
                    kakaotalk: sns_kakaotalk,
                    facebook: sns_facebook,
                    twitter: sns_twitter,
                    url: sns_url
                },
                auth: {
                    list: auth_list,
                    read: auth_read,
                    write: auth_write,
                    comment: auth_comment
                }
            };
            createBoardMaster(data);
        }
    };

    // 저장
    const saveClick = () => {
        console.log('saveClick called...');

        if (!isValidate()) return;
        if (confirm('저장 하시겠습니까?')) {
            const inputCategories = categories.map((tag) => {
                return tag.text;
            });
            const inputTags = tags.map((tag) => {
                return tag.text;
            });
            const data = {
                id,
                site_id,
                name,
                is_use,
                type,
                is_allow_comment,
                is_allow_reply,
                is_allow_attach_file,
                is_use_secret,
                is_use_category,
                categories: inputCategories,
                pagination_type,
                count_per_page,
                is_use_tag,
                tags: inputTags,
                sns_share: {
                    kakaotalk: sns_kakaotalk,
                    facebook: sns_facebook,
                    twitter: sns_twitter,
                    url: sns_url
                },
                auth: {
                    list: auth_list,
                    read: auth_read,
                    write: auth_write,
                    comment: auth_comment
                }
            };
            updateBoardMaster(data);
        }
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle titleNm="게시판 생성" menuStep01="통합 관리" menuStep02="통합 게시판 관리" />

                <div className={cx('common-grid--layout2')}>
                    <table className={cx('two-column-table')}>
                        <tbody>
                            <tr>
                                <th className={'tb--title'} style={{minWidth: '150px'}}>사이트명</th>
                                <td>
                                    <Select name="site_id" label="사이트명" value={site_id} onChange={handleChange}>
                                        {siteList.map((item) => (
                                            <MenuItem key={item.id} value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </td>
                                <th className={'tb--title'}>사용여부</th>
                                <td>
                                    <FormControlLabel
                                        control={<Checkbox checked={is_use} name="is_use" onChange={handleChange} />}
                                        label="사용"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title'} style={{minWidth: '150px'}}>게시판 ID</th>
                                <td>
                                    <TextField
                                            id="filled-hidden-label-small"
                                            type="text"
                                            size="small"
                                            value={id}
                                            name="id"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder=""
                                            disabled={boardMasterId}
                                        />
                                </td>
                                <th className={'tb--title'}>게시판명</th>
                                <td>
                                    <TextField
                                        id="filled-hidden-label-small"
                                        type="text"
                                        size="small"
                                        value={name}
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder=""
                                        fullwidth
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title'} style={{minWidth: '150px'}}>게시판 타입</th>
                                <td>
                                    <Select name="type" label="타입" value={type} onChange={handleChange}>
                                        {boardTypes.map((item) => (
                                            <MenuItem key={`${item.code}`} value={`${item.code}`}>
                                                {item.title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </td>
                                <th className={'tb--title'}>게시판 옵션</th>
                                <td>
                                    <FormControlLabel
                                        control={<Checkbox checked={is_allow_comment} name="is_allow_comment" onChange={handleChange} />}
                                        label="댓글 사용"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={is_allow_reply} name="is_allow_reply" onChange={handleChange} />}
                                        label="답변글 사용"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={is_allow_attach_file} name="is_allow_attach_file" onChange={handleChange} />}
                                        label="파일 업로드"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={is_use_secret} name="is_use_secret" onChange={handleChange} />}
                                        label="비밀글 사용"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title'} style={{minWidth: '150px'}}>페이징 방식</th>
                                <td>
                                    <Select name="pagination_type" label="페이징 방식" value={pagination_type} onChange={handleChange}>
                                        {paginationTypes.map((item) => (
                                            <MenuItem key={`${item.code}`} value={`${item.code}`}>
                                                {item.title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </td>
                                <th className={'tb--title'}>리스트 개수</th>
                                <td>
                                    <TextField
                                        id="filled-hidden-label-small"
                                        type="number"
                                        size="small"
                                        value={count_per_page}
                                        name="count_per_page"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder=""
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>카테고리</th>
                                <td colSpan={3}>
                                    <FormControlLabel
                                        control={<Checkbox checked={is_use_category} name="is_use_category" onChange={handleChange} />}
                                        label="사용"
                                    />
                                    <ReactTags
                                        tags={categories}
                                        delimiters={delimiters}
                                        handleDelete={handleCategoryDelete}
                                        handleAddition={handleCategoryAddition}
                                        handleDrag={handleCategoryDrag}
                                        handleTagClick={handleCategoryClick}
                                        inputFieldPosition="inline"
                                        placeholder="카테고리 입력 후 엔터"
                                        autocomplete
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>태그</th>
                                <td colSpan={3}>
                                    <FormControlLabel
                                        control={<Checkbox checked={is_use_tag} name="is_use_tag" onChange={handleChange} />}
                                        label="사용"
                                    />
                                    <ReactTags
                                        tags={tags}
                                        delimiters={delimiters}
                                        handleDelete={handleDelete}
                                        handleAddition={handleAddition}
                                        handleDrag={handleDrag}
                                        handleTagClick={handleTagClick}
                                        inputFieldPosition="inline"
                                        placeholder="태그 입력 후 엔터"
                                        autocomplete
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>SNS 공유</th>
                                <td colSpan={3}>
                                    <FormControlLabel
                                        control={<Checkbox checked={sns_kakaotalk} name="sns_kakaotalk" onChange={handleChange} />}
                                        label="카카오"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={sns_facebook} name="sns_facebook" onChange={handleChange} />}
                                        label="페이스북"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={sns_twitter} name="sns_twitter" onChange={handleChange} />}
                                        label="트위터"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={sns_url} name="sns_url" onChange={handleChange} />}
                                        label="URL복사"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>권한</th>
                                <td colSpan={3}>
                                    <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, sm: 8, md: 16 }}>
                                        <Grid item xs={2} sm={4} md={4}>
                                            <Item>
                                                <h3>목록</h3>
                                                <br />
                                                <Select name="auth_list" label="권한목록" value={auth_list} onChange={handleChange}>
                                                    {authTypes.map((item) => (
                                                        <MenuItem key={`${item.code}`} value={`${item.code}`}>
                                                            {item.title}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </Item>
                                        </Grid>
                                        <Grid item xs={2} sm={4} md={4}>
                                            <Item>
                                                <h3>읽기</h3>
                                                <br />
                                                <Select name="auth_read" label="권한읽기" value={auth_read} onChange={handleChange}>
                                                    {authTypes.map((item) => (
                                                        <MenuItem key={`${item.code}`} value={`${item.code}`}>
                                                            {item.title}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </Item>
                                        </Grid>
                                        <Grid item xs={2} sm={4} md={4}>
                                            <Item>
                                                <h3>글작성</h3>
                                                <br />
                                                <Select name="auth_write" label="권한글작성" value={auth_write} onChange={handleChange}>
                                                    {authTypes.map((item) => (
                                                        <MenuItem key={`${item.code}`} value={`${item.code}`}>
                                                            {item.title}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </Item>
                                        </Grid>
                                        <Grid item xs={2} sm={4} md={4}>
                                            <Item>
                                                <h3>댓글</h3>
                                                <br />
                                                <Select name="auth_comment" label="권한댓글" value={auth_comment} onChange={handleChange}>
                                                    {authTypes.map((item) => (
                                                        <MenuItem key={`${item.code}`} value={`${item.code}`}>
                                                            {item.title}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </Item>
                                        </Grid>
                                    </Grid>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <TopInputLayout>
                    <InputLayout>
                        <Button disableElevation size="small" type="submit" variant="contained" color="secondary" onClick={listClick}>
                            목록
                        </Button>
                    </InputLayout>
                    {!boardMasterId && (
                        <ButtonLayout>
                            <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={addClick}>
                                등록
                            </Button>
                        </ButtonLayout>
                    )}
                    {boardMasterId && (
                        <ButtonLayout>
                            <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={saveClick}>
                                저장
                            </Button>
                        </ButtonLayout>
                    )}
                </TopInputLayout>

                {errorMessage ? (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                ) : null}
            </Grid>
        </Grid>
    );
}

export default BoardMngRegForm;
