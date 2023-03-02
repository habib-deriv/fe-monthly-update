import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settings';
import contentReducer from './content';
import chartsReducer from './charts';

const store = configureStore({
    reducer: {
        settings: settingsReducer,
        content : contentReducer,
        charts  : chartsReducer,
    }
});

export type TRootState = ReturnType<typeof store.getState>
export type TAppDispatch = typeof store.dispatch

export default store;
