import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Grid, Tab, Tabs, Typography } from '@mui/material';
import ErrorScreen from 'components/ErrorScreen';
import TabPanel from 'components/TabPanel';
import OfficeInfo from './officeinfo';
import ProjectMng from './projectmng';
import FileMng from './filemng';
import ProjectHistory from './history';
import ProjectCommunity from './community';
import HeaderTitle from 'components/HeaderTitle';
import TopInputLayout from '../../../components/Common/TopInputLayout';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import './styles.scss';
const ProjectsDetailPage = () => {
    const columns = [
        {
            field: 'id',
            headerName: '프로젝트명',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'name',
            headerName: '심볼',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'type',
            headerName: '거래지원 현황',
            width: 300,
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                <div>
                    <Typography>{params.value.name}</Typography>
                    <Typography color="textSecondary">{params.value.title}</Typography>
                </div>;
            }
        },
        {
            field: 'is_use',
            headerName: '사업 계열',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'valid_start_date',
            headerName: '네트워크 계열',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'valid_end_date',
            headerName: '마케팅 수량',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'parameter',
            headerName: '연결 프로젝트',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'project_date',
            headerName: '상장일',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'create_date',
            headerName: '등록일시',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        }
    ];
    const navigate = useNavigate();
    const { paramId } = useParams();

    const [value, setValue] = React.useState(0);

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

    // onload
    useEffect(() => {
        // 탭 파일 변경.
        if (localStorage.getItem('projectTabIndex')) {
            let data = localStorage.getItem('projectTabIndex');
            //console.log(`tab value => ${data}`);
            setValue(parseInt(data, 10));
        }
    }, [paramId]);

    const tabChange = (event, value) => {
        setValue(value);
        // 해당 값을 로컬 스토리지에 저장한다.
        localStorage.setItem('projectTabIndex', value);
    };

    const listClick = () => {
        console.log('listClick called');
        navigate('/projects/list');
    };
    const chatClose = () => {
        //chatRef.current.chatClose();
    };
    return (
        <Grid className="projectsDetail" container rowSpacing={4} columnSpacing={2.75}>
            <Grid item xs={12}>
                <HeaderTitle titleNm="거래지원 관리" menuStep01="사이트 운영" menuStep02="거래지원 관리" menuStep03="재단 정보" />

                <TopInputLayout className="layout--button__bottom">
                    <Tabs value={value} onChange={tabChange} aria-label="basic tabs example">
                        <Tab label="재단 정보" />
                        <Tab label="프로젝트 관리" />
                        <Tab label="제출 서류 관리" />
                        <Tab label="변경 히스토리" />
                        <Tab label="커뮤니케이션" />
                    </Tabs>

                    <ButtonLayout>
                        <Button
                            disableElevation
                            sx={{ bgcolor: '#fff', color: '#262626' }}
                            size="medium"
                            type="submit"
                            variant="outlined"
                            color="secondary"
                            onClick={listClick}
                        >
                            목록
                        </Button>
                    </ButtonLayout>
                </TopInputLayout>

                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid container spacing={0} sx={{ mt: 0 }}>
                        <Box sx={{ width: '100%' }}>
                            <Grid container spacing={0} sx={{ mt: 0 }}>
                                <Grid item xs={12}>
                                    {/* 재단 정보 */}
                                    <TabPanel value={value} index={0}>
                                        <OfficeInfo value={value} projectId={paramId} index={0} chatClose={chatClose} />
                                    </TabPanel>
                                    {/* 프로젝트 관리 */}
                                    <TabPanel value={value} index={1}>
                                        <ProjectMng value={value} projectId={paramId} index={1} />
                                    </TabPanel>
                                    {/* 제출 서류 관리 */}
                                    <TabPanel value={value} index={2}>
                                        <FileMng value={value} projectId={paramId} index={2} />
                                    </TabPanel>
                                    {/* 변경 히스토리 */}
                                    <TabPanel value={value} index={3}>
                                        <ProjectHistory value={value} projectId={paramId} index={3} />
                                    </TabPanel>
                                    {/* 커뮤니티 */}
                                    <TabPanel value={value} index={4}>
                                        <ProjectCommunity value={value} projectId={paramId} index={3} />
                                    </TabPanel>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>

                {errorMessage && (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                )}
            </Grid>
        </Grid>
    );
};

export default ProjectsDetailPage;
