import React, { useState, useEffect } from 'react';
import { DataGrid, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import { alpha } from '@mui/material/styles';
import './style.scss';

function customCheckbox(theme) {
    return {
        '& .MuiCheckbox-root svg': {
            width: 14,
            height: 14,
            backgroundColor: 'transparent',
            border: `1px solid ${theme.palette.mode === 'light' ? '#d9d9d9' : 'rgb(67, 67, 67)'}`,
            borderRadius: 2
        },
        '& .MuiCheckbox-root svg path': {
            display: 'none'
        },
        '& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg': {
            backgroundColor: '#1890ff',
            borderColor: '#1890ff'
        },
        '& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after': {
            position: 'absolute',
            display: 'table',
            border: '1px solid #fff',
            borderTop: 0,
            borderLeft: 0,
            transform: 'rotate(45deg) translate(-50%,-50%)',
            opacity: 1,
            transition: 'all .2s cubic-bezier(.12,.4,.29,1.46) .1s',
            content: '""',
            top: '50%',
            left: '39%',
            width: 5.71428571,
            height: 9.14285714
        },
        '& .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiIconButton-label:after': {
            width: 8,
            height: 8,
            backgroundColor: '#1890ff',
            transform: 'none',
            top: '39%',
            border: 0
        }
    };
}

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: 1,
    color: 'rgba(0,0,0,.50)',
    fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"'
    ].join(','),
    WebkitFontSmoothing: 'auto',
    letterSpacing: 'normal',
    '& .MuiDataGrid-columnsContainer': {
        backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : '#1d1d1d'
    },
    '& .MuiDataGrid-iconSeparator': {
        display: 'none'
    },
    '& .MuiDataGrid-columnHeader': {
        backgroundColor: alpha('#eeeeee', 0.7),
        height: 45
    },
    '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
        borderRight: `1px solid '#303030'`
    },
    '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
        borderLeft: `1px solid '#303030'`
    },
    '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
        borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'}`
    },
    '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
        borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'}`
    },
    '& .MuiDataGrid-cell': {
        color: theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.65)',
        maxHeight: 'none !important'
    },
    '& .MuiDataGrid-row': {
        maxHeight: 'none !important'
    },
    '& .MuiPaginationItem-root': {
        borderRadius: 2
    },
    ...customCheckbox(theme)
}));

function CheckBoxPagination() {
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

export function CheckBoxDataGrid({ columns, rows, handlePageChange, handleGridClick, handleGridDoubleClick, selectionChange, height }) {
    const handlePage = (page, details) => {
        handlePageChange(page + 1);
    };

    const [selectionModel, setSelectionModel] = useState([]);
    useEffect(() => {
        console.log('change selectionModel:', selectionModel);
        selectionChange(selectionModel);
    }, [selectionModel]);

    let mHeight = 600;

    if (height) {
        mHeight = height;
    }
    if (rows) {
        return (
            <div style={{ height: mHeight, width: '100%' }}>
                <StyledDataGrid
                    checkboxSelection
                    pageSize={20}
                    rowsPerPageOptions={[5]}
                    components={{
                        Pagination: CheckBoxPagination
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

export default CheckBoxDataGrid;