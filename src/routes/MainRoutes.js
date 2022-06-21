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

// render - 사이트 관리
const AccessMngPage = Loadable(lazy(() => import('pages/operator/accessmng/index')));
const AccessRegForm = Loadable(lazy(() => import('pages/operator/accessmng/AccessRegForm')));
const SiteMenuRegForm = Loadable(lazy(() => import('pages/operator/menu/index')));
const SiteMenuMappingForm = Loadable(lazy(() => import('pages/operator/menu/SiteMenuMappingForm')));
const SiteAuthManagementPage = Loadable(lazy(() => import('pages/operator/auth/index')));
const SiteAuthMngRegForm = Loadable(lazy(() => import('pages/operator/auth/SiteAuthMngReg')));

// render - 통합 관리
const AccountMng = Loadable(lazy(() => import('pages/totalmng/accountmng/index')));
const AccountMngForm = Loadable(lazy(() => import('pages/totalmng/accountmng/AccountMngForm')));

// render - 통합 시스템 관리
const CryptoSample = Loadable(lazy(() => import('pages/samples/crud/cryptoSample')));
// render - job page
const SiteManagementPage = Loadable(lazy(() => import('pages/site/index')));

const AccountManagementPage = Loadable(lazy(() => import('pages/account/index')));
const AccountRegForm = Loadable(lazy(() => import('pages/account/AccountRegForm')));

const RoleManagementPage = Loadable(lazy(() => import('pages/roles/index')));
const RoleRegForm = Loadable(lazy(() => import('pages/roles/RoleRegForm')));
const RoleMappingForm = Loadable(lazy(() => import('pages/roles/RoleMappingForm')));

const ProgramManagementPage = Loadable(lazy(() => import('pages/programs/index')));
const ProgramRegForm = Loadable(lazy(() => import('pages/programs/ProgramRegForm')));

const MenuRegForm = Loadable(lazy(() => import('pages/menumng/MenuRegForm')));
const MenuMappingForm = Loadable(lazy(() => import('pages/menumng/MenuMappingForm')));

const AuthManagementPage = Loadable(lazy(() => import('pages/authmng/index')));
const AuthMngRegForm = Loadable(lazy(() => import('pages/authmng/AuthMngReg.js')));
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
            // 사이트 관리
            {
                path: 'access/list',
                element: <AccessMngPage />
            },
            {
                path: 'access/reg',
                element: <AccessRegForm />
            },
            {
                path: 'sitemenu/list',
                element: <SiteMenuRegForm />
            },
            {
                path: '/sitemenus/mapping',
                element: <SiteMenuMappingForm />
            },
            {
                path: '/siteauth/list',
                element: <SiteAuthManagementPage />
            },
            {
                path: '/siteauth/reg',
                element: <SiteAuthMngRegForm />
            },
            // 통합관리
            {
                path: 'accountmng/list',
                element: <AccountMng />
            },
            {
                path: 'accountmng/reg',
                element: <AccountMngForm />
            },
            {
                path: 'accountmng/reg/:paramId',
                element: <AccountMngForm />
            },
            // 통합시스템 관리
            {
                path: 'site/list',
                element: <SiteManagementPage />
            },
            {
                path: 'site/reg',
                element: <SiteRegForm />
            },
            {
                path: 'site/reg/:paramId',
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
                path: 'account/reg/:paramId',
                element: <AccountRegForm />
            },
            {
                path: 'roles/list',
                element: <RoleManagementPage />
            },
            {
                path: 'roles/list/:search_site_id/:search_is_use',
                element: <RoleManagementPage />
            },
            {
                path: 'roles/reg',
                element: <RoleRegForm />
            },
            {
                path: 'roles/reg/:paramId/:search_site_id/:search_is_use',
                element: <RoleRegForm />
            },
            {
                path: 'roles/mapping',
                element: <RoleMappingForm />
            },
            {
                path: 'menus/reg',
                element: <MenuRegForm />
            },
            {
                path: 'menus/mapping',
                element: <MenuMappingForm />
            },
            {
                path: 'pgm/list',
                element: <ProgramManagementPage />
            },
            {
                path: 'pgm/reg',
                element: <ProgramRegForm />
            },
            { path: 'pgm/reg/:paramId/:paramSiteId', element: <ProgramRegForm /> },
            {
                path: 'authmng/list',
                element: <AuthManagementPage />
            },
            {
                path: 'authmng/reg',
                element: <AuthMngRegForm />
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
