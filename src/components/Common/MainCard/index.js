import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Card, Typography } from '@mui/material';
import styles from './styles.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

/**
 * title 제목
 * @type {React.ForwardRefExoticComponent<React.PropsWithoutRef<{readonly border?: *, readonly elevation?: *, readonly contentSX?: *, readonly children?: *, readonly title?: *, readonly content?: *, readonly bgcolor?: *, readonly sx?: *, readonly addContClass?: *}> & React.RefAttributes<unknown>>}
 */
const MainCard = forwardRef(({ border = true, children, content = true, elevation, title, bgcolor, sx, addContClass }, ref) => {
    return (
        <Card
            elevation={elevation || 0}
            ref={ref}
            sx={{
                ...sx,
                border: border && '1px solid #e6ebf1',
                marginBottom: !title && '20px',
                bgcolor: bgcolor
            }}
            className={cx('content', addContClass)}
        >
            {/* 컨텐츠 제목 */}
            {title && (
                <Typography variant="h4" className={cx('contentTilte')}>
                    {title}
                </Typography>
            )}

            {/* 컨텐츠 내용물 */}
            {content && <div className={cx('cardCon')}>{children}</div>}
            {!content && children}
        </Card>
    );
});

MainCard.propTypes = {
    border: PropTypes.bool,
    boxShadow: PropTypes.bool,
    contentSX: PropTypes.object,
    darkTitle: PropTypes.bool,
    divider: PropTypes.bool,
    elevation: PropTypes.number,
    secondary: PropTypes.node,
    shadow: PropTypes.string,
    sx: PropTypes.object,
    title: PropTypes.string,
    codeHighlight: PropTypes.bool,
    content: PropTypes.bool,
    children: PropTypes.node,
    bgcolor: PropTypes.any,
    sx: PropTypes.any,
    addContClass: PropTypes.string
};

export default MainCard;
