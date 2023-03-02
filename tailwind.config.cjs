/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    important: '#root',
    theme    : {
        fontFamily: {
            'sans': ['Roboto'],
        },
        height: {
            'hero': 'height: calc(100vh - 66px - 52px)'
        },
        extend: {},
    },
    corePlugins: {
        preflight: true,
    },
    plugins: [
        // require('daisyui')
    ],
};
