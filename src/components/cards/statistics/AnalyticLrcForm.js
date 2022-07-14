import PropTypes from 'prop-types';

// material-ui
import { Box, Chip, Grid, Stack, Typography, GRid } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// assets
import { RiseOutlined, FallOutlined } from '@ant-design/icons';

// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

const AnalyticLrcForm = ({ color, title, count, child, percentage, isLoss, extra }) => (
    <div>
        <MainCard contentSX={{ p: 2.25 }}>
            <Stack spacing={0.5}>
                <Typography variant="h4" color="textSecondary">
                    {title}
                </Typography>
                <Grid item container direction="row" alignItems="center" justifyContent="center">
                    <Grid item justify="center">
                        <Typography variant="h2" color="inherit">
                            {count} 건
                        </Typography>
                    </Grid>
                </Grid>
            </Stack>
        </MainCard>
        <Grid container spacing={0} sx={{ mt: 1 }}></Grid>
        {child.map((item, index) => (
            <div>
                <MainCard contentSX={{ mt: 1, p: 0.25 }}>
                    <Stack spacing={0.5}>
                        <Grid item container direction="row" alignItems="center" justifyContent="center">
                            <Grid key={index} item justify="center">
                                <Typography variant="h6" color="inherit">
                                    {item.name} {item.count} 건
                                </Typography>
                            </Grid>
                        </Grid>
                    </Stack>
                </MainCard>
                <Grid container spacing={0} sx={{ mt: 1 }}></Grid>
            </div>
        ))}
    </div>
);

AnalyticLrcForm.propTypes = {
    color: PropTypes.string,
    title: PropTypes.string,
    count: PropTypes.number,
    child: PropTypes.array,
    percentage: PropTypes.number,
    isLoss: PropTypes.bool,
    extra: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
};

AnalyticLrcForm.defaultProps = {
    color: 'primary'
};

export default AnalyticLrcForm;
