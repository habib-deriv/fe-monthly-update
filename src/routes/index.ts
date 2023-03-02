/* -------------------------------------------------------------------------- */
/* ROUTES MAP                                                                 */
/* -------------------------------------------------------------------------- */

import * as Layout from '@/layouts';

/**
 * Components
 */
import App from '@pages/App';
import Login from '@pages/Login';
import Settings from '@pages/Settings';
import Road from '@pages/Road';
import Tasks from '@pages/Tasks';
import Stars from '@pages/Stars';
import FileList from '@pages/FileList';
import Firebase from '@pages/Firebase';
import ChartBuilder from '@pages/ChartBuilder';

/**
 * Routes
 */
const routes = [
    {
        name     : 'App',
        path     : '/',
        layout   : Layout.DefaultLayout,
        component: App,
        children : []
    },
    {
        name     : 'Login',
        path     : '/login',
        layout   : Layout.DefaultLayout,
        component: Login,
        children : []
    },
    {
        name     : 'Settings',
        path     : '/settings',
        layout   : Layout.DefaultLayout,
        component: Settings,
        children : []
    },
    {
        name     : 'Road',
        path     : '/road',
        layout   : Layout.DefaultLayout,
        component: Road,
        children : [],
    },
    {
        name     : 'Tasks',
        path     : '/tasks',
        layout   : Layout.DefaultLayout,
        component: Tasks,
        children : [],
    },

    {
        name     : 'Stars',
        path     : '/stars',
        layout   : Layout.DefaultLayout,
        component: Stars,
        children : [],
    },
    {
        name     : 'FileList',
        path     : '/list',
        layout   : Layout.DefaultLayout,
        component: FileList,
        children : [],
    },
    {
        name     : 'Firebase',
        path     : '/firebase',
        layout   : Layout.DefaultLayout,
        component: Firebase,
        children : [],
    },
    {
        name     : 'Chart Builder',
        path     : '/chart-builder',
        layout   : Layout.DefaultLayout,
        component: ChartBuilder,
        children : [],
    }
];

export default routes;
