import React from 'react';
import ReactDOM from 'react-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MUIRichTextEditor from 'mui-rte';
import { useEffect, useState } from 'react';
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
import MainCard from 'components/MainCard';

const EditorPage = () => {
    const [data, setData] = useState();

    const save = (data) => {
        setData(data);
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Board Write Sample</Typography>
                    </Grid>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <Typography variant="h6">Reference : https://github.com/niuware/mui-rte</Typography>
                </MainCard>
                <MainCard sx={{ mt: 2, minHeight: 200 }} content={false}>
                    <MUIRichTextEditor label="Type something here..." onSave={save} inlineToolbar={true} />
                </MainCard>
                <MainCard sx={{ mt: 2 }} content={false}>
                    {data}
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default EditorPage;
