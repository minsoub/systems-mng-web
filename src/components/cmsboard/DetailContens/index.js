/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Select, MenuItem, TextField, Checkbox, FormControl, FormGroup, FormControlLabel, Button } from '@mui/material';

// library
import cx from 'classnames';
import moment from 'moment';

// project import
import Editor from 'components/editor/index';
import TopInputLayout from 'components/Common/TopInputLayout';
import EventModal from '../modal/EventModal';
import CustomTextfield from './CustomTextfield';
import EventContents from './EventContents';
import CustomSelectBox from './CustomSelectBox';

// transition
import {
    activeNotiCategory1,
    activeNotiCategory2,
    activeTitle,
    activeTopFixable,
    activePostState,
    activeFileId,
    activeThumbnailId,
    activeReservation,
    activeReservationDate,
} from 'store/reducers/cms/DetailData';
import BoardApi from 'apis/cms/boardapi';

// utils
import { changeDateType } from 'utils/CommonUtils';

// style
import styles from './styles.module.scss';

// =============|| DetailContens - Index ||============= //

const DetailContens = ({ type, editMode, detailData }) => {
    const dispatch = useDispatch();
    const [responseData, requestError, loading, { getCategory, fileInfo, downloadFileData }] = BoardApi();

    const [categoryList, setCategoryList] = useState([{ id: '0', name: '선택안함' }]); // 카테고리1 리스트
    const [reservationDate, setReservationDate] = useState(moment().format('YYYY.MM.DD A hh:mm')); // 게시 예약일자
    const [contentsData, setContentsData] = useState(''); // 내용
    const [fileName, setFileName] = useState(''); // 첨부파일 이름
    const [fileID, setFileID] = useState(''); // 첨부파일 아이디
    const [thumnailFileName, setThumnailFileName] = useState(''); // 썸네일 파일 이름
    const [thumnailFileID, setThumnailFileID] = useState(''); // 썸네일 파일 아이디
    const [downloadName, setDownloadName] = useState(''); // 다운로드 파일명
    const editParam = { editName: 'contentsEditor', value: { contentsData } }; // 에디터 설정관련

    const [inputs, setInputs] = useState({
        title: '', // 제목
        category1: '0', // 카테고리1
        category2: '0', // 카테고리2
        notiTopType: 0, // 상단고정
        visibleState: 0, // 공개 상태
        bannrState: 0, // 배너공지
        reservationState: false // 게시예약
    });
    const { title, category1, category2, notiTopType, visibleState, bannrState, reservationState } = inputs;
    const [open, setOpen] = useState(false); //팝업 오픈 관련 설정
    const [modalType, setModalType] = useState(0); // 팝업 형태
    // 상단고정 셀렉박스
    const notiSelectList = [
        { name: '일반', id: 0 },
        { name: '고정', id: 1 }
    ];

    const handleOpen = ($type) => {
        setModalType($type);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    useEffect(() => {
        setReservationDate(
            changeDateType(
                moment()
                    .add(+2, 'days')
                    .format('YYYY-MM-DD')
            )
        );
        if (type === 'notices') {
            getCategory('notices/categories/items');
        }
    }, []);
    const onChange = (e) => {
        const { name, value, checked, type } = e.target;
        const resultValue = type === 'checkbox' ? checked : value;
        setInputs({
            ...inputs,
            [name]: resultValue
        });
    };
    // 연동결과
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getCategory':
                if (responseData.data.data) {
                    const tempCate = categoryList.concat(responseData.data.data.contents);
                    setCategoryList(tempCate);
                }
                break;
            case 'fileInfo':
                if (responseData.data.data) {
                    const { id, name, extension } = responseData.data.data;
                    switch (id) {
                        case fileID:
                            setFileName(name + '.' + extension.toLowerCase());
                            break;
                        case thumnailFileID:
                            setThumnailFileName(name + '.' + extension.toLowerCase());
                            break;
                        default:
                            break;
                    }
                }
                break;
            case 'downloadFile':
                if (responseData.data) {
                    let res = responseData;
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${downloadName}`);
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
    const fileHandleChange = (e) => {
        const { name } = e.target;
        switch (name) {
            case 'addFile':
                setFileName(e.target.files[0].name);
                break;
            case 'thumnailFile':
                setThumnailFileName(e.target.files[0].name);
                break;
            default:
                break;
        }
    };
    const fileDeleteClickHandler = (e) => {
        const name = e.target.getAttribute('name');
        switch (name) {
            case 'addFile':
                setFileID('');
                setFileName('');
                document.getElementById('addFile').value = '';
                dispatch(activeFileId({ reduceFileId: '' }));
                break;
            case 'thumnailFile':
                setThumnailFileID('');
                setThumnailFileName('');
                document.getElementById('thumnailFile').value = '';
                dispatch(activeFileId({ reduceFileId: '' }));
                break;
            default:
                break;
        }
    };
    const thumnailFileClickHandler = () => {
        setDownloadName(thumnailFileName);
        downloadFileData(thumnailFileID);
    };
    const fileDownloadClickHandler = () => {
        setDownloadName(fileName);
        downloadFileData(fileID);
    };

    useEffect(() => {
        if (!detailData) return;
        // 불러온 데이터 삽입
        let _cate1 = '0';
        let _cate2 = '0';
        if (detailData.category_names) {
            _cate1 = detailData.category_names[0] ? detailData.category_names[0].id : '0';
            _cate2 = detailData.category_names[1] ? detailData.category_names[1].id : '0';
        }
        setInputs({
            ...inputs,
            ['category1']: _cate1,
            ['category2']: _cate2,
            ['title']: detailData.title,
            ['notiTopType']: detailData.is_fix_top ? 1 : 0,
            ['bannrState']: detailData.is_banner ? 1 : 0,
            ['visibleState']: detailData.is_show ? 1 : 0,
            ['reservationState']: detailData.is_schedule
        });

        setFileID(detailData.file_id);
        setThumnailFileID(detailData.thumbnail_file_id);
        setContentsData(detailData.content);
        setReservationDate(
            detailData.schedule_date
                ? changeDateType(moment(detailData.schedule_date).format('YYYY-MM-DD A hh:mm'))
                : changeDateType(
                      moment()
                          .add(+2, 'days')
                          .format('YYYY-MM-DD')
                  )
        );
    }, [detailData]);
    //-- value 변경시 reducersㅇ에 바로 저장 -S- //
    useEffect(() => {
        if (category1 === category2 && category1 !== '0') {
            alert('같은 카테고리를 선택하셨습니다.');
            setInputs({
                ...inputs,
                ['category1']: '0'
            });
            return;
        }
        dispatch(activeNotiCategory1({ reduceNotiCategory1: category1 }));
    }, [category1]);
    useEffect(() => {
        if (category1 === category2 && category2 !== '0') {
            alert('같은 카테고리를 선택하셨습니다.');
            setInputs({
                ...inputs,
                ['category2']: '0'
            });
            return;
        }
        dispatch(activeNotiCategory2({ reduceNotiCategory2: category2 }));
    }, [category2]);
    useEffect(() => {
        dispatch(activeTitle({ reduceTitle: title }));
    }, [title]);
    useEffect(() => {
        dispatch(activeTopFixable({ reduceTopFixable: notiTopType }));
    }, [notiTopType]);
    useEffect(() => {
        dispatch(activePostState({ reducePostState: visibleState }));
    }, [visibleState]);
    useEffect(() => {
        dispatch(activeReservation({ reduceReservation: reservationState }));
    }, [reservationState]);
    useEffect(() => {
        dispatch(activeReservationDate({ reduceReservationDate: reservationDate }));
    }, [reservationDate]);
    useEffect(() => {
        if (!fileID) return;
        dispatch(activeFileId({ reduceFileId: fileID }));
        fileInfo(fileID);
    }, [fileID]);
    useEffect(() => {
        if (!thumnailFileID) return;
        dispatch(activeThumbnailId({ reduceThumbnailId: thumnailFileID }));
        fileInfo(thumnailFileID);
    }, [thumnailFileID]);
    useEffect(() => {
        return () => {
            dispatch(activeNotiCategory1({ reduceNotiCategory1: '' }));
            dispatch(activeNotiCategory2({ reduceNotiCategory2: '' }));
            dispatch(activeTopFixable({ reduceTopFixable: '' }));
            dispatch(activePostState({ reducePostState: '' }));
            dispatch(activeReservation({ reduceReservation: '' }));
            dispatch(activeReservationDate({ reduceReservationDate: '' }));
            dispatch(activeFileId({ reduceFileId: '' }));
        }
    }, []);
    //-- value 변경시 reducersㅇ에 바로 저장 -E- //
    return (
        <div className={cx('common-board--layout')}>
            <table>
                <tbody>
                    <tr>
                        <th className={'tb--title'}>등록일시</th>
                        <td className={'width15'}>{detailData?.create_date ? detailData.create_date : '-'}</td>
                        <th className={'tb--title'}>업데이트 일시</th>
                        <td className={'width15'}>{detailData?.update_date ? detailData.update_date : '-'}</td>
                        <th className={'tb--title'}>작성자</th>
                        <td className={'width15'}>{detailData?.create_account_email ? detailData.create_account_email : '-'}</td>
                        <th className={'tb--title'}>조회수</th>
                        <td className={'width15'}>{detailData?.read_count ? detailData.read_count.toLocaleString('ko-KR') : '-'}</td>
                    </tr>
                    {type === 'notices' && (
                        <tr>
                            <th className={'tb--title'}>카테고리1{editMode && <em className={styles.essential}>*</em>}</th>
                            <td className={'width15'}>
                                <CustomSelectBox
                                    editMode={editMode}
                                    value={category1}
                                    name="category1"
                                    change={onChange}
                                    selectList={categoryList}
                                />
                            </td>
                            <th className={'tb--title'}>카테고리2</th>
                            <td className={'width15'} colSpan="5">
                                <CustomSelectBox
                                    editMode={editMode}
                                    value={category2}
                                    name="category2"
                                    change={onChange}
                                    selectList={categoryList}
                                />
                            </td>
                        </tr>
                    )}
                    <tr>
                        <th className={'tb--title'}>제목{editMode && <em className={styles.essential}>*</em>}</th>
                        <td className={'width15'} colSpan="7">
                            <CustomTextfield
                                editMode={editMode}
                                value={title}
                                name="title"
                                change={onChange}
                                holder="제목을 입력해 주세요."
                            />
                        </td>
                    </tr>
                    {type === 'notices' && (
                        <tr>
                            <th className={'tb--title'}>상단 고정</th>
                            <td className={'width15'}>
                                <CustomSelectBox
                                    editMode={editMode}
                                    value={notiTopType}
                                    name="notiTopType"
                                    change={onChange}
                                    selectList={notiSelectList}
                                />
                            </td>
                            <th className={'tb--title'}>배너 공지</th>
                            <td className={'width15'} colSpan="5">
                                {bannrState === 1 ? '노출' : '비노출'}
                            </td>
                        </tr>
                    )}
                    <tr>
                        <th className={'tb--title'}>상태</th>
                        <td className={'width15'} colSpan="7">
                            {editMode ? (
                                <>
                                    <Select
                                        className={styles.detail_select}
                                        name="visibleState"
                                        label="공개 여부"
                                        value={visibleState}
                                        onChange={onChange}
                                    >
                                        <MenuItem value="1">공개</MenuItem>
                                        <MenuItem value="0">비공개</MenuItem>
                                    </Select>
                                    <FormControl component="fieldset" className={styles.date_check_checkbox}>
                                        <FormGroup aria-label="position" row>
                                            <FormControlLabel
                                                name="reservationState"
                                                control={<Checkbox checked={reservationState} onChange={onChange} />}
                                                label="게시 예약"
                                                sx={{ ml: 1 }}
                                            />
                                        </FormGroup>
                                    </FormControl>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            disabled={!reservationState}
                                            className="event_start_date"
                                            renderInput={(props) => <TextField {...props} />}
                                            label="게시 예약일시"
                                            inputFormat="YYYY-MM-DD A hh:mm"
                                            value={reservationDate}
                                            onChange={(newValue) => {
                                                setReservationDate(changeDateType(moment(newValue.$d).format('YYYY-MM-DD A hh:mm')));
                                            }}
                                        />
                                    </LocalizationProvider>
                                </>
                            ) : (
                                <>
                                    {visibleState === 1 ? '공개' : '비공개'}
                                    {reservationState &&
                                        ` (게시 예약일시 : ${moment(reservationDate.replace(' T ', ' ')).format('YYYY-MM-DD A hh:mm')})`}
                                </>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th className={'tb--title'}>내용{editMode && <em className={styles.essential}>*</em>}</th>
                        <td className={'width15'} colSpan="7" style={{ maxWidth: '100px' }}>
                            {editMode ? (
                                <Editor props={editParam} />
                            ) : (
                                <div className={styles.contentsViewArea} dangerouslySetInnerHTML={{ __html: contentsData }} />
                            )}
                        </td>
                    </tr>
                    {(type === 'review-reports' || type === 'economic-researches') && (
                        <tr>
                            <th className="tb--title">썸네일</th>
                            <td className="width15 thumnailFile" colSpan="7">
                                {editMode ? (
                                    <TopInputLayout className={`${styles.inputWrap} file__upload--box`}>
                                        <input
                                            accept="image/*"
                                            id="thumnailFile"
                                            type="file"
                                            name="thumnailFile"
                                            onChange={fileHandleChange}
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="thumnailFile">
                                            <Button size="medium" type="button" variant="contained" color="primary" component="span">
                                                파일선택
                                            </Button>
                                        </label>
                                        <div className={`${styles.file_name}`}>{thumnailFileName ? thumnailFileName : '-'}</div>
                                        {thumnailFileName && (
                                            <Button
                                                size="medium"
                                                type="button"
                                                variant="contained"
                                                color="primary"
                                                component="span"
                                                name="thumnailFile"
                                                onClick={fileDeleteClickHandler}
                                            >
                                                삭제
                                            </Button>
                                        )}
                                    </TopInputLayout>
                                ) : (
                                    <>
                                        {thumnailFileName ? (
                                            <Button className={styles.file_download} onClick={thumnailFileClickHandler}>
                                                {thumnailFileName}
                                            </Button>
                                        ) : (
                                            '-'
                                        )}
                                    </>
                                )}
                            </td>
                        </tr>
                    )}
                    <tr>
                        <th className="tb--title">첨부파일</th>
                        <td className="width15 add_file" colSpan="7">
                            {editMode ? (
                                <TopInputLayout className={`${styles.inputWrap} file__upload--box`}>
                                    <input
                                        id="addFile"
                                        type="file"
                                        name="addFile"
                                        onChange={fileHandleChange}
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="addFile">
                                        <Button size="medium" type="button" variant="contained" color="primary" component="span">
                                            파일선택
                                        </Button>
                                    </label>
                                    <div className={`${styles.file_name}`}>{fileName ? fileName : '-'}</div>
                                    {fileName && (
                                        <Button
                                            size="medium"
                                            type="button"
                                            variant="contained"
                                            color="primary"
                                            component="span"
                                            name="addFile"
                                            onClick={fileDeleteClickHandler}
                                        >
                                            삭제
                                        </Button>
                                    )}
                                </TopInputLayout>
                            ) : (
                                <>
                                    {fileName ? (
                                        <Button className={styles.file_download} onClick={fileDownloadClickHandler}>
                                            {fileName}
                                        </Button>
                                    ) : (
                                        '-'
                                    )}
                                </>
                            )}
                        </td>
                    </tr>
                    {type === 'events' && <EventContents editMode={editMode} handleOpen={handleOpen} detailData={detailData} />}
                </tbody>
            </table>
            <EventModal open={open} onClose={handleClose} modalType={modalType} />
        </div>
    );
};
export default DetailContens;
