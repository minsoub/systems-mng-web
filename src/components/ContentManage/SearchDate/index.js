import React, { useState } from 'react';
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
    addAll
}) => {
    //const [start_date2, setStartDate] = useState();
    //const [end_date2, setEndDate] = useState();
    SearchDate.defaultProps = {
        noneChecked: null,
        period: null
    };

    return (
        <div className={cx(`result__list--date ${noneChecked}`)}>
            <StackLabel title={title} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                    label="연도. 월. 일"
                    inputFormat="YYYY-MM-DD"
                    value={start_date} // 변수바뀜 확인필요
                    onChange={(newValue) => {
                        //setStartDate(newValue)
                        console.log(start_date,newValue);
                        start_date = newValue;
                    }}
                    renderInput={(params) => (
                        <TextField
                            sx={{ maxWidth: '150px' }}
                            name={startName}
                            value={start_date}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            {...params}
                        />
                    )}
                />
                <span className={cx('center')}> ~ </span>
                <DesktopDatePicker
                    label="연도. 월. 일"
                    inputFormat="YYYY-MM-DD"
                    value={end_date} // 변수바뀜 확인필요
                    onChange={(newValue) => {
                        setEndDate(newValue);
                    }}
                    renderInput={(params) => (
                        <TextField
                            sx={{ maxWidth: '150px' }}
                            name={endName}
                            value={end_date}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            {...params}
                        />
                    )}
                />
            </LocalizationProvider>

            {/*
            <div className="result__list--input">
                <FormControl size="medium" sx={{ marginBottom: '5px' }}>
                    <TextField name={startName} value={start_date} onBlur={handleBlur} onChange={handleChange} type="date" />
                </FormControl>
                <span className={cx('center')}> ~ </span>
                <FormControl size="medium">
                    <TextField name={endName} value={end_date} onBlur={handleBlur} onChange={handleChange} type="date" />{' '}
                </FormControl>
            </div>
            */}
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
