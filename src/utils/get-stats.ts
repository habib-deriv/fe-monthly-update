import axios from 'axios';
import { addZero, daysInMonth } from '@/utils';

const axios_instance = axios.create({
    baseURL: 'https://api.github.com',
});

axios_instance.defaults.headers.common['Authorization'] = `Bearer ${import.meta.env.VITE_GITHUB_API_AUTHORIZATION_TOKEN}` ?? '';

const per_page = 100;

const createNewMonthFormat = (month: number) => {
    return month.toString().length === 1 ? addZero(month) : month;
};

export const getMergedPRs = async (repository: string, year: string, month: number, last_day: number) => {
    const new_month_format = createNewMonthFormat(month);
    return await axios_instance.get(`/search/issues?q=repo:binary-com/${repository}+is:pr+merged:${year}-${new_month_format}-01..${year}-${new_month_format}-${last_day}&per_page=${per_page}&page=1`).catch((err) => {
        console.log('error: ', err.message);
    });
};

export const getOpenedPRs = async (repository: string, year: string, month: number, last_day: number) => {
    const new_month_format = createNewMonthFormat(month);
    return await axios_instance.get(`/search/issues?q=repo:binary-com/${repository}+is:pr+is:open+created:${year}-${new_month_format}-01..${year}-${new_month_format}-${last_day}`).catch((err) => {
        console.log('error: ', err.message);
    });
};

export const getFirstCommit = async (repository: string, year: string, month: number, last_day: number) => {
    let new_month, new_year, new_last_day = null;

    if(month < 1){
        new_month = createNewMonthFormat(month + 12);
        new_year = Number(year) - 1;
        new_last_day = daysInMonth(new_month as number, new_year);
    };
    
    const new_month_format = createNewMonthFormat(month);

    return await axios_instance
        .get(`/repos/binary-com/${repository}/commits?since=${new_year || year}-${new_month || new_month_format}-01&until=${new_year || year}-${new_month || new_month_format}-${new_last_day || last_day}&per_page=1&page=1`)
        .catch((err) => {
            console.log('error: ', err.message);
        });
};

export const getLastCommit = async (repository: string, year: string, month: number, last_day: number) => {
    const new_month_format = createNewMonthFormat(month);
    return await axios_instance.get(`/repos/binary-com/${repository}/commits?since=${year}-${new_month_format}-01&until=${year}-${new_month_format}-${last_day}&per_page=1&page=1`).catch((err) => {
        console.log('error: ', err.message);
    });
};

export const getComparingCommits = async (repository: string, first_commit: string, last_commit: string) => {
    return await axios.get(`https://rasteeslove-misc.herokuapp.com/deriv/github-stats/${repository}?since=${first_commit}&until=${last_commit}`).catch((err) => {
        console.log('error: ', err.message);
    });
};


export const getAllPRs = (pages: number, repository: string, year: string, month: number, last_day: number ) => {
    const new_month_format = createNewMonthFormat(month);
    const pages_arr = Array.from(Array(pages + 1).keys()).slice(1);
    pages_arr.shift();
    return pages_arr.map(async page=>{
        return await axios_instance.get(`/search/issues?q=repo:binary-com/${repository}+is:pr+merged:${year}-${new_month_format}-01..${year}-${new_month_format}-${last_day}&per_page=${per_page}&page=${page}`).catch((err) => {
            console.log('error: ', err.message);
        });
    });
};

export const getPrLifetimesInDays = (prs: Array<{
    user: {
        login: string,
    },
    created_at: string;
    closed_at: string;
}>) => {
    const bot_usernames = ['github-actions[bot]'];
    return prs.filter(pr => !bot_usernames.includes(pr.user.login))
        .filter(pr => pr.user.login.endsWith('-deriv'))
        .map(
            (pr) => Math.round(
                (Date.parse(pr.closed_at) - Date.parse(pr.created_at))
                        / 1000 / 3600)
        );
};
