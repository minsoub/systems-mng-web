import React from 'react';
import ReactDOM from 'react-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MUIRichTextEditor from 'mui-rte';
import { useEffect, useState } from 'react';
import AnimateButton from 'components/@extended/AnimateButton';

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
    Typography,
    OutlinedInput,
    InputLabel
} from '@mui/material';
import MainCard from 'components/MainCard';
import DefaultButton from 'components/button/DefaultButton';
import { useNavigate } from 'react-router-dom';

const Write = () => {
    const navgate = useNavigate();
    const [data, setData] = useState();
    const [subject, setSubject] = useState();

    const save = (data) => {
        setData(data);
    };

    const handleSaveButton = () => {
        console.log('save');
    };

    const handleCancelButton = () => {
        console.log('cancel');
        navgate(-1);
    };
    return (
        <Grid container rowSpacing={2} columnSpacing={0.75}>
            <Grid item xs={12} md={12} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Board Write Sample</Typography>
                    </Grid>
                </Grid>
                <Stack spacing={1}>
                    <InputLabel htmlFor="lastname-signup">Title*</InputLabel>
                    <OutlinedInput fullWidth id="lastname-signup" value={subject} name="" placeholder="" inputProps={{}} />
                </Stack>
                <MainCard sx={{ mt: 2, minHeight: 300 }} content={false}>
                    <MUIRichTextEditor label="Type something here..." onSave={save} inlineToolbar={true} />
                </MainCard>
                <MainCard sx={{ mt: 2 }} content={false}>
                    {data}
                </MainCard>
            </Grid>
            <Grid item xs={8} md={10} lg={10}></Grid>
            <Grid item xs={2} md={1} lg={1}>
                <DefaultButton buttonType="primary" onButtonClick={handleSaveButton}>
                    Save
                </DefaultButton>
            </Grid>
            <Grid item xs={2} md={1} lg={1}>
                <DefaultButton buttonType="secondary" onButtonClick={handleCancelButton}>
                    cancel
                </DefaultButton>
            </Grid>
        </Grid>
    );
};

export default Write;
