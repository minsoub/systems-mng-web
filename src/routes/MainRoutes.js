import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import MinimalLayout from 'layout/MinimalLayout';
import SiteRegForm from 'pages/sysmng/site/SiteRegForm';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/auth/login')));
const OtpLogin = Loadable(lazy(() => import('pages/auth/otpLogin')));
const OtpSimpleLogin = Loadable(lazy(() => import('pages/auth/otpSimpleLogin')));
const TmpPasswordForm = Loadable(lazy(() => import('pages/auth/tmpPasswordForm')));
const SignUp = Loadable(lazy(() => import('pages/auth/signup')));

// profile - updateform
const ProfileUpdateForm = Loadable(lazy(() => import('pages/profile/index')));
// render - 사이트 운영 (거래지원 신청)
const ProjectsPage = Loadable(lazy(() => import('pages/lrc/projects/index')));
const ProjectsDetailPage = Loadable(lazy(() => import('pages/lrc/projects/detail')));
const StatusRegForm = Loadable(lazy(() => import('pages/lrc/state/index')));
const LineMngPage = Loadable(lazy(() => import('pages/lrc/line/index')));
const FaqCategoryPage = Loadable(lazy(() => import('pages/lrc/faq/categorylist')));
const FaqContentsPage = Loadable(lazy(() => import('pages/lrc/faq/index')));
const FaqRegForm = Loadable(lazy(() => import('pages/lrc/faq/faqreg')));

// render - 고객보호센터 - 대시보드
const CpcDashboard = Loadable(lazy(() => import('pages/cpc/dashboard')));

// render - 고객보호센터 - 메인 관리
const CpcMainContentsMng = Loadable(lazy(() => import('pages/cpc/main/contents')));

// render - 고객보호센터 - 콘텐츠 관리
const CpcDamageCaseMng = Loadable(lazy(() => import('pages/cpc/contents/DamageCaseMng')));
const CpcDamageCaseMngForm = Loadable(lazy(() => import('pages/cpc/contents/DamageCaseMngForm')));
const CpcCampaignMng = Loadable(lazy(() => import('pages/cpc/contents/CampaignMng')));
const CpcCampaignMngForm = Loadable(lazy(() => import('pages/cpc/contents/CampaignMngForm')));
const CpcDigitalAssetBasicMng = Loadable(lazy(() => import('pages/cpc/contents/DigitalAssetBasicMng')));
const CpcDigitalAssetBasicMngForm = Loadable(lazy(() => import('pages/cpc/contents/DigitalAssetBasicMngForm')));
const CpcInsightColumnMng = Loadable(lazy(() => import('pages/cpc/contents/InsightColumnMng')));
const CpcInsightColumnMngForm = Loadable(lazy(() => import('pages/cpc/contents/InsightColumnMngForm')));
const CpcDigitalAssetTrendMng = Loadable(lazy(() => import('pages/cpc/contents/DigitalAssetTrendMng')));
const CpcDigitalAssetTrendMngForm = Loadable(lazy(() => import('pages/cpc/contents/DigitalAssetTrendMngForm')));
const CpcBlockChainNewsMng = Loadable(lazy(() => import('pages/cpc/contents/BlockChainNewsMng')));
const CpcBlockChainNewsMngForm = Loadable(lazy(() => import('pages/cpc/contents/BlockChainNewsMngForm')));
const CpcNoticeMng = Loadable(lazy(() => import('pages/cpc/contents/NoticeMng')));
const CpcNoticeMngForm = Loadable(lazy(() => import('pages/cpc/contents/NoticeMngForm')));

// render - 고객보호센터 - 사기신고 관리
const CpcFraudReportMng = Loadable(lazy(() => import('pages/cpc/fraudReport/index')));
const CpcFraudReportMngForm = Loadable(lazy(() => import('pages/cpc/fraudReport/FraudReportMngForm')));

// render - 고객보호센터 - 법률상담 관리
const CpcLegalCounselingMng = Loadable(lazy(() => import('pages/cpc/legalCounseling/index')));
const CpcLegalCounselingMngForm = Loadable(lazy(() => import('pages/cpc/legalCounseling/LegalCounselingMngForm')));

// render - 통합 게시판 관리
const BoardMng = Loadable(lazy(() => import('pages/board/index')));
const BoardMngRegForm = Loadable(lazy(() => import('pages/board/BoardMngRegForm')));

// render - 사이트 관리
const AccessMngPage = Loadable(lazy(() => import('pages/operator/accessmng/index')));
const AccessRegForm = Loadable(lazy(() => import('pages/operator/accessmng/AccessRegForm')));
const SiteMenuRegForm = Loadable(lazy(() => import('pages/operator/menu/index')));
const SiteMenuMappingForm = Loadable(lazy(() => import('pages/operator/menu/SiteMenuMappingForm')));
const SiteAuthManagementPage = Loadable(lazy(() => import('pages/operator/auth/index')));
const SiteAuthMngRegForm = Loadable(lazy(() => import('pages/operator/auth/SiteAuthMngReg')));
const SiteLogPage = Loadable(lazy(() => import('pages/operator/log/index')));
const ServiceLog = Loadable(lazy(() => import('pages/lrc/servicelogs/index')));
const ServiceDetail = Loadable(lazy(() => import('pages/lrc/servicelogs/detail')));

// render - 통합 관리
const AccountMng = Loadable(lazy(() => import('pages/totalmng/accountmng/index')));
const AccountMngForm = Loadable(lazy(() => import('pages/totalmng/accountmng/AccountMngForm')));

// render - 통합 시스템 관리
const SiteManagementPage = Loadable(lazy(() => import('pages/sysmng/site/index')));
const AccountManagementPage = Loadable(lazy(() => import('pages/sysmng/account/index')));
const AccountRegForm = Loadable(lazy(() => import('pages/sysmng/account/AccountRegForm')));

const RoleManagementPage = Loadable(lazy(() => import('pages/sysmng/roles/index')));
const RoleRegForm = Loadable(lazy(() => import('pages/sysmng/roles/RoleRegForm')));
const RoleMappingForm = Loadable(lazy(() => import('pages/sysmng/roles/RoleMappingForm')));

const ProgramManagementPage = Loadable(lazy(() => import('pages/sysmng/programs/index')));
const ProgramRegForm = Loadable(lazy(() => import('pages/sysmng/programs/ProgramRegForm')));

const MenuRegForm = Loadable(lazy(() => import('pages/sysmng/menumng/MenuRegForm')));
const MenuMappingForm = Loadable(lazy(() => import('pages/sysmng/menumng/MenuMappingForm')));

const AuthManagementPage = Loadable(lazy(() => import('pages/sysmng/authmng/index')));
const AuthMngRegForm = Loadable(lazy(() => import('pages/sysmng/authmng/AuthMngReg.js')));

const LrcDashboard = Loadable(lazy(() => import('pages/lrc/dashboard/index')));

const MainRoutes = [
    {
        path: '/',
        element: <MinimalLayout />,
        children: [
            // 로그인 페이지
            {
                path: '/',
                element: <AuthLogin />
            },
            // 로그인 페이지
            {
                path: 'login',
                element: <AuthLogin />
            },
            // otp (QR 코드) 발급 페이지
            {
                path: 'otplogin',
                element: <OtpLogin />
            },
            // otp 인증 페이지
            {
                path: 'otpsimplelogin',
                element: <OtpSimpleLogin />
            },
            // 임시 패스워드 변경 페이지
            {
                path: 'tmppassword',
                element: <TmpPasswordForm />
            },
            // 회원가입 페이지
            {
                path: 'signup',
                element: <SignUp />
            }
        ]
    },
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: 'lrc/dashboard',
                element: <LrcDashboard />
            },
            // profile update
            {
                path: 'profile/update',
                element: <ProfileUpdateForm />
            },
            // 사이트 운영
            {
                path: 'projects/list',
                element: <ProjectsPage />
            },
            {
                path: 'projects/detail',
                element: <ProjectsDetailPage />
            },
            {
                path: 'projects/detail/:paramId',
                element: <ProjectsDetailPage />
            },
            {
                path: 'status/list',
                element: <StatusRegForm />
            },
            {
                path: 'line/list',
                element: <LineMngPage />
            },
            {
                path: 'faq/categorylist',
                element: <FaqCategoryPage />
            },
            {
                path: 'faq/list',
                element: <FaqContentsPage />
            },
            {
                path: 'faq/reg/:paramId',
                element: <FaqRegForm />
            },
            {
                path: 'faq/reg/:paramId/:paramNo',
                element: <FaqRegForm />
            },
            {
                path: 'service/list',
                element: <ServiceLog />
            },
            {
                path: 'service/log/:paramId',
                element: <ServiceDetail />
            },
            // 고객보호센터 - 대시보드
            {
                path: 'cpc/dashboard',
                element: <CpcDashboard />
            },
            // 고객보호센터 - 메인 관리
            {
                path: 'cpc/main/contents/list',
                element: <CpcMainContentsMng />
            },
            // 고객보호센터 - 콘텐츠 관리
            {
                path: 'cpc/contents/damage-case/list',
                element: <CpcDamageCaseMng />
            },
            {
                path: 'cpc/contents/damage-case/reg',
                element: <CpcDamageCaseMngForm />
            },
            {
                path: 'cpc/contents/damage-case/reg/:boardId',
                element: <CpcDamageCaseMngForm />
            },
            {
                path: 'cpc/contents/campaign/list',
                element: <CpcCampaignMng />
            },
            {
                path: 'cpc/contents/campaign/reg',
                element: <CpcCampaignMngForm />
            },
            {
                path: 'cpc/contents/campaign/reg/:boardId',
                element: <CpcCampaignMngForm />
            },
            {
                path: 'cpc/contents/digital-asset-basic/list',
                element: <CpcDigitalAssetBasicMng />
            },
            {
                path: 'cpc/contents/digital-asset-basic/reg',
                element: <CpcDigitalAssetBasicMngForm />
            },
            {
                path: 'cpc/contents/digital-asset-basic/reg/:boardId',
                element: <CpcDigitalAssetBasicMngForm />
            },
            {
                path: 'cpc/contents/insight-column/list',
                element: <CpcInsightColumnMng />
            },
            {
                path: 'cpc/contents/insight-column/reg',
                element: <CpcInsightColumnMngForm />
            },
            {
                path: 'cpc/contents/insight-column/reg/:boardId',
                element: <CpcInsightColumnMngForm />
            },
            {
                path: 'cpc/contents/digital-asset-trend/list',
                element: <CpcDigitalAssetTrendMng />
            },
            {
                path: 'cpc/contents/digital-asset-trend/reg',
                element: <CpcDigitalAssetTrendMngForm />
            },
            {
                path: 'cpc/contents/digital-asset-trend/reg/:boardId',
                element: <CpcDigitalAssetTrendMngForm />
            },
            {
                path: 'cpc/contents/blockchain-news/list',
                element: <CpcBlockChainNewsMng />
            },
            {
                path: 'cpc/contents/blockchain-news/reg',
                element: <CpcBlockChainNewsMngForm />
            },
            {
                path: 'cpc/contents/blockchain-news/reg/:newsId',
                element: <CpcBlockChainNewsMngForm />
            },
            {
                path: 'cpc/contents/notice/list',
                element: <CpcNoticeMng />
            },
            {
                path: 'cpc/contents/notice/reg',
                element: <CpcNoticeMngForm />
            },
            {
                path: 'cpc/contents/notice/reg/:boardId',
                element: <CpcNoticeMngForm />
            },
            // 고객보호센터 - 사기신고 관리
            {
                path: 'cpc/fraud-report/list',
                element: <CpcFraudReportMng />
            },
            {
                path: 'cpc/fraud-report/reg/:applyId',
                element: <CpcFraudReportMngForm />
            },
            // 고객보호센터 - 법률상담 관리
            {
                path: 'cpc/legal-counseling/list',
                element: <CpcLegalCounselingMng />
            },
            {
                path: 'cpc/legal-counseling/reg/:applyId',
                element: <CpcLegalCounselingMngForm />
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
                path: 'access/reg/:paramId',
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
                path: '/siteauth/reg/:paramId',
                element: <SiteAuthMngRegForm />
            },
            {
                path: '/siteauth/reg',
                element: <SiteAuthMngRegForm />
            },
            {
                path: '/sitelog/list',
                element: <SiteLogPage />
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
                path: 'board/list',
                element: <BoardMng />
            },
            {
                path: 'board/reg/',
                element: <BoardMngRegForm />
            },
            {
                path: 'board/reg/:boardMasterId',
                element: <BoardMngRegForm />
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
                path: 'authmng/reg/:siteId/:roleType/:roleId',
                element: <AuthMngRegForm />
            }
        ]
    }
];

export default MainRoutes;
