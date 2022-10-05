import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ButtonBase } from '@mui/material';
import Logo from './Logo';
import InnerLogo from './InnerLogo';
import config from 'config';

const LogoSection = ({ sx, to, isIcon }) => (
    <ButtonBase disableRipple component={Link} to={!to ? config.defaultPath : to} sx={sx}>
        {isIcon ? <InnerLogo /> : <Logo />}
    </ButtonBase>
);

LogoSection.propTypes = {
    sx: PropTypes.object,
    to: PropTypes.string
};

export default LogoSection;
