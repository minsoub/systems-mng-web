import { FormControl, FormControlLabel, RadioGroup, Radio, Stack, TextField } from '@mui/material';
import cx from 'classnames';
import './styles.scss';

const SearchDate = ({ start_date, handleBlur, handleChange, end_date, noneChecked, period }) => {
    SearchDate.defaultProps = {
        noneChecked: null
    };

    return (
        <div className={cx(`result__list--date ${noneChecked}`)}>
            <Stack spacing={10} className={cx('borderTitle')}>
                기간 검색
            </Stack>
            <div className="result__list--input">
                <FormControl size="medium">
                    <TextField
                        id="start_date"
                        name="start_date"
                        value={start_date}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="date"
                        sx={{ minWidth: 250 }}
                    />
                </FormControl>
                <span className={cx('center')}> ~ </span>
                <FormControl size="medium">
                    <TextField
                        id="end_date"
                        name="end_date"
                        value={end_date}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="date"
                        sx={{ minWidth: 250 }}
                    />
                </FormControl>
            </div>

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
            </RadioGroup>
        </div>
    );
};

export default SearchDate;
