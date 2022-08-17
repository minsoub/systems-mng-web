import HeaderTitle from '../../../components/HeaderTitle';
import { Button, Grid, Stack, TextField, Typography } from '@mui/material';
import MainCard from '../../../components/Common/MainCard';
import FlexBox from '../../../components/Common/FlexBox';
import DropInput from '../../../components/Common/DropInput';
import React, { useEffect, useState } from 'react';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import ContentLine from '../../../components/Common/ContentLine';
import CheckBoxDataGrid from '../../../components/DataGrid/CheckBoxDataGrid';
import { getDateFormat } from '../../../utils/CommonUtils';
import cx from 'classnames';
import './styles.scss';
import { useNavigate } from 'react-router-dom';
import SearchDate from '../../../components/ContentManage/SearchDate';
import IpMngApi from '../../../apis/sysmng/ipmng';

const IpRegForm = () => {
    const navigate = useNavigate();
    const [responseData, requestError, loading, { getSearchData, getListData, getDeleteData, getDelete }] = IpMngApi();
    const [selectedRows, setSeletedRows] = useState([]);
    const [dataGridRows, setDataGridRows] = useState([]);

    // 사이트명
    const [siteName, setSiteName] = useState('');
    // 이메일주소
    const [email, setEmail] = useState('');
    // 이름
    const [name, setName] = useState('');
    // 운영 권한
    const [is_use, setIsUse] = useState(true);
    // 계정 상태
    const [adminState, setAdminState] = useState('');
    // 유효기간
    const [valid_start_date, setValidStartDate] = useState('');
    const [valid_end_date, setValidEndDate] = useState('');

    const columns = [
        {
            field: 'name',
            headerName: 'No.',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 100
        },
        {
            field: 'email',
            headerName: '접근 IP',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'role_management_name',
            headerName: '유효기간(From)',
            flex: 1,
            headerAlign: 'center',
            align: 'left',
            maxWidth: 230
        },
        {
            field: 'last_login_date',
            headerName: '유효기간(To)',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 230
        },
        {
            field: 'create_date',
            headerName: '등록일자',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 230,
            valueGetter: ({ value }) => `${getDateFormat(value)}`
        }
    ];

    // 체크박스 선택된 row id 저장
    const handleSelectionChange = (item) => {
        console.log(item);
        if (item) {
            setSeletedRows(item);
        }
    };
    // 페이징 변경 이벤트
    const handlePage = (page) => {};

    // 그리드 클릭
    const handleClick = (rowData) => {
        if (rowData && rowData.field && rowData.field !== '__check__') {
            navigate(`/accountmng/reg/${rowData.id}`);
        }
    };

    // program 등록 화면
    const listClick = () => {
        navigate('/ipmng/list');
    };

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    const validDateSplit = (data) => {
        if (data !== null) {
            let d = data.substring(0, 10);
            console.log(d);
            return d;
        } else {
            console.log(data);
            return data;
        }
    };

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'ipRegList':
                if (responseData.data.data) {
                    setDataGridRows(responseData.data.data);
                    setSiteName(responseData.data.data.id);
                    setEmail(responseData.data.data.email);
                    setName(responseData.data.data.name);
                    setIsUse(responseData.data.data.is_use);
                    setAdminState(responseData.data.admin_account_id);
                    setValidStartDate(validDateSplit(responseData.data.data.valid_start_date));
                    setValidEndDate(validDateSplit(responseData.data.data.valid_end_date));
                } else {
                    setDataGridRows([]);
                }
                break;
            case 'deleteData':
                console.log('deleteData');
                if (responseData.data.data && responseData.data.data.count > 0) {
                    alert('삭제를 완료하였습니다');
                    listClick();
                }
                break;
            default:
        }
    }, [responseData]);
    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle titleNm="접근 IP 등록" menuStep01="통합시스템 관리" menuStep02="접근 IP 관리" menuStep03="접근 IP 등록" />

                <ButtonLayout buttonName="btn__blank">
                    <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={listClick}>
                        목록
                    </Button>
                </ButtonLayout>

                <MainCard sx={{ height: 400 }} content={false} className="stateSubmit layout--inner">
                    <div className="bottom--blank">
                        <FlexBox>
                            <DropInput title="사이트명">
                                <TextField
                                    id="filled-hidden-label-small"
                                    type="text"
                                    size="medium"
                                    value={siteName}
                                    name="name"
                                    fullWidth
                                />
                            </DropInput>
                            <DropInput title="이메일주소">
                                <TextField id="filled-hidden-label-small" type="text" size="medium" value={email} name="name" fullWidth />
                            </DropInput>
                        </FlexBox>
                    </div>
                    <div className="bottom--blank">
                        <FlexBox>
                            <DropInput title="이름">
                                <TextField id="filled-hidden-label-small" type="text" size="medium" value={name} name="name" fullWidth />
                            </DropInput>
                            <DropInput title="운영권한">
                                <TextField id="filled-hidden-label-small" type="text" size="medium" value={is_use} name="name" fullWidth />
                            </DropInput>
                        </FlexBox>
                    </div>
                    <div>
                        <FlexBox>
                            <DropInput title="계정상태">
                                <TextField
                                    id="filled-hidden-label-small"
                                    type="text"
                                    size="medium"
                                    value={adminState}
                                    name="name"
                                    fullWidth
                                />
                            </DropInput>

                            {/* 유효 기간 */}
                            <SearchDate
                                start_date={valid_start_date}
                                end_date={valid_end_date}
                                noneChecked="noneChecked"
                                startName="from_date"
                                endName="to_date"
                                title="유효 기간"
                            />
                        </FlexBox>
                    </div>
                </MainCard>

                <div className="ip__layout">
                    <Typography variant="h4" className={cx('contentTilte')}>
                        접근 제어 IP
                    </Typography>

                    <ButtonLayout>
                        <Button disableElevation size="medium" type="submit" name="saveBtn" variant="contained" color="primary">
                            저장
                        </Button>
                        <Button disableElevation size="medium" type="submit" name="saveBtn" variant="contained" color="secondary">
                            삭제
                        </Button>
                    </ButtonLayout>
                </div>

                <ContentLine>
                    <CheckBoxDataGrid
                        columns={columns}
                        rows={dataGridRows}
                        handlePageChange={handlePage}
                        handleGridClick={handleClick}
                        handleGridDoubleClick={handleDoubleClick}
                        selectionChange={handleSelectionChange}
                        height={700}
                    />
                </ContentLine>

                <MainCard className="bottom__layout">
                    <FlexBox>
                        <DropInput title="접근 IP">
                            <TextField id="filled-hidden-label-small" type="text" size="medium" value={name} name="name" fullWidth />
                        </DropInput>
                        <DropInput title="유효기간">
                            <TextField id="filled-hidden-label-small" type="text" size="medium" value={name} name="name" fullWidth />
                        </DropInput>
                    </FlexBox>

                    <ButtonLayout>
                        <Button disableElevation size="medium" type="submit" name="saveBtn" variant="contained">
                            등록
                        </Button>
                    </ButtonLayout>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default IpRegForm;
