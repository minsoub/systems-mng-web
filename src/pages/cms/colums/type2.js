import { getDateFormat } from 'utils/CommonUtils';

// 데이터 그리드 컬럼 공지사항관리
export const columns = [
    {
        field: 'id',
        headerName: 'No.',
        flex: 1,
        headerAlign: 'center',
        maxWidth: 80,
        align: 'center',
        valueGetter: (value) => {
            let setValue = '고정';
            if (value.row.is_fix_top !== true) {
                setValue = value.id;
            }
            return setValue;
        }
    },
    {
        field: 'title',
        headerName: '제목',
        flex: 1,
        headerAlign: 'center',
        align: 'left'
    },
    {
        field: 'is_banner',
        headerName: '배너',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        maxWidth: 80,
        valueGetter: ({ value }) => {
            if (value) {
                return '사용';
            } else {
                return '미사용';
            }
        }
    },
    {
        field: 'is_show',
        headerName: '상태',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        maxWidth: 80,
        valueGetter: ({ value }) => {
            if (value) {
                return '사용';
            } else {
                return '미사용';
            }
        }
    },
    {
        field: 'create_date',
        headerName: '등록일시',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        maxWidth: 150,
        valueGetter: ({ value }) => `${getDateFormat(value)}`
    },
    {
        field: 'update_date',
        headerName: '업데이트일시',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        maxWidth: 150,
        valueGetter: ({ value }) => {
            return value ? `${getDateFormat(value)}` : '-';
        }
    },
    {
        field: 'create_account_email',
        headerName: '등록담당자',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        maxWidth: 150
    },
    {
        field: 'read_count',
        headerName: '조회수',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        maxWidth: 100,
        valueGetter: ({ value }) => {
            return value ? `${value.toLocaleString('ko-KR')}` : '-';
        }
    }
];