import CardsList from './CardsList';
import Histogram from './Histogram';
import PieChart from './PieChart';
import { TData } from '@/stores/charts';
import './chart.scss';

type TChart = {
    chart_stats: TData,
    repository_name: string;
}

const Chart = ({chart_stats, repository_name}: TChart) => {
    const {prs, additions, deletions, number_of_files, merged_prs, opened_prs} = chart_stats;

    return  (
        <div className="flex gap-y-7 flex-col">
            <h3>{repository_name}</h3>
            <CardsList additions={additions as number}
                deletions={deletions as number}
                number_of_files={number_of_files as number}
                merged_prs={merged_prs as number}
                opened_prs={opened_prs as number}
            />
            <div className="flex gap-x-5">
                <Histogram prs={prs as Required<TData['prs']>}/>
                <PieChart merged_prs={merged_prs as number}
                    opened_prs={opened_prs as number}
                />
            </div>
        
        </div>)
    ;
};

export default Chart;
