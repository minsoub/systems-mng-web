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
        children: [
            {
                id: 'dashboard',
                title: 'Dashboard',
                type: 'item',
                url: '/dashboard/default',
                auth: true, // 로그인 했을 때만 사용가능 메뉴
                icon: icons.DashboardOutlined,
                breadcrumbs: false
            }
        ]
    },
    {
        id: 'authentication',
        title: 'Authentication',
        type: 'group',
        children: [
            {
                id: 'login1',
                title: 'Login',
                type: 'item',
                url: '/login',
                icon: icons.LoginOutlined,
                target: true
            },
            {
                id: 'register1',
                title: 'Register',
                type: 'item',
                url: '/register',
                icon: icons.ProfileOutlined,
                target: true
            }
        ]
    },
    {
        id: 'sample',
        title: 'Bityumbsystems Sample',
        type: 'group',
        children: [
            {
                id: 'TableList1',
                title: 'Table Grid Sample',
                type: 'item',
                url: '/table-page',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true
            },
            {
                id: 'TableList2',
                title: 'Sub Menu Test',
                type: 'collapse',
                auth: true,
                icon: icons.ChromeOutlined,
                breadcrumbs: true,
                children: [
                    {
                        id: 'url_test',
                        title: 'Sample API Call(TreeView)',
                        type: 'item',
                        url: '/url-page',
                        auth: true,
                        icon: icons.ChromeOutlined
                    },
                    {
                        id: 'board_write',
                        title: 'Editor Sample',
                        type: 'item',
                        url: '/editor-page',
                        auth: true,
                        icon: icons.ChromeOutlined
                    }
                ]
            }
        ]
    },
    {
        id: 'support',
        title: 'Support',
        type: 'group',
        children: [
            {
                id: 'sample-page',
                title: 'Sample Page',
                type: 'item',
                url: '/sample-page',
                auth: true,
                icon: icons.ChromeOutlined
            },
            {
                id: 'documentation',
                title: 'Documentation',
                type: 'item',
                url: 'https://codedthemes.gitbook.io/mantis-react/',
                icon: icons.QuestionOutlined,
                external: true,
                target: true
            }
        ]
    },
    {
        id: 'utilities',
        title: 'Utilities',
        type: 'group',
        children: [
            {
                id: 'util-typography',
                title: 'Typography',
                type: 'item',
                url: '/typography',
                icon: icons.FontSizeOutlined
            },
            {
                id: 'util-color',
                title: 'Color',
                type: 'item',
                url: '/color',
                icon: icons.BgColorsOutlined
            },
            {
                id: 'util-shadow',
                title: 'Shadow',
                type: 'item',
                url: '/shadow',
                icon: icons.BarcodeOutlined
            },
            {
                id: 'ant-icons',
                title: 'Ant Icons',
                type: 'item',
                url: '/icons/ant',
                icon: icons.AntDesignOutlined,
                breadcrumbs: false
            }
        ]
    },
    {
        id: 'crud',
        title: 'CRUD Sample',
        type: 'group',
        children: [
            {
                id: 'crud-list',
                title: 'List',
                type: 'item',
                url: '/crud/list',
                icon: icons.LoginOutlined,
                target: true
            },
            {
                id: 'crud-write',
                title: 'Write',
                type: 'item',
                url: '/crud/write',
                icon: icons.ProfileOutlined,
                target: true
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
