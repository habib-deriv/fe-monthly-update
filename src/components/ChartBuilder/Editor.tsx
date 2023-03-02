import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {ChartType, TUniversalChart} from '@/types/charts.types';

const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16);

const isColor = (str_color: string) => {
    const s = new Option().style;
    s.color = str_color;
    return s.color !== '';
};

type TEditor = {
    data: TUniversalChart,
    setData: Dispatch<SetStateAction<TUniversalChart>>,
    saveChanges: (changes: TUniversalChart) => void,
    cancelChanges: VoidFunction,
}

const Editor = ({data, setData, saveChanges, cancelChanges}: TEditor) => {
    const [data_text, setDataText] = useState<string>();

    useEffect(() => {
        if (data.data.length > 0 && !isNaN(data.data[0])) {
            setDataText(data.labels.map((label, index) => label + ' => ' + data.data[index].toString()).join('\n'));
        }
    }, []);

    const setColor = () => {
        setData((prevState) => {
            return {
                ...prevState,
                color: data_text!.split('\n').map((el, index) => {
                    if (el.includes('::')) {
                        const color_str = el.split('::')[1].trim();
                        if (isColor(color_str)) {
                            return el.split('::')[1].trim();
                        }
                    }
                    return prevState.color[index];
                })
            };
        });
    };

    useEffect(() => {
        if (data_text !== undefined) {
            setData(prevState => {
                return {
                    ...prevState,
                    labels: data_text.split('\n').map(el => el.split('=>')[0].trim()),
                    data  : data_text.split('\n').map(el => +el.split(/=>|::/)[1]),
                };
            });
            setColor();
        }
    }, [data_text, setData]);

    return(
        <div className='edit'>
            edit
            <select id='chart-type'
                className='edit-chart-type'
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setData(prevState => {
                        return {
                            ...prevState,
                            type: ChartType[e.target.value as keyof typeof ChartType],
                        };
                    });
                }}
            >
                {
                    (Object.keys(ChartType) as Array<keyof typeof ChartType>).map((key, index) => (
                        <option key={index}
                            value={key}
                            selected={ChartType[key] === data.type}
                        >
                            {ChartType[key]}
                        </option>))
                }
            </select>
            <textarea placeholder={'label 1 => *value 1*\nlabel 2 => *value 2*\n\ne.g.:\noak => 21\nbirch => 12\npine => 42'}
                value={data_text}
                className='edit-data'
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setDataText(e.target.value);
                }}
            />
            <div className='edit-other'>
                <div className='edit-show-labels'>
                    <label htmlFor='show-labels'>
                        Show labels
                    </label>
                    <input name='show-labels'
                        type='checkbox'
                        checked={data.datalabels?.display}
                        onChange={() => {
                            setData(prevState => {
                                return {
                                    ...prevState,
                                    datalabels: {
                                        ...prevState.datalabels,
                                        display: !prevState.datalabels?.display,
                                    },
                                };
                            });
                        }}
                    />
                </div>
                <div className='edit-label-size'>
                    <label htmlFor='label-size'>
                        Label size
                    </label>
                    <input name='label-size'
                        value={data.datalabels?.font?.size}
                        type='number'
                        className='edit-label-size-input'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setData(prevState => {
                                return {
                                    ...prevState,
                                    datalabels: {
                                        ...prevState.datalabels,
                                        font: {
                                            size: +e.target.value,
                                        },
                                    }
                                };
                            });
                        }}
                    />
                </div>
                <select id='label-color'
                    className='edit-label-color'
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setData(prevState => {
                            return {
                                ...prevState,
                                textColor : e.target.value,
                                datalabels: {
                                    ...prevState.datalabels,
                                    color: e.target.value,
                                },
                            };
                        });
                    }}
                >
                    <option key='black'
                        value='black'
                        selected={data.textColor==='black'}
                    >
                        black
                    </option>
                    <option key='white'
                        value='white'
                        selected={data.textColor==='white'}
                    >
                        white
                    </option>
                </select>
                {
                    data.type === ChartType.Bar &&
                    <>
                        <select id='bar-orientation'
                            className='edit-label-color'
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                const new_index_axis: 'x' | 'y' | undefined = e.target.value === 'x' ? 'x' :
                                    e.target.value === 'y' ? 'y' : undefined;
                                setData(prevState => {
                                    return {
                                        ...prevState,
                                        indexAxis: new_index_axis,
                                    };
                                });
                            }}
                        >
                            <option key='x'
                                selected={data.indexAxis === 'x' || data.indexAxis === undefined}
                                value='x'
                            >
                                vertical
                            </option>
                            <option key='y'
                                selected={data.indexAxis === 'y'}
                                value='y'
                            >
                                horizontal
                            </option>
                        </select>
                        <div className='edit-title-text'>
                            <label htmlFor='title-text'>
                                Title text
                            </label>
                            <input name='title-text'
                                className='edit-title-text-input'
                                value={data.titleText}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setData(prevState => {
                                        return {
                                            ...prevState,
                                            titleText: e.target.value,
                                        };
                                    });
                                }}
                            />
                        </div>
                    </>
                }
            </div>
            <button style={{
                color: 'blue',
            }}
            onClick={() => {
                setDataText(prevState => prevState?.split('\n')
                    .map((line, index) => line + ' :: ' + data.color[index])
                    .join('\n'));
            }}
            >
                Capture colors
            </button>
            <button style={{
                color: 'purple',
            }}
            onClick={() => {
                setData((prevState) => {
                    return {
                        ...prevState,
                        color: prevState.data.map(() => randomColor()),
                    };
                });
                setColor();
            }}
            >
                Shuffle unset colors
            </button>
            <button style={{
                color: 'green',
            }}
            onClick={() => {
                saveChanges(data);
            }}
            >
                Save changes
            </button>
            <button style={{
                color: 'red',
            }}
            onClick={() => {
                cancelChanges();
            }}
            >
                Cancel changes
            </button>
        </div>
    );
};

export default Editor;
