export * from './export-data';

export const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

// TODO: type-checking
export const has_items_in_month = (items: any, month: string) => items.some((item: any) => item.month === month);

// TODO: type-checking
export const has_items_in_week = (items: any, key: string, month: string) => items[key].length && items[key].some((item: any) => item.month === month);

export const daysInMonth = (month: number, year: number) =>{
    return new Date(year, month, 0).getDate();
};

export const addZero = (num: number) => {
    return ('0' + num).slice(-2);
};

export const nFormatter = (num: number, digits: number) => {
    const lookup = [
        {value: 1, symbol: ''},
        {value: 1e3, symbol: 'k'},
        {value: 1e6, symbol: 'M'},
        {value: 1e9, symbol: 'G'},
        {value: 1e12, symbol: 'T'},
        {value: 1e15, symbol: 'P'},
        {value: 1e18, symbol: 'E'}
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let item = lookup.slice().reverse().find(function (item) {
        return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
};
