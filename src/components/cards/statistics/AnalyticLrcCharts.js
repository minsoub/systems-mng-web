import PropTypes from 'prop-types';
import { Stack } from '@mui/material';
import MainCard from 'components/Common/MainCard';
import PieChart, { Legend, Export, Series, Label, Font, Connector, HoverStyle, Tooltip, Format } from 'devextreme-react/pie-chart';

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
                        onPointHoverChanged={onPointHoverChanged}
                    >
                        <Series argumentField="argument" valueField="value">
                            <Label visible={true} position="columns" customizeText={customizeText}>
                                <Font size={12} />
                                <Connector visible={true} width={0.5} />
                            </Label>
                        </Series>
                        <Export enabled={true} />
                        <Legend margin={0} horizontalAlignment="right" verticalAlignment="top" />
                        <Tooltip enabled={true} customizeTooltip={customizeTooltip}></Tooltip>
                    </PieChart>
                </Stack>
            </MainCard>
        </div>
    );
};

function customizeText(arg) {
    return `${arg.valueText} (${arg.percentText})`;
}
function customizeTooltip(arg) {
    return {
        text: `${arg.valueText} - ${(arg.percent * 100).toFixed(2)}%`
    };
}

function onPointHoverChanged(e) {
    if (e.target.isHovered()) e.element.style.cursor = 'pointer';
    else e.element.style.cursor = 'auto';
}
AnalyticLrcCharts.propTypes = {
    color: PropTypes.string,
    data: PropTypes.array
};

export default AnalyticLrcCharts;
