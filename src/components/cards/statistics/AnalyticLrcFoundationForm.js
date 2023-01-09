import PropTypes from 'prop-types';
import { Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/Common/MainCard';
import cx from 'classnames';
import './styles.scss';
import { useNavigate } from 'react-router-dom';
import { CopyFilled, ClockCircleOutlined, StopOutlined, PieChartOutlined } from '@ant-design/icons';

const AnalyticLrcFoundationForm = ({ color, id, title, count, child, percentage, isLoss, extra }) => {
    const navigate = useNavigate();
    // 페이지 이동
    const moveUrl = (id) => {
        navigate(`/line/list/`);
    };

    const detailUrl = (id, processCode) => {
        navigate(`/line/list`);
    };

    return (
        <div className={'blue_color'}>
            <MainCard contentSX={{ pl: 2.25 }} className={cx('gridCardColor')}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 'auto',
                        gap: '40px'
                    }}
                >
                    <Typography variant="h6" color="white" style={{ fontSize: '1rem' }}>
                        {title}
                    </Typography>
                    <Typography variant="h6" color="inherit">
                        <a href="#" style={{ color: '#fff', fontSize: '1.25rem' }} onClick={() => moveUrl(id)}>
                            <b>{count}</b> 건
                        </a>
                    </Typography>
                </div>
            </MainCard>

            {child.map((item, index) => (
                <div className="child" key={index}>
                    <MainCard contentSX={{ mt: 1, p: 0.25 }}>
                        <Stack spacing={0.5}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    margin: 'auto',
                                    gap: '40px'
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{ fontSize: '1rem', fontWeight: '500', color: '#777777', whiteSpace: 'nowrap' }}
                                >
                                    {item.name}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="inherit"
                                    sx={{ fontSize: '1.25rem', fontWeight: '500', color: '#777777', whiteSpace: 'nowrap' }}
                                >
                                    <a href="#" onClick={() => detailUrl(id, item.id)}>
                                        <b>{item.count}</b> 건
                                    </a>
                                </Typography>
                            </div>
                        </Stack>
                    </MainCard>
                    <Grid container spacing={0} sx={{ mt: 1 }}></Grid>
                </div>
            ))}
        </div>
    );
};

AnalyticLrcFoundationForm.propTypes = {
    color: PropTypes.string,
    title: PropTypes.string,
    count: PropTypes.number,
    child: PropTypes.array,
    percentage: PropTypes.number,
    isLoss: PropTypes.bool,
    extra: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
};

AnalyticLrcFoundationForm.defaultProps = {
    color: 'primary'
};

export default AnalyticLrcFoundationForm;
