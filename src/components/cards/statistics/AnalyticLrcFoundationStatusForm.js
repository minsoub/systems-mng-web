import PropTypes from 'prop-types';
import { Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/Common/MainCard';
import cx from 'classnames';
import './styles.scss';
import { useNavigate } from 'react-router-dom';
import { CopyFilled, ClockCircleOutlined, StopOutlined, PieChartOutlined } from '@ant-design/icons';

const AnalyticLrcFoundationStatusForm = ({ color, id, title, count, percentage, isLoss, extra }) => {
    const navigate = useNavigate();
    // 페이지 이동
    const moveUrl = (id) => {
        navigate(`/line/list/`);
    };

    const detailUrl = (id, processCode) => {
        navigate(`/line/list`);
    };

    return (
        <div className="child">
            <MainCard contentSX={{ mt: 1, p: 0.25 }}>
                <Stack spacing={0.5}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, margin: 'auto' }}>
                            <Typography variant="h6" sx={{ fontSize: '1rem', color: '#777777', whiteSpace: 'nowrap' }}>
                                {title}
                            </Typography>
                            <Typography
                                variant="h6"
                                color="inherit"
                                sx={{ fontSize: '1.5rem', fontWeight: '700', color: '#777777', whiteSpace: 'nowrap' }}
                            >
                                <a href="#" onClick={() => detailUrl(id, item.id)}>
                                    <b>{count}</b> 건
                                </a>
                            </Typography>
                        </div>
                    </div>
                </Stack>
            </MainCard>
            <Grid container spacing={0} sx={{ mt: 1 }}></Grid>
        </div>
    );
};

AnalyticLrcFoundationStatusForm.propTypes = {
    color: PropTypes.string,
    title: PropTypes.string,
    count: PropTypes.number,
    percentage: PropTypes.number,
    isLoss: PropTypes.bool,
    extra: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
};

AnalyticLrcFoundationStatusForm.defaultProps = {
    color: 'primary'
};

export default AnalyticLrcFoundationStatusForm;
