import React, { useState, useEffect } from 'react';
import { FormControl, FormControlLabel, RadioGroup, Radio, Stack, TextField } from '@mui/material';
import cx from 'classnames';
import './styles.scss';
import StackLabel from '../../Common/StackLabel';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

const SearchDate = ({
    start_date,
    handleBlur,
    handleChange,
    end_date,
    noneChecked,
    period,
    startName,
    endName,
    title = '기간 검색',
    addAll,
    changeDate,
    resetPeriod
}) => {
    const [start_date2, setStartDate] = useState();
    const [end_date2, setEndDate] = useState();
    const [start_view_date, setStartViewDate] = useState();
    const [end_view_date, setEndViewDate] = useState();
    SearchDate.defaultProps = {
        noneChecked: null,
        period: null
    };
    useEffect(() => {
        if (!start_date) return;
        setStartViewDate(start_date);
    },[start_date]);
    useEffect(() => {
        if (!end_date) return;
        setEndViewDate(end_date);
    },[end_date]);
    useEffect(() => {
        if (!start_date2) return;
        if(getFormatDate(new Date(start_date2.$y + '-' + (start_date2.$M + 1) + '-' + start_date2.$D))>getFormatDate(new Date(end_view_date))){
            alert('기간 검색에서 시작일이 종료일보다 클 수 없습니다.');
            return;
        }
        resetPeriod();
        setStartViewDate(start_date2.$y + '-' + (start_date2.$M + 1) + '-' + start_date2.$D);
    },[start_date2]);
    useEffect(() => {
        if (!end_date2) return;
        if(getFormatDate(new Date(start_view_date))>getFormatDate(new Date(end_date2.$y + '-' + (end_date2.$M + 1) + '-' + end_date2.$D))){
            alert('기간 검색에서 종료일이 시작일보다 작을 수 없습니다.');
            return;
        }
        resetPeriod();
        setEndViewDate(end_date2.$y + '-' + (end_date2.$M + 1) + '-' + end_date2.$D);
    }, [end_date2]);
    useEffect(() => {
        if (!start_view_date) return;
        changeDate('start', getFormatDate(new Date(start_view_date)));
    }, [start_view_date]);
    useEffect(() => {
        if (!end_view_date) return;
        changeDate('end', getFormatDate(new Date(end_view_date)));
    }, [end_view_date]);
    const getFormatDate = (date) =>{
        let year = date.getFullYear();
        var month = 1 + date.getMonth();
        month = month >= 10 ? month : '0' + month;
        var day = date.getDate();
        day = day >= 10 ? day : '0' + day;
        return year + '-' + month + '-' + day;
    };
    return (
        <div className={cx(`result__list--date ${noneChecked}`)}>
            <StackLabel title={title} titleWidth={120} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                    label="연도. 월. 일"
                    inputFormat="YYYY-MM-DD"
                    value={start_view_date} // 변수바뀜 확인필요
                    onChange={(newValue) => {
                        setStartDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
                <span className={cx('center')}> ~ </span>
                <DesktopDatePicker
                    label="연도. 월. 일"
                    inputFormat="YYYY-MM-DD"
                    value={end_view_date} // 변수바뀜 확인필요
                    onChange={(e) => {
                        setEndDate(e);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>

            {/* <div className="result__list--input">
                <FormControl size="medium" sx={{ marginBottom: '5px' }}>
                    <TextField name={startName} value={start_date} onBlur={handleBlur} onChange={handleChange} type="date" />
                </FormControl>
                <span className={cx('center')}> ~ </span>
                <FormControl size="medium">
                    <TextField name={endName} value={end_date} onBlur={handleBlur} onChange={handleChange} type="date" />{' '}
                </FormControl>
            </div> */}

            <RadioGroup
                className={cx('date-checked')}
                row
                aria-labelledby="period-radio-buttons-group-label"
                name="period"
                value={period}
                onChange={handleChange}
            >
                <FormControlLabel value="1" control={<Radio />} label="오늘" />
                <FormControlLabel value="2" control={<Radio />} label="어제" />
                <FormControlLabel value="3" control={<Radio />} label="1개월" />
                <FormControlLabel value="4" control={<Radio />} label="3개월" />
                {addAll && <FormControlLabel value="5" control={<Radio />} label="전체" />}
            </RadioGroup>
        </div>
    );
};

export default SearchDate;
