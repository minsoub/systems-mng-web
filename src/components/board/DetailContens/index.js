/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Select, MenuItem, TextField, Checkbox, FormControl, FormGroup, FormControlLabel, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TopInputLayout from 'components/Common/TopInputLayout';
import Editor from 'components/editor/index';
import { humanFileSize, changeDateType } from 'utils/CommonUtils';
import {
    activeNotiCategory1,
    activeNotiCategory2,
    activeTitle,
    activeTopFixable,
    activePostState,
    activeReservation,
    activeReservationDate,
} from 'store/reducers/cms/DetailData';
import cx from 'classnames';
import moment from 'moment';
import EventModal from './EventModal';
import CustomTextfield from './CustomTextfield';
import EventContents from './EventContents';
import CustomSelectBox from './CustomSelectBox';
import styles from './styles.module.scss';

const DetailContens = ({ type, editMode }) => {
    const dispatch = useDispatch();
    // 카테고리1 리스트
    const [categoryList1, setCategoryList1] = useState([
        { name: '카테1', id: 1 },
        { name: '카테2', id: 2 },
        { name: '카테3', id: 3 },
        { name: '카테4', id: 4 }
    ]);

    // 카테고리2 리스트
    const [categoryList2, setCategoryList2] = useState([
        { name: '카테고리1', id: 1 },
        { name: '카테고리2', id: 2 },
        { name: '카테고리3', id: 3 },
        { name: '카테고리4', id: 4 },
        { name: '카테고리5', id: 5 }
    ]);

    // 상단고정 셀렉박스
    const notiSelectList = [
        { name: '일반', id: 1 },
        { name: '고정', id: 2 }
    ];

    // 공개여부 셀렉박스
    const visibleSelectList = [
        { name: '공개', id: 1 },
        { name: '비공개', id: 2 }
    ];

    // 게시 예약일자
    const [reservationDate, setReservationDate] = useState(moment().format('YYYY.MM.DD A hh:mm'));
    // 내용
    const [contentsData, setContentsData] = useState('');

    // 파일 정보
    const [file_part, setFilePart] = useState(); //파일 정보
    const [file, setFile] = useState(''); // 첨부파일
    const editParam = { editName: 'contentsEditor', value: '<b>여기 입력 고고</b>' }; // 에디터 설정관련

    // 인풋 관리
    const [inputs, setInputs] = useState({
        title: '', // 제목
        category1: 1, // 카테고리1
        category2: 1, // 카테고리2
        notiTopType: 1, // 상단고정
        visibleState: 1, // 공개 상태
        reservationState: false // 게시예약
    });
    const { title, category1, category2, notiTopType, visibleState, reservationState } = inputs;

    //팝업 오픈 관련 설정
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState(0);
    const handleOpen = ($type) => {
        setModalType($type);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    useEffect(() => {
        setReservationDate(
            changeDateType(
                moment()
                    .add(+1, 'days')
                    .format('YYYY-MM-DD')
            )
        );
    }, []);
    const onChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'reservationState') {
            setInputs({
                ...inputs,
                [name]: checked
            });
        } else {
            setInputs({
                ...inputs,
                [name]: value
            });
        }
    };

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
        // insertChatFile(formData);
    };
    useEffect(() => {
        console.log(category1);
        dispatch(activeNotiCategory1({ reduceNotiCategory1: category1 }));
    }, [category1]);
    useEffect(() => {
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

    return (
        <div className={cx('common-board--layout')}>
            <table>
                <tbody>
                    <tr>
                        <th className={'tb--title'}>등록일시</th>
                        <td className={'width15'}>2022-03-14 12:00:00</td>
                        <th className={'tb--title'}>업데이트 일시</th>
                        <td className={'width15'}>2022-03-14 12:00:00</td>
                        <th className={'tb--title'}>작성자</th>
                        <td className={'width15'}>userID</td>
                        <th className={'tb--title'}>조회수</th>
                        <td className={'width15'}>12,456</td>
                    </tr>
                    {type === 'notice' && (
                        <tr>
                            <th className={'tb--title'}>카테고리1</th>
                            <td className={'width15'}>
                                <CustomSelectBox
                                    editMode={editMode}
                                    value={category1}
                                    name="category1"
                                    change={onChange}
                                    selectList={categoryList1}
                                />
                            </td>
                            <th className={'tb--title'}>카테고리2</th>
                            <td className={'width15'} colSpan="5">
                                <CustomSelectBox
                                    editMode={editMode}
                                    value={category2}
                                    name="category2"
                                    change={onChange}
                                    selectList={categoryList2}
                                />
                            </td>
                        </tr>
                    )}
                    <tr>
                        <th className={'tb--title'}>제목</th>
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
                    {type === 'notice' && (
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
                                비노출
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
                                        <MenuItem value="2">비공개</MenuItem>
                                    </Select>
                                    <FormControl component="fieldset" className={styles.date_check_checkbox}>
                                        <FormGroup aria-label="position" row>
                                            <FormControlLabel
                                                name="reservationState"
                                                control={<Checkbox onChange={onChange} />}
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
                                <>비공개 (게시일시 : 2022-03-18 00:00)</>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th className={'tb--title'}>내용</th>
                        <td className={'width15'} colSpan="7">
                            {editMode ? (
                                <Editor props={editParam} />
                            ) : (
                                <>
                                    안녕하세요. No.1 가상자산 플랫폼, 빗썸입니다. 최근 공공기관, 수사기관 등을 사칭한 보이스피싱 시도가
                                    지속적으로 이뤄지고 있어, 피해가 발생하지 않도록 각별한 주의를 부탁드립니다.
                                </>
                            )}
                        </td>
                    </tr>
                    {(type === 'review-report' || type === 'economic-research') && (
                        <tr>
                            <th className="tb--title">썸네일</th>
                            <td className="width15 add_file" colSpan="7">
                                {editMode ? (
                                    <TopInputLayout className={`${styles.inputWrap} file__upload--box`}>
                                        <div className={`${styles.file_name}`}>
                                            Notice.pdf<em>(110.00KB)</em>
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
                                        Notice.pdf<em>(110.00KB)</em>
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
                                    <div className={`${styles.file_name}`}>
                                        Notice.pdf<em>(110.00KB)</em>
                                    </div>
                                    <TextField
                                        type="file"
                                        id="file"
                                        name="file"
                                        size="medium"
                                        className="file__upload--field"
                                        onChange={fileHandleChange}
                                        inputProps={{
                                            accept:
                                                '.doc, .docx, .xlsx, .xls, .ppt, .pptx, .ai, .mov, .mp4, .avi, .mkv, .jpg, .jpeg, .png, .gif, .pdf, .txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
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
                                    Notice.pdf<em>(110.00KB)</em>
                                </>
                            )}
                        </td>
                    </tr>
                    {type === 'event' && <EventContents editMode={editMode} handleOpen={handleOpen} />}
                </tbody>
            </table>
            <EventModal open={open} onClose={handleClose} modalType={modalType} />
        </div>
    );
};
export default DetailContens;
