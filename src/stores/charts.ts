import { createSlice, createAsyncThunk  } from '@reduxjs/toolkit';
import {
    getMergedPRs,
    getOpenedPRs,
    getFirstCommit,
    getLastCommit,
    getComparingCommits,
    getAllPRs,
} from '@/utils/get-stats';
import { daysInMonth } from '@/utils';
import { MONTHS, REPOSITORIES } from '@/constants';
import { TRootState } from '@/stores/store';

type TPRs = {
        user: {
            login: string,
        },
        created_at: string,
        closed_at: string,
}

export type TData = {
    merged_prs?: number | null;
    opened_prs?: number | null;
    first_commit?: string | null;
    last_commit?: string | null;
    number_of_files?: number | null;
    additions?: number | null;
    deletions?: number | null;
    prs?: Array<TPRs>;
}

export type TGitHubData = {
    [key: string]: TData;
}

const merged_prs = (repository: string, year: string, month_number: number) => getMergedPRs(
    repository,
    year,
    month_number,
    daysInMonth(month_number, Number(year))
);

const opened_prs = (repository: string, year: string, month_number: number) => getOpenedPRs(
    repository,
    year,
    month_number,
    daysInMonth(month_number, Number(year))
);

const first_commit = (repository: string, year: string, month_number: number, attempt: number = 1) => getFirstCommit(
    repository,
    year,
    month_number - attempt,
    daysInMonth(month_number - attempt, Number(year))
);

const last_commit = (repository: string, year: string, month_number: number) => getLastCommit(
    repository,
    year,
    month_number,
    daysInMonth(month_number, Number(year))
);

const getPromisesPRArray = (mergded_prs: number, repository: string,  year: string, month_number: number)=>{
    return getAllPRs(mergded_prs, repository, year, month_number, daysInMonth(month_number, Number(year)));
};

const getMonthNumber = (month: string) => MONTHS.indexOf(month) + 1;

const prs_per_page = 100;

export const fetchStats = createAsyncThunk(
    'stats/fetchGitHubStats',
    async (_, thunkAPI) => {
        const { settings: {date: { year, month }}, charts: { repositories }} = thunkAPI.getState() as TRootState;
        return await Promise.all(repositories.map(async (repository: string) => {
            const result = await Promise.all([
                merged_prs(repository, year, getMonthNumber(month)),
                opened_prs(repository, year, getMonthNumber(month)),
                first_commit(repository, year, getMonthNumber(month)),
                last_commit(repository, year, getMonthNumber(month)),
            ]);
            const stats_data: TGitHubData = {[repository]: {
                merged_prs     : null,
                opened_prs     : null,
                first_commit   : null,
                last_commit    : null,
                number_of_files: null,
                additions      : null,
                deletions      : null,
                prs            : [],
            }};
            result.forEach((res, idx) => {
                if(res?.data){
                    switch (idx) {
                    case 0:
                        stats_data[repository].merged_prs = res.data.total_count;
                        stats_data[repository].prs = [...stats_data[repository].prs as {[key: string]: any}[] , ...res.data.items];
                        break;
                    case 1:
                        stats_data[repository].opened_prs = res.data.total_count;
                        break;
                    case 2:
                        stats_data[repository].first_commit = res.data[0]?.sha;
                        break;
                    case 3:
                        stats_data[repository].last_commit = res.data[0]?.sha;
                        break;
                    default:
                        break;
                    }
                }
            });
            if(!stats_data[repository].first_commit){
                let attempt = 2;
                while(!stats_data[repository].first_commit && attempt <= 4){
                    const commit = await first_commit(repository, year, getMonthNumber(month), attempt);
                    attempt += 1;
                    stats_data[repository].first_commit = commit?.data[0]?.sha;
                }
            }
            const pages = Math.ceil(stats_data[repository].merged_prs!/prs_per_page);
            if(pages > 1){
                const promises_pr_arr = getPromisesPRArray(pages, repository, year, getMonthNumber(month));
                const prs_result = await Promise.all([...promises_pr_arr]);
                prs_result.forEach(res=> {
                    if(res?.data){
                        stats_data[repository].prs = [...stats_data[repository].prs as {[key: string]: any}[] , ...res.data.items];
                    }
                });
            }
            const comparing_data = await getComparingCommits(
                repository,
                stats_data[repository].first_commit as unknown as string,
                stats_data[repository].last_commit as unknown as string,
            );
            if(comparing_data?.data){
                stats_data[repository].number_of_files = comparing_data.data.files;
                stats_data[repository].additions = comparing_data.data.additions;
                stats_data[repository].deletions = comparing_data.data.deletions;
            }
            return stats_data;
        }));
    }
);

export const chartsSlice = createSlice({
    name        : 'stats',
    initialState: {
        repositories    : REPOSITORIES,
        stats           : {} as TGitHubData,
        is_stats_loading: false
    },
    reducers: {
        setIsStatsLoading: (state, action) => {
            state.is_stats_loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchStats.fulfilled, (state, action) => {
            action.payload.forEach(repo=>{
                state.stats[Object.keys(repo)[0]] = {...repo[Object.keys(repo)[0]]};
            });
            state.is_stats_loading = false;
        });
    },
});

export const { setIsStatsLoading } = chartsSlice.actions;

export default chartsSlice.reducer;
