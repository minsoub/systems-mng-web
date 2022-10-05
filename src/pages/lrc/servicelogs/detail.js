import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, FormControl, Grid, Table, TableBody, TableRow } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { makeStyles, withStyles } from '@mui/styles';
import LogsApi from 'apis/logs/service';
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
const ServiceDetail = () => {
    const navigate = useNavigate();
    const { paramId } = useParams();
    const [responseData, requestError, loading, { logLrcDetail }] = LogsApi();
    ////////////////////////////////////////////////////
    // 공통 에러 처리
    const [open, setOpen] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [logDetail, setLogDetail] = useState({});
    // onload
    useEffect(() => {
        logLrcDetail(paramId);
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
        navigate('/service/list');
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle
                    titleNm="서비스 로그 관리"
                    menuStep01="서비스 로그 관리"
                    menuStep02="사이트 운영"
                    menuStep03="서비스 로그 관리"
                />

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
                                <th className={'tb--title'}>CRUD</th>
                                <td>{logDetail.method}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>URI</th>
                                <td>{logDetail.uri}</td>
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

export default ServiceDetail;
