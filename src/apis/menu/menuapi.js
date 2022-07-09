/// assets
import {
    LoginOutlined,
    ProfileOutlined,
    ChromeOutlined,
    QuestionOutlined,
    DashboardOutlined,
    AppstoreAddOutlined,
    AntDesignOutlined,
    BarcodeOutlined,
    BgColorsOutlined,
    FontSizeOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import Apis from 'apis/Apis';
import icon from '../../../node_modules/refractor/lang/icon';

// icons
const icons = {
    LoginOutlined,
    ProfileOutlined,
    ChromeOutlined,
    QuestionOutlined,
    DashboardOutlined,
    AppstoreAddOutlined,
    AntDesignOutlined,
    BarcodeOutlined,
    BgColorsOutlined,
    FontSizeOutlined,
    LoadingOutlined
};

const menus = [
    // {
    //     id: 'group-dashboard',
    //     title: 'Navigation',
    //     type: 'group',
    //     parents_menu_id: '',
    //     children: [
    //         {
    //             id: 'dashboard',
    //             title: 'Dashboard',
    //             type: 'item',
    //             url: '/dashboard/default',
    //             auth: true, // 로그인 했을 때만 사용가능 메뉴
    //             icon: icons.DashboardOutlined,
    //             breadcrumbs: false,
    //             parents_menu_id: 'xxx'
    //         }
    //     ]
    // },
    // {
    //     id: 'authentication',
    //     title: 'Authentication',
    //     type: 'group',
    //     parents_menu_id: '',
    //     children: [
    //         {
    //             id: 'login1',
    //             title: 'Login',
    //             type: 'item',
    //             url: '/login',
    //             icon: icons.LoginOutlined,
    //             target: true,
    //             parents_menu_id: 'xxx'
    //         },
    //         {
    //             id: 'register1',
    //             title: 'Register',
    //             type: 'item',
    //             url: '/register',
    //             icon: icons.ProfileOutlined,
    //             target: true,
    //             parents_menu_id: 'xxx'
    //         }
    //     ]
    // },
    {
        id: 'sitemoperator',
        title: '사이트 운영',
        type: 'group',
        parents_menu_id: '',
        children: [
            {
                id: 'dealmng',
                title: '거래지원 관리',
                type: 'item',
                url: '/projects/list',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                parents_menu_id: 'xxx'
            },
            {
                id: 'dealmng2',
                title: 'FAQ 관리',
                type: 'collapse',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                parents_menu_id: 'xxx',
                children: [
                    {
                        id: 'dealmng19',
                        title: '컨텐츠 관리',
                        type: 'item',
                        url: '/faq/list',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        breadcrumbs: true,
                        parents_menu_id: 'xxx'
                    },
                    {
                        id: 'dealmng20',
                        title: '카테고리 관리',
                        type: 'item',
                        url: '/faq/categorylist',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        breadcrumbs: true,
                        parents_menu_id: 'xxx'
                    }
                ]
            },
            {
                id: 'statusmng',
                title: '상태값 관리',
                type: 'collapse',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                parents_menu_id: 'xxx',
                children: [
                    {
                        id: 'dealmng13',
                        title: '상태값 관리',
                        type: 'item',
                        url: '/status/list',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        breadcrumbs: true,
                        parents_menu_id: 'xxx'
                    },
                    {
                        id: 'dealmng14',
                        title: '계열 관리',
                        type: 'item',
                        url: '/line/list',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        breadcrumbs: true,
                        parents_menu_id: 'xxx'
                    }
                ]
            },
            {
                id: 'dealmng4',
                title: '서비스 로그 관리',
                type: 'item',
                url: '/service/list',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                parents_menu_id: 'xxx'
            },
            {
                id: 'cpcmain',
                title: '메인 관리',
                type: 'collapse',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                parents_menu_id: 'sitemoperator',
                children: [
                    {
                        id: 'cpcmaincontents',
                        title: '콘텐츠 노출 관리',
                        type: 'item',
                        url: '/cpc/main/contents/list',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        breadcrumbs: true,
                        parents_menu_id: 'cpcmain'
                    }
                ]
            },
            {
                id: 'cpccontents',
                title: '콘텐츠 관리',
                type: 'collapse',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                parents_menu_id: 'sitemoperator',
                children: [
                    {
                        id: 'cpcdamagecase',
                        title: '피해사례',
                        type: 'item',
                        url: '/cpc/contents/damage-case/list',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        breadcrumbs: true,
                        parents_menu_id: 'cpccontents'
                    },
                    {
                        id: 'cpccampaign',
                        title: '안전거래 캠페인',
                        type: 'item',
                        url: '/cpc/contents/campaign/list',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        breadcrumbs: true,
                        parents_menu_id: 'cpccontents'
                    },
                    {
                        id: 'cpcdigitalassetbasic',
                        title: '가상자산의 기초',
                        type: 'item',
                        url: '/cpc/contents/digital-asset-basic/list',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        breadcrumbs: true,
                        parents_menu_id: 'cpccontents'
                    },
                    {
                        id: 'cpcinsightcolumn',
                        title: '인사이트 칼럼',
                        type: 'item',
                        url: '/cpc/contents/insight-column/list',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        breadcrumbs: true,
                        parents_menu_id: 'cpccontents'
                    },
                    {
                        id: 'cpcdigitalassettrend',
                        title: '가상자산 동향',
                        type: 'item',
                        url: '/cpc/contents/digital-asset-trend/list',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        breadcrumbs: true,
                        parents_menu_id: 'cpccontents'
                    },
                    {
                        id: 'cpcblockchainnews',
                        title: '블록체인 뉴스',
                        type: 'item',
                        url: '/cpc/contents/blockchain-news/list',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        breadcrumbs: true,
                        parents_menu_id: 'cpccontents'
                    },
                    {
                        id: 'cpcnotice',
                        title: '공지사항',
                        type: 'item',
                        url: '/cpc/contents/notice/list',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        breadcrumbs: true,
                        parents_menu_id: 'cpccontents'
                    }
                ]
            },
            {
                id: 'cpcfraudreport',
                title: '사기신고 관리',
                type: 'item',
                url: '/cpc/fraud-report/list',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                parents_menu_id: 'sitemoperator'
            },
            {
                id: 'cpclegalcounseling',
                title: '법률상담 관리',
                type: 'item',
                url: '/cpc/legal-counseling/list',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                parents_menu_id: 'sitemoperator'
            }
        ]
    },
    {
        id: 'sitemanagement',
        title: '사이트 관리',
        type: 'group',
        parents_menu_id: '',
        children: [
            {
                id: 'siteaccess',
                title: '사용자 접근관리',
                type: 'item',
                url: '/access/list',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                parents_menu_id: 'xxx'
            },
            {
                id: 'sitemenu',
                title: '메뉴 관리',
                type: 'collapse',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                parents_menu_id: 'xxx',
                children: [
                    {
                        id: 'site_menu_register',
                        title: '메뉴 등록',
                        type: 'item',
                        url: '/sitemenu/list',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        parents_menu_id: 'xxx'
                    },
                    {
                        id: 'site_menu_mapping',
                        title: '프로그램 연결',
                        type: 'item',
                        url: '/sitemenus/mapping',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        parents_menu_id: 'xxx'
                    }
                ]
            },
            {
                id: 'siteauth',
                title: '권한 관리',
                type: 'collapse',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                children: [
                    {
                        id: 'siteauth_list',
                        title: '권한 리스트',
                        type: 'item',
                        url: '/siteauth/list',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        parents_menu_id: 'xxx'
                    },
                    {
                        id: 'siteauth_reg',
                        title: '권한 맵핑 등록',
                        type: 'item',
                        url: '/siteauth/reg',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        parents_menu_id: 'xxx'
                    }
                ]
            },
            {
                id: 'sitelog',
                title: '감사로그 조회',
                type: 'item',
                url: '/sitelog/list',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                parents_menu_id: 'xxx'
            }
        ]
    },
    {
        id: 'totaladmin',
        title: '통합관리',
        type: 'group',
        parents_menu_id: '',
        children: [
            {
                id: 'accountmng',
                title: '계정 관리',
                type: 'item',
                url: '/accountmng/list',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                parents_menu_id: 'xxx'
            }
        ]
    },
    {
        id: 'smartadmin',
        title: '통합시스템 관리',
        type: 'group',
        parents_menu_id: '',
        children: [
            {
                id: 'site',
                title: '사이트 관리',
                type: 'item',
                url: '/site/list',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                parents_menu_id: 'xxx'
            },
            {
                id: 'account',
                title: '계정 관리',
                type: 'item',
                url: '/account/list',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                parents_menu_id: 'xxx'
            },
            {
                id: 'roles',
                title: 'Role 관리',
                type: 'collapse',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                parents_menu_id: 'xxx',
                children: [
                    {
                        id: 'role_management',
                        title: 'Role 리스트',
                        type: 'item',
                        url: '/roles/list',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        parents_menu_id: 'xxx'
                    },
                    {
                        id: 'role_regt',
                        title: 'Role 등록',
                        type: 'item',
                        url: '/roles/reg',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        parents_menu_id: 'xxx'
                    },
                    {
                        id: 'role_mapping',
                        title: '사용자 맵핑',
                        type: 'item',
                        url: '/roles/mapping',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        parents_menu_id: 'xxx'
                    }
                ]
            },
            {
                id: 'menus',
                title: '메뉴 관리',
                type: 'collapse',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                parents_menu_id: 'xxx',
                children: [
                    {
                        id: 'menu_register',
                        title: '메뉴 등록',
                        type: 'item',
                        url: '/menus/reg',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        parents_menu_id: 'xxx'
                    },
                    {
                        id: 'menu_mapping',
                        title: '프로그램 연결',
                        type: 'item',
                        url: '/menus/mapping',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        parents_menu_id: 'xxx'
                    }
                ]
            },
            {
                id: 'programs',
                title: '프로그램 관리',
                type: 'collapse',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                children: [
                    {
                        id: 'program_list',
                        title: '프로그램 리스트',
                        type: 'item',
                        url: '/pgm/list',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        parents_menu_id: 'xxx'
                    },
                    {
                        id: 'program_reg',
                        title: '프로그램 등록',
                        type: 'item',
                        url: '/pgm/reg',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        parents_menu_id: 'xxx'
                    }
                ]
            },
            {
                id: 'authmng',
                title: '권한 관리',
                type: 'collapse',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                children: [
                    {
                        id: 'authmng_list',
                        title: '권한 리스트',
                        type: 'item',
                        url: '/authmng/list',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        parents_menu_id: 'xxx'
                    },
                    {
                        id: 'authmng_reg',
                        title: '권한 맵핑 등록',
                        type: 'item',
                        url: '/authmng/reg',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        parents_menu_id: 'xxx'
                    }
                ]
            }
        ]
    }
    //,
    // {
    //     id: 'sample',
    //     title: 'Bityumbsystems Sample',
    //     type: 'group',
    //     parents_menu_id: '',
    //     children: [
    //         {
    //             id: 'TableList1',
    //             title: 'Table Grid Sample',
    //             type: 'item',
    //             url: '/table-page',
    //             auth: true,
    //             icon: icons.ChromeOutlined,
    //             breadcrumbs: true,
    //             parents_menu_id: 'xxx'
    //         },
    //         {
    //             id: 'TableList2',
    //             title: 'Sub Menu Test',
    //             type: 'collapse',
    //             auth: true,
    //             icon: icons.ChromeOutlined,
    //             breadcrumbs: true,
    //             parents_menu_id: 'xxx',
    //             children: [
    //                 {
    //                     id: 'url_test',
    //                     title: 'Sample API Call(TreeView)',
    //                     type: 'item',
    //                     url: '/url-page',
    //                     auth: true,
    //                     icon: icons.ChromeOutlined,
    //                     parents_menu_id: 'xxx'
    //                 },
    //                 {
    //                     id: 'board_write',
    //                     title: 'Editor Sample',
    //                     type: 'item',
    //                     url: '/editor-page',
    //                     auth: true,
    //                     icon: icons.ChromeOutlined,
    //                     parents_menu_id: 'xxx'
    //                 }
    //             ]
    //         }
    //     ]
    // },
    // {
    //     id: 'support',
    //     title: 'Support',
    //     type: 'group',
    //     parents_menu_id: '',
    //     children: [
    //         {
    //             id: 'sample-page',
    //             title: 'Sample Page',
    //             type: 'item',
    //             url: '/sample-page',
    //             auth: true,
    //             icon: icons.ChromeOutlined,
    //             parents_menu_id: 'xxx'
    //         },
    //         {
    //             id: 'documentation',
    //             title: 'Documentation',
    //             type: 'item',
    //             url: 'https://codedthemes.gitbook.io/mantis-react/',
    //             icon: icons.QuestionOutlined,
    //             external: true,
    //             target: true,
    //             parents_menu_id: 'xxx'
    //         }
    //     ]
    // },
    // {
    //     id: 'utilities',
    //     title: 'Utilities',
    //     type: 'group',
    //     parents_menu_id: '',
    //     children: [
    //         {
    //             id: 'util-typography',
    //             title: 'Typography',
    //             type: 'item',
    //             url: '/typography',
    //             icon: icons.FontSizeOutlined,
    //             parents_menu_id: 'xxx'
    //         },
    //         {
    //             id: 'util-color',
    //             title: 'Color',
    //             type: 'item',
    //             url: '/color',
    //             icon: icons.BgColorsOutlined,
    //             parents_menu_id: 'xxx'
    //         },
    //         {
    //             id: 'util-shadow',
    //             title: 'Shadow',
    //             type: 'item',
    //             url: '/shadow',
    //             icon: icons.BarcodeOutlined,
    //             parents_menu_id: 'xxx'
    //         },
    //         {
    //             id: 'ant-icons',
    //             title: 'Ant Icons',
    //             type: 'item',
    //             url: '/icons/ant',
    //             icon: icons.AntDesignOutlined,
    //             breadcrumbs: false,
    //             parents_menu_id: 'xxx'
    //         }
    //     ]
    // },
    // {
    //     id: 'crud',
    //     title: 'CRUD Sample',
    //     type: 'group',
    //     parents_menu_id: '',
    //     children: [
    //         {
    //             id: 'crud-list',
    //             title: 'List',
    //             type: 'item',
    //             url: '/crud/list',
    //             icon: icons.LoginOutlined,
    //             target: true,
    //             parents_menu_id: 'xxx'
    //         },
    //         {
    //             id: 'crud-write',
    //             title: 'Write',
    //             type: 'item',
    //             url: '/crud/write',
    //             icon: icons.ProfileOutlined,
    //             target: true,
    //             parents_menu_id: 'xxx'
    //         },
    //         {
    //             id: 'crypto-sample',
    //             title: 'Cripto sample',
    //             type: 'item',
    //             url: '/crud/crypto',
    //             icon: icons.ProfileOutlined,
    //             target: true,
    //             parents_menu_id: 'xxx'
    //         }
    //     ]
    // }
];

export function findmenus({ email, password }) {
    const menulist = menus; // .find((user) => user.email === email && user.password === password);

    if (menulist === undefined) throw new Error();

    const menuItems = {
        items: menulist // [pages] // [dashboard, pages, utilities, support]
    };

    return menuItems;
}

export const findlist = async (site_id) => {
    //`/site/${site_id}/menu-list?isUse=${is_use}`,
    const response = await Apis.get(`/site/${site_id}/menu-list?isUse=true`);

    console.log(response.data);

    return response.data.data;
};
