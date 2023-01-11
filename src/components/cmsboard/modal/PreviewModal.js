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

    useEffect(() => {
        if (!viewMode) return;
        console.log(viewMode);
    }, [viewMode]);

    useEffect(() => {
        if(open){
            setEditContents(window['contentsEditor'].getPublishingHtml());
        }
    }, [open]);

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box className={`${styles.preview_modal_wrap} ${viewMode}`}>
                <h2 className={`${styles.modal_title}`}>{reduceTitle}</h2>
                <div>2023-01-01 00:00:00</div>
                <div className="common-board--layout" dangerouslySetInnerHTML={{ __html: editContents }}></div>
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
