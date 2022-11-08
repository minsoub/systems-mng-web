import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertTitle, Button, Dialog, DialogContent, Typography, OutlinedInput } from '@mui/material';
import ButtonLayout from '../../../../../components/Common/ButtonLayout';
import './style.module.scss';
import './style.scss';

function MaskingDialog(props) {
    const { onClose, onMasking, open } = props;

    const [inputValue, setInputValue] = useState('');

    const saveClick = () => onMasking(inputValue);

    const handleChage = (e) => {
        setInputValue(e.target.value);
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogContent className="cpcMainContentsPopup">
                <Typography sx={{ mt: 1, mb: 0 }} variant={'h5'} gutterBottom component="div" className="bottom--blank">
                    개인정보 열람 사유 입력
                </Typography>
                <OutlinedInput sx={{ mt: 1, mb: 0 }} onChange={handleChage} value={inputValue} />
                <ButtonLayout style={{ justifyContent: 'center', marginTop: '1rem' }}>
                    <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={handleClose}>
                        닫기
                    </Button>
                    <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={saveClick}>
                        확인
                    </Button>
                </ButtonLayout>
            </DialogContent>
        </Dialog>
    );
}

MaskingDialog.propTypes = {
    onMasking: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};

export default MaskingDialog;
