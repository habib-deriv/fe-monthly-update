import {useEffect, useState} from 'react';
import {ChartType, TUniversalChart} from '@/types/charts.types';
import {createRecord, updateRecord} from '@/utils/db-operations';
import ChartBuilder from '@components/ChartBuilder';
import UniversalChart from '@components/charts/UniversalChart';
import './GithubUpdates.scss';
import {useFetch} from '@/hooks';
import {COLLECTIONS} from '@/constants';
import {useSelector} from 'react-redux';
import {TRootState} from '@stores/store';
import {has_items_in_month} from '@/utils';

type TChartView = {
    is_editable: boolean,
}

interface TChartViewContent {
    [n: number]:  TUniversalChart | TChartViewContent;
}

const GithubUpdates = ({is_editable}: TChartView) => {
    const { settings } = useSelector((state: TRootState) => state);
    const [is_loading_charts, charts, grouped_charts] = useFetch(COLLECTIONS.GITHUB, 'month', settings.list.months);
    const [is_showing_chart_builder, setIsShowingChartBuilder] = useState<boolean>(false);
    const [chart_builder_target, setChartBuilderTarget] = useState<TUniversalChart>();
    const [traceback, setTraceback] = useState<Array<number>>([]);
    const [firestore_entry_id, setFirestoreEntryId] = useState<string>('');
    const [content, setContent] = useState<TChartViewContent>(
        [
            [
                {
                    type  : ChartType.Card,
                    data  : [175],
                    labels: ['Open PRs'],
                    color : ['#D1E9FC'],
                },
                {
                    type  : ChartType.Card,
                    data  : [32],
                    labels: ['Merged PRs'],
                    color : ['#D1E9FC'],
                },
                {
                    type  : ChartType.Card,
                    data  : [20],
                    labels: ['Revered PRs'],
                    color : ['#D0F2FF'],
                },
            ],
            [
                {
                    type      : ChartType.Bar,
                    data      : [4, 13, 7, 8],
                    labels    : ['First week', 'Second week', 'Third week', 'Fourth week'],
                    color     : ['#5287DA', '#5287DA', '#5287DA', '#5287DA', '#5287DA'],
                    titleText : 'Merged PRs',
                    datalabels: {
                        display: false,
                    },
                },
                {
                    type      : ChartType.Doughnut,
                    data      : [175, 32, 20],
                    labels    : ['Open', 'Merged', 'Revered'],
                    color     : ['#79A881', '#F2C94C', '#968EB9'],
                    datalabels: {
                        display: true,
                        color  : 'white',
                        font   : {
                            size: 20,
                        },
                    },
                },
            ],
        ]
    );

    useEffect(() => {
        if (!is_loading_charts && charts.length > 0) {
            if (has_items_in_month(charts, settings.date.month)) {
                const chart_data = grouped_charts[settings.date.month][0];
                setFirestoreEntryId(chart_data.id!);
                console.log(JSON.parse(chart_data.json));
                setContent(JSON.parse(chart_data.json));
            } else {
                console.log('ccc', charts);
                if (!firestore_entry_id) {
                    console.log('creating');
                    createRecord(COLLECTIONS.GITHUB, {
                        json : JSON.stringify(content),
                        month: settings.date.month,
                        year : settings.date.year,
                    });
                }
            }
        }
    }, [is_loading_charts, grouped_charts, charts]);

    const applyChartBuilderChanges = (new_value: TUniversalChart) => {
        const new_state = JSON.parse(JSON.stringify(content));
        let pointer = new_state;
        traceback.slice(0, traceback.length-1).forEach(index => {
            pointer = pointer[index];
        });
        pointer[traceback[traceback.length-1]] = new_value;
        setContent(new_state);
        window.localStorage.setItem('chartview', JSON.stringify(new_state));
        updateRecord(COLLECTIONS.GITHUB, firestore_entry_id, {
            json : JSON.stringify(new_state),
            month: settings.date.month,
            year : settings.date.year,
        });
        setIsShowingChartBuilder(false);
    };

    type TChartFlexSequence = {
        data: TChartViewContent | TUniversalChart,
        flexDirection: 'row' | 'column',
        traceback: Array<number>,
    }

    const ChartFlexSequence = ({data, flexDirection, traceback}: TChartFlexSequence) => {
        return(
            ('type' in data) ?
                <UniversalChart props={data}
                    onClick={() => {
                        setIsShowingChartBuilder(true);
                        setTraceback(traceback);
                        setChartBuilderTarget(data);
                    }}
                />
                :
                <>
                    {
                        Array.isArray(data) &&
                        data.map((el: TUniversalChart | TChartViewContent, index) => {
                            return(
                                <div style={{
                                    position     : 'relative',
                                    display      : 'flex',
                                    flexDirection: flexDirection === 'row' ? 'column' : 'row',
                                    gap          : 10,
                                    width        : flexDirection === 'column' ? '100%' : (100 / data.length).toString() + '%',
                                    height       : flexDirection === 'row' ? '100%' : (100 / data.length).toString() + '%',
                                }}
                                >
                                    <ChartFlexSequence data={el}
                                        flexDirection={
                                            flexDirection === 'row' ? 'column' : 'row'
                                        }
                                        traceback={traceback.concat([index])}
                                    />
                                </div>
                            );
                        })
                    }
                </>
        );
    };

    return(
        !is_loading_charts ?
            <>
                <div style={{
                    marginTop      : 40,
                    backgroundColor: '#f8f8f8',
                    borderRadius   : 40,
                    padding        : 40,
                    position       : 'relative',
                    display        : 'flex',
                    flexDirection  : 'column',
                    gap            : 10,
                }}
                >
                    <ChartFlexSequence data={content}
                        flexDirection='column'
                        traceback={[]}
                    />
                </div>
                {
                    is_showing_chart_builder &&
                    <ChartBuilder initial_state={chart_builder_target}
                        saveChanges={applyChartBuilderChanges}
                        cancelChanges={() => {
                            setIsShowingChartBuilder(false);
                        }}
                    />
                }
            </> : <>Loading...</>
    );
};

export default GithubUpdates;
