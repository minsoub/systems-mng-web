import React,{useEffect} from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import propTypes from 'prop-types';

import { styled } from '@mui/material/styles';
import FlexBox from 'components/Common/FlexBox/index';

// eslint-disable-next-line react/prop-types
const CustomPagination = ({ total, page, count, color, boundary_count, on_change }) => {
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
                // rowsPerPage={rowPerPage}
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

CustomPagination.propTypes = {
    total: propTypes.any.isRequired,
    page: propTypes.any.isRequired,
    count: propTypes.number.isRequired,
    color: propTypes.string,
    // rows_per_page: propTypes.number.isRequired,
    boundary_count: propTypes.number,
    on_change: propTypes.func
};
