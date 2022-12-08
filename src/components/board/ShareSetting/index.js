import React, { useEffect, useState } from 'react';
import { Typography, TextField, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { activeShareTitle, activeShareDesc, activeShareBtnName } from 'store/reducers/cms/DetailData';
import TopInputLayout from 'components/Common/TopInputLayout';
import { humanFileSize } from 'utils/CommonUtils';
import styles from './styles.module.scss';
import cx from 'classnames';

// eslint-disable-next-line react/prop-types
const ShareSetting = ({ type, editMode }) => {
    const dispatch = useDispatch();
    // 인풋 관리
    const [inputs, setInputs] = useState({
        shareTitle: '',
        shareDesc: '',
        shareBtnName: ''
    });
    const { shareTitle, shareDesc, shareBtnName } = inputs;
    // 파일 정보
    const [file_part, setFilePart] = useState();
    const [file, setFile] = useState('');

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
    useEffect(() => {
        // console.log('editMode', editMode);
    }, [editMode]);

    // 입력 박스 입력 시 호출
    const fileHandleChange = (e) => {
        if (!e.target.files[0]) {
            setFilePart();
            return;
        }
        setFile(e.target.files[0].name);
        setFilePart(e.target.files[0]);
    };
    const fileSave = (data) => {
        if (!file) {
            alert('파일을 업로드 하지 않았습니다.');
            return;
        }
        const formData = new FormData();
        formData.append('file', file_part);
        formData.append('fileName', file);
        formData.append('fileType', file_part.type);
        // 3.2MB로 계산하기
        formData.append('fileSize', humanFileSize(file_part.size, true, 2));

        console.log(file_part);
        console.log(file);
        console.log(file_part.type);
        console.log(humanFileSize(file_part.size, true, 2));
        //insertChatFile(formData);
    };

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
                                        placeholder="공유할 페이지 제목을 입력하세요."
                                        fullWidth
                                    />
                                ) : (
                                    <>공지사항 | 빗썸</>
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
                                        placeholder="공유할 페이지 설명을 입력하세요."
                                        fullWidth
                                    />
                                ) : (
                                    <>공지사항 입니다. 디스크립션을 작성하시면 됩니다.</>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th className={'tb--title'}>이미지</th>
                            <td className="add_file">
                                {editMode ? (
                                    <TopInputLayout className={`${styles.inputWrap} file__upload--box`}>
                                        <div className={`${styles.file_name}`}>
                                            image.png<em>(10.00KB)</em>
                                        </div>
                                        <TextField
                                            type="file"
                                            id="file"
                                            name="file"
                                            size="medium"
                                            className="file__upload--field"
                                            onChange={fileHandleChange}
                                            inputProps={{
                                                accept: '.jpg, .jpeg, .png, .gif'
                                            }}
                                        />
                                        &nbsp;
                                        <Button
                                            className={`${styles.file_dave_btn}`}
                                            disableElevation
                                            size="medium"
                                            type="button"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => fileSave(file)}
                                        >
                                            업로드
                                        </Button>
                                    </TopInputLayout>
                                ) : (
                                    <>
                                        image.png<em>(10.00KB)</em>
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
                                        placeholder="공유 버튼명을 입력해 주세요."
                                        fullWidth
                                    />
                                ) : (
                                    <>자세히 보기</>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )};
export default ShareSetting;
