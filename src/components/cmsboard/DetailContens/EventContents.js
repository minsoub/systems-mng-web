/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Select, MenuItem, TextField, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// library
import moment from 'moment';

// project import
import CustomTextfield from './CustomTextfield';

// transition
import {
    activeEventType,
    activeEventStartDate,
    activeEventEndDate,
    activeEventJoinUser,
    activeEventBtnName,
    activeEventBtnColor,
    activeEventBtnLink,
    activeEventSuccessMsg,
    activeEventOverlapMsg,
    activeEventPrivateTxt
} from 'store/reducers/cms/DetailEventData';

// utiles
import { changeDateType } from 'utils/CommonUtils';

// style
import styles from './styles.module.scss';

// =============|| DetailContents - EventContents ||============= //

const EventContents = ({ editMode, handleOpen, detailData }) => {
    const dispatch = useDispatch();

    const [startDate, setStartDate] = useState(moment().format('YYYY.MM.DD')); // 이벤트 시작일
    const [endDate, setEndDate] = useState(moment().format('YYYY.MM.DD')); // 이벤트 종료일
    const [isDisableBtnBool, setIsDisableBtnBool] = useState(false); // 버튼, 버튼명 필드 사용여부
    const [isDisableEventDateBool, setIsDisableEventDateBool] = useState(false); // 이벤트 기간필드 사용여부
    const [inputs, setInputs] = useState({
        eventBtnName: '', // 버튼명
        eventBtnColor: '', // 버튼 색상
        eventLink: '', // 버튼 링크경로
        eventJoinMsg: '', // 참여 완료시 메시지
        eventOverlapMsg: '', // 중복 참여시 메시지
        eventType: 'DEFAULT', // 이벤트 유형
        targetPerson: 'LOGIN' // 참여대상
    }); // 인풋 관리
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
        if ((targetPerson === 'NOT_LOGIN' && !isDisableBtnBool) || eventType === 'DEFAULT') {
            private_btn.classList.add('Mui-disabled');
        } else {
            private_btn.classList.remove('Mui-disabled');
        }
    }, [targetPerson, isDisableBtnBool, eventType]);

    useEffect(() => {
        switch (eventType) {
            case 'DEFAULT':
                setIsDisableEventDateBool(true);
                setIsDisableBtnBool(true);
                break;
            case 'PARTICIPATION':
                setIsDisableEventDateBool(false);
                setIsDisableBtnBool(false);
                break;
            case 'LINK':
                setIsDisableEventDateBool(true);
                setIsDisableBtnBool(false);
                break;
            default:
                return;
        }
    }, [eventType]);
    const changeEventTypeTxt = ($type) => {
        switch ($type) {
            case 'DEFAULT':
                return '게시형';
            case 'PARTICIPATION':
                return '참여형';
            case 'LINK':
                return '링크형';
        }
    }
    const onChange = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    };
    useEffect(() => {
        if (!detailData) return;
        console.log(detailData);
        // 불러온 데이터 삽입
        setInputs({
            ...inputs,
            ['eventType']: detailData.type,
            ['targetPerson']: detailData.target,
            ['eventBtnName']: detailData.button_name ? detailData.button_name : '',
            ['eventBtnColor']: detailData.button_color ? detailData.button_color : '',
            ['eventLink']: detailData.button_url ? detailData.button_url : '',
            ['eventJoinMsg']: detailData.message?.participate_message,
            ['eventOverlapMsg']: detailData.message?.duplicate_message
        });
        setStartDate(
            detailData.event_start_date
                ? changeDateType(moment(detailData.event_start_date).format('YYYY-MM-DD A hh:mm'))
                : changeDateType(
                      moment()
                          .add(+2, 'days')
                          .format('YYYY-MM-DD')
                  )
        );
        setEndDate(
            detailData.event_end_date
                ? changeDateType(moment(detailData.event_end_date).format('YYYY-MM-DD A hh:mm'))
                : changeDateType(
                      moment()
                          .add(+2, 'days')
                          .format('YYYY-MM-DD')
                  )
        );
        dispatch(activeEventPrivateTxt({ reduceEventPrivateTxt: detailData.agreement_content }));
    }, [detailData]);

    //-- value 변경시 reducersㅇ에 바로 저장 -S- //
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
    useEffect(() => {
        return () => {
            dispatch(activeEventType({ reduceEventType: '' }));
            dispatch(activeEventStartDate({ reduceEventStartDate: '' }));
            dispatch(activeEventEndDate({ reduceEventEndDate: '' }));
            dispatch(activeEventJoinUser({ reduceEventJoinUser: '' }));
            dispatch(activeEventBtnName({ reduceEventBtnName: '' }));
            dispatch(activeEventBtnColor({ reduceEventBtnColor: '' }));
            dispatch(activeEventBtnLink({ reduceEventBtnLink: '' }));
            dispatch(activeEventSuccessMsg({ reduceEventSuccessMsg: '' }));
            dispatch(activeEventOverlapMsg({ reduceEventOverlapMsg: '' }));
            dispatch(activeEventPrivateTxt({ reduceEventPrivateTxt: '' }));
        };
    }, []);
    //-- value 변경시 reducersㅇ에 바로 저장 -E- //
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
                                <MenuItem value="DEFAULT">일반</MenuItem>
                                <MenuItem value="PARTICIPATION">참여</MenuItem>
                                <MenuItem value="LINK">링크</MenuItem>
                            </Select>
                            <div className="eventDateWrap">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        disabled={isDisableEventDateBool}
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
                                        disabled={isDisableEventDateBool}
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
                            {changeEventTypeTxt(eventType)} <br />
                            {eventType !== 'DEFAULT' && `(이벤트 기간 : ${startDate.replace(' T ', ' ')} ~ ${endDate.replace(' T ', ' ')})`}
                        </>
                    )}
                </td>
                <th className={'tb--title'}>참여 대상</th>
                <td className={'width15'} colSpan="3">
                    {editMode ? (
                        <>
                            <Select
                                disabled={isDisableBtnBool}
                                className={styles.detail_select}
                                name="targetPerson"
                                label="참여 대상"
                                value={targetPerson}
                                onChange={onChange}
                            >
                                <MenuItem value="LOGIN">로그인 회원</MenuItem>
                                <MenuItem value="NOT_LOGIN">비로그인 회원</MenuItem>
                            </Select>
                            <Button
                                disabled={isDisableBtnBool}
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
                            {eventType === 'DEFAULT' ? '' : targetPerson === 'LOGIN' ? '로그인 회원' : '비로그인 회원'}
                            {eventType === 'PARTICIPATION' && (
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
                            )}
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
                        accessWap={['PARTICIPATION', 'LINK']}
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
                        accessWap={['PARTICIPATION', 'LINK']}
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
                        accessWap={['LINK']}
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
                        accessWap={['PARTICIPATION']}
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
                        accessWap={['PARTICIPATION']}
                    />
                </td>
            </tr>
        </>
    );
};

export default EventContents;
