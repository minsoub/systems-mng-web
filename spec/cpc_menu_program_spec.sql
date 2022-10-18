db.menu_program_specification.insertMany([
// 고객보호센터 - 대시보드
{
    path: '/cpc/dashboard',
    element: '<CpcDashboard />'
},
// 고객보호센터 - 메인 관리
{
    path: '/cpc/main/contents/list',
    element: '<CpcMainContentsMng />',
    programs: [{
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/main'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/main/{boardMasterId}'
    },
    {
      action_method : 'POST',
      action_url : '/api/v1/mng/cpc/main'
    },
    ]
},
// 고객보호센터 - 컨텐츠 관리
{
    path: '/cpc/contents/damage-case/list',
    element: '<CpcDamageCaseMng />',
    programs: [
    {
      action_method : 'DELETE',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/{boardId}'
    },{
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}'
    },
    {
      action_method : 'PUT',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/{boardId}'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/board-types'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/pagination-types'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/{boardId}'
    },
    {
      action_method : 'DELETE',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/bulk-delete'
    },
    {
      action_method : 'POST',
      action_url : '/api/v1/mng/cpc/board/upload'
    },
    {
      action_method : 'POST',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}'
    },
    ]
},
{
    path: '/cpc/contents/campaign/list',
    element: '<CpcCampaignMng />',
    programs: [
    {
      action_method : 'DELETE',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/{boardId}'
    },{
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}'
    },
    {
      action_method : 'PUT',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/{boardId}'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/board-types'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/pagination-types'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/{boardId}'
    },
    {
      action_method : 'DELETE',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/bulk-delete'
    },
    {
      action_method : 'POST',
      action_url : '/api/v1/mng/cpc/board/upload'
    },
    {
      action_method : 'POST',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}'
    },
    ]
},
{
    path: '/cpc/contents/digital-asset-basic/list',
    element: '<CpcDigitalAssetBasicMng />',
    programs: [
    {
      action_method : 'DELETE',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/{boardId}'
    },{
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}'
    },
    {
      action_method : 'PUT',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/{boardId}'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/board-types'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/pagination-types'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/{boardId}'
    },
    {
      action_method : 'DELETE',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/bulk-delete'
    },
    {
      action_method : 'POST',
      action_url : '/api/v1/mng/cpc/board/upload'
    },
    {
      action_method : 'POST',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}'
    },
    ]
},
{
    path: '/cpc/contents/insight-column/list',
    element: '<CpcInsightColumnMng />',
    programs: [
    {
      action_method : 'DELETE',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/{boardId}'
    },{
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}'
    },
    {
      action_method : 'PUT',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/{boardId}'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/board-types'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/pagination-types'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/{boardId}'
    },
    {
      action_method : 'DELETE',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/bulk-delete'
    },
    {
      action_method : 'POST',
      action_url : '/api/v1/mng/cpc/board/upload'
    },
    {
      action_method : 'POST',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}'
    },
    ]
},
{
    path: '/cpc/contents/digital-asset-trend/list',
    element: '<CpcDigitalAssetTrendMng />',
    programs: [
    {
      action_method : 'DELETE',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/{boardId}'
    },{
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}'
    },
    {
      action_method : 'PUT',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/{boardId}'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/board-types'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/pagination-types'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/{boardId}'
    },
    {
      action_method : 'DELETE',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/bulk-delete'
    },
    {
      action_method : 'POST',
      action_url : '/api/v1/mng/cpc/board/upload'
    },
    {
      action_method : 'POST',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}'
    },
    ]
},
{
    path: '/cpc/contents/notice/list',
    element: '<CpcNoticeMng />',
    programs: [
    {
      action_method : 'DELETE',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/{boardId}'
    },{
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}'
    },
    {
      action_method : 'PUT',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/{boardId}'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/board-types'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/pagination-types'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/{boardId}'
    },
    {
      action_method : 'DELETE',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/bulk-delete'
    },
    {
      action_method : 'POST',
      action_url : '/api/v1/mng/cpc/board/upload'
    },
    {
      action_method : 'POST',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}'
    },
    ]
},
// 보도자료 리스트
{
    path: '/cpc/contents/press-release/list',
    element: '<CpcPressReleaseMng />',
    programs: [
    {
      action_method : 'DELETE',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/{boardId}'
    },{
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}'
    },
    {
      action_method : 'PUT',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/{boardId}'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/board-types'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/pagination-types'
    },
    {
      action_method : 'GET',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/{boardId}'
    },
    {
      action_method : 'DELETE',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}/bulk-delete'
    },
    {
      action_method : 'POST',
      action_url : '/api/v1/mng/cpc/board/upload'
    },
    {
      action_method : 'POST',
      action_url : '/api/v1/mng/cpc/board/{boardMasterId}'
    },
    ]
}
]);