db.menu_program_specification.insertMany([
{
    path: '/access/list',
    element: '<AccessMngPage />',
    programs: [
    {
      action_method : 'GET',
      action_url : '/api/v1/accountmng'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/roles'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/sites'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/accountmng/{id}'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/access'
    },
    {
      action_method : 'PUT',
      action_url : '/api/v1/mng/access'
    },
    {
      action_method : 'POST',
      action_url : '/api/v1/account'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/account/{adminAccountId}/roles'
    },
    {
      action_method : 'PUT',
      action_url : '/api/v1/account/{adminAccountId}/roles'
    }
    ]
},
{
    path: '/siteroles/list',
    element: '<SiteRoleManagementPage />',
    programs: [
    {
      action_method : 'GET',
      action_url : '/api/v1/roles'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/sites'
    }
    ]
},
{
    path: '/siteroles/reg',
    element: '<SiteRoleRegForm />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/sites'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/role/{id}/accounts'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/role/{id}'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/role'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/role/{id}'
      }
    ]
},
{
    path: '/siteroles/mapping',
    element: '<SiteRoleMappingForm />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/roles'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/sites'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/accounts/user'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/role/{id}/accounts'
      },
      {
        action_method : 'DELETE',
        action_url : '/api/v1/role/{role_id}/accounts/{user_id}'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/role/{id}/accounts'
      }
    ]
},
{
    path: '/sitemenu/list',
    element: '<SiteMenuRegForm />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/site/{site_id}/menu-list'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/site/{site_id}/menu/{id}'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/site/{site_id}/menu'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/site/{site_id}/menu/{id}'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/site/{id}/menu'
      }
    ]
},
{
    path: '/sitemenus/mapping',
    element: '<SiteMenuMappingForm />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/sites'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/site/{site_id}/programs'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/site/{site_id}/menu-list'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/site/{site_id}/menu/{menu_id}/programs'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/site/{site_id}/menu/{menu_id}/programs'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/site/{site_id}/menu/{menu_id}/programs'
      }
    ]
},
{
    path: '/siteauth/list',
    element: '<SiteAuthManagementPage />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/sites'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/roles'
      }
    ]
},
{
    path: '/siteauth/reg',
    element: '<SiteAuthMngRegForm />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/sites'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/site/{site_id}/menu/{menu_id}/programs'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/site/{site_id}/menu/{menu_id}/programs'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/roles'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/role/{id}/accounts'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/role/{role_id}/sites/{site_id}'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/role/{role_id}/resources'
      }
    ]
},
{
    path: '/sitelog/list',
    element: '<SiteLogPage />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/audit/logs'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/audit/logs/excel/export'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/audit/logs/{no}'
      }
    ]
},
{
    path: '/accountmng/list',
    element: '<AccountMng />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/accountmng'
      },
      {
        action_method : 'DELETE',
        action_url : '/api/v1/accountmng'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/accounts'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/accountmng'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/accountmng/{id}'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/accountmng/{id}'
      },
      {
        action_method : 'DELETE',
        action_url : '/api/v1/account/{idsList}'
      }
    ]
},
{
    path: '/site/list',
    element: '<SiteManagementPage />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/sites'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/site'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/site/{id}'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/site/{id}'
      }
    ]
},
{
    path: '/account/list',
    element: '<AccountManagementPage />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/sites'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/roles'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/accountmng'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/accountmng/{id}'
      },
      {
        action_method : 'DELETE',
        action_url : '/api/v1/accountmng/{id}'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/accounts'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/account/{id}'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/account'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/account/{id}/roles'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/account/{id}/role'
      }
    ]
},
{
    path: '/roles/list',
    element: '<RoleManagementPage />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/sites'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/roles'
      }
    ]
},
{
    path: '/roles/reg',
    element: '<RoleRegForm />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/sites'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/role/{id}'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/role'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/role/{id}'
      }
    ]
},
{
    path: '/roles/mapping',
    element: '<RoleMappingForm />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/sites'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/accounts/user'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/roles'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/role/{id}/accounts'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/role/{id}/accounts'
      },
      {
        action_method : 'DELETE',
        action_url : '/api/v1/role/{role_id}/accounts/{user_id}'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/role/{id}/accounts'
      }
    ]
},
{
    path: '/menus/reg',
    element: '<MenuRegForm />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/sites'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/site/{site_id}/menu-list'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/site/{site_id}/menu/{id}'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/site/{site_id}/menu'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/site/{site_id}/menu/{id}'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/site/{id}/menu'
      }
    ]
},
{
    path: '/menus/mapping',
    element: '<MenuMappingForm />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/sites'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/site/{site_id}/programs'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/site/{site_id}/menu-list'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/site/{site_id}/menu/{menu_id}/programs'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/site/{site_id}/menu/{menu_id}/programs'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/site/{site_id}/menu/{menu_id}/programs'
      }
    ]
},
{
    path: '/pgm/list',
    element: '<ProgramManagementPage />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/sites'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/site/{site_id}/programs'
      }
    ]
},
{
    path: '/pgm/reg',
    element: '<ProgramRegForm />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/sites'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/site/{site_id}/program/{id}'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/site/{site_id}/program/{id}'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/site/{site_id}/program'
      }
    ]
},
{
    path: '/authmng/list',
    element: '<AuthManagementPage />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/sites'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/roles'
      }
    ]
},
{
    path: '/authmng/reg',
    element: '<AuthMngRegForm />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/sites'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/site/{site_id}/menu/{menu_id}/programs'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/site/{site_id}/menu/{menu_id}/programs'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/roles'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/role/{id}/accounts'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/role/{role_id}/sites/{site_id}'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/role/{role_id}/resources'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/auth/mapping/init'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/auth/mapping/init'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/menu/mapping'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/menu/mapping/init'
      }
    ]
},
{
    path: '/board/list',
    element: '<BoardMng />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/sites'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/board/board-types'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/board/pagination-types'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/board/auth-types'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/board'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/board/{id}'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/board'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/board/{id}'
      },
      {
        action_method : 'DELETE',
        action_url : '/api/v1/board/{id}'
      }
    ]
},
{
    path: '/filemng/list',
    element: '<FileManagementPage />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/sites'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/files'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/site/{site_id}/file/{id}'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/site/{site_id}/file'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/site/{site_id}/file'
      }
    ]
}
]);