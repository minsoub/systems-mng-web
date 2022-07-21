import React, { useEffect, useState } from 'react';
import { Button, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import SvgIcon from '@mui/material/SvgIcon';
import StatusApi from 'apis/lrc/status/statusapi';
import ErrorScreen from 'components/ErrorScreen';
import StyledTtreeItem from 'components/TreeMenu/StyledTreeItem';
import TreeView from '@mui/lab/TreeView';
import HeaderTitle from 'components/HeaderTitle';
import ButtonLayout from 'components/Common/ButtonLayout';
import cx from 'classnames';
import './styles.scss';
import DropInput from '../../../components/Common/DropInput';

function MinusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
        </SvgIcon>
    );
}

function PlusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
        </SvgIcon>
    );
}

function CloseSquare(props) {
    return (
        <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
        </SvgIcon>
    );
}

const StatusRegForm = () => {
    const [resData, reqErr, resLoading, { statusSearch, statusInsert, statusUpdate }] = StatusApi();

    const [expanded, setExpanded] = useState([]);
    const [selected, setSelected] = useState([]);
    const [statusdata, setStatusData] = useState([]); // menu data

    const [isUpdate, setIsUpdate] = useState(false); // input mode
    const [isButton, setIsButton] = useState(false); // +, - 버튼 모드

    const [login_site_id, setLoginStiteId] = useState(''); // 사용자 로그인 - 사이트 ID

    // 입력 데이터 - Default
    const [inputs, setInputs] = useState({
        id: '',
        name: '',
        order_no: '',
        parent_code: '',
        parent_code_name: '',
        use_yn: 'true'
    });
    const { id, name, name_en, order_no, parent_code, parent_code_name, use_yn } = inputs;

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
    // TODO: onload
    useEffect(() => {
        // 디폴트 상태 트리 조회
        statusSearch();
    }, []);

    // transaction error 처리
    useEffect(() => {
        if (reqErr) {
            if (reqErr.result === 'FAIL') {
                console.log('error requestError');
                console.log(reqErr);
                setErrorTitle('Error Message');
                setErrorMessage('[' + reqErr.error.code + '] ' + reqErr.error.message);
                setOpen(true);
            }
        }
    }, [reqErr]);

    // Transaction Return
    useEffect(() => {
        if (!resData) {
            return;
        }
        switch (resData.transactionId) {
            case 'insertData':
                if (resData.data.data) {
                    alert('저장을 완료하였습니다!!!');
                    inputClear();
                    // 트리 구조 조회
                    statusSearch();
                }
                break;
            case 'getList':
                if (resData.data.data && resData.data.data.length > 0) {
                    setStatusData(resData.data.data);
                } else {
                    setStatusData([]);
                }
                break;
            case 'updateData':
                if (resData.data.data) {
                    alert('저장을 완료하였습니다!!!');
                    inputClear();
                    // 트리 구조 조회
                    statusSearch();
                }
                break;
            default:
                break;
        }
    }, [resData]);

    const handleClose = () => {
        setVisible(false);
    };

    // Input Form clear
    const inputClear = () => {
        setInputs({
            id: '',
            name: '',
            name_en: '',
            code: '',
            order_no: '',
            parent_code: '',
            parent_code_name: '',
            use_yn: 'true'
        });
    };

    // 저장한다.
    const saveClick = () => {
        console.log(inputs);
        // Validation check
        if (!inputs.name) {
            setError('상태명을 입력하지 않았습니다!');
            return;
        }
        if (!inputs.order_no) {
            setError('정렬 순서를 입력하지 않았습니다!');
            return;
        }
        if (confirm('저장하시겠습니까?')) {
            if (!isUpdate) {
                statusInsert(inputs);
            } else {
                statusUpdate(inputs);
            }
        }
    };
    // 데이터 초기화
    const cancelClick = () => {
        inputClear();
        setIsUpdate(false);
    };

    // 입력 박스 입력 시 호출
    const handleChange = (e) => {
        let { value, name } = e.target;
        if (e.target.type === 'checkbox') {
            value = e.target.checked;
        }
        setInputs({
            ...inputs, // 기존 input 객체 복사
            [name]: value
        });
    };
    const handleBlur = (e) => {
        console.log(e);
    };

    // 에러 메시지 처리
    const setError = (msg) => {
        setErrorTitle('입력 오류');
        setErrorMessage(msg);
        setOpen(true);
    };

    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    const handleSelect = (nodeIds) => {
        console.log('handleSelect called....');
        console.log(nodeIds);
        statusdata.map((item, idx) => {
            console.log(item.id + '====' + nodeIds);
            if (item.id === nodeIds) {
                console.log('found...1');
                console.log(item);
                setInputs({
                    id: item.id,
                    name: item.name,
                    name_en: item.name_en,
                    parent_code: item.parent_code,
                    parent_code_name: '',
                    order_no: item.order_no,
                    use_yn: item.use_yn
                });
                setSelected(nodeIds);
                setIsUpdate(true); // 수정모드
                return;
            } else if (item.children && item.children.length > 0) {
                item.children.map((sub, index) => {
                    if (sub.id === nodeIds) {
                        setInputs({
                            id: sub.id,
                            name: sub.name,
                            name_en: item.name_en,
                            parent_code: sub.parent_code,
                            parent_code_name: item.name,
                            order_no: sub.order_no,
                            use_yn: sub.use_yn
                        });
                        setSelected(nodeIds);
                        setIsUpdate(true); // 수정모드
                        return;
                    }
                });
            }
        });
        setSelected(nodeIds);
        setExpanded(nodeIds);
    };

    const onPlusSelect = (nodeIds) => {
        console.log('onPlusSelect called => ' + nodeIds);
        if (statusdata) {
            let found = 0;
            statusdata.map((item, idx) => {
                if (item.id === nodeIds) {
                    found = 1;
                    console.log('found...1');
                    console.log(item);
                    setInputs({
                        id: '',
                        name: '',
                        name_en: '',
                        parent_code: item.id,
                        parent_code_name: item.name,
                        order_no: '1',
                        use_yn: 'true'
                    });
                    setSelected(nodeIds);
                    setIsUpdate(false); // 수정모드
                    return;
                }
            });
        }
    };

    const renderTreeItem = (items) => {
        //console.log(items);
        const menu = items.map((item) => {
            if (item.children && item.children.length) {
                return (
                    <StyledTtreeItem
                        key={item.id}
                        nodeId={item.id}
                        dataMsg={item.id}
                        labelText={item.name}
                        labelPlus={'block'}
                        labelMinus={'none'}
                        plusSelect={onPlusSelect}
                        nodeSelect={handleSelect}
                    >
                        {renderTreeItem(item.children)}
                    </StyledTtreeItem>
                );
            } else {
                //console.log(item);
                if (item.parent_code === '') {
                    return (
                        <StyledTtreeItem
                            key={item.id}
                            nodeId={item.id}
                            dataMsg={item.id}
                            labelText={item.name}
                            labelPlus={'block'}
                            labelMinus={'none'}
                            plusSelect={onPlusSelect}
                            nodeSelect={handleSelect}
                        />
                    );
                } else {
                    return (
                        <StyledTtreeItem
                            key={item.id}
                            nodeId={item.id}
                            dataMsg={item.id}
                            labelText={item.name}
                            labelPlus={'none'}
                            labelMinus={'none'}
                            plusSelect={onPlusSelect}
                            nodeSelect={handleSelect}
                        />
                    );
                }
            }
            return null;
        });
        return menu;
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75} className="stateMng">
            <Grid item xs={12} md={7} lg={12}>
                <HeaderTitle titleNm="상태값 관리" menuStep01="사이트 운영" menuStep02="상태값 관리" menuStep03="상태값 관리" />

                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item md={3}>
                        <MainCard content={false}>
                            <Grid container>
                                <TreeView
                                    aria-label="controlled"
                                    //defaultExpanded={expanded}
                                    defaultCollapseIcon={<MinusSquare />}
                                    defaultExpandIcon={<PlusSquare />}
                                    defaultEndIcon={<CloseSquare />}
                                    sx={{ height: 600 }}
                                    //expanded={expanded}
                                    //selected={selected}
                                    onNodeToggle={handleToggle}
                                    //onNodeSelect={handleSelect}
                                >
                                    {renderTreeItem(statusdata)}
                                </TreeView>
                            </Grid>
                        </MainCard>
                    </Grid>

                    <Grid item md={8.8}>
                        <MainCard sx={{ height: 600 }} content={false} className="stateSubmit layout--inner">
                            <Typography variant="h4" className="title">
                                상태값 등록
                            </Typography>

                            <div className="common-grid--layout">
                                <DropInput title="상태명" className="layout--out">
                                    <TextField
                                        id="filled-hidden-label-small"
                                        type="text"
                                        size="small"
                                        value={name}
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </DropInput>
                                <DropInput title="분류 위치">
                                    <TextField
                                        id="outlined-multiline-static"
                                        inputProps={{ readOnly: true }}
                                        value={parent_code_name}
                                        name="parent_code_name"
                                        size="small"
                                        fullWidth
                                    />
                                </DropInput>
                                <DropInput title="정렬 순서" className="layout--out">
                                    <TextField
                                        id="filled-hidden-label-small"
                                        type="number"
                                        size="small"
                                        value={order_no}
                                        name="order_no"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </DropInput>
                                <DropInput title="사용 여부">
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="use_yn"
                                        value={use_yn}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel value="true" control={<Radio />} label="사용함" />
                                        <FormControlLabel value="false" control={<Radio />} label="사용안함" />
                                    </RadioGroup>
                                </DropInput>
                            </div>
                        </MainCard>
                    </Grid>
                </Grid>

                <div className="layout--button">
                    <ButtonLayout className={cx('stateButton')}>
                        <Button disableElevation size="medium" type="submit" variant="contained" onClick={saveClick}>
                            저장
                        </Button>
                        <Button disableElevation size="medium" type="submit" variant="contained" color="secondary" onClick={cancelClick}>
                            취소
                        </Button>
                    </ButtonLayout>
                </div>

                {errorMessage && (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                )}
            </Grid>
        </Grid>
    );
};

export default StatusRegForm;
