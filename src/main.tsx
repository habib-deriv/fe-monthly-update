import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import AppRoutes from '@/routes/Routes';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import store from '@/stores/store';
import './main.scss';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// import '@fontsource/josefin-sans/700.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const theme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: () => ({
                    lineHeight: 2
                }),
            },
        },
    },
});

root.render(
    // <React.StrictMode>
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <AppRoutes />
        </ThemeProvider>
    </Provider>
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
