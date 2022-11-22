/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Select, MenuItem, TextField, Checkbox, FormControl, FormGroup, FormControlLabel, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DropInput from 'components/Common/DropInput';
import TopInputLayout from 'components/Common/TopInputLayout';
import Editor from 'components/editor/index';
import cx from 'classnames';
import styles from './styles.module.scss';

const DetailContens = ({ type, editMode }) => {
    // 파일 정보
    const [file_part, setFilePart] = useState();
    const [file, setFile] = useState('');

    const [postType, setPostType] = useState('1');
    const [title, setTitle] = useState('');
    const [view_date, setViewDate] = useState();
    const editParam = { editName: 'editorName', value: '<b>여기 입력 고고</b>' };
    useEffect(() => {
        console.log(type, editMode);
    }, []);
    const typeChanged = (e) => {
        setPostType(e.target.value);
    };
    const handleBlur = () => {};
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'title':
                setTitle(e.target.value);
                break;
            default:
                return;
        }
    };
    // 입력 박스 입력 시 호출
    const fileHandleChange = (e) => {
        if (!e.target.files[0]) {
            setFilePart();
            return;
        }
        setFile(e.target.files[0].name);
        setFilePart(e.target.files[0]);
    };
    const fileSave = (data) => {
        if (!file) {
            alert('파일을 업로드 하지 않았습니다.');
            return;
        }
        const formData = new FormData();
        formData.append('file', file_part);
        formData.append('fileName', file);
        formData.append('fileType', file_part.type);
        // 3.2MB로 계산하기
        formData.append('fileSize', humanFileSize(file_part.size, true, 2));

        //console.log(formData);
        insertChatFile(formData);
    };
    function byteString(index) {
        const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']; //  : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

        // eslint-disable-next-line security/detect-object-injection
        return units[index];
    }
    function humanFileSize(bytes, si = false, dp = 1) {
        const thresh = si ? 1000 : 1024;

        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }

        //const units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        const r = 10 ** dp;

        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < 8 - 1); // units.length - 1);

        return bytes.toFixed(dp) + ' ' + byteString(u); // units[u];
    }
    return (
        <div className={cx('common-board--layout')}>
            <table>
                <tbody>
                    {editMode ? (
                        <></>
                    ) : (
                        <tr>
                            <th className={'tb--title'}>등록일시</th>
                            <td className={'width15'}>2022-03-14 12:00:00</td>
                            <th className={'tb--title'}>업데이트 일시</th>
                            <td className={'width15'}>2022-03-14 12:00:00</td>
                            <th className={'tb--title'}>작성자</th>
                            <td className={'width15'}>userID</td>
                            <th className={'tb--title'}>조회수</th>
                            <td className={'width15'}>12,456</td>
                        </tr>
                    )}
                    <tr>
                        <th className={'tb--title'}>카테고리1</th>
                        <td className={'width15'}>
                            {editMode ? (
                                <Select className={styles.detail_select} name="type" label="구분" value={postType} onChange={typeChanged}>
                                    <MenuItem value="1">일반</MenuItem>
                                    <MenuItem value="2">고정</MenuItem>
                                </Select>
                            ) : (
                                <>일반</>
                            )}
                        </td>
                        <th className={'tb--title'}>카테고리2</th>
                        <td className={'width15'} colSpan="5">
                            {editMode ? (
                                <Select className={styles.detail_select} name="type" label="구분" value={postType} onChange={typeChanged}>
                                    <MenuItem value="1">일반</MenuItem>
                                    <MenuItem value="2">고정</MenuItem>
                                </Select>
                            ) : (
                                <>-</>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th className={'tb--title'}>제목</th>
                        <td className={'width15'} colSpan="7">
                            {editMode ? (
                                <TextField
                                    type="text"
                                    size="small"
                                    value={title}
                                    name="title"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="제목을 입력해 주세요."
                                    fullWidth
                                />
                            ) : (
                                <>전기통신금융사기 주의 안내(공공기관, 수사기관 사칭) 제목이 길어지는 경우 모두 출력합니다. 제목이 길어지는
                                경우 모두 출력합니다. 제목이 길어지는 경우 모두 출력합니다.</>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th className={'tb--title'}>상단 고정</th>
                        <td className={'width15'}>
                            {editMode ? (
                                <Select className={styles.detail_select} name="type" label="구분" value={postType} onChange={typeChanged}>
                                    <MenuItem value="1">일반</MenuItem>
                                    <MenuItem value="2">고정</MenuItem>
                                </Select>
                            ) : (
                                <>일반</>
                            )}
                        </td>
                        <th className={'tb--title'}>배너 공지</th>
                        <td className={'width15'} colSpan="5">
                            비노출
                        </td>
                    </tr>
                    <tr>
                        <th className={'tb--title'}>상태</th>
                        <td className={'width15'} colSpan="7">
                            {editMode ? (
                                <>
                                    <Select
                                        className={styles.detail_select}
                                        name="type"
                                        label="상태"
                                        value={postType}
                                        onChange={typeChanged}
                                    >
                                        <MenuItem value="1">공개</MenuItem>
                                        <MenuItem value="2">비공개</MenuItem>
                                    </Select>
                                    <FormControl component="fieldset" className={styles.date_check_checkbox}>
                                        <FormGroup aria-label="position" row>
                                            <FormControlLabel control={<Checkbox />} label="게시 예약" sx={{ ml: 1 }} />
                                        </FormGroup>
                                    </FormControl>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DesktopDatePicker
                                            label="연도. 월. 일"
                                            inputFormat="YYYY-MM-DD"
                                            value={view_date} // 변수바뀜 확인필요
                                            onChange={(newValue) => {
                                                setViewDate(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>
                                </>
                            ) : (
                                <>비공개 (게시일시 : 2022-03-18 00:00)</>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th className={'tb--title'}>내용</th>
                        <td className={'width15'} colSpan="7">
                            {editMode ? (
                                <Editor props={editParam} />
                            ) : (
                                <>
                                    안녕하세요. No.1 가상자산 플랫폼, 빗썸입니다. 최근 공공기관, 수사기관 등을 사칭한 보이스피싱 시도가
                                지속적으로 이뤄지고 있어, 피해가 발생하지 않도록 각별한 주의를 부탁드립니다.
                                </>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th className="tb--title">첨부파일</th>
                        <td className="width15 add_file" colSpan="7">
                            {editMode ? (
                                <TopInputLayout className={`${styles.inputWrap} file__upload--box`}>
                                    <div className={`${styles.file_name}`}>
                                        Notice.pdf<em>(110.00KB)</em>
                                    </div>
                                    <TextField
                                        type="file"
                                        id="file"
                                        name="file"
                                        size="medium"
                                        className="file__upload--field"
                                        onChange={fileHandleChange}
                                        inputProps={{
                                            accept:
                                                '.doc, .docx, .xlsx, .xls, .ppt, .pptx, .ai, .mov, .mp4, .avi, .mkv, .jpg, .jpeg, .png, .gif, .pdf, .txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                        }}
                                    />
                                    &nbsp;
                                    <Button
                                        className={`${styles.file_dave_btn}`}
                                        disableElevation
                                        size="medium"
                                        type="button"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => fileSave(file)}
                                    >
                                        업로드
                                    </Button>
                                </TopInputLayout>
                            ) : (
                                <>
                                    Notice.pdf<em>(110.00KB)</em>
                                </>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
export default DetailContens;
