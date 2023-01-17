/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Box, TextField, Modal, Input } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// transition
import { activeEventPrivateTitle, activeEventPrivateTxt } from 'store/reducers/cms/DetailEventData';

// transition
import BoardApi from 'apis/cms/boardapi';

// library
import PropTypes from 'prop-types';

// style
import styles from './styles.module.scss';

// =============|| DetailContents - EventModal ||============= //

const EventModal = ({ open, onClose, modalType }) => {
    const { paramId } = useParams(); //상세번호
    const dispatch = useDispatch();
    const [responseData, requestError, loading, { excelDownload }] = BoardApi();
    const { reduceEventPrivateTitle, reduceEventPrivateTxt } = useSelector((state) => state.cmsDetailEventData);

    const [eventTitle, setEventTitle] = useState('개인정보 수집 및 이용 동의');
    const [eventContents, setEventContents] = useState('');

    const handleChangeTitle = (event) => {
        setEventTitle(event.target.value);
    };
    const handleChange = (event) => {
        setEventContents(event.target.value);
    };
    useEffect(() => {
        if (!open) setEventContents('');
        if (modalType === 1) {
            setEventContents(reduceEventPrivateTxt);
            if (reduceEventPrivateTitle) {
                setEventTitle(reduceEventPrivateTitle);
            } else {
                setEventTitle('개인정보 수집 및 이용 동의');
            }
        }
    }, [open]);

    const onSave = () => {
        if (modalType === 1) {
            dispatch(activeEventPrivateTitle({ reduceEventPrivateTitle: eventTitle }));
            dispatch(activeEventPrivateTxt({ reduceEventPrivateTxt: eventContents }));
            onClose();
        } else {
            excelDownload(paramId, eventContents);
        }
    };

    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'downloadExcel':
                if (responseData.data) {
                    let res = responseData;
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', '참여자 정보.xlsx');
                    link.style.cssText = 'display:none';
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    onClose();
                }
                break;
            default:
                break;
        }
    }, [responseData]);

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box className={`${styles.modal_wrap}`}>
                <h2 className={`${styles.modal_title}`}>
                    {modalType === 0 ? (
                        <>개인정보 열람 사유입력</>
                    ) : (
                        <>
                            <Input
                                type="text"
                                size="small"
                                value=""
                                maxRows={1}
                                maxLength={18}
                                name="title"
                                value={eventTitle}
                                inputProps={{ maxLength: 18 }}
                                onChange={handleChangeTitle}
                                placeholder="개인정보 수집 및 이용 동의"
                                fullWidth
                            />
                        </>
                    )}
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
                                                name="contents"
                                                value={eventContents}
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
                                                name="contents"
                                                value={eventContents}
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
                                        onClick={onSave}
                                    >
                                        {modalType === 1 ? '저장' : '다운로드'}
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
