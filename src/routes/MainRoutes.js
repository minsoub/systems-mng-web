import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import MinimalLayout from 'layout/MinimalLayout';
import TableUrlPage from 'pages/url-page/index';
import EditorPage from 'pages/editor-page/index';
import SiteRegForm from 'pages/site/SiteRegForm';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const OtpLogin = Loadable(lazy(() => import('pages/authentication/OtpLogin')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));

// render - sample
const TableSamplePage = Loadable(lazy(() => import('pages/table-page')));

const CrudList = Loadable(lazy(() => import('pages/samples/crud/list')));
const CrudWrite = Loadable(lazy(() => import('pages/samples/crud/write')));
const CryptoSample = Loadable(lazy(() => import('pages/samples/crud/cryptoSample')));
// render - job page
const SiteManagementPage = Loadable(lazy(() => import('pages/site/index')));

const AccountManagementPage = Loadable(lazy(() => import('pages/account/index')));
const AccountRegForm = Loadable(lazy(() => import('pages/account/AccountRegForm')));

const RoleManagementPage = Loadable(lazy(() => import('pages/roles/index')));
const RoleRegForm = Loadable(lazy(() => import('pages/roles/RoleRegForm')));
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
                path: 'otplogin',
                element: <OtpLogin />
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
                path: 'site/list',
                element: <SiteManagementPage />
            },
            {
                path: 'site/reg',
                element: <SiteRegForm />
            },
            {
                path: 'account/list',
                element: <AccountManagementPage />
            },
            {
                path: 'account/reg',
                element: <AccountRegForm />
            },
            {
                path: 'roles/list',
                element: <RoleManagementPage />
            },
            {
                path: 'roles/reg',
                element: <RoleRegForm />
            },
            {
                path: 'roles/mapping',
                element: <RoleManagementPage />
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
            },
            {
                path: 'crud/list',
                element: <CrudList />
            },
            {
                path: 'crud/write',
                element: <CrudWrite />
            },
            {
                path: 'crud/edit/:id',
                element: <CrudWrite />
            },
            {
                path: 'crud/crypto',
                element: <CryptoSample />
            }
        ]
    }
];

export default MainRoutes;
