import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import MinimalLayout from 'layout/MinimalLayout';
import TableUrlPage from 'pages/url-page/index';
import EditorPage from 'pages/editor-page/index';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));

// render - sample
const TableSamplePage = Loadable(lazy(() => import('pages/table-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = [
    {
        path: '/',
        element: <MinimalLayout />,
        children: [
            {
                path: '/',
                element: <AuthLogin />
            },
            {
                path: 'login',
                element: <AuthLogin />
            },
            {
                path: 'register',
                element: <AuthRegister />
            }
        ]
    },
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: 'dashboard',
                element: <DashboardDefault />
            },
            {
                path: 'color',
                element: <Color />
            },
            {
                path: 'dashboard',
                children: [
                    {
                        path: 'default',
                        element: <DashboardDefault />
                    }
                ]
            },
            {
                path: 'table-page',
                element: <TableSamplePage />
            },
            {
                path: 'url-page',
                element: <TableUrlPage />
            },
            {
                path: 'editor-page',
                element: <EditorPage />
            },
            {
                path: 'sample-page',
                element: <SamplePage />
            },
            {
                path: 'shadow',
                element: <Shadow />
            },
            {
                path: 'typography',
                element: <Typography />
            },
            {
                path: 'icons/ant',
                element: <AntIcons />
            }
        ]
    }
];

export default MainRoutes;
