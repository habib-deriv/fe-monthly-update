import React, {Dispatch, SetStateAction, useState} from 'react';
import {ChartType, TUniversalChart} from '@/types/charts.types';
import UniversalChart from '@components/charts/UniversalChart';
import Editor from './Editor';
import './ChartBuilder.scss';

const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16);

type TChartBuilder = {
    initial_state?: TUniversalChart,
    saveChanges: (changes: TUniversalChart) => void,
    cancelChanges: VoidFunction,
}

const ChartBuilder = ({initial_state, saveChanges, cancelChanges}: TChartBuilder) => {
    const [data, setData] = useState<TUniversalChart>(
        initial_state ?
            initial_state : {
                type      : ChartType.Pie,
                data      : [],
                labels    : [],
                color     : [],
                indexAxis : 'x',
                titleText : 'Title',
                datalabels: {
                    display: false,
                    color  : 'black',
                    font   : {
                        size: 20,
                    },
                },
            });

    return(
        <div className='chart-builder'>
            <Editor data={data}
                setData={setData}
                saveChanges={saveChanges}
                cancelChanges={cancelChanges}
            />
            <div className='preview'>
                preview
                {
                    data.data.length > 0 && !isNaN(data.data[0]) ? (
                        <div style={{
                            minHeight: 400,
                            minWidth : 400,
                        }}
                        >
                            <UniversalChart props={{
                                ...data,
                            }}
                            />
                        </div>
                    ) : <div>nothing to preview</div>
                }
            </div>
        </div>
    );
};

export default ChartBuilder;
