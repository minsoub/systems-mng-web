/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Select, MenuItem, TextField, Checkbox, FormControl, FormGroup, FormControlLabel, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DropInput from 'components/Common/DropInput';
import SearchDate from 'components/ContentManage/SearchDate';
import TopInputLayout from 'components/Common/TopInputLayout';
import Editor from 'components/editor/index';
import { humanFileSize } from 'utils/CommonUtils';
import cx from 'classnames';
import moment from 'moment';
import EventModal from './EventModal';
import styles from './styles.module.scss';

const DetailContens = ({ type, editMode }) => {
    // 카테고리1 리스트
    const [categoryList1, setCategoryList1] = useState(["카테1","카테2","카테3","카테4","카테5"]);
    // 카테고리1
    const [category1, setCategory1] = useState(0);
    // 카테고리2 리스트
    const [categoryList2, setCategoryList2] = useState(["카테1","카테2","카테3","카테4","카테5"]);
    // 카테고리2
    const [category2, setCategory2] = useState(0);
    // 제목
    const [title, setTitle] = useState('');
    // 상단고정 여부
    const [notiTopType, setNotiTopType] = useState('1');
    // 공개 여부 상태
    const [visibleState, setVisibleState] = useState('1');
    // 게시예약
    const [reservationState, setReservationState] = useState(false);
    // 게시 예약일자
    const [reservationDate, setReservationDate] = useState(moment().format('YYYY.MM.DD'));
    // 내용
    const [contentsData, setContentsData] = useState('');
    // 이벤트 유형
    const [eventType, setEventType] = useState('1');
    // 이벤트 시작일
    const [startDate, setStartDate] = useState(moment().format('YYYY.MM.DD'));
    // 이벤트 종료일
    const [endDate, setEndDate] = useState(moment().format('YYYY.MM.DD'));
    // 참여대상
    const [targetPerson, setTargetPerson] = useState('1');
    // 개인정보 수집 및  이용동의
    const [privateText, setPrivateText] = useState('');
    // 이벤트 버튼명
    const [eventBtnName, setEventBtnName] = useState('');
    // 버튼 색상
    const [eventBtnColor, setEventBtnColor] = useState('');
    // 버튼 링크 경로
    const [eventLink, setEventLink] = useState('');
    // 이벤트 참여 완료 메시지
    const [eventJoinMsg, setEventJoinMsg] = useState('');
    // 이벤트 중복 참여 메시지
    const [eventOverlapMsg, setEventOverlapMsg] = useState('');

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
        setStartDate(
            moment()
                .add(+1, 'days')
                .format('YYYY.MM.DD')
        );
        setEndDate(
            moment()
                .add(+2, 'days')
                .format('YYYY.MM.DD')
        );
    }, []);
    const typeChanged = (e) => {
        switch (e.target.name) {
            case 'cate1':
                setCategory1(e.target.value);
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
            case 'eventType':
                setEventType(e.target.value);
                break;
            case 'targetPerson':
                setTargetPerson(e.target.value);
                const private_btn = document.querySelector('.private_btn');
                if(e.target.value === '2'){
                    private_btn.classList.add('Mui-disabled')
                }else{
                    private_btn.classList.remove('Mui-disabled')
                }
                break;
            default:
                return;
        }
    };
    const handleBlur = () => {};
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'title':
                setTitle(e.target.value);
                break;
            case 'eventBtnName':
                setEventBtnName(e.target.value);
                break;
            case 'eventBtnColor':
                setEventBtnColor(e.target.value);
                break;
            case 'eventLink':
                setEventLink(e.target.value);
                break;
            case 'eventJoinMsg':
                setEventJoinMsg(e.target.value);
                break;
            case 'eventOverlapMsg':
                setEventOverlapMsg(e.target.value);
                break;
            default:
                return;
        }
    };
    // 날자 변경 함수
    const changeDate = (type, e) => {
        switch (type) {
            case 'start':
                setStartDate(e);
                break;
            case 'end':
                setEndDate(e);
                break;
            default:
                break;
        }
    };
    // 날자 검색 타입 초기화 함수
    const resetPeriod = () => {};
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
                    {type === 'notice' ? (
                        <tr>
                            <th className={'tb--title'}>카테고리1</th>
                            <td className={'width15'}>
                                {editMode ? (
                                    <Select
                                        className={styles.detail_select}
                                        name="cate1"
                                        label="카테고리1"
                                        value={category1}
                                        onChange={typeChanged}
                                    >
                                        {categoryList1.map((item, index) => {
                                            return (
                                                <MenuItem value={index} key={item}>
                                                    {item}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                ) : (
                                    <>일반</>
                                )}
                            </td>
                            <th className={'tb--title'}>카테고리2</th>
                            <td className={'width15'} colSpan="5">
                                {editMode ? (
                                    <Select
                                        className={styles.detail_select}
                                        name="cate2"
                                        label="카테고리2"
                                        value={category2}
                                        onChange={typeChanged}
                                    >
                                        {categoryList1.map((item, index) => {
                                            return (
                                                <MenuItem value={index} key={item}>
                                                    {item}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                ) : (
                                    <>-</>
                                )}
                            </td>
                        </tr>
                    ) : (
                        <></>
                    )}
                    <tr>
                        <th className={'tb--title'}>제목</th>
                        <td className={'width15'} colSpan="7">
                            {editMode ? (
                                <TextField
                                    type="text"
                                    size="small"
                                    value={title}
                                    name="title"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="제목을 입력해 주세요."
                                    fullWidth
                                />
                            ) : (
                                <>
                                    전기통신금융사기 주의 안내(공공기관, 수사기관 사칭) 제목이 길어지는 경우 모두 출력합니다. 제목이
                                    길어지는 경우 모두 출력합니다. 제목이 길어지는 경우 모두 출력합니다.
                                </>
                            )}
                        </td>
                    </tr>
                    {type === 'notice' ? (
                        <tr>
                            <th className={'tb--title'}>상단 고정</th>
                            <td className={'width15'}>
                                {editMode ? (
                                    <Select
                                        className={styles.detail_select}
                                        name="notiTopType"
                                        label="상단고정"
                                        value={notiTopType}
                                        onChange={typeChanged}
                                    >
                                        <MenuItem value="1">일반</MenuItem>
                                        <MenuItem value="2">고정</MenuItem>
                                    </Select>
                                ) : (
                                    <>일반</>
                                )}
                            </td>
                            <th className={'tb--title'}>배너 공지</th>
                            <td className={'width15'} colSpan="5">
                                비노출
                            </td>
                        </tr>
                    ) : (
                        <></>
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
                                            <DesktopDatePicker
                                                label="연도. 월. 일"
                                                inputFormat="YYYY-MM-DD"
                                                value={reservationDate} // 변수바뀜 확인필요
                                                onChange={(newValue) => {
                                                    setReservationDate(newValue);
                                                }}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        ) : (
                                            <DesktopDatePicker
                                                label="연도. 월. 일"
                                                inputFormat="YYYY-MM-DD"
                                                value={reservationDate} // 변수바뀜 확인필요
                                                disabled
                                                onChange={(newValue) => {}}
                                                renderInput={(params) => <TextField {...params} />}
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
                    {type === 'review-report' || type === 'economic-research' ? (
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
                    ) : (
                        <></>
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
                    {type === 'event' ? (
                        <>
                            <tr>
                                <th className="tb--title">유형</th>
                                <td className="width15 event_type" colSpan="3">
                                    {editMode ? (
                                        <>
                                            <Select
                                                className={styles.event_select}
                                                name="eventType"
                                                label="이벤트 유형"
                                                value={eventType}
                                                onChange={typeChanged}
                                            >
                                                <MenuItem value="1">일반</MenuItem>
                                                <MenuItem value="2">참여</MenuItem>
                                                <MenuItem value="3">링크</MenuItem>
                                            </Select>
                                            <div className="eventDateWrap">
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    {eventType === '2'?
                                                        (
                                                            <>
                                                                <DateTimePicker
                                                                    className="event_start_date"
                                                                    renderInput={(props) => <TextField {...props} />}
                                                                    label="연도. 월. 일 시:분"
                                                                    inputFormat="YYYY-MM-DD A hh:mm"
                                                                    value={startDate}
                                                                    onChange={(newValue) => {
                                                                        setStartDate(newValue);
                                                                    }}
                                                                />
                                                                <span className={styles.event_wave}> ~ </span>
                                                                <DateTimePicker
                                                                    className="event_end_date"
                                                                    renderInput={(props) => <TextField {...props} />}
                                                                    label="연도. 월. 일 시:분"
                                                                    inputFormat="YYYY-MM-DD A hh:mm"
                                                                    value={endDate}
                                                                    onChange={(newValue) => {
                                                                        setEndDate(newValue);
                                                                    }}
                                                                />
                                                            </>
                                                        ):(
                                                            <>
                                                                <DateTimePicker
                                                                    disabled
                                                                    className="event_start_date"
                                                                    renderInput={(props) => <TextField {...props} />}
                                                                    label="연도. 월. 일 시:분"
                                                                    inputFormat="YYYY-MM-DD A hh:mm"
                                                                    value={startDate}
                                                                    onChange={(newValue) => {
                                                                        setStartDate(newValue);
                                                                    }}
                                                                />
                                                                <span className={styles.event_wave}> ~ </span>
                                                                <DateTimePicker
                                                                    disabled
                                                                    className="event_end_date"
                                                                    renderInput={(props) => <TextField {...props} />}
                                                                    label="연도. 월. 일 시:분"
                                                                    inputFormat="YYYY-MM-DD A hh:mm"
                                                                    value={endDate}
                                                                    onChange={(newValue) => {
                                                                        setEndDate(newValue);
                                                                    }}
                                                                />
                                                            </>
                                                        )
                                                    }
                                                </LocalizationProvider>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            참여형 <br />
                                            (이벤트 기간 : 2022-10-25 12:00 ~ 2022-11-25 12:00)
                                        </>
                                    )}
                                </td>
                                <th className={'tb--title'}>참여 대상</th>
                                <td className={'width15'} colSpan="3">
                                    {editMode ? (
                                        <>
                                            <Select
                                                className={styles.detail_select}
                                                name="targetPerson"
                                                label="참여 대상"
                                                value={targetPerson}
                                                onChange={typeChanged}
                                            >
                                                <MenuItem value="1">로그인 회원</MenuItem>
                                                <MenuItem value="2">비로그인 회원</MenuItem>
                                            </Select>
                                            <Button
                                                className={`${styles.insert_private} private_btn`}
                                                disableElevation
                                                size="medium"
                                                type="button"
                                                variant="contained"
                                                color="primary"
                                                onClick={() =>{
                                                    handleOpen(1);
                                                }}
                                                
                                            >
                                                개인정보 수집 및 이용 동의 입력
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            로그인 회원
                                            <Button
                                                className={styles.down_user}
                                                disableElevation
                                                size="medium"
                                                type="button"
                                                variant="contained"
                                                color="primary"
                                                onClick={()=>{handleOpen(0)}}
                                            >
                                                참여자 정보 다운로드
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>버튼명</th>
                                <td className={'width15'} colSpan="3">
                                    {editMode ? (
                                        <TextField
                                            type="text"
                                            size="small"
                                            value={eventBtnName}
                                            name="eventBtnName"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="버튼명을 입력해 주세요."
                                            fullWidth
                                        />
                                    ) : (
                                        <>참여하기</>
                                    )}
                                </td>
                                <th className="tb--title">버튼 색상</th>
                                <td className="width15" colSpan="3">
                                    {editMode ? (
                                        <TextField
                                            type="text"
                                            size="small"
                                            value={eventBtnColor}
                                            name="eventBtnColor"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="버튼색상을 입력해 주세요."
                                            fullWidth
                                        />
                                    ) : (
                                        <>#fff</>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>버튼 링크경로</th>
                                <td className={'width15'} colSpan="7">
                                    {editMode ? (
                                        <TextField
                                            type="text"
                                            size="small"
                                            value={eventLink}
                                            name="eventLink"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="링크를 입력해 주세요."
                                            fullWidth
                                        />
                                    ) : (
                                        <>-</>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title'} rowSpan="2">
                                    메시지
                                </th>
                                <th className={'tb--title'}>참여 완료 시</th>
                                <td className={'width15'} colSpan="6">
                                    {editMode ? (
                                        <TextField
                                            type="text"
                                            size="small"
                                            value={eventJoinMsg}
                                            name="eventJoinMsg"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="메세지를 입력해 주세요."
                                            fullWidth
                                        />
                                    ) : (
                                        <>응모하였습니다. 참여해 주셔서 감사합니다.</>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>중복 완료 시</th>
                                <td className={'width15'} colSpan="6">
                                    {editMode ? (
                                        <TextField
                                            type="text"
                                            size="small"
                                            value={eventOverlapMsg}
                                            name="eventOverlapMsg"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="메세지를 입력해 주세요."
                                            fullWidth
                                        />
                                    ) : (
                                        <>이미 응모하신 이벤트입니다.</>
                                    )}
                                </td>
                            </tr>
                        </>
                    ) : (
                        <></>
                    )}
                </tbody>
            </table>
            <EventModal open={open} onClose={handleClose} modalType={modalType} />
        </div>
    );
};
export default DetailContens;
