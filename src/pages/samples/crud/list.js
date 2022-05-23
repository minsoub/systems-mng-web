import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material-ui
import {
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Grid,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import DefaultButton from 'components/button/DefaultButton';
import MainCard from 'components/MainCard';
import DefaultDataGrid from '../../../components/DataGrid/DefaultDataGrid';
import Search from '../../../components/Input/Search';

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'firstName',
        headerName: 'First name',
        width: 150,
        editable: true
    },
    {
        field: 'lastName',
        headerName: 'Last name',
        width: 150,
        editable: true
    },
    {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 110,
        editable: true
    },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`
    }
];

const TableSamplePage = () => {
    const navgate = useNavigate();
    const rows = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
        { id: 10, lastName: '정', firstName: '호균', age: 35 },
        { id: 11, lastName: '짱', firstName: '민섭', age: 42 },
        { id: 12, lastName: '송', firstName: '원창', age: 45 },
        { id: 13, lastName: '나', firstName: '성진', age: 16 },
        { id: 14, lastName: '이', firstName: '한솔', age: null },
        { id: 15, lastName: '권', firstName: '수현', age: 150 },
        { id: 16, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 17, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 18, lastName: 'Roxie', firstName: 'Harvey', age: 65 }
    ];

    const handlePage = (page) => {
        console.log('handlePage:', page);
    };

    const handleClick = (rowData) => {
        console.log('handleClick:', rowData);
    };

    const handleDoubleClick = (rowData) => {
        console.log('handleDoubleClick:', rowData);
        navgate(`/crud/edit/${rowData.id}`);
    };

    const handleSearch = () => {
        console.log('search');
        navgate('/crud/list');
    };

    const handleWriteButton = () => {
        console.log();
        navgate('/crud/write');
    };
    return (
        <Grid container rowSpacing={2} columnSpacing={0.75}>
            <Grid item xs={12} md={12} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Crud Sample - list</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <DefaultButton buttonType="primary" onButtonClick={handleWriteButton}>
                            Write
                        </DefaultButton>
                    </Grid>
                    <Grid item>
                        <Search enterEvent={handleSearch} />
                    </Grid>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <DefaultDataGrid
                        columns={columns}
                        rows={rows}
                        handlePageChange={handlePage}
                        handleGridClick={handleClick}
                        handleGridDoubleClick={handleDoubleClick}
                    />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default TableSamplePage;
