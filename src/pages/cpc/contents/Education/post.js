import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, MenuItem, Select, TextareaAutosize } from '@mui/material';
import moment from 'moment';
import EducationApi from 'apis/cpc/education/maskingApi';
import EducationAnswerApi from 'apis/cpc/education/answerApi';
import ErrorScreen from 'components/ErrorScreen';
import ButtonLayout from 'components/Common/ButtonLayout';
import TopInputLayout from 'components/Common/TopInputLayout';
import HeaderTitle from 'components/HeaderTitle';
import MaskingModal from './MaskingDialog';
import { getDateFormat } from 'utils/CommonUtils';
import cx from 'classnames';
import '../BoardList.module.scss';
import './style.scss';

const Post = () => {
    const navigate = useNavigate();
    const { educationId } = useParams();
    const [responseData, requestError, resLoading, { searchEducation, searchUnMaskingEducation }] = EducationApi();
    const [answerData, answerError, answerLoading, { sendAnswer }] = EducationAnswerApi();
    // education 정보
    const [educationInfo, setEducationInfo] = useState({
        id: '', // ID
        name: '이브이', // 이름
        email: 'test@test.com', // 이메일주소
        phone: '010-1111-1111', // 휴대폰번호
        content: '', // 신청내용
        desireDate: getDateFormat(moment().format('YYYY-MM-DD')), // 교육희망일
        isAnswerComplete: false, // 답변여부
        isConsignmentAgreement: true, // 개인정보 위탁 동의
        isUseAgreement: true, // 개인정보 수집 및 이용동의
        isEmail: true, // 메일전송여부
        answer: '', // 답변
        createDate: getDateFormat(moment().format('YYYY-MM-DD')), // 생성일자
        updateDate: getDateFormat(moment().format('YYYY-MM-DD')), // 답변일자
        updateAccountId: '' // 답변자 ID
    });
    // 마스킹 상태
    const [isMasking, setIsMasking] = useState(true);
    const [isMaskingModal, setIsMaskingModal] = useState(false);

    // 공통 에러처리
    const [errorMessage, setErrorMessage] = useState('');

    const handleBlur = (e) => {
        console.log(e);
    };

    const handleChange = (e) => {
        switch (e.target.name) {
            case 'answer':
                setEducationInfo((prev) => ({ ...prev, answer: e.target.value }));
                break;
            case 'isEmail':
                setEducationInfo((prev) => ({ ...prev, isEmail: e.target.checked }));
                break;
            default:
                break;
        }
    };

    const handleMasking = (reason) => {
        console.log({ reason });
        setIsMaskingModal(false);
        setIsMasking(true);
        const data = {
            id: educationInfo.id,
            reason
        };
        searchUnMaskingEducation(data);
    };

    const handleMaskingModal = () => {
        setIsMaskingModal((prev) => !prev);
    };

    const handleMaskingModalClose = () => {
        setIsMaskingModal(false);
    };

    // 목록
    const listClick = () => {
        console.log('listClick called...');
        navigate('/cpc/education/list');
    };

    // 저장
    const saveClick = () => {
        console.log('saveClick called...');
        if (!educationInfo.answer.length) return;
        if (confirm('저장 하시겠습니까?')) {
            const data = {
                id: educationInfo.id,
                isEmail: educationInfo.isEmail,
                answer: educationInfo.answer,
                isMasking
            };

            console.log(data);
            sendAnswer(data);
        }
    };

    useEffect(() => {
        console.log({ educationId });
        if (educationId) {
            searchEducation({ id: educationId });
        }
    }, [educationId]);

    useEffect(() => {
        console.log({ responseData });
    }, [responseData]);

    useEffect(() => {
        console.log({ requestError });
    }, [requestError]);

    useEffect(() => {
        console.log({ answerData });
    }, [answerData]);

    useEffect(() => {
        console.log({ answerError });
    }, [answerError]);

    useEffect(() => {
        console.log({ educationInfo });
    }, [educationInfo]);
    // transaction error 처리
    useEffect(() => {
        if (requestError) {
            console.log('error requestError');
            console.log(requestError);
            setErrorTitle('Error Message');
            setErrorMessage(requestError);
            setOpen(true);
        }
    }, [requestError]);

    return (
        <Grid container rowSpacing={4} columnSpacing={2.75} className="cpcEducationReg">
            <Grid item xs={12}>
                <HeaderTitle titleNm="신청자 관리" menuStep01="사이트 운영" menuStep02="찾아가는 교육 관리" menuStep03="신청자 관리" />

                <div className={cx('common-grid--layout')}>
                    <table>
                        <tbody>
                            <tr>
                                <th className={'tb--title'}>상태</th>
                                <td>접수</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>이름</th>
                                <td>{educationInfo.name}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>이메일 주소</th>
                                <td>{educationInfo.email}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>휴대폰 번호</th>
                                <td>{educationInfo.phone}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>교육 희망일</th>
                                <td>{educationInfo.desireDate}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>내용</th>
                                <td>{educationInfo.content}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>개인정보 위탁 동의</th>
                                <td>{educationInfo.isConsignmentAgreement ? 'Y' : 'N'}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>개인정보 수집 및 이용 동의</th>
                                <td>{educationInfo.isUseAgreement ? 'Y' : 'N'}</td>
                            </tr>
                            <tr>
                                <th className={'tb--title'}>답변하기</th>
                                <td>
                                    <FormGroup>
                                        <FormControl>
                                            <TextareaAutosize
                                                id="filled-hidden-label-small"
                                                type="text"
                                                size="small"
                                                value={educationInfo.answer}
                                                name="answer"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="답변을 입력하세요."
                                                fullWidth
                                                style={{ width: '100%', minHeight: 100 }}
                                            />
                                        </FormControl>
                                        <FormControlLabel
                                            name={'isEmail'}
                                            onChange={handleChange}
                                            label={'이메일로 답변하기'}
                                            control={<Checkbox />}
                                            labelPlacement={'end'}
                                        />
                                    </FormGroup>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <TopInputLayout>
                    <Button disableElevation size="medium" type="submit" variant="outlined_d" color="secondary" onClick={listClick}>
                        목록
                    </Button>

                    <ButtonLayout>
                        <Button
                            disableElevation
                            size="medium"
                            type="submit"
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                if (isMasking) {
                                    handleMaskingModal();
                                } else {
                                    searchEducation(educationInfo.id);
                                    setIsMasking(true);
                                }
                            }}
                        >
                            {isMasking ? '마스킹 해제' : '마스킹 설정'}
                        </Button>
                        <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={saveClick}>
                            저장
                        </Button>
                    </ButtonLayout>
                </TopInputLayout>
                {errorMessage && (
                    <ErrorScreen open={open} errorTitle={errorTitle} errorMessage={errorMessage} parentErrorClear={parentErrorClear} />
                )}
            </Grid>
            <MaskingModal open={isMaskingModal} onClose={handleMaskingModalClose} onMasking={handleMasking} />
        </Grid>
    );
};

export default Post;
