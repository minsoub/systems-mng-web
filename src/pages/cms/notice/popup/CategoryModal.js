/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, MenuItem, Select, Box, TextField, Modal } from '@mui/material';
import styles from './styles.module.scss';
const CategoryModal = ({ open, onClose }) => {
    const [categoryValue, setCategoryValue] = useState('');
    const [stateValue, setStateValue] = useState('1');

    const handleChange = (event) => {
        setCategoryValue(event.target.value);
    };
    const stateChange = (event) => {
        setStateValue(event.target.value);
    };
    useEffect(() => {}, []);
    useEffect(() => {
        if (!open){
            setCategoryValue('');
            setStateValue('1');
        }
    }, [open]);
    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box className={`${styles.modal_wrap}`}>
                <h2 className={`${styles.modal_title}`}>카테고리 관리</h2>
                <div className="common-board--layout">
                    <table>
                        <tbody>
                            <tr>
                                <th className={'tb--title width20'}>
                                    카테고리명<em>*</em>
                                </th>
                                <td>
                                    <TextField
                                        type="text"
                                        size="small"
                                        value=""
                                        name="title"
                                        value={categoryValue}
                                        onChange={handleChange}
                                        placeholder="카테고리명을 입력해 주세요."
                                        fullWidth
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className={'tb--title width15'}>상태</th>
                                <td>
                                    <Select
                                        className={styles.detail_select}
                                        name="type"
                                        label="구분"
                                        value={stateValue}
                                        onChange={stateChange}
                                    >
                                        <MenuItem value="1">일반</MenuItem>
                                        <MenuItem value="2">고정</MenuItem>
                                </Select>
                                </td>
                            </tr>
                            <tr className={styles.button_wrap_tr}>
                                <td colSpan="2" className={styles.button_wrap_td}>
                                    <Button
                                        disableElevation
                                        size="medium"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        className={styles.buttons}
                                        onClick={onClose}
                                    >
                                        취소
                                    </Button>
                                    <Button
                                        disableElevation
                                        size="medium"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        className={styles.buttons}
                                    >
                                        삭제
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

export default CategoryModal;
