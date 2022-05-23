// material-ui
import { Box, FormControl, InputAdornment, OutlinedInput, Grid } from '@mui/material';

// assets
import { SearchOutlined } from '@ant-design/icons';
import DefaultButton from 'components/button/DefaultButton';
// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Search = ({ enterEvent }) => {
    const handleKeyDown = (event) => {
        console.log('handleKeyDown', event);
        if (event.key == 'Enter') {
            enterEvent();
        }
    };
    return (
        <>
            <FormControl>
                <OutlinedInput
                    size="small"
                    id="header-search"
                    endAdornment={
                        <InputAdornment position="start" sx={{ mr: -0.5 }}>
                            <SearchOutlined />
                        </InputAdornment>
                    }
                    aria-describedby="header-search-text"
                    inputProps={{
                        'aria-label': 'weight'
                    }}
                    placeholder="Search"
                    onKeyPress={handleKeyDown}
                />
            </FormControl>
        </>
    );
};

export default Search;
