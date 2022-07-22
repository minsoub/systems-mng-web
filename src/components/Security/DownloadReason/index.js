import React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function FormDialog({ open, reason, setReason, handleClose }) {
    const handleBlur = (e) => {
        console.log(e);
    };
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'reason':
                setReason(e.target.value);
                break;
            default:
                break;
        }
    };

    const handleChecked = () => {
        handleClose();
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>다운로드 사유 입력</DialogTitle>
                <DialogContent>
                    <DialogContentText>개인정보를 다운로드하는 경우 사유 확인이 필요합니다.</DialogContentText>
                    <TextField
                        margin="dense"
                        name="reason"
                        label="사유"
                        type="text"
                        value={reason}
                        fullWidth
                        variant="standard"
                        onBlur={handleBlur}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>취소</Button>
                    <Button onClick={handleChecked}>확인</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
