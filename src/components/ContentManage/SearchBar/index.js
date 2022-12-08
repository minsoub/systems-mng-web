import cx from 'classnames';
import PropTypes from 'prop-types';
import { FormControl, Stack, TextField } from '@mui/material';
import './styles.scss';
import StackLabel from '../../Common/StackLabel';
// 검색단
const SearchBar = ({ keyword, handleBlur, handleChange, titleWidth }) => {
    const titleWidthVal = titleWidth ? titleWidth : 120;
    return (
        <div className={cx('searchBar')}>
            <StackLabel title="검색어" titleWidth={titleWidthVal} />

            <FormControl sx={{ width: 250 }} size="medium">
                <TextField
                    id="filled-hidden-label-small"
                    type="text"
                    size="medium"
                    value={keyword}
                    name="keyword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="검색어를 입력해 주세요"
                    fullWidth
                />
            </FormControl>
        </div>
    );
};

export default SearchBar;

SearchBar.propTypes = {
    keyword: PropTypes.string,
    handleBlur: PropTypes.func,
    handleChange: PropTypes.func,
    titleWidth: PropTypes.number
};
