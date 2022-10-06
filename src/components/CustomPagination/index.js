import React,{useEffect} from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';
import FlexBox from 'components/Common/FlexBox/index';

// eslint-disable-next-line react/prop-types
const CustomPagination = ({ total, page, count, color, rows_per_page, boundary_count, on_change }) => {
    useEffect(() => {
        console.log(page);
    }, [page]);
    return (
        <FlexBox sx={{ mt: 2, alignItems: 'center' }}>
            <div style={{ marginRight: '1rem' }}>Total {total} Items</div>
            <Pagination
                page={page}
                count={count}
                shape="rounded"
                color={color}
                // defaultPage={1}
                rowsPerPage={rows_per_page}
                boundaryCount={boundary_count}
                showFirstButton
                showLastButton
                onChange={on_change}
                renderItem={(props2) => <PaginationItem {...props2} disableRipple variant="outlined" />}
            />
        </FlexBox>
    );
}

export default CustomPagination;

CustomPagination.PropTypes = {
    total: PropTypes.string.isRequired,
    page: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    color: PropTypes.string,
    rows_per_page: PropTypes.number.isRequired,
    boundary_count: PropTypes.number,
    on_change: PropTypes.func
};
