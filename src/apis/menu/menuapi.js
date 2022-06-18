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
    {
        id: 'group-dashboard',
        title: 'Navigation',
        type: 'group',
        parents_menu_id: '',
        children: [
            {
                id: 'dashboard',
                title: 'Dashboard',
                type: 'item',
                url: '/dashboard/default',
                auth: true, // 로그인 했을 때만 사용가능 메뉴
                icon: icons.DashboardOutlined,
                breadcrumbs: false,
                parents_menu_id: 'xxx'
            }
        ]
    },
    {
        id: 'authentication',
        title: 'Authentication',
        type: 'group',
        parents_menu_id: '',
        children: [
            {
                id: 'login1',
                title: 'Login',
                type: 'item',
                url: '/login',
                icon: icons.LoginOutlined,
                target: true,
                parents_menu_id: 'xxx'
            },
            {
                id: 'register1',
                title: 'Register',
                type: 'item',
                url: '/register',
                icon: icons.ProfileOutlined,
                target: true,
                parents_menu_id: 'xxx'
            }
        ]
    },
    {
        id: 'sitemanagement',
        title: '사이트관리',
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
                type: 'item',
                url: '/sitemenu/list',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                parents_menu_id: 'xxx'
            },
            {
                id: 'siteauth',
                title: '권한 관리',
                type: 'item',
                url: '/siteauth/list',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                parents_menu_id: 'xxx'
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
    },
    {
        id: 'sample',
        title: 'Bityumbsystems Sample',
        type: 'group',
        parents_menu_id: '',
        children: [
            {
                id: 'TableList1',
                title: 'Table Grid Sample',
                type: 'item',
                url: '/table-page',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                parents_menu_id: 'xxx'
            },
            {
                id: 'TableList2',
                title: 'Sub Menu Test',
                type: 'collapse',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                parents_menu_id: 'xxx',
                children: [
                    {
                        id: 'url_test',
                        title: 'Sample API Call(TreeView)',
                        type: 'item',
                        url: '/url-page',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        parents_menu_id: 'xxx'
                    },
                    {
                        id: 'board_write',
                        title: 'Editor Sample',
                        type: 'item',
                        url: '/editor-page',
                        auth: true,
                        icon: icons.ChromeOutlined,
                        parents_menu_id: 'xxx'
                    }
                ]
            }
        ]
    },
    {
        id: 'support',
        title: 'Support',
        type: 'group',
        parents_menu_id: '',
        children: [
            {
                id: 'sample-page',
                title: 'Sample Page',
                type: 'item',
                url: '/sample-page',
                auth: true,
                icon: icons.ChromeOutlined,
                parents_menu_id: 'xxx'
            },
            {
                id: 'documentation',
                title: 'Documentation',
                type: 'item',
                url: 'https://codedthemes.gitbook.io/mantis-react/',
                icon: icons.QuestionOutlined,
                external: true,
                target: true,
                parents_menu_id: 'xxx'
            }
        ]
    },
    {
        id: 'utilities',
        title: 'Utilities',
        type: 'group',
        parents_menu_id: '',
        children: [
            {
                id: 'util-typography',
                title: 'Typography',
                type: 'item',
                url: '/typography',
                icon: icons.FontSizeOutlined,
                parents_menu_id: 'xxx'
            },
            {
                id: 'util-color',
                title: 'Color',
                type: 'item',
                url: '/color',
                icon: icons.BgColorsOutlined,
                parents_menu_id: 'xxx'
            },
            {
                id: 'util-shadow',
                title: 'Shadow',
                type: 'item',
                url: '/shadow',
                icon: icons.BarcodeOutlined,
                parents_menu_id: 'xxx'
            },
            {
                id: 'ant-icons',
                title: 'Ant Icons',
                type: 'item',
                url: '/icons/ant',
                icon: icons.AntDesignOutlined,
                breadcrumbs: false,
                parents_menu_id: 'xxx'
            }
        ]
    },
    {
        id: 'crud',
        title: 'CRUD Sample',
        type: 'group',
        parents_menu_id: '',
        children: [
            {
                id: 'crud-list',
                title: 'List',
                type: 'item',
                url: '/crud/list',
                icon: icons.LoginOutlined,
                target: true,
                parents_menu_id: 'xxx'
            },
            {
                id: 'crud-write',
                title: 'Write',
                type: 'item',
                url: '/crud/write',
                icon: icons.ProfileOutlined,
                target: true,
                parents_menu_id: 'xxx'
            },
            {
                id: 'crypto-sample',
                title: 'Cripto sample',
                type: 'item',
                url: '/crud/crypto',
                icon: icons.ProfileOutlined,
                target: true,
                parents_menu_id: 'xxx'
            }
        ]
    }
];

export function findmenus({ email, password }) {
    const menulist = menus; // .find((user) => user.email === email && user.password === password);

    if (menulist === undefined) throw new Error();

    const menuItems = {
        items: menulist // [pages] // [dashboard, pages, utilities, support]
    };

    return menuItems;
}

export const findlist = async () => {
    const response = await Apis.get('/menulist');

    console.log(response.data);

    return response;
};
