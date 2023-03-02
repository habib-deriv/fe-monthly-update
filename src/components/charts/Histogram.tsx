import {
    Chart,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import {getPrLifetimesInDays} from '@/utils/get-stats';
import ChartDataLabels from 'chartjs-plugin-datalabels';

type TProps = {
    prs?: Array<{
        user: {
            login: string,
        },
        created_at: string,
        closed_at: string,
    }>,
};

Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels,
);

const Histogram = ({ prs }: TProps) => {
    const counter = (arr: Array<number>, range: Array<number>) => arr.filter(el => el < range[1] && el >= range[0]).length;
    const intervals = [[0, 8], [8, 120], [120, 288], [288, 624], [624, Infinity]];
    const labels = ['1 day', '1 week', '2 weeks', '3-4 weeks', '> 4 weeks'];
    const data = {
        labels,
        datasets: [
            {
                label          : 'Number of PRs',
                data           : intervals.map((el) => counter(getPrLifetimesInDays(prs!), el)),
                backgroundColor: 'rgb(32, 101, 209, 0.8)',
            },
        ],
        
    };

    const options = {
        plugins: {
            datalabels: {
                display: false,
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                }
            },
        }
    };
    
    return(
        <div className="w-3/5 bg-white rounded-xl px-8 py-5">
            <h3 className="mb-4 text-lg">Pull request lifetime</h3>
            <Bar data={data}
                options={options}
            />
        </div>
    );
};

export default Histogram;
