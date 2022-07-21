import PropTypes from 'prop-types';
import { Stack } from '@mui/material';
import MainCard from 'components/MainCard';
import PieChart, { Export, HoverStyle, Legend, Series } from 'devextreme-react/pie-chart';

const AnalyticLrcCharts = ({ title, data }) => {
    return (
        <div>
            <MainCard contentSX={{ p: 2.25 }}>
                <Stack spacing={0.5}>
                    <PieChart id="pie" dataSource={data} type="doughnut" palette="Soft Pastel" title={title}>
                        <Series argumentField="argument" valueField="value">
                            <HoverStyle color="#ffd700" />
                        </Series>
                        <Export enabled={true} />
                        <Legend margin={0} horizontalAlignment="right" verticalAlignment="top" />
                    </PieChart>
                </Stack>
            </MainCard>
        </div>
    );
};

AnalyticLrcCharts.propTypes = {
    color: PropTypes.string,
    data: PropTypes.array
};

export default AnalyticLrcCharts;
