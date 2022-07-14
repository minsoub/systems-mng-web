import PropTypes from 'prop-types';

// material-ui
import { Box, Chip, Grid, Stack, Typography, GRid } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// assets
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import PieChart, { Series, Label, Connector, Size, Export, Legend } from 'devextreme-react/pie-chart';

// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

const AnalyticLrcCharts = ({ title, data }) => {
    return (
        <div>
            <MainCard contentSX={{ p: 2.25 }}>
                <Stack spacing={0.5}>
                    <PieChart
                        id="pie"
                        dataSource={data}
                        type="doughnut"
                        palette="Soft Pastel"
                        title={title}
                        // onPointClick={this.pointClickHandler}
                        // onLegendClick={this.legendClickHandler}
                    >
                        <Series argumentField="argument" valueField="value">
                            <Label visible={true}>
                                <Connector visible={true} width={1} />
                            </Label>
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
