export enum ChartType {
    Pie = 'pie chart',
    Doughnut = 'doughnut chart',
    Bar = 'bar chart',
    Card = 'card',
}

export type TUniversalChart = {
    type: ChartType,
    data: Array<number>,
    labels: Array<string>,
    color: Array<string>,
    textColor?: string,
    indexAxis?: 'x' | 'y',
    titleText?: string,
    datalabels?: {
        display?: boolean,
        color?: string,
        font?: {
            size?: number,
        },
    },
}
