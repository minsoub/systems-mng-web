import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tree } from 'antd';
import {
    Button,
    FormControl,
    Grid,
    MenuItem,
    Select,
    Stack,
    Tab,
    Tabs,
    TextField,
    RadioGroup,
    Radio,
    Typography,
    FormControlLabel
} from '@mui/material';
import MainCard from 'components/Common/MainCard';
import TabPanel from 'components/TabPanel';
import DefaultDataGrid from 'components/DataGrid/DefaultDataGrid';
import LineApis from 'apis/lrc/line/lineapi';
import ErrorScreen from 'components/ErrorScreen';
import './styles.scss';
import InputLayout from '../../../components/Common/InputLayout';
import TopInputLayout from '../../../components/Common/TopInputLayout';
import cx from 'classnames';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import HeaderTitle from '../../../components/HeaderTitle';
import ContentLine from '../../../components/Common/ContentLine';
import DropInput from '../../../components/Common/DropInput';
import LineTree from './lineTree';
import LineDetail from './lineDetail';
import { getDateFormat } from 'utils/CommonUtils';

const LineMngPage = () => {
    const [responseData, requestError, loading, { lineSearch, lineInsert, lineUpdate, lineDelete }] = LineApis();

    // 그리드 선택된 row id
    const [selectedRows, setSeletedRows] = useState([]);
    // 그리드 목록 데이터
    const [dataGridRows, setDataGridRows] = useState([]);
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

    const [search_line_type, setSearchLineType] = useState('BUSINESS');
    const [isUpdate, setIsUpdate] = useState(false);

    // 입력 데이터 - Default
    const [inputs, setInputs] = useState({
        id: '',
        name: '',
        type: '',
        use_yn: true
    });
    const { id, name, type, use_yn } = inputs;

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

    // onload
    useEffect(() => {
        // 리스트 가져오기
        // lineSearch('');
        setIsUpdate(false);
    }, []);

    useEffect(() => {
        lineSearch(search_line_type);
    }, [search_line_type]);

    useEffect(() => {
        // lineSearch('searchLineType');
        console.log('searchLineType', search_line_type);
    }, [search_line_type]);

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
            case 'insertData':
                if (responseData.data.data) {
                    alert('저장되였습니다.');
                    newClick();
                    lineSearch(search_line_type);
                }
                break;
            case 'updateData':
                if (responseData.data.data) {
                    alert('수정을 완료하였습니다.');
                    newClick();
                    lineSearch(search_line_type);
                }
                break;
            case 'deleteData':
                console.log('deleteData');
                alert('삭제 처리를 완료하였습니다.');
                newClick();
                lineSearch(search_line_type);
                break;
            default:
        }
    }, [responseData]);

    const searchLineChanged = (_, value) => {
        setSearchLineType(value);
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

    // new
    const newClick = () => {
        console.log('called register form');
        //navigate('/account/reg');
        setInputs({
            id: '',
            name: '',
            type: '',
            use_yn: true
        });
        setIsUpdate(false);
    };

    // save
    const saveClick = () => {
        if (!name) {
            alert('계열 명칭을 입력하지 않았습니다.');
            return;
        }
        if (!type) {
            alert('계열 타입을 선택하지 않았습니다.');
            return;
        }
        console.log(inputs);
        if (confirm('저장하시겠습니까?')) {
            if (!isUpdate) {
                lineInsert(inputs);
            } else {
                lineUpdate(inputs);
            }
        }
    };
    // delete
    const deleteClick = () => {
        if (!isUpdate) {
            alert('삭제할 데이터가 없습니다.');
            return;
        }
        if (confirm('삭제하시겠습니까?')) {
            // 선택한 계정에 대해서 삭제를 수행한다.
            lineDelete(inputs);
        }
    };

    const onSelect = (selectedKeys) => {
        const rowData = dataGridRows.find((row) => row.id === selectedKeys);
        if (rowData) {
            setSeletedRows([rowData]);
            setIsUpdate(true);
            setInputs({
                id: rowData.id,
                name: rowData.name,
                use_yn: rowData.use_yn,
                type: rowData.type
            });
        }
    };

    return (
        <Grid container rowSpacing={4} className="lineList">
            <Grid item xs={12}>
                <HeaderTitle titleNm="계열 관리" menuStep01="사이트 운영" menuStep02="상태값 관리" menuStep03="계열 관리" />

                <Tabs
                    value={search_line_type}
                    onChange={searchLineChanged}
                    aria-label="basic tabs example"
                    className="bottom--blank"
                    sx={{ minHeight: '32px' }}
                >
                    <Tab label="사업계열" value={'BUSINESS'} />
                    <Tab label="네트워크 계열" value={'NETWORK'} />
                </Tabs>
            </Grid>

            <LineTree dataGridRows={dataGridRows} onSelect={onSelect} />
            <LineDetail
                inputs={inputs}
                handleBlur={handleBlur}
                handleChange={handleChange}
                saveClick={saveClick}
                deleteClick={deleteClick}
                isUpdate={isUpdate}
            />

            {errorMessage && (
                <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
            )}
        </Grid>
    );
};

export default LineMngPage;
