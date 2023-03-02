import type { TFetchData } from '@/hooks/use_fetch';
import { capitalize } from '.';

const API_URL = {
    star   : 'https://api.github.com/repos/farzin-deriv/deriv-dynamic-videos/actions/workflows/star-of-month.yml/dispatches',
    task   : 'https://api.github.com/repos/farzin-deriv/deriv-dynamic-videos/actions/workflows/weekly-update.yml/dispatches',
    road   : 'https://api.github.com/repos/farzin-deriv/deriv-dynamic-videos/actions/workflows/road-map.yml/dispatches',
    monthly: 'https://api.github.com/repos/farzin-deriv/deriv-dynamic-videos/actions/workflows/monthly-update.yml/dispatches',
};
const HEADER = {
    Accept       : 'application/vnd.github+json',
    Authorization: import.meta.env.VITE_REMOTION_AUTHORIZATION_TOKEN ?? '',
};

export const sendStarData = async (star: TFetchData, date: any) => {
    const inputs = {
        filename    : `star-${date.year}-${date.month}-${star.name.replace('', '-').toLowerCase()}`,
        name        : star.name,
        image       : star.image,
        achievements: star.achievements,
    };
    await fetch(API_URL.star, {
        method: 'POST',
        body  : JSON.stringify({
            ref: 'main',
            inputs,
        }),
        headers: HEADER,
    }).catch((err) => {
        console.log('error: ', err.message);
    });
};

export const sendWeeklyTasks = async (tasks: any, date: any, week_no: string) => {
    const inputs = {
        filename       : `task-${date.year}-${date.month}-week-${week_no}`,
        week           : String(week_no),
        date           : `${capitalize(date.month)} ${date.year}`,
        accomplishments: JSON.stringify(tasks.filter((task: any) => task.month === date.month && task.type === 'achievement')),
        challenges     : JSON.stringify(tasks.filter((task: any) => task.month === date.month && task.type === 'challenge')),
    };
    await fetch(API_URL.task, {
        method: 'POST',
        body  : JSON.stringify({
            ref: 'main',
            inputs,
        }),
        headers: HEADER,
    }).catch((err) => {
        console.log('error: ', err.message);
    });
};

export const sendRoadItems = async (items: any, date: any) => {
    const inputs = {
        filename: `road-${date.year}-${date.month}`,
        items   : JSON.stringify(items),
    };
    await fetch(API_URL.road, {
        method: 'POST',
        body  : JSON.stringify({
            ref: 'main',
            inputs,
        }),
        headers: HEADER,
    }).catch((err) => {
        console.log('error: ', err.message);
    });
};

export const sendMonthlyUpdate = async (stars: any, weeks: any, roads: any, settings: any) => {
    const taskList = (list: any, type: string) => list.filter((item: any) => item.type === type && item.month === settings.date.month);

    const inputs = {
        filename: `monthly-update-${settings.date.year}-${settings.date.month}`,
        stars   : JSON.stringify(stars[settings.date.month].map((star: any) => {
            return {
                name        : star.name,
                image       : star.image,
                achievements: star.achievements.split(' | ')
            };
        })),
        weeks: JSON.stringify(Object.keys(weeks).map((week) => {
            return {
                week           : settings.list.weeks.indexOf(week) + 1,
                date           : `${settings.date.month} ${settings.date.year}`,
                accomplishments: taskList(weeks[week], 'achievement').map((item: any) => {
                    return {
                        title      : item.title,
                        description: item.description
                    };
                }),
                challenges: taskList(weeks[week], 'challenge').map((item: any) => {
                    return {
                        title      : item.title,
                        description: item.description
                    };
                })
            };
        })),
        roads: JSON.stringify(roads.map((item: any) => item.title))
    };

    await fetch(API_URL.monthly, {
        method: 'POST',
        body  : JSON.stringify({
            ref: 'main',
            inputs,
        }),
        headers: HEADER,
    }).catch((err) => {
        console.log('error: ', err.message);
    }).finally(() => {
        // console.log('ddd');
    });
};
