import PropTypes from 'prop-types';
import { Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/Common/MainCard';
import cx from 'classnames';
import './styles.scss';
import { useNavigate } from 'react-router-dom';

const AnalyticLrcForm = ({ color, id, title, count, child, percentage, isLoss, extra }) => {
    const navigate = useNavigate();
    // 페이지 이동
    const moveUrl = (id) => {
        navigate(`/projects/list/${id}/`);
    };

    const detailUrl = (id, processCode) => {
        navigate(`/projects/list/${id}/${processCode}`);
    };

    return (
        <div>
            <MainCard contentSX={{ p: 2.25 }} className={cx('gridCardColor')}>
                <Stack spacing={0.5}>
                    <Typography variant="h4" color="textSecondary">
                        {title}
                    </Typography>
                    <Grid item container direction="row" alignItems="center" justifyContent="center">
                        <Grid item justify="center">
                            <Typography variant="h2" color="inherit">
                                <a href="#" onClick={() => moveUrl(id)}>
                                    <b>{count}</b> 건
                                </a>
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
                                        <a href="#" onClick={() => detailUrl(id, item.id)}>
                                            {item.name} <b>{item.count}</b> 건
                                        </a>
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
};

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
