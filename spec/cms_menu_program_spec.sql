db.menu_program_specification.insertMany([
    {
        path: '/cms/notice/categorylist',
        element: '<CmsNoticeCategoryContentsMng />',
        programs: [
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/notices/categories'
            },
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/notices/categories/{id}'
            },
            {
              action_method : 'POST',
              action_url : '/api/v1/mng/cms/notices/categories'
            },
            {
              action_method : 'PUT',
              action_url : '/api/v1/mng/cms/notices/categories/{id}'
            },
            {
              action_method : 'DELETE',
              action_url : '/api/v1/mng/cms/notices/categories/{id}'
            },
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/notices/categories/items'
            }
        ]
    },
    {
        path: '/cms/notice/list',
        element: '<CmsNoticeContentsMng />',
        programs: [
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/notices'
            },
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/notices/{id}'
            },
            {
              action_method : 'POST',
              action_url : '/api/v1/mng/cms/notices'
            },
            {
              action_method : 'PUT',
              action_url : '/api/v1/mng/cms/notices/{id}'
            },
            {
              action_method : 'DELETE',
              action_url : '/api/v1/mng/cms/notices/{id}'
            },
            {
              action_method : 'POST',
              action_url : '/api/v1/mng/cms/notices/{id}/banners'
            },
            {
              action_method : 'DELETE',
              action_url : '/api/v1/mng/cms/notices/{id}/banners'
            },
            {
              action_method : 'POST',
              action_url : '/api/v1/mng/cms/files'
            },
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/files/{id}'
            },
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/files/{id}/info'
            }
        ]
    },
    {
        path: '/cms/press-release/list',
        element: '<CmsPressReleaseContentsMng />',
        programs: [
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/press-releases'
            },
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/press-releases/{id}'
            },
            {
              action_method : 'POST',
              action_url : '/api/v1/mng/cms/press-releases'
            },
            {
              action_method : 'PUT',
              action_url : '/api/v1/mng/cms/press-releases/{id}'
            },
            {
              action_method : 'DELETE',
              action_url : '/api/v1/mng/cms/press-releases/{id}'
            },
            {
              action_method : 'POST',
              action_url : '/api/v1/mng/cms/files'
            },
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/files/{id}'
            },
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/files/{id}/info'
            }
        ]
    },
    {
        path: '/cms/event/list',
        element: '<CmsEventContentsMng />',
        programs: [
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/events'
            },
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/events/{id}'
            },
            {
              action_method : 'POST',
              action_url : '/api/v1/mng/cms/events'
            },
            {
              action_method : 'PUT',
              action_url : '/api/v1/mng/cms/events/{id}'
            },
            {
              action_method : 'DELETE',
              action_url : '/api/v1/mng/cms/events/{id}'
            },
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/events/{id}/excel'
            },
            {
              action_method : 'POST',
              action_url : '/api/v1/mng/cms/files'
            },
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/files/{id}'
            },
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/files/{id}/info'
            }
        ]
    },
    {
        path: '/cms/review-report/list',
        element: '<CmsReviewReportContentsMng />',
        programs: [
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/review-reports'
            },
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/review-reports/{id}'
            },
            {
              action_method : 'POST',
              action_url : '/api/v1/mng/cms/review-reports'
            },
            {
              action_method : 'PUT',
              action_url : '/api/v1/mng/cms/review-reports/{id}'
            },
            {
              action_method : 'DELETE',
              action_url : '/api/v1/mng/cms/review-reports/{id}'
            },
            {
              action_method : 'POST',
              action_url : '/api/v1/mng/cms/files'
            },
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/files/{id}'
            },
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/files/{id}/info'
            }
        ]
    },
    {
        path: '/cms/investment-warning/list',
        element: '<CmsInvestmentWarningContentsMng />',
        programs: [
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/investment-warnings'
            },
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/investment-warnings/{id}'
            },
            {
              action_method : 'POST',
              action_url : '/api/v1/mng/cms/investment-warnings'
            },
            {
              action_method : 'PUT',
              action_url : '/api/v1/mng/cms/investment-warnings/{id}'
            },
            {
              action_method : 'DELETE',
              action_url : '/api/v1/mng/cms/investment-warnings/{id}'
            },
            {
              action_method : 'POST',
              action_url : '/api/v1/mng/cms/files'
            },
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/files/{id}'
            },
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/files/{id}/info'
            }
        ]
    },
    {
        path: '/cms/economic-research/list',
        element: '<CmsEconomicResearchContentsMng />',
        programs: [
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/economic-researches'
            },
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/economic-researches/{id}'
            },
            {
              action_method : 'POST',
              action_url : '/api/v1/mng/cms/economic-researches'
            },
            {
              action_method : 'PUT',
              action_url : '/api/v1/mng/cms/economic-researches/{id}'
            },
            {
              action_method : 'DELETE',
              action_url : '/api/v1/mng/cms/economic-researches/{id}'
            },
            {
              action_method : 'POST',
              action_url : '/api/v1/mng/cms/files'
            },
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/files/{id}'
            },
            {
              action_method : 'GET',
              action_url : '/api/v1/mng/cms/files/{id}/info'
            }
        ]
    },
]);
