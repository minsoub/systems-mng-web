import React, { useRef } from 'react';
import { FormControl, InputAdornment, OutlinedInput } from '@mui/material';
import { SearchOutlined } from '@ant-design/icons';

const Search = ({ enterEvent }) => {
    const refOutlinedInput = useRef();
    const handleKeyDown = (event) => {
        console.log('handleKeyDown', event);
        if (event.key == 'Enter') {
            enterEvent(refOutlinedInput.current.value);
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
                    inputRef={refOutlinedInput}
                />
            </FormControl>
        </>
    );
};

export default Search;
