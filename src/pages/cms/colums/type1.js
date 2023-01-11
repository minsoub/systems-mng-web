//utils
import { getDateFormat } from 'utils/CommonUtils';

// 데이터 그리드 컬럼 이벤트관리, 가상자산검토보고서관리, 투자유의지정안내관리, 빗썸경제연구소관리
export const columns = [
    {
        field: 'id',
        headerName: 'No.',
        flex: 1,
        headerAlign: 'center',
        maxWidth: 80,
        align: 'center'
    },
    {
        field: 'title',
        headerName: '제목',
        flex: 1,
        headerAlign: 'center',
        align: 'left'
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
        maxWidth: 200,
        valueGetter: ({ value }) => `${getDateFormat(value)}`
    },
    {
        field: 'update_date',
        headerName: '업데이트일시',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        maxWidth: 200,
        valueGetter: ({ value }) => {
            return value ? `${getDateFormat(value)}` : '-';
        }
    },
    {
        field: 'create_account_email',
        headerName: '작성자',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        maxWidth: 200
    },
    {
        field: 'read_count',
        headerName: '조회수',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        maxWidth: 100,
        valueGetter: ({ value }) => {
            return value ? `${(value).toLocaleString('ko-KR')}` : '-';
        }
    }
];
