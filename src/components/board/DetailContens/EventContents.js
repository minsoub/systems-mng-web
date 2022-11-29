/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Select, MenuItem, TextField, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from 'moment';
import CustomTextfield from './CustomTextfield';
import styles from './styles.module.scss';
const EventContents = ({ editMode, handleOpen }) => {
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
    const [eventBtnName, setEventBtnName] = useState('버튼명');
    // 버튼 색상
    const [eventBtnColor, setEventBtnColor] = useState('#ff0000');
    // 버튼 링크 경로
    const [eventLink, setEventLink] = useState('https://www.bithumb.com/');
    // 이벤트 참여 완료 메시지
    const [eventJoinMsg, setEventJoinMsg] = useState('응모완료 되었습니다.');
    // 이벤트 중복 참여 메시지
    const [eventOverlapMsg, setEventOverlapMsg] = useState('이미 참여 하였습니다.');
    // 버튼, 버튼명 필드
    const [disableBtnBool, setDisableBtnBool] = useState(false);
    // 이벤트 기간필드
    const [disableEventDateBool, setDisableEventDateBool] = useState(false);

    useEffect(() => {
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
    useEffect(() => {
        const private_btn = document.querySelector('.private_btn');
        if (!private_btn) return;
        if ((targetPerson === '2' && !disableBtnBool) || eventType === '1') {
            private_btn.classList.add('Mui-disabled');
        } else {
            private_btn.classList.remove('Mui-disabled');
        }
    }, [targetPerson, disableBtnBool, eventType]);

    useEffect(() => {
        switch (eventType) {
            case '1':
                setDisableEventDateBool(true);
                setDisableBtnBool(true);
                break;
            case '2':
                setDisableEventDateBool(false);
                setDisableBtnBool(false);
                //setTargetPerson(1);
                break;
            case '3':
                setDisableEventDateBool(true);
                setDisableBtnBool(false);
                //setTargetPerson(1);
                break;
            default:
                return;
        }
    }, [eventType]);
    const typeChanged = (e) => {
        switch (e.target.name) {
            case 'eventType':
                setEventType(e.target.value);
                break;
            case 'targetPerson':
                setTargetPerson(e.target.value);
                break;
            default:
                return;
        }
    };
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'eventBtnName':
                if (e.target.value.length > 10) return;
                setEventBtnName(e.target.value);
                break;
            case 'eventBtnColor':
                if (e.target.value.length > 10) return;
                setEventBtnColor(e.target.value);
                break;
            case 'eventLink':
                setEventLink(e.target.value);
                break;
            case 'eventJoinMsg':
                if (e.target.value.length > 20) return;
                setEventJoinMsg(e.target.value);
                break;
            case 'eventOverlapMsg':
                if (e.target.value.length > 20) return;
                setEventOverlapMsg(e.target.value);
                break;
            default:
                return;
        }
    };
    return (
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
                                    <DateTimePicker
                                        disabled={disableEventDateBool}
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
                                        disabled={disableEventDateBool}
                                        className="event_end_date"
                                        renderInput={(props) => <TextField {...props} />}
                                        label="연도. 월. 일 시:분"
                                        inputFormat="YYYY-MM-DD A hh:mm"
                                        value={endDate}
                                        onChange={(newValue) => {
                                            setEndDate(newValue);
                                        }}
                                    />
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
                                disabled={disableBtnBool}
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
                                disabled={disableBtnBool}
                                className={`${styles.insert_private} private_btn`}
                                disableElevation
                                size="medium"
                                type="button"
                                variant="contained"
                                color="primary"
                                onClick={() => {
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
                                onClick={() => {
                                    handleOpen(0);
                                }}
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
                    <CustomTextfield
                        typeNum={eventType}
                        editMode={editMode}
                        value={eventBtnName}
                        name="eventBtnName"
                        change={handleChange}
                        holder="버튼명을 입력해 주세요."
                        accessWap={[2, 3]}
                    />
                </td>
                <th className="tb--title">버튼 색상</th>
                <td className="width15" colSpan="3">
                    <CustomTextfield
                        typeNum={eventType}
                        editMode={editMode}
                        value={eventBtnColor}
                        name="eventBtnColor"
                        change={handleChange}
                        holder="버튼색상을 입력해 주세요."
                        accessWap={[2, 3]}
                    />
                </td>
            </tr>
            <tr>
                <th className={'tb--title'}>버튼 링크경로</th>
                <td className={'width15'} colSpan="7">
                    <CustomTextfield
                        typeNum={eventType}
                        editMode={editMode}
                        value={eventLink}
                        name="eventLink"
                        change={handleChange}
                        holder="링크를 입력해 주세요."
                        accessWap={[3]}
                    />
                </td>
            </tr>
            <tr>
                <th className={'tb--title'} rowSpan="2">
                    메시지
                </th>
                <th className={'tb--title'}>참여 완료 시</th>
                <td className={'width15'} colSpan="6">
                    <CustomTextfield
                        typeNum={eventType}
                        editMode={editMode}
                        value={eventJoinMsg}
                        name="eventJoinMsg"
                        change={handleChange}
                        holder="메세지를 입력해 주세요."
                        accessWap={[2]}
                    />
                </td>
            </tr>
            <tr>
                <th className={'tb--title'}>중복 완료 시</th>
                <td className={'width15'} colSpan="6">
                    <CustomTextfield
                        typeNum={eventType}
                        editMode={editMode}
                        value={eventOverlapMsg}
                        name="eventOverlapMsg"
                        change={handleChange}
                        holder="메세지를 입력해 주세요."
                        accessWap={[2]}
                    />
                </td>
            </tr>
        </>
    );
};

export default EventContents;
