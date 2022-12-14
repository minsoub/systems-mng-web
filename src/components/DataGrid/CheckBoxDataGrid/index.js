import React, { useEffect, useState } from 'react';
import { DataGrid, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector } from '@mui/x-data-grid';
import { alpha, styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import cx from 'classnames';
import './style.scss';

function customCheckbox(theme) {
    return {
        '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#ddd'
        },
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
    '& .MuiDataGrid-columnsContainer': {
        backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : '#1d1d1d'
    },
    '& .MuiDataGrid-iconSeparator': {
        display: 'none'
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

    //console.log('pageCount', pageCount, 'page', page);
    return (
        <Pagination
            color="primary"
            variant="outlined"
            shape="rounded"
            page={page + 1}
            count={pageCount}
            className="pagination"
            renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
    );
}

export function CheckBoxDataGrid({
    columns,
    rows,
    handlePageChange,
    handleGridClick,
    handleGridDoubleClick,
    selectionChange,
    height,
    pageSize = 10,
    className
}) {
    const [selectionModel, setSelectionModel] = useState([]);
    const [page, setPage] = useState(1);
    const [gridDatas, setGridDatas] = useState([]);
    const [loading, setLoading] = useState(false);

    const handlePage = (page, details) => {
        handlePageChange(page + 1);
        setPage(page + 1);
    };
    const loadServerRows = (page, data) => {
        return new Promise((resolve) => {
            resolve(data.slice((page - 1) * pageSize, page * pageSize));
        });
    };
    useEffect(() => {
        console.log('change selectionModel:', selectionModel);
        //setSelectionModel(selectionModel);
        selectionChange(selectionModel);
    }, [selectionModel]);

    useEffect(() => {
        let active = true;
        if (rows.length) {
            (async () => {
                setLoading(true);
                const newRows = await loadServerRows(page, rows);
                if (!active) {
                    return;
                }
                setGridDatas(newRows);
                setLoading(false);
            })();
        } else {
            setGridDatas([]);
        }

        return () => {
            active = false;
        };
    }, [page, rows]);

    let mHeight = 600;

    if (height) {
        mHeight = height;
    }
    // 글 1개 이상이면
    if (rows) {
        return (
            <div className={cx('gridLayout')} style={{ height: mHeight, width: '100%' }}>
                <StyledDataGrid
                    checkboxSelection
                    pageSize={pageSize || 20}
                    rowsPerPageOptions={[1]}
                    components={{
                        Pagination: CheckBoxPagination
                    }}
                    className={className}
                    rows={gridDatas}
                    rowCount={rows.length}
                    columns={columns}
                    onPageChange={handlePage}
                    onCellClick={handleGridClick}
                    onCellDoubleClick={handleGridDoubleClick}
                    isCellEditable={(params) => false}
                    pagination
                    paginationMode="server"
                    loading={loading}
                    disableSelectionOnClick
                    selectionModel={selectionModel}
                    onSelectionModelChange={(newSelectionModel) => {
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
