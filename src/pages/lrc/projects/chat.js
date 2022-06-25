import React from 'react';
import { createStyles, makeStyles, Theme } from '@mui/styles';
import {
    OutlinedInput,
    Box,
    Button,
    Grid,
    Stack,
    TextField,
    Paper,
    Alert,
    AlertTitle,
    Typography,
    FormControl,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Radio,
    RadioGroup,
    Tab,
    Tabs,
    Divider,
    List,
    ListItem,
    Fab,
    ListItemText
} from '@mui/material';
import { TextInput } from './TextInput';
import { MessageLeft, MessageRight } from './message';
const useStyles = makeStyles((theme) =>
    createStyles({
        paper: {
            width: '80vw',
            height: '80vh',
            maxWidth: '500px',
            maxHeight: '700px',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            position: 'relative'
        },
        paper2: {
            width: '80vw',
            maxWidth: '500px',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            position: 'relative'
        },
        container: {
            width: '400',
            //height: '50vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        messagesBody: {
            width: 'calc( 100% - 20px )',
            margin: 10,
            overflowY: 'scroll',
            height: 'calc( 100% - 80px )'
        }
    })
);

const Chat = () => {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <Paper className={classes.paper} zdepth={2}>
                <Paper id="style-1" className={classes.messagesBody}>
                    <MessageLeft
                        message="상장 신청하려고 파일을 업로드하려고 합니다."
                        timestamp="2022.02.01 11:10"
                        photoURL=""
                        displayName="minsoub"
                        avatarDisp={true}
                    />
                    <MessageLeft
                        message="상장 신청서 업로드했습니다."
                        timestamp="2022.02.01 11:10"
                        photoURL=""
                        displayName="minsoub"
                        avatarDisp={false}
                    />
                    <MessageRight
                        message="업로드 확인하였습니다."
                        timestamp="2022.02.01 11:10"
                        photoURL=""
                        displayName="Listing Team"
                        avatarDisp={true}
                    />
                    <MessageRight
                        message="서류 검토는 최소 5일정도 소요될 수 있습니다."
                        timestamp="2022.02.01 11:10"
                        photoURL=""
                        displayName="Listing Team"
                        avatarDisp={false}
                    />
                </Paper>
                <TextInput />
            </Paper>
        </div>
    );
};

export default Chat;
