import React, { useEffect, useState } from 'react';
import { DataGrid, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import './style.scss';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: 1,
    color: 'rgba(0,0,0,.50)',
    WebkitFontSmoothing: 'auto',
    letterSpacing: 'normal',

    '& .MuiDataGrid-columnHeaders': {
        backgroundColor: '#ddd'
    },
    '& .MuiDataGrid-columnsContainer': {
        backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : '#1d1d1d'
    },
    '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
        borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'}`
    },
    '& .MuiDataGrid-cell': {
        color: theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.65)',
        display: 'flex',
        justifyContent: 'center'
    }
}));

function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <Pagination
            color="primary"
            variant="outlined"
            shape="rounded"
            page={page + 1}
            count={pageCount}
            // @ts-expect-error
            renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
    );
}

export function CustomDataGrid({
    columns,
    rows,
    handlePageChange,
    handleGridClick,
    handleGridDoubleClick,
    selectionChange,
    height,
    pageSize
}) {
    const [selectionModel, setSelectionModel] = useState([]);
    const handlePage = (page, details) => {
        handlePageChange(page + 1);
    };

    useEffect(() => {
        //console.log('change selectionModel:', selectionModel);
        selectionChange(selectionModel);
    }, [selectionModel]);

    let mHeight = 500;

    if (height) {
        mHeight = height;
    }
    if (rows) {
        return (
            <div style={{ height: mHeight, width: '100%' }}>
                <StyledDataGrid
                    pageSize={pageSize || 20}
                    rowsPerPageOptions={[5]}
                    components={{
                        Pagination: CustomPagination
                    }}
                    rows={rows}
                    columns={columns}
                    onPageChange={handlePage}
                    onCellClick={handleGridClick}
                    onCellDoubleClick={handleGridDoubleClick}
                    isCellEditable={(params) => false}
                    disableSelectionOnClick
                    selectionModel={selectionModel}
                    onSelectionModelChange={(newSelectionModel) => {
                        console.log('newSelectionModel:', newSelectionModel);
                        setSelectionModel(newSelectionModel);
                    }}
                    keepNonExistentRowsSelected
                />
            </div>
        );
    } else {
        return null;
    }
}

export default CustomDataGrid;
