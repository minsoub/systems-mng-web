/* eslint-disable no-unused-vars */
import { Box, Modal } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

// library
import PropTypes from 'prop-types';

// style
import styles from './styles.module.scss';

// =============|| DetailContents - LoadingModal ||============= //

const LoadingModal = ({ open, onClose }) => {
    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box className={`${styles.load_wrap}`}>
                <CircularProgress disableShrink size="5rem" sx={{ color: '#fff' }} />
            </Box>
        </Modal>
    );
};

export default LoadingModal;

LoadingModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
};
