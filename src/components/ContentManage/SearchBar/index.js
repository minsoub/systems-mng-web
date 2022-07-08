import cx from 'classnames';
import { FormControl, Stack, TextField } from '@mui/material';
import './styles.scss';

// 검색단
const SearchBar = ({ keyword, handleBlur, handleChange }) => {
    return (
        <div className={cx('searchBar')}>
            <Stack spacing={10} className={cx('borderTitle')}>
                검색어
            </Stack>

            <FormControl sx={{ minWidth: 400 }} size="medium">
                <TextField
                    id="filled-hidden-label-small"
                    type="text"
                    size="medium"
                    value={keyword}
                    name="keyword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="검색어를 입력해주세요"
                    fullWidth
                />
            </FormControl>
        </div>
    );
};

export default SearchBar;
