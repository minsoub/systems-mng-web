db.menu_program_specification.insertMany([
{
    path: '/lrc/dashboard',
    element: '<LrcDashboard />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/dashboard/status-code'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/dashboard/line-code'
      }
    ]
},
// 사이트 운영
{
    path: '/projects/list',
    element: '<ProjectsPage />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/service/chat/file/{key}'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/mng/lrc/service/chat/file'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/mng/lrc/service/chat'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/service/chat/files/{project_id}'
      },
      {
        action_method : 'DELETE',
        action_url : '/api/v1/mng/lrc/service/chat/{id}'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/service/chat/excel/export?id={project_id}'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/service/chat/files/{project_id}/{fileKey}'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/statusmanagment/line-code'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/mng/lrc/statusmanagment/line-code'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/mng/lrc/statusmanagment/line-code/{id}'
      },
      {
        action_method : 'DELETE',
        action_url : '/api/v1/mng/lrc/statusmanagment/line-code/{id}'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/mng/lrc/statusmanagment/status-code'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/statusmanagment/status-code/tree'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/mng/lrc/statusmanagment/status-code'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/review-estimate/{data}'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/review-estimate/upload/s3'
      },
      {
        action_method : 'DELETE',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/review-estimate/{projectId}/{id}'
      },
      {
        action_method : 'DELETE',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/marketing-quantity/{projectId}/{id}'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/marketing-quantity/{projectId}'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/marketing-quantity/{data}'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/ico-info/{projectId}'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/ico-info/{data}'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/create-user-account/{data}'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/user-account/{data}'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/project-info/{project_id}'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/project-info/{data}'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/foundation-info/{id}'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/foundation-info/{data}'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/submitted-document/file'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/foundation/excel/download'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/foundation/search'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/files/download/s3/common/{key}'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/project-link/foundation'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/project-link'
      },
      {
        action_method : 'DELETE',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/project-link/{id}'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/project-link/link/{projectId}'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/submitted-document/file'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/submitted-document/url'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/lrcmanagment/mail/send'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/user-account'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/user-account/{projectId}'
      },
      {
        action_method : 'DELETE',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/user-account/{projectId}/{id}'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/user-accounts/{projectId}'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/submitted-document/file'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/submitted-document/url'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/submitted-document/url'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/submitted-document/file'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/files/download/s3/{key}'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/lrcmanagment/project/history'
      }
    ]
},
{
    path: '/faq/list',
    element: '<FaqContentsPage />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/faq/category'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/faq/content'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/faq/content/{id}'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/mng/lrc/faq/content'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/mng/lrc/faq/content/{id}'
      },
      {
        action_method : 'DELETE',
        action_url : '/api/v1/mng/lrc/faq/content/{id}'
      }
    ]
},
{
    path: '/faq/categorylist',
    element: '<FaqCategoryPage />',
    programs: [
      {
        action_method : 'POST',
        action_url : '/api/v1/mng/lrc/faq/category'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/faq/category'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/mng/lrc/faq/category/{id}'
      },
      {
        action_method : 'DELETE',
        action_url : '/api/v1/mng/lrc/faq/category/{id}'
      }
    ]
},
{
    path: '/status/list',
    element: '<StatusRegForm />',
    programs: [
      {
        action_method : 'POST',
        action_url : '/api/v1/mng/lrc/statusmanagment/status-code'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/statusmanagment/status-code/tree'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/mng/lrc/statusmanagment/status-code'
      }
    ]
},
{
    path: '/line/list',
    element: '<LineMngPage />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/statusmanagment/line-code'
      },
      {
        action_method : 'POST',
        action_url : '/api/v1/mng/lrc/statusmanagment/line-code'
      },
      {
        action_method : 'PUT',
        action_url : '/api/v1/mng/lrc/statusmanagment/line-code/{id}'
      },
      {
        action_method : 'DELETE',
        action_url : '/api/v1/mng/lrc/statusmanagment/line-code/{id}'
      }
    ]
},
{
    path: '/service/list',
    element: '<ServiceLog />',
    programs: [
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/service/logs'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/service/logs/{no}'
      },
      {
        action_method : 'GET',
        action_url : '/api/v1/mng/lrc/service/logs/excel/export'
      }
    ]
}
]);