/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Select, MenuItem, TextField, Checkbox, FormControl, FormGroup, FormControlLabel, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TopInputLayout from 'components/Common/TopInputLayout';
import Editor from 'components/editor/index';
import { humanFileSize } from 'utils/CommonUtils';
import cx from 'classnames';
import moment from 'moment';
import EventModal from './EventModal';
import CustomTextfield from './CustomTextfield';
import EventContents from './EventContents';
import CustomSelectBox from './CustomSelectBox';
import styles from './styles.module.scss';

const DetailContens = ({ type, editMode }) => {
    // 카테고리1 리스트
    const [categoryList1, setCategoryList1] = useState([
        { name: '카테1', value: 1 },
        { name: '카테2', value: 2 },
        { name: '카테3', value: 3 },
        { name: '카테4', value: 4 }
    ]);
    // 카테고리1
    const [category1, setCategory1] = useState(2);
    // 카테고리2 리스트
    const [categoryList2, setCategoryList2] = useState([
        { name: '카테고리1', value: 1 },
        { name: '카테고리2', value: 2 },
        { name: '카테고리3', value: 3 },
        { name: '카테고리4', value: 4 },
        { name: '카테고리5', value: 5 }
    ]);
    // 카테고리2
    const [category2, setCategory2] = useState(3);
    // 제목
    const [title, setTitle] = useState(
        '전기통신금융사기 주의 안내(공공기관, 수사기관 사칭) 제목이 길어지는 경우 모두 출력합니다. 제목이 길어지는 경우 모두 출력합니다. 제목이 길어지는 경우 모두 출력합니다.'
    );
    // 상단고정 여부
    const [notiTopType, setNotiTopType] = useState(1);
    // 상단고정 셀렉박스
    const notiSelectList = [
        { name: '일반', value: 1 },
        { name: '고정', value: 2 }
    ];
    // 공개 여부 상태
    const [visibleState, setVisibleState] = useState(1);
    // 공개여부 셀렉박스
    const visibleSelectList = [
        { name: '공개', value: 1 },
        { name: '비공개', value: 2 }
    ];
    // 게시예약
    const [reservationState, setReservationState] = useState(false);
    // 게시 예약일자
    const [reservationDate, setReservationDate] = useState(moment().format('YYYY.MM.DD'));
    // 내용
    const [contentsData, setContentsData] = useState('');

    // 파일 정보
    const [file_part, setFilePart] = useState(); //파일 정보
    const [file, setFile] = useState(''); // 첨부파일
    const editParam = { editName: 'editorName', value: '<b>여기 입력 고고</b>' }; // 에디터 설정관련

    //팝업 오픈 관련 설정
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState(0);
    const handleOpen = ($type) => {
        setModalType($type);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    useEffect(() => {
        // console.log(type, editMode);
        setReservationDate(
            moment()
                .add(+1, 'days')
                .format('YYYY.MM.DD')
        );
    }, []);
    const typeChanged = (e) => {
        switch (e.target.name) {
            case 'cate1':
                setCategory1(e.target.value);
                console.log(e.target.value);
                // setCategoryList2(['카테고리1', '카테고리1', '카테고리1', '카테고리1', '카테고리1', '카테고리1']);
                break;
            case 'cate2':
                setCategory2(e.target.value);
                break;
            case 'notiTopType':
                setNotiTopType(e.target.value);
                break;
            case 'visibleState':
                setVisibleState(e.target.value);
                break;
            case 'reservationState':
                setReservationState(e.target.checked);
                break;
            default:
                return;
        }
    };
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'title':
                setTitle(e.target.value);
                break;
            default:
                return;
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
                                    name="cate1"
                                    change={typeChanged}
                                    selectList={categoryList1}
                                />
                            </td>
                            <th className={'tb--title'}>카테고리2</th>
                            <td className={'width15'} colSpan="5">
                                <CustomSelectBox
                                    editMode={editMode}
                                    value={category2}
                                    name="cate2"
                                    change={typeChanged}
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
                                change={handleChange}
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
                                    change={typeChanged}
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
                                        onChange={typeChanged}
                                    >
                                        <MenuItem value="1">공개</MenuItem>
                                        <MenuItem value="2">비공개</MenuItem>
                                    </Select>
                                    <FormControl component="fieldset" className={styles.date_check_checkbox}>
                                        <FormGroup aria-label="position" row>
                                            <FormControlLabel
                                                name="reservationState"
                                                control={<Checkbox onChange={typeChanged} />}
                                                label="게시 예약"
                                                sx={{ ml: 1 }}
                                            />
                                        </FormGroup>
                                    </FormControl>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        {reservationState ? (
                                            <DateTimePicker
                                                className="event_start_date"
                                                renderInput={(props) => <TextField {...props} />}
                                                label="연도. 월. 일 시:분"
                                                inputFormat="YYYY-MM-DD A hh:mm"
                                                value={reservationDate}
                                                onChange={(newValue) => {
                                                    setReservationDate(newValue);
                                                }}
                                            />
                                        ) : (
                                            <DateTimePicker
                                                className="event_start_date"
                                                renderInput={(props) => <TextField {...props} />}
                                                label="연도. 월. 일 시:분"
                                                inputFormat="YYYY-MM-DD A hh:mm"
                                                value={reservationDate}
                                                disabled
                                                onChange={(newValue) => {}}
                                            />
                                        )}
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
