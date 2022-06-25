import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// material-ui
// eslint-disable-next-line prettier/prettier
import {
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    // [`&.${tableCellClasses.head}`]: {
    //     backgroundColor: theme.palette.common.black,
    //     color: theme.palette.common.white
    // },
    [`&.${tableCellClasses.body}`]: {
        backgroundColor: '#dcdcdc00', //theme.palette.common.black,
        color: theme.palette.common.black
    }
}));
export const FontTableCell = styled(TableCell)(({ theme }) => ({
    // [`&.${tableCellClasses.head}`]: {
    //     backgroundColor: theme.palette.common.black,
    //     color: theme.palette.common.white
    // },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 9
    }
}));
