//utils
import { getDateFormat } from 'utils/CommonUtils';

// 데이터 그리드 컬럼 이벤트관리, 가상자산검토보고서관리, 투자유의지정안내관리, 빗썸경제연구소관리
// export const columns = [
//     {
//         field: 'id',
//         headerName: 'No.',
//         flex: 1,
//         headerAlign: 'center',
//         maxWidth: 80,
//         align: 'center'
//     },
//     {
//         field: 'title',
//         headerName: '제목',
//         flex: 1,
//         headerAlign: 'center',
//         align: 'left'
//     },
//     {
//         field: 'is_show',
//         headerName: '상태',
//         flex: 1,
//         headerAlign: 'center',
//         align: 'center',
//         maxWidth: 80,
//         valueGetter: ({ value }) => {
//             if (value) {
//                 return '사용';
//             } else {
//                 return '미사용';
//             }
//         }
//     },
//     {
//         field: 'create_date',
//         headerName: '등록일시',
//         flex: 1,
//         headerAlign: 'center',
//         align: 'center',
//         maxWidth: 200,
//         valueGetter: ({ value }) => `${getDateFormat(value)}`
//     },
//     {
//         field: 'update_date',
//         headerName: '업데이트일시',
//         flex: 1,
//         headerAlign: 'center',
//         align: 'center',
//         maxWidth: 200,
//         valueGetter: ({ value }) => {
//             return value ? `${getDateFormat(value)}` : '-';
//         }
//     },
//     {
//         field: 'create_account_email',
//         headerName: '작성자',
//         flex: 1,
//         headerAlign: 'center',
//         align: 'center',
//         maxWidth: 200
//     },
//     {
//         field: 'read_count',
//         headerName: '조회수',
//         flex: 1,
//         headerAlign: 'center',
//         align: 'center',
//         maxWidth: 100,
//         valueGetter: ({ value }) => {
//             return value ? `${(value).toLocaleString('ko-KR')}` : '-';
//         }
//     }
// ];

export const getColumsData = (type, dataArray) => {
    switch (type) {
        case 'category':
            return [
                {
                    field: 'id',
                    headerName: 'No.',
                    flex: 1,
                    headerAlign: 'center',
                    align: 'center',
                    maxWidth: 70,
                    valueGetter: ({ value }) => {
                        if (dataArray.length) {
                            return dataArray.findIndex((row) => row.id === value) + 1;
                        }
                        return 0;
                    }
                },
                {
                    field: 'name',
                    headerName: '카테고리명',
                    flex: 1,
                    headerAlign: 'center',
                    align: 'left'
                },
                {
                    field: 'is_use',
                    headerName: '상태',
                    flex: 1,
                    headerAlign: 'center',
                    align: 'center',
                    maxWidth: 80,
                    valueGetter: ({ value }) => {
                        if (value) {
                            return '공개';
                        } else {
                            return '비공개';
                        }
                    }
                },
                {
                    field: 'create_date',
                    headerName: '등록일시',
                    flex: 1,
                    headerAlign: 'center',
                    align: 'center',
                    maxWidth: 150
                },
                {
                    field: 'create_account_email',
                    headerName: '등록담당자',
                    flex: 1,
                    headerAlign: 'center',
                    align: 'center',
                    maxWidth: 200
                },
                {
                    field: 'update_date',
                    headerName: '업데이트일시',
                    flex: 1,
                    headerAlign: 'center',
                    align: 'center',
                    maxWidth: 150,
                    valueGetter: ({ value }) => {
                        return value ? `${value}` : '-';
                    }
                },
                {
                    field: 'update_account_email',
                    headerName: '업데이트 담당자',
                    flex: 1,
                    headerAlign: 'center',
                    align: 'center',
                    maxWidth: 200,
                    valueGetter: ({ value }) => {
                        return value ? value : '-';
                    }
                }
            ];
            break;
        case 'notices':
            return [
                {
                    field: 'id',
                    headerName: 'No.',
                    flex: 1,
                    headerAlign: 'center',
                    maxWidth: 80,
                    align: 'center',
                    valueGetter: (value) => {
                        const { is_draft } = value.row;
                        let setValue = '고정';
                        if (is_draft) {
                            return '-';
                        }
                        if (value.row.is_fix_top !== true) {
                            setValue = dataArray.length - dataArray.findIndex((row) => row.id === value.id);
                        }
                        return setValue;
                    }
                },
                {
                    field: 'title',
                    headerName: '제목',
                    flex: 1,
                    headerAlign: 'center',
                    align: 'left',
                    valueGetter: (value) => {
                        const { is_draft } = value.row;
                        const draftText = is_draft ? ' (초안)' : '';
                        return value.value + draftText;
                    }
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
                            return '공개';
                        } else {
                            return '비공개';
                        }
                    }
                },
                {
                    field: 'create_date',
                    headerName: '등록일시',
                    flex: 1,
                    headerAlign: 'center',
                    align: 'center',
                    maxWidth: 150
                },
                {
                    field: 'update_date',
                    headerName: '업데이트일시',
                    flex: 1,
                    headerAlign: 'center',
                    align: 'center',
                    maxWidth: 150,
                    valueGetter: ({ value }) => {
                        return value ? `${value}` : '-';
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
        case 'events':
        case 'review-reports':
        case 'press-releases':
        case 'investment-warnings':
        case 'economic-researches':
            return [
                {
                    field: 'id',
                    headerName: 'No.',
                    flex: 1,
                    headerAlign: 'center',
                    maxWidth: 80,
                    align: 'center',
                    valueGetter: (value) => {
                        const { is_draft } = value.row;
                        if (is_draft) {
                            return '-';
                        }
                        return dataArray.length - dataArray.findIndex((row) => row.id === value.id);
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
                    field: 'is_show',
                    headerName: '상태',
                    flex: 1,
                    headerAlign: 'center',
                    align: 'center',
                    maxWidth: 80,
                    valueGetter: ({ value }) => {
                        if (value) {
                            return '공개';
                        } else {
                            return '비공개';
                        }
                    }
                },
                {
                    field: 'create_date',
                    headerName: '등록일시',
                    flex: 1,
                    headerAlign: 'center',
                    align: 'center',
                    maxWidth: 200
                },
                {
                    field: 'update_date',
                    headerName: '업데이트일시',
                    flex: 1,
                    headerAlign: 'center',
                    align: 'center',
                    maxWidth: 200,
                    valueGetter: ({ value }) => {
                        return value ? `${value}` : '-';
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
        default:
            break;
    }
    return '';
};
