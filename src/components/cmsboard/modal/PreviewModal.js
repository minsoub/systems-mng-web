/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Modal } from '@mui/material';

//library
import PropTypes from 'prop-types';

// style
import styles from './styles.module.scss';

// =============|| Category - Modal ||============= //

const PreviewModal = ({ open, onClose, viewMode }) => {
    const { reduceTitle } = useSelector((state) => state.cmsDetailData);
    const [editContents, setEditContents] = useState('');
    const [viewModeStyle, setViewModeStyle] = useState(styles.false);

    useEffect(() => {
        if (!viewMode) return;
        console.log(viewMode);
        if (viewMode === 'pc') {
            setViewModeStyle(styles.pc);
        } else {
            setViewModeStyle(styles.mobile);
        }
        console.log(viewModeStyle);
    }, [viewMode]);

    useEffect(() => {
        if(open){
            setEditContents(window['contentsEditor'].getPublishingHtml());
        }
    }, [open]);

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box className={`${styles.preview_modal_wrap} ${viewModeStyle}`}>
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
