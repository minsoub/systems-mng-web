import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DefaultDataGrid from '../../components/DataGrid/DefaultDataGrid';
import MainCard from 'components/Common/MainCard';
import { blue } from '@mui/material/colors';
import {
    OutlinedInput,
    Box,
    Button,
    Grid,
    Stack,
    DialogTitle,
    Dialog,
    Alert,
    AlertTitle,
    Typography,
    TextField,
    FormControl,
    Collapse,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountApis from 'apis/account/accountapis';

function PrivateReasonDialog(props) {
    const { onClose, selectedValue, open } = props;
    const [keyword, setKeyword] = useState('');

    const handleChange = (event) => {
        setKeyword(event.target.value);
    };

    const handleClose = () => {
        console.log('handleClose called..');
        if (keyword === '') {
            alert('개인정보 열람 사유를 입력하세요.');
            return;
        }
        onClose(keyword);
        clearData();
    };
    const closePopup = () => {
        console.log('closePopup called');
        onClose('');
        clearData();
    };

    const clearData = () => {
        setKeyword('');
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>개인정보 열람 사유입력</DialogTitle>

            <MainCard sx={{ mt: 0 }}>
                <Stack direction="row" spacing={1}>
                    <FormControl sx={{ m: 0, maxHeight: 30 }} size="small">
                        <TextField
                            id="filled-hidden-label-small"
                            type="text"
                            size="small"
                            value={keyword}
                            name="keyword"
                            onChange={handleChange}
                            placeholder=""
                            fullWidth
                        />
                    </FormControl>
                    <Button disableElevation size="small" type="submit" variant="contained" color="secondary" onClick={handleClose}>
                        적용
                    </Button>
                    <Button disableElevation size="small" type="submit" variant="contained" color="secondary" onClick={closePopup}>
                        닫기
                    </Button>
                </Stack>
            </MainCard>
        </Dialog>
    );
}

PrivateReasonDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};

export default PrivateReasonDialog;
