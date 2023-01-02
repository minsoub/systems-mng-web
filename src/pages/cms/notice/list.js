/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import HeaderTitle from 'components/HeaderTitle';
import RadioBoxDataGrid from 'components/DataGrid/RadioBoxDataGrid';
import TableHeader from 'components/Table/TableHeader';
import NoticeSearchForm from './search/NoticeSearchForm';
import ContentLine from 'components/Common/ContentLine';
import ErrorScreen from 'components/ErrorScreen';
import styles from './styles.module.scss';
import BoardApi from 'apis/cms/boardapi';
import { getDateFormat } from 'utils/CommonUtils';

const NoticeList = () => {
    // 데이터 그리드 컬럼
    const columns = [
        {
            field: 'id',
            headerName: 'No.',
            flex: 1,
            headerAlign: 'center',
            maxWidth: 80,
            align: 'center',
            valueGetter: (value) => {
                // console.log('-------------------------row의 다른값 체크후 변환 처리', value.row);
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
            maxWidth: 100
        }
    ];
    const [responseData, requestError, loading, { searchBoardList, changeBannerState }] = BoardApi();
    const [dataGridRows, setDataGridRows] = useState([]); // 그리드 목록 데이터
    const [dataTotal, setDataTotal] = useState(0); //데이터 전체 숫자
    const [selectedValue, setSelectedValue] = useState(''); // 선택라인
    const [listRelooad, setListRelooad] = useState(false); // 리스트 갱신
    const navigate = useNavigate();
    ////////////////////////////////////////////////////
    // 공통 에러 처리
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const parentErrorClear = () => {
        setOpen(false);
        setErrorTitle('');
        setErrorMessage('');
    };
    ////////////////////////////////////////////////////
    // 페이징 변경 이벤트
    const handlePage = (page) => {};
    //체크박스 선택된 row id 저장
    const handleSelectionChange = (item) => {
        setSelectedValue(item);
    };
    // 목록 조회
    const listLoad = (request) => {
        setListRelooad(false);
        searchBoardList('notices', request);
    };
    // 그리드 클릭
    const handleClick = (e) => {
        const { field } = e;
        if (field === '__check__') return;
        navigate(`/cms/notice/reg/${e.id}`);
    };
    //배너 상태 변경
    const bannerStateChange = (state) => {
        const _selNum = dataGridRows.findIndex((row) => row.id === selectedValue);
        // eslint-disable-next-line security/detect-object-injection
        const _isBanner = dataGridRows[_selNum].is_banner;
        if (_isBanner === state) {
            if (state) alert('현재 사용 상태입니다.');
            if (!state) alert('현재 비사용 상태입니다.');
        } else {
            changeBannerState(selectedValue, state);
        }
    };
    // 연동 결과
    useEffect(() => {
        if (!responseData) {
            return;
        }
        console.log('list --- responseData.transactionId', responseData.transactionId);
        switch (responseData.transactionId) {
            case 'getBoards':
                if (responseData.data.data) {
                    console.log(responseData.data.data);
                    setDataTotal(Number(responseData.data.data.total_counts));
                    setDataGridRows(responseData.data.data.contents);
                } else {
                    setDataGridRows([]);
                }
                break;
            case 'changeBannerState':
                setDataGridRows([]);
                if (responseData.data.data) {
                    alert('상태가 변경되었습니다.');
                    setListRelooad(true);
                    //searchClick();
                }
                break;
            default:
                return;
        }
    }, [responseData]);

    return (
        <Grid container rowSpacing={4} columnSpacing={2.75} className={styles.notceList}>
            <Grid item xs={12}>
                <HeaderTitle titleNm="공지사항 관리" menuStep01="사이트 운영" menuStep02="공지사항 관리" />
                <NoticeSearchForm listLoad={listLoad} listRelooad={listRelooad} />
                <TableHeader type="notice" dataTotal={dataTotal} bannerStateChange={bannerStateChange} />
                <ContentLine>
                    <RadioBoxDataGrid
                        columns={columns}
                        rows={dataGridRows}
                        pageSize={10}
                        height={660}
                        handlePageChange={handlePage}
                        handleGridClick={handleClick}
                        selectionChange={handleSelectionChange}
                    />
                </ContentLine>
            </Grid>
            {errorMessage && (
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
            )}
        </Grid>
    );
};

export default NoticeList;
