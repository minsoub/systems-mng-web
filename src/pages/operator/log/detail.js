import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, FormControl, Grid, Table, TableBody, TableRow } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { makeStyles, withStyles } from '@mui/styles';
import LogsApi from 'apis/logs/audit';
import HeaderTitle from 'components/HeaderTitle';
import cx from 'classnames';
import ButtonLayout from 'components/Common/ButtonLayout';

const StyledTableCell = withStyles((theme) => ({
    root: {
        padding: '0px 16px'
    },
    [`&.${tableCellClasses.body}`]: {
        backgroundColor: '#e0e0e0', //theme.palette.common.black,
        color: theme.palette.common.black
    }
}))(TableCell);
const SiteLogDetail = () => {
    const navigate = useNavigate();
    const { paramId } = useParams();
    const [responseData, requestError, loading, { auditLogDetail }] = LogsApi();
    ////////////////////////////////////////////////////
    // 공통 에러 처리
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [logDetail, setLogDetail] = useState({});
    // onload
    useEffect(() => {
      auditLogDetail(paramId);
    }, []);

    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            if (requestError.result === 'FAIL') {
                console.log('error requestError');
                console.log(requestError);
                setErrorTitle('Error Message');
                setErrorMessage('[' + requestError.error.code + '] ' + requestError.error.message);
                setOpen(true);
            }
        }
    }, [requestError]);

    // Transaction Return
    useEffect(() => {
        if (!responseData) {
            return;
        }
        switch (responseData.transactionId) {
            case 'logDetail':
                if (responseData.data.data) {
                    console.log(responseData.data.data);
                    setLogDetail(responseData.data.data);
                } else {
                    setLogDetail({});
                }
                break;
            default:
                break;
        }
    }, [responseData]);

    const listClick = () => {
        navigate('/sitelog/list');
    };

    return (
        <Grid container rowSpacing={4} columnSpacing={2.75}>
            <Grid item xs={12}>
                <HeaderTitle titleNm="사이트 관리" menuStep01="감사 로그 관리" menuStep02="감사로그 상세" />

                <div className={cx('common-grid--layout')}>
                    <table>
                        <tbody>
                            <tr>
                                <th className={'tb--title'}>발생일시</th>
                                <td>{logDetail.create_date}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>SN</th>
                                <td>{logDetail.id}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>ID</th>
                                <td>{logDetail.email}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>접속 IP</th>
                                <td>{logDetail.ip}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>메뉴</th>
                                <td>{logDetail.menu_name}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>프로그램명</th>
                                <td>{logDetail.program_name}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>CRUD</th>
                                <td>{logDetail.method}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>URI</th>
                                <td>{logDetail.uri}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>Path</th>
                                <td>{logDetail.path}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>사이트명</th>
                                <td>{logDetail.site_name}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>권한코드</th>
                                <td>{logDetail.roles}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>Refer 정보</th>
                                <td>{logDetail.referer}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>디바이스</th>
                                <td>{logDetail.device}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>Parameter</th>
                                <td>{logDetail.query_params}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>Parameter Detail</th>
                                <td style={{ width: '100%', lineBreak: 'anywhere' }}>{logDetail.parameter}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <ButtonLayout>
                    <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={listClick}>
                        목록
                    </Button>
                </ButtonLayout>
            </Grid>
        </Grid>
    );
};

export default SiteLogDetail;
