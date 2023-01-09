/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, MenuItem, Select, Box, TextField, Modal } from '@mui/material';

// library
import PropTypes from 'prop-types';

// style
import styles from './styles.module.scss';

// =============|| DetailContents - EventModal ||============= //

const EventModal = ({ open, onClose, modalType }) => {
    const [value, setValue] = useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };
    useEffect(() => {
        console.log(modalType);
    }, [modalType]);
    useEffect(() => {
        if (!open) setValue('');
    }, [open]);

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box className={`${styles.modal_wrap}`}>
                <h2 className={`${styles.modal_title}`}>
                    {modalType === 0 ? <>개인정보 열람 사유입력</> : <>개인정보 수집 및 이용 동의</>}
                </h2>
                <div className="common-board--layout">
                    <table>
                        <tbody>
                            <tr className={styles.button_wrap_tr}>
                                <td className={styles.button_wrap_td}>
                                    {modalType === 0 ? (
                                        <>
                                            <TextField
                                                type="text"
                                                size="small"
                                                value=""
                                                name="title"
                                                value={value}
                                                onChange={handleChange}
                                                placeholder="개인정보 열람 사유를 입력해 주세요."
                                                fullWidth
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <TextField
                                                type="text"
                                                size="small"
                                                value=""
                                                multiline
                                                maxRows={3}
                                                name="title"
                                                value={value}
                                                onChange={handleChange}
                                                placeholder="개인정보 수집 및 이용 동의를 입력해 주세요."
                                                fullWidth
                                            />
                                        </>
                                    )}
                                </td>
                            </tr>
                            <tr className={styles.button_wrap_tr}>
                                <td className={styles.button_wrap_td}>
                                    <Button
                                        disableElevation
                                        size="medium"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        className={styles.buttons}
                                        onClick={onClose}
                                    >
                                        닫기
                                    </Button>
                                    <Button
                                        disableElevation
                                        size="medium"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        className={styles.buttons}
                                    >
                                        저장
                                    </Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Box>
        </Modal>
    );
};

export default EventModal;

EventModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    modalType: PropTypes.number
};
