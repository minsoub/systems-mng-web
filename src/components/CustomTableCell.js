import React from 'react';
// material-ui
// eslint-disable-next-line prettier/prettier
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
