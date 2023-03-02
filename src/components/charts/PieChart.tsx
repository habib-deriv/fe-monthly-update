import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

type TProps = {
    merged_prs: number,
    opened_prs: number,
};

const PieChart = ({ merged_prs, opened_prs }: TProps) => {
    const data = {
        labels  : ['Merged', 'Open'],
        datasets: [
            {
                label          : `PRs (${merged_prs+opened_prs} in total)`,
                data           : [merged_prs, opened_prs],
                backgroundColor: [
                    'rgba(121, 110, 168, 0.8)',
                    'rgba(84, 145, 95, 0.8)',
                ],
                borderColor: [
                    'rgb(121, 110, 168)',
                    'rgb(84, 145, 95)',
                ],
                borderWidth: 2,
            },
        ],
    };

    return(
        <div className="bg-white rounded-xl px-8 py-5 flex-grow">
            <h3 className="mb-4 text-lg">Active pull requests</h3>
            <div className='w-100 px-8'>
                <Pie data={data}
                    options={{
                        plugins: {
                            datalabels: {
                                display: true,
                                color  : 'white',
                                font   : { size: 30 }
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default PieChart;
