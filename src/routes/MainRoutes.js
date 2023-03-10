import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import MinimalLayout from 'layout/MinimalLayout';
import SiteRegForm from 'pages/sysmng/site/SiteRegForm';
import Sitemyprivacy from 'pages/operator/sitemyprivacy';
import ProjectLink from 'pages/lrc/projectlink';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/auth/login')));
const OtpLogin = Loadable(lazy(() => import('pages/auth/otpLogin')));
const OtpSimpleLogin = Loadable(lazy(() => import('pages/auth/otpSimpleLogin')));
const TmpPasswordForm = Loadable(lazy(() => import('pages/auth/tmpPasswordForm')));
const ResetPasswordForm = Loadable(lazy(() => import('pages/auth/resetPasswordForm')));
const SignUp = Loadable(lazy(() => import('pages/auth/signup')));
const Unauthorized = Loadable(lazy(() => import('pages/auth/Unauthorized')));

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
const MainDashboard = Loadable(lazy(() => import('pages/sysmng/dashboard')));
// -----------------------
// render - 고객보호센터 - 메인 관리
const CpcMainContentsMng = Loadable(lazy(() => import('pages/cpc/main/contents')));
// -----------------------
// 사이트 운영/콘텐츠 관리
// 피해사례
const CpcDamageCaseMng = Loadable(lazy(() => import('pages/cpc/contents/Damage/view')));
const CpcDamageCaseMngForm = Loadable(lazy(() => import('pages/cpc/contents/Damage/post')));
// 안전거래 캠페인
const CpcCampaignMng = Loadable(lazy(() => import('pages/cpc/contents/Campaign/view')));
const CpcCampaignMngForm = Loadable(lazy(() => import('pages/cpc/contents/Campaign/post')));
// 가상자산의 기초
const CpcDigitalAssetBasicMng = Loadable(lazy(() => import('pages/cpc/contents/AssetBasic/view')));
const CpcDigitalAssetBasicMngForm = Loadable(lazy(() => import('pages/cpc/contents/AssetBasic/post')));
// 인사이트 칼럼
const CpcInsightColumnMng = Loadable(lazy(() => import('pages/cpc/contents/Insight/view')));
const CpcInsightColumnMngForm = Loadable(lazy(() => import('pages/cpc/contents/Insight/post')));
// 가상자산 동향
const CpcDigitalAssetTrendMng = Loadable(lazy(() => import('pages/cpc/contents/AssetTrend/view')));
const CpcDigitalAssetTrendMngForm = Loadable(lazy(() => import('pages/cpc/contents/AssetTrend/post')));
// 블록체인 뉴스
// const CpcBlockChainNewsMng = Loadable(lazy(() => import('pages/cpc/contents/BlockChain/view')));
// const CpcBlockChainNewsMngForm = Loadable(lazy(() => import('pages/cpc/contents/BlockChain/post')));
// 공지사항
const CpcNoticeMng = Loadable(lazy(() => import('pages/cpc/contents/Notice/view')));
const CpcNoticeMngForm = Loadable(lazy(() => import('pages/cpc/contents/Notice/post')));
// 보도자료
const CpcPressReleaseMng = Loadable(lazy(() => import('pages/cpc/contents/PressRelease/view')));
const CpcPressReleaseForm = Loadable(lazy(() => import('pages/cpc/contents/PressRelease/post')));

// 빗썸 경제연구소
const CpcEconomicResearchMng = Loadable(lazy(() => import('pages/cpc/contents/EconomicResearch/view')));
const CpcEconomicResearchMngForm = Loadable(lazy(() => import('pages/cpc/contents/EconomicResearch/post')));
// 이벤트
const CpcEventMng = Loadable(lazy(() => import('pages/cpc/contents/Event/view')));
const CpcEventMngForm = Loadable(lazy(() => import('pages/cpc/contents/Event/post')));
// 코인팅
const CpcCointingMng = Loadable(lazy(() => import('pages/cpc/contents/Cointing/view')));
const CpcCointingMngForm = Loadable(lazy(() => import('pages/cpc/contents/Cointing/post')));


// 찾아가는 교육 관리 - 신청자
const CpcEducationMng = Loadable(lazy(() => import('pages/cpc/contents/Education/view')));
const CpcEducationForm = Loadable(lazy(() => import('pages/cpc/contents/Education/post')));

// -----------------------
// render - 고객보호센터 - 사기신고 관리
// const CpcFraudReportMng = Loadable(lazy(() => import('pages/cpc/fraudReport/view')));
// const CpcFraudReportMngForm = Loadable(lazy(() => import('pages/cpc/fraudReport/detail')));
// -----------------------
// render - 고객보호센터 - 법률상담 관리
// const CpcLegalCounselingMng = Loadable(lazy(() => import('pages/cpc/legalCounseling/view')));
// const CpcLegalCounselingMngForm = Loadable(lazy(() => import('pages/cpc/legalCounseling/detail')));
// -----------------------
// render - 통합 게시판 관리
const BoardMng = Loadable(lazy(() => import('pages/board/index')));
const BoardMngRegForm = Loadable(lazy(() => import('pages/board/BoardMngRegForm')));
// -----------------------
// render - 사이트 관리
const AccessMngPage = Loadable(lazy(() => import('pages/operator/accessmng/index')));
const AccessRegForm = Loadable(lazy(() => import('pages/operator/accessmng/AccessRegForm')));
const SiteMenuRegForm = Loadable(lazy(() => import('pages/operator/menu/index')));
const SiteMenuMappingForm = Loadable(lazy(() => import('pages/operator/menu/SiteMenuMappingForm')));
const SiteAuthManagementPage = Loadable(lazy(() => import('pages/operator/auth/index')));
const SiteAuthMngRegForm = Loadable(lazy(() => import('pages/operator/auth/SiteAuthMngReg')));
const SiteLogPage = Loadable(lazy(() => import('pages/operator/log/index')));
const SiteLogDetail = Loadable(lazy(() => import('pages/operator/log/detail')));
const ServiceLog = Loadable(lazy(() => import('pages/lrc/servicelogs/index')));
const ServiceDetail = Loadable(lazy(() => import('pages/lrc/servicelogs/detail')));
const SiteRoleManagementPage = Loadable(lazy(() => import('pages/operator/roles/index')));
const SiteRoleRegForm = Loadable(lazy(() => import('pages/operator/roles/RoleRegForm')));
const SiteRoleMappingForm = Loadable(lazy(() => import('pages/operator/roles/RoleMappingForm')));
const SitemyprivacyPage = Loadable(lazy(() => import('pages/operator/sitemyprivacy/index')));
// -----------------------
// render - 통합 관리
const AccountMng = Loadable(lazy(() => import('pages/totalmng/accountmng/index')));
const AccountMngForm = Loadable(lazy(() => import('pages/totalmng/accountmng/AccountMngForm')));
// -----------------------
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
const FileManagementPage = Loadable(lazy(() => import('pages/sysmng/filemng/index')));
const FilemngRegForm = Loadable(lazy(() => import('pages/sysmng/filemng/FileMngRegForm')));

// 통합 시스템 관리 -> 접근 IP 관리
const IpMngBoard = Loadable(lazy(() => import('pages/sysmng/ipmng')));
const IpMngRegForm = Loadable(lazy(() => import('pages/sysmng/ipmng/ipRegForm')));

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
            //{
            //    path: 'otplogin',
            //    element: <OtpLogin />
            //},
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
            // 패스워드 초기화 요청 페이지
            {
                path: 'resetpassword',
                element: <ResetPasswordForm />
            },
            // 패스워드 초기화 요청 페이지
            {
                path: 'confirm-password/:paramId',
                element: <ResetPasswordForm />
            },
            // 회원가입 페이지
            {
                path: 'signup',
                element: <SignUp />
            },
            // 401
            {
                path: '401',
                element: <Unauthorized />
            },
            // Project Link
            {
                path: 'lrc/project/link/:id',
                element: <ProjectLink />
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
                path: 'projects/list/:paramId1',
                element: <ProjectsPage />
            },
            {
                path: 'projects/list/:paramId1/:paramId2',
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
            // 빗썸 경제연구소
            {
                path: 'cpc/contents/economic-research/list',
                element: <CpcEconomicResearchMng />
            },
            {
                path: 'cpc/contents/economic-research/reg',
                element: <CpcEconomicResearchMngForm />
            },
            {
                path: 'cpc/contents/economic-research/reg/:boardId',
                element: <CpcEconomicResearchMngForm />
            },
            // 이벤트
            {
                path: 'cpc/contents/event/list',
                element: <CpcEventMng />
            },
            {
                path: 'cpc/contents/event/reg',
                element: <CpcEventMngForm />
            },
            {
                path: 'cpc/contents/event/reg/:boardId',
                element: <CpcEventMngForm />
            },
            // 코인팅
            {
                path: 'cpc/contents/cointing/list',
                element: <CpcCointingMng />
            },
            {
                path: 'cpc/contents/cointing/reg',
                element: <CpcCointingMngForm />
            },
            {
                path: 'cpc/contents/cointing/reg/:boardId',
                element: <CpcCointingMngForm />
            },

            // {
            //     path: 'cpc/contents/blockchain-news/list',
            //     element: <CpcBlockChainNewsMng />
            // },
            // {
            //     path: 'cpc/contents/blockchain-news/reg',
            //     element: <CpcBlockChainNewsMngForm />
            // },
            // {
            //     path: 'cpc/contents/blockchain-news/reg/:newsId',
            //     element: <CpcBlockChainNewsMngForm />
            // },
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
            // 보도자료 리스트
            {
                path: 'cpc/contents/press-release/list',
                element: <CpcPressReleaseMng />
            },
            // 보도자료 등록
            {
                path: 'cpc/contents/press-release/reg',
                element: <CpcPressReleaseForm />
            },
            // 보도자료 수정
            {
                path: 'cpc/contents/press-release/reg/:boardId',
                element: <CpcPressReleaseForm />
            },
            // 찾아가는 교육 관리 - 신청자 관리
            {
                path: 'cpc/education/list',
                element: <CpcEducationMng />
            },
            // 찾아가는 교육 관리 - 신청자 등록(삭제예정)
            {
                path: 'cpc/education/reg',
                element: <CpcEducationForm />
            },
            // 찾아가는 교육 관리 - 신청자 수정
            {
                path: 'cpc/education/reg/:educationId',
                element: <CpcEducationForm />
            },

            // 고객보호센터 - 사기신고 관리
            // {
            //     path: 'cpc/fraud-report/list',
            //     element: <CpcFraudReportMng />
            // },
            // {
            //     path: 'cpc/fraud-report/reg/:applyId',
            //     element: <CpcFraudReportMngForm />
            // },
            // 고객보호센터 - 법률상담 관리
            // {
            //     path: 'cpc/legal-counseling/list',
            //     element: <CpcLegalCounselingMng />
            // },
            // {
            //     path: 'cpc/legal-counseling/reg/:applyId',
            //     element: <CpcLegalCounselingMngForm />
            // },
            // 사이트 관리
            {
                path: 'main/dashboard',
                element: <MainDashboard />
            },
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
                path: '/siteauth/reg/:siteId/:roleType/:roleId',
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
            {
                path: '/sitelog/log/:paramId',
                element: <SiteLogDetail />
            },
            {
                path: 'siteroles/list',
                element: <SiteRoleManagementPage />
            },
            {
                path: 'siteroles/reg/:paramId',
                element: <SiteRoleRegForm />
            },
            {
                path: 'siteroles/reg',
                element: <SiteRoleRegForm />
            },
            {
                path: 'siteroles/mapping',
                element: <SiteRoleMappingForm />
            },
            {
                path: '/sitemyprivacy',
                element: <SitemyprivacyPage />
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
            },
            {
                path: 'filemng/list',
                element: <FileManagementPage />
            },
            {
                path: 'filemng/reg',
                element: <FilemngRegForm />
            },
            {
                path: 'ipmng/list',
                element: <IpMngBoard />
            },
            {
                path: 'ipmng/reg',
                element: <IpMngRegForm />
            }
        ]
    }
];

export default MainRoutes;
