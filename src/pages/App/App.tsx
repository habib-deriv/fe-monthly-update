import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import domtoimage from 'dom-to-image';
import FileSaver from 'file-saver';
// import  Chart  from '@/components/charts';
import RedmineUpdates from '@components/RedmineUpdates';
import { COLLECTIONS } from '@/constants';
import { Skeleton, Star, MonthSelector, EmptyList } from '@/components';
import { useFetch } from '@/hooks';
import { Button, Chip } from '@mui/material';
// import { fetchStats, setIsStatsLoading, TData } from '@/stores/charts';
import { TRootState } from '@/stores/store';
// import { setIsDateChanged} from '@/stores/settings';
import { capitalize, sendMonthlyUpdate, has_items_in_month } from '@/utils';
import './App.scss';

const App = () => {
    // const dispatch = useDispatch<TAppDispatch>();
    const { settings } = useSelector((state: TRootState) => state);
    const [is_loading_stars, stars, grouped_stars] = useFetch(COLLECTIONS.STARS, 'month', settings.list.months);
    const [is_loading_tasks, tasks, grouped_tasks] = useFetch(COLLECTIONS.TASK, 'week', settings.list.weeks);
    const [is_road_empty, setIsRoadEmpty] = useState(false);
    const [is_loading_road, road] = useFetch(COLLECTIONS.ROADMAP);
    // const [filtered_repositories, setFilteredRepositories] = useState<[string, TData][]>(Object.keys(charts.stats).length > 0 ? [Object.entries(charts.stats)[0]] : []);
    // const [current_repo_name, setCurrentRepoName] = useState('');
    const exportRef = useRef();

    // const filterRepositories = useCallback((repository: string) => {
    //     if(repository === 'All') {
    //         const all_stats = Object.values(charts.stats).reduce((acc,el)=>{
    //             return ({
    //                 additions      : acc.additions! + el.additions!,
    //                 deletions      : acc.deletions! + el.deletions!,
    //                 merged_prs     : acc.merged_prs! + el.merged_prs!,
    //                 number_of_files: acc.number_of_files! + el.number_of_files!,
    //                 opened_prs     : acc.opened_prs! + el.opened_prs!,
    //                 prs            : acc.prs!.concat(el.prs!),
    //             });
    //         });
    //         setFilteredRepositories([['All', all_stats]]);
    //     } else {
    //         const filtered_repos = Object.entries(charts.stats).filter(([repo, _])=> repo === repository);
    //         setFilteredRepositories(filtered_repos);
    //     }
    //     setCurrentRepoName(repository);
    // }, [charts.stats]);

    // useEffect(()=>{
    //     if(Object.keys(charts.stats).length === 0 || settings.is_date_changed){
    //         dispatch(setIsStatsLoading(true));
    //         dispatch(fetchStats());
    //         dispatch(setIsDateChanged(false));
    //     }
    // },[dispatch, settings.date, settings.is_date_changed, charts.stats]);

    // useEffect(()=>{
    //     filterRepositories(REPOSITORIES[0]);
    // },[charts.stats, filterRepositories]);

    useEffect(() => {
        if (!road.length) setIsRoadEmpty(true);
        else setIsRoadEmpty(false);
    }, [road]);

    useEffect(() => {
        console.log(grouped_stars);
    }, [grouped_stars]);

    const taskList = (list: any, type: string) => list.filter((item: any) => item.type === type && item.month === settings.date.month);

    const exportImage = async (el: any, imageFileName: string) => {
        domtoimage.toBlob(el)
            .then(function (blob) {
                FileSaver.saveAs(blob, imageFileName);
            });
    };

    return (
        <div className="app-hero p-10">
            <React.Fragment>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center justify-start basis-1/3">
                        <h3 className="text-2xl font-bold mr-2">Overview</h3>
                        <Chip
                            label={capitalize(settings.date.month)}
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                    </div>
                    <div className="flex items-center justify-end">
                        <MonthSelector />
                        <Button
                            variant="contained"
                            disableElevation
                            color="secondary"
                            size="small"
                            className="ml-2"
                            onClick={() => exportImage(exportRef.current, 'preview')}
                        >
                            Export Image
                        </Button>
                        <Button
                            variant="contained"
                            disableElevation
                            color="secondary"
                            size="small"
                            className="ml-2"
                            onClick={() => {
                                sendMonthlyUpdate(grouped_stars, grouped_tasks, road, settings);
                            }}
                        >
                            Export Video
                        </Button>
                    </div>
                </div>

                <div
                    // @ts-ignore
                    ref={exportRef}
                    className="py-4 px-1 bg-white"
                >
                    {/* Empty List */}
                    {!is_loading_tasks && !has_items_in_month(tasks, settings.date.month) && !has_items_in_month(stars, settings.date.month) && is_road_empty /* && !filtered_repositories.length */ && (
                        <EmptyList
                            title='This month is Empty'
                            has_description={false}
                        />
                    )}

                    {/* Tasks */}
                    {is_loading_tasks && <Skeleton row={2} />}
                    {!is_loading_tasks && has_items_in_month(tasks, settings.date.month) && grouped_tasks && (
                        <div>
                            <span className="block text-2xl font-medium text-black text-center tracking-widest p-4 my-4">
                                Tasks
                            </span>

                            <div>
                                {Object.keys(grouped_tasks).map((key) => {
                                    return (
                                        <div
                                            className="block bg-gradient-to-t from-slate-200 to-slate-100 drop-shadow-lg rounded-md p-4 mb-8"
                                            key={key}
                                        >
                                            <span className="block text-lg font-medium text-black text-center tracking-wide mb-4">
                                                Week {key}
                                            </span>

                                            <div className="grid gap-4 grid-cols-2">
                                                <div className={classNames('border-2 rounded-md', {
                                                    'bg-gray-100 border-gray-200'  : !taskList(grouped_tasks[key], 'achievement').length,
                                                    'bg-green-100 border-green-200': taskList(grouped_tasks[key], 'achievement').length
                                                })}
                                                >
                                                    <div className={classNames('p-2', {
                                                        'bg-gray-200 text-gray-500': !taskList(grouped_tasks[key], 'achievement').length,
                                                        'bg-green-200 text-black'  : taskList(grouped_tasks[key], 'achievement').length
                                                    })}
                                                    >
                                                        <span className="block text-center font-medium text-lg">
                                                            Accomplishments
                                                        </span>
                                                    </div>
                                                    <div className="p-4">
                                                        {taskList(grouped_tasks[key], 'achievement').map((item: any, idx: number) => {
                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    className="mb-3"
                                                                >
                                                                    <p className="text-base font-medium mb-1">{item.title}</p>
                                                                    <ul className="list-disc ml-4">
                                                                        {item.description.split('|').map((item: string, idx: number) => {
                                                                            return (
                                                                                <li
                                                                                    key={idx}
                                                                                    className="text-sm mb-1"
                                                                                >
                                                                                    {item.trim()}
                                                                                </li>
                                                                            );
                                                                        })}
                                                                    </ul>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <div className={classNames('border-2 rounded-md', {
                                                    'bg-gray-100 border-gray-200': !taskList(grouped_tasks[key], 'challenge').length,
                                                    'bg-red-100 border-red-200'  : taskList(grouped_tasks[key], 'challenge').length
                                                })}
                                                >
                                                    <div className={classNames('p-2', {
                                                        'bg-gray-200 text-gray-500': !taskList(grouped_tasks[key], 'challenge').length,
                                                        'bg-red-200 text-black'    : taskList(grouped_tasks[key], 'challenge').length
                                                    })}
                                                    >
                                                        <span className="block text-center font-medium text-lg">
                                                            Challenges
                                                        </span>
                                                    </div>
                                                    <div className="p-4">
                                                        {taskList(grouped_tasks[key], 'challenge').map((item: any, idx: number) => {
                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    className="mb-3"
                                                                >
                                                                    <p className="text-base font-medium mb-1">{item.title}</p>
                                                                    <ul className="list-disc ml-4">
                                                                        {item.description.split('|').map((item: string, idx: number) => {
                                                                            return (
                                                                                <li
                                                                                    key={idx}
                                                                                    className="text-sm mb-1"
                                                                                >
                                                                                    {item.trim()}
                                                                                </li>
                                                                            );
                                                                        })}
                                                                    </ul>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Redmine */}
                    <div>
                        <span className="block text-2xl font-medium text-black text-center tracking-widest p-4 my-4">
                            Redmine Updates
                        </span>
                        <RedmineUpdates is_editable={true}/>
                    </div>

                    {/* Stars */}
                    {is_loading_stars && <Skeleton row={2} />}
                    {!is_loading_stars && has_items_in_month(stars, settings.date.month) && (
                        <div>
                            <span className="block text-2xl font-medium text-black text-center tracking-widest p-4 mt-12 mb-4">
                                Stars of the month
                            </span>

                            <div className="grid gap-4 grid-cols-2">
                                {grouped_stars[settings.date.month].map((star, idx) => {
                                    return (
                                        <Star
                                            key={idx}
                                            item={star}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Road */}
                    {is_loading_road && <Skeleton row={2} />}
                    {!is_loading_road && !is_road_empty && (
                        <div>
                            <span className="block text-2xl font-medium text-black text-center tracking-widest p-4 mt-12 mb-4">
                                Road Ahead
                            </span>

                            <ul className="road-list">
                                {road.map((item) => {
                                    return (
                                        <li
                                            key={item.id}
                                            className="road-list__item text-base"
                                        >
                                            {item.title}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </React.Fragment>
        </div>
    );
};

export default App;
