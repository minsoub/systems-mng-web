/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, MenuItem, Select, Box, TextField, Modal } from '@mui/material';
import BoardApi from 'apis/cms/boardapi';
import styles from './styles.module.scss';
const CategoryModal = ({ open, onClose, selectRowData }) => {
    //통신 데이터
    const [responseData, requestError, loading, { createBoard, updateBoard, deleteBoard }] = BoardApi();

    const [categoryValue, setCategoryValue] = useState('');
    const [stateValue, setStateValue] = useState('1');

    const handleChange = (event) => {
        setCategoryValue(event.target.value);
    };
    const stateChange = (event) => {
        setStateValue(event.target.value);
    };
    useEffect(() => {
        console.log('selectRowData', selectRowData);
        if (!selectRowData) return;
        setCategoryValue(selectRowData.name);
        setStateValue(selectRowData.is_use ? 1 : 2);
    }, [selectRowData]);
    useEffect(() => {
        if (!open) {
            setCategoryValue('');
            setStateValue('1');
        }
    }, [open]);
    const onDelete = () => {
        // 삭제 기능 제작
        if (confirm('삭제 하시겠습니까?')) {
            deleteBoard('notices/categories', selectRowData.id);
        }
    };
    const onSave = () => {
        // 공백제거 추가
        if (!categoryValue || !categoryValue.replace(/\s/g, '')) {
            alert('카테고리명을 입력하세요.');
            return;
        }
        if (confirm('저장 하시겠습니까?')) {
            const data = {
                name: categoryValue,
                is_use: Number(stateValue) === 1 ? true : false
            };

            if (selectRowData) {
                // 업데이트
                updateBoard('notices/categories', selectRowData.id, data);
            } else {
                createBoard('notices/categories', data);
            }
        }
    };
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'createBoard':
            case 'updateBoard':
                alert('등록되었습니다.');
                onClose('reload');
                break;
            case 'deleteBoard':
                alert('삭제되었습니다.');
                onClose('reload');
                break;
            default:
                return;
        }
    }, [responseData]);
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
                                        <MenuItem value="1">사용</MenuItem>
                                        <MenuItem value="2">미사용</MenuItem>
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
                                    {selectRowData && (
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            className={styles.buttons}
                                            onClick={onDelete}
                                        >
                                            삭제
                                        </Button>
                                    )}
                                    <Button
                                        disableElevation
                                        size="medium"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        className={styles.buttons}
                                        onClick={onSave}
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

CategoryModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    selectRowData: PropTypes.object
};
