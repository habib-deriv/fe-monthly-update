import {
    Chart,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Bar, Pie, Doughnut} from 'react-chartjs-2';
import Card from './Card';
import {ChartType, TUniversalChart} from '@/types/charts.types';

// this should probably be done more globally
Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    ChartDataLabels,
);

type TProps = {
    props: TUniversalChart,
    onClick?: VoidFunction,
}

const UniversalChart = ({props, onClick}: TProps) => {
    const {type, data, labels, color, textColor, indexAxis, titleText, datalabels} = props;

    const chart_data = {
        labels,
        datasets: [{
            label          : titleText,
            data,
            backgroundColor: color,
        }],
    };

    const options = {
        plugins: {
            datalabels,
        },
        indexAxis,
        responsive         : true,
        maintainAspectRatio: false,
    };

    switch (type) {
    case ChartType.Pie:
        return(
            <Pie data={chart_data}
                options={options}
                onClick={() => {
                    if (onClick) {
                        onClick();
                    }
                }}
            />
        );
    case ChartType.Doughnut:
        return(
            <Doughnut data={chart_data}
                options={options}
                onClick={() => {
                    if (onClick) {
                        onClick();
                    }
                }}
            />
        );
    case ChartType.Bar:
        return(
            <Bar data={chart_data}
                options={options}
                onClick={() => {
                    if (onClick) {
                        onClick();
                    }
                }}
            />
        );
    case ChartType.Card:
        return(
            <Card value={data[0]}
                title={labels[0]}
                bgColor={color[0]}
                textColor={textColor}
                onClick={() => {
                    if (onClick) {
                        onClick();
                    }
                }}
            />
        );
    }
    return(
        <div>
            Unknown chart type passed to UniversalChart
        </div>
    );
};

export default UniversalChart;
