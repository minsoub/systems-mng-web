import PropTypes from 'prop-types';
import { Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/Common/MainCard';
import cx from 'classnames';
import './styles.scss';
import { useNavigate } from 'react-router-dom';
import { CopyFilled, ClockCircleOutlined, StopOutlined, PieChartOutlined } from '@ant-design/icons';

const AnalyticLrcForm = ({ color, id, title, count, child, percentage, isLoss, extra }) => {
    const navigate = useNavigate();
    // 페이지 이동
    const moveUrl = (id) => {
        navigate(`/projects/list/${id}/`);
    };

    const detailUrl = (id, processCode) => {
        navigate(`/projects/list/${id}/${processCode}`);
    };
    const createClassName = (id) => {
        switch (id) {
            default:
                return 'default_color';
            case '4769abb1-5ab7-4bea-8126-9a90debc0c44': // 접수중
                return {
                    className: 'color_a',
                    icon: <CopyFilled style={{ fontSize: 40, color: '#fff' }} />
                };
            case 'fde71dc5-756c-4343-bdcc-b419855095a9': // 검토중
                return {
                    className: 'color_b',
                    icon: <ClockCircleOutlined style={{ fontSize: 40, color: '#fff' }} />
                };
            case '371edf0e-e770-4ede-b9f7-7e9945d8273e': // 보류
                return {
                    className: 'color_c',
                    icon: <StopOutlined style={{ fontSize: 40, color: '#fff' }} />
                };
            case '48ef9ce3-7b47-4512-b3a0-dcb32c718e67': // 상장완료
                return {
                    className: 'color_d',
                    icon: <PieChartOutlined style={{ fontSize: 40, color: '#fff' }} />
                };
        }
    };

    return (
        <div className={createClassName(id).className}>
            <MainCard contentSX={{ pl: 2.25 }} className={cx('gridCardColor')}>
                <Stack spacing={0.5} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack>
                        <Typography variant="h4" color="white" style={{ fontSize: '0.845rem', fontWeight: '500' }}>
                            {title}
                        </Typography>
                        <Grid item container direction="row" alignItems="center" justifyContent="left">
                            <Grid item justify="center">
                                <Typography variant="h2" color="inherit">
                                    <a href="#" style={{ color: '#fff', fontSize: '1.4rem' }} onClick={() => moveUrl(id)}>
                                        <b>{count}</b> 건
                                    </a>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Stack>
                    <Stack>{createClassName(id).icon}</Stack>
                </Stack>
            </MainCard>

            <Grid container spacing={0} sx={{ mt: 1 }}></Grid>
            {child.map((item, index) => (
                <div className="child">
                    <MainCard contentSX={{ mt: 1, p: 0.25 }}>
                        <Stack spacing={0.5}>
                            <Grid item container direction="row" alignItems="center" justifyContent="left">
                                <Grid key={index} item justify="left">
                                    <Typography variant="h6" sx={{ fontSize: '1rem', color: '#8c8c8c' }}>
                                        {item.name}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        color="inherit"
                                        sx={{ fontSize: '1.5rem', fontWeight: '700', color: '#262626' }}
                                    >
                                        <a href="#" onClick={() => detailUrl(id, item.id)}>
                                            <b>{item.count}</b> 건
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
