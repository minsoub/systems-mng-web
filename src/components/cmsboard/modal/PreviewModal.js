/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Modal, Divider, Button } from '@mui/material';

//library
import PropTypes from 'prop-types';

// style
import styles from './styles.module.scss';

// =============|| DetailContents - PreviewModal ||============= //

const PreviewModal = ({ open, onClose, viewMode }) => {
    const { reduceTitle } = useSelector((state) => state.cmsDetailData);
    const [editContents, setEditContents] = useState('');
    const [viewModeStyle, setViewModeStyle] = useState(styles.false);

    useEffect(() => {
        if (!viewMode) return;
        if (viewMode === 'pc') {
            setViewModeStyle(styles.pc);
        } else {
            setViewModeStyle(styles.mobile);
        }
    }, [viewMode]);

    useEffect(() => {
        if(open){
            setEditContents(window['contentsEditor'].getPublishingHtml());
        }
    }, [open]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            BackdropProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.7' } }}
        >
            <Box className={`${styles.preview_modal_wrap} ${viewModeStyle}`}>
                <div className={styles.modal_title}>
                    <h4 className={styles.header}>{viewMode} 미리보기</h4>
                    <Button className={styles.button_close} size="small" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M21 3.705L20.295 3L12 11.295L3.705 3L3 3.705L11.295 12L3 20.295L3.705 21L12 12.705L20.295 21L21 20.295L12.705 12L21 3.705V3.705Z"
                                fill="#1C2028"
                            />
                        </svg>
                    </Button>
                </div>
                <Divider sx={{ backgroundColor: 'transparent' }} />
                <div className={styles.preview_modal_box}>
                    <div className={styles.modal_header}>
                        <h2 className={`${styles.modal_header__title}`}>{reduceTitle}</h2>
                        <p className={styles.modal_header_box}>
                            <span className={styles.modal_header__date}>2023-01-01 00:00:00</span>
                        </p>
                    </div>
                    <div
                        className={`common-board--layout ${styles.modal_content}`}
                        dangerouslySetInnerHTML={{ __html: editContents }}
                    ></div>
                </div>
            </Box>
        </Modal>
    );
};

export default PreviewModal;

PreviewModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    viewMode: PropTypes.string
};
