import { createSlice } from '@reduxjs/toolkit';
import { MONTHS as months } from '@/constants';

const d = new Date();
const weeks = ['one', 'two', 'three', 'four', 'five', 'six'];

export const settingsSlice = createSlice({
    name        : 'settings',
    initialState: {
        list: {
            months,
            weeks,
        },
        date: {
            year:
        JSON.parse(localStorage.getItem('fe-update-year')!) ?? d.getFullYear(),
            month:
        JSON.parse(localStorage.getItem('fe-update-month')!) ??
        months[d.getMonth()],
        },
        is_date_changed: false,
    },
    reducers: {
        setYear: (state, action) => {
            localStorage.setItem('fe-update-year', JSON.stringify(action.payload));
            state.is_date_changed = true;
            state.date.year = action.payload;
        },
        setMonth: (state, action) => {
            localStorage.setItem('fe-update-month', JSON.stringify(action.payload));
            state.is_date_changed = true;
            state.date.month = action.payload;
        },
        setIsDateChanged: (state, action) => {
            state.is_date_changed = action.payload;
        },
    },
});

export const { setYear, setMonth, setIsDateChanged } = settingsSlice.actions;

export default settingsSlice.reducer;
