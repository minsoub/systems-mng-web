/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Select, MenuItem, TextField, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { changeDateType } from 'utils/CommonUtils';
import moment from 'moment';
import {
    activeEventType,
    activeEventStartDate,
    activeEventEndDate,
    activeEventJoinUser,
    activeEventPrivateTxt,
    activeEventBtnName,
    activeEventBtnColor,
    activeEventBtnLink,
    activeEventSuccessMsg,
    activeEventOverlapMsg
} from 'store/reducers/cms/DetailEventData';
import CustomTextfield from './CustomTextfield';
import styles from './styles.module.scss';
const EventContents = ({ editMode, handleOpen }) => {
    const dispatch = useDispatch();
    // 이벤트 시작일
    const [startDate, setStartDate] = useState(moment().format('YYYY.MM.DD'));
    // 이벤트 종료일
    const [endDate, setEndDate] = useState(moment().format('YYYY.MM.DD'));
    // 개인정보 수집 및  이용동의
    const [privateText, setPrivateText] = useState('');
    // 버튼, 버튼명 필드 사용여부
    const [disableBtnBool, setDisableBtnBool] = useState(false);
    // 이벤트 기간필드 사용여부
    const [disableEventDateBool, setDisableEventDateBool] = useState(false);
    // 인풋 관리
    const [inputs, setInputs] = useState({
        eventBtnName: '', // 버튼명
        eventBtnColor: '', // 버튼 색상
        eventLink: '', // 버튼 링크경로
        eventJoinMsg: '', // 참여 완료시 메시지
        eventOverlapMsg: '', // 중복 참여시 메시지
        eventType: 1, // 이벤트 유형
        targetPerson: 1 // 참여대상
    });
    const { eventBtnName, eventBtnColor, eventLink, eventJoinMsg, eventOverlapMsg, eventType, targetPerson } = inputs;

    useEffect(() => {
        setStartDate(
            changeDateType(
                moment()
                    .add(+1, 'days')
                    .format('YYYY-MM-DD')
            )
        );
        setEndDate(
            changeDateType(
                moment()
                    .add(+2, 'days')
                    .format('YYYY-MM-DD')
            )
        );
    }, []);
    useEffect(() => {
        const private_btn = document.querySelector('.private_btn');
        if (!private_btn) return;
        if ((targetPerson === 2 && !disableBtnBool) || eventType === 1) {
            private_btn.classList.add('Mui-disabled');
        } else {
            private_btn.classList.remove('Mui-disabled');
        }
    }, [targetPerson, disableBtnBool, eventType]);

    useEffect(() => {
        switch (eventType) {
            case 1:
                setDisableEventDateBool(true);
                setDisableBtnBool(true);
                break;
            case 2:
                setDisableEventDateBool(false);
                setDisableBtnBool(false);
                //setTargetPerson(1);
                break;
            case 3:
                setDisableEventDateBool(true);
                setDisableBtnBool(false);
                //setTargetPerson(1);
                break;
            default:
                return;
        }
    }, [eventType]);
    const onChange = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    };
    useEffect(() => {
        dispatch(activeEventType({ reduceEventType: eventType }));
    }, [eventType]);
    useEffect(() => {
        dispatch(activeEventStartDate({ reduceEventStartDate: startDate }));
    }, [startDate]);
    useEffect(() => {
        dispatch(activeEventEndDate({ reduceEventEndDate: endDate }));
    }, [endDate]);
    useEffect(() => {
        dispatch(activeEventJoinUser({ reduceEventJoinUser: targetPerson }));
    }, [targetPerson]);
    useEffect(() => {
        dispatch(activeEventPrivateTxt({ reduceEventPrivateTxt: privateText }));
    }, [privateText]);
    useEffect(() => {
        dispatch(activeEventBtnName({ reduceEventBtnName: eventBtnName }));
    }, [eventBtnName]);
    useEffect(() => {
        dispatch(activeEventBtnColor({ reduceEventBtnColor: eventBtnColor }));
    }, [eventBtnColor]);
    useEffect(() => {
        dispatch(activeEventBtnLink({ reduceEventBtnLink: eventLink }));
    }, [eventLink]);
    useEffect(() => {
        dispatch(activeEventSuccessMsg({ reduceEventSuccessMsg: eventJoinMsg }));
    }, [eventJoinMsg]);
    useEffect(() => {
        dispatch(activeEventOverlapMsg({ reduceEventOverlapMsg: eventOverlapMsg }));
    }, [eventOverlapMsg]);
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
                                onChange={onChange}
                            >
                                <MenuItem value={1}>일반</MenuItem>
                                <MenuItem value={2}>참여</MenuItem>
                                <MenuItem value={3}>링크</MenuItem>
                            </Select>
                            <div className="eventDateWrap">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        disabled={disableEventDateBool}
                                        className="event_start_date"
                                        renderInput={(props) => <TextField {...props} />}
                                        label="이벤트 시작일시"
                                        inputFormat="YYYY-MM-DD A hh:mm"
                                        value={startDate}
                                        onChange={(newValue) => {
                                            setStartDate(changeDateType(moment(newValue.$d).format('YYYY-MM-DD A hh:mm')));
                                        }}
                                    />
                                    <span className={styles.event_wave}> ~ </span>
                                    <DateTimePicker
                                        disabled={disableEventDateBool}
                                        className="event_end_date"
                                        renderInput={(props) => <TextField {...props} />}
                                        label="이벤트 종료일시"
                                        inputFormat="YYYY-MM-DD A hh:mm"
                                        value={endDate}
                                        onChange={(newValue) => {
                                            setEndDate(changeDateType(moment(newValue.$d).format('YYYY-MM-DD A hh:mm')));
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
                                onChange={onChange}
                            >
                                <MenuItem value={1}>로그인 회원</MenuItem>
                                <MenuItem value={2}>비로그인 회원</MenuItem>
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
                        change={onChange}
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
                        change={onChange}
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
                        change={onChange}
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
                        change={onChange}
                        holder="메세지를 입력해 주세요."
                        accessWap={[2]}
                    />
                </td>
            </tr>
            <tr>
                <th className={'tb--title'}>중복 참여 시</th>
                <td className={'width15'} colSpan="6">
                    <CustomTextfield
                        typeNum={eventType}
                        editMode={editMode}
                        value={eventOverlapMsg}
                        name="eventOverlapMsg"
                        change={onChange}
                        holder="메세지를 입력해 주세요."
                        accessWap={[2]}
                    />
                </td>
            </tr>
        </>
    );
};

export default EventContents;
