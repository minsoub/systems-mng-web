import HeaderTitle from '../../../components/HeaderTitle';
import {
    Button,
    FormControl,
    FormControlLabel,
    Grid,
    MenuItem,
    OutlinedInput,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography
} from '@mui/material';
import MainCard from '../../../components/Common/MainCard';
import FlexBox from '../../../components/Common/FlexBox';
import DropInput from '../../../components/Common/DropInput';
import React, { useEffect, useState } from 'react';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import cx from 'classnames';
import './styles.scss';
import ContentLine from '../../../components/Common/ContentLine';
import CheckBoxDataGrid from '../../../components/DataGrid/CheckBoxDataGrid';
import { getDateFormat } from '../../../utils/CommonUtils';
import AccountApis from '../../../apis/account/accountapis';
import TopInputLayout from '../../../components/Common/TopInputLayout';
import InputLayout from '../../../components/Common/InputLayout';

const IpRegForm = () => {
    const [responseData, requestError, loading, { accountMngSearch, accountList, accountMngDeletes }] = AccountApis();
    const [selectedRows, setSeletedRows] = useState([]);
    const [dataGridRows, setDataGridRows] = useState([]);

    const columns = [
        {
            field: 'name',
            headerName: 'No.',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 140
        },
        {
            field: 'email',
            headerName: '접근 IP',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 280
        },
        {
            field: 'role_management_name',
            headerName: '유효기간(From)',
            flex: 1,
            headerAlign: 'center',
            align: 'left'
        },
        {
            field: 'last_login_date',
            headerName: '유효기간(To)',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 180
        },
        {
            field: 'create_date',
            headerName: '등록일자',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            maxWidth: 180,
            valueGetter: ({ value }) => `${getDateFormat(value)}`
        }
    ];
    //체크박스 선택된 row id 저장
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

    // 그리드 더블 클릭
    const handleDoubleClick = (rowData) => {};

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'getList':
                if (responseData.data.data) {
                    setDataGridRows(responseData.data.data);
                } else {
                    setDataGridRows([]);
                }
                break;
            case 'deleteDatas':
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
                    <Button disableElevation size="medium" type="submit" variant="contained" color="secondary">
                        목록
                    </Button>
                </ButtonLayout>

                <MainCard sx={{ height: 400 }} content={false} className="stateSubmit layout--inner">
                    <div className="bottom--blank">
                        <FlexBox>
                            <DropInput title="사이트명">
                                <p>ㅇㅇ</p>
                            </DropInput>
                            <DropInput title="이메일주소">
                                <p>ㅇㅇ</p>
                            </DropInput>
                        </FlexBox>
                    </div>
                    <div className="bottom--blank">
                        <FlexBox>
                            <DropInput title="이름">
                                <p>ㅇㅇ</p>
                            </DropInput>
                            <DropInput title="운영권한">
                                <p>ㅇㅇ</p>
                            </DropInput>
                        </FlexBox>
                    </div>
                    <div>
                        <FlexBox>
                            <DropInput title="계정상태">
                                <p>ㅇㅇ</p>
                            </DropInput>
                            <DropInput title="계정 유효기간">
                                <p>ㅇㅇ</p>
                            </DropInput>
                        </FlexBox>
                    </div>
                </MainCard>

                <div className="ip__layout">
                    <Typography variant="h4" className={cx('contentTilte')}>
                        접근 제어 IP
                    </Typography>

                    <ButtonLayout>
                        <Button disableElevation size="medium" type="submit" name="saveBtn" variant="contained">
                            저장
                        </Button>
                        <Button disableElevation size="medium" type="submit" name="saveBtn" variant="contained">
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
                            <p>ㅇㅇ</p>
                        </DropInput>
                        <DropInput title="유효기간">
                            <p>ㅇㅇ</p>
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
