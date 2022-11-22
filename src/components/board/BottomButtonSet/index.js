/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Button } from '@mui/material';
import ButtonLayout from 'components/Common/ButtonLayout';
import styles from './styles.module.scss';

const BottomButtonSet = ({ type, editMode, changeEditState }) => {
    const navigate = useNavigate();
    // 삭제 버튼 제어
    const [isDisabled, setIsDisabled] = useState(false);
    // delete
    const deleteClick = () => {
        if (confirm('삭제를 하시겠습니까?')) {
            const requestData = {
                // id: id,
                // name: name,
                // valid_start_date: valid_start_date,
                // valid_end_date: valid_end_date,
                // site_id: site_id,
                // is_use: false,
                // type: type
            };
            //roleDelete(id, requestData);
        }
    };
    // List
    const listClick = () => {
        navigate(`/cms/${type}/list`);
    };
    useEffect(() => {
        console.log(changeEditState, editMode);
    }, []);
    return (
        <Grid className={styles.button_layout}>
            <ButtonLayout>
                {editMode ? (
                    <>
                        <Button disableElevation size="medium" type="button" variant="outlined_d" color="secondary" onClick={listClick}>
                            PC 미리보기
                        </Button>
                        <Button disableElevation size="medium" type="button" variant="outlined_d" color="secondary" onClick={listClick}>
                            MO 미리보기
                        </Button>
                    </>
                ) : (
                    <Button disableElevation size="medium" type="button" variant="outlined_d" color="secondary" onClick={listClick}>
                        목록
                    </Button>
                )}
            </ButtonLayout>
            <ButtonLayout>
                {editMode ? (
                    <>
                        <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={listClick}>
                            취소
                        </Button>
                        <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={deleteClick}>
                            초안 저장
                        </Button>
                        <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={deleteClick}>
                            출판
                        </Button>
                    </>
                ) : (
                    <>
                        <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={deleteClick}>
                            삭제
                        </Button>
                        <Button disableElevation size="medium" type="submit" variant="contained" color="primary" onClick={changeEditState}>
                            수정
                        </Button>
                    </>
                )}
            </ButtonLayout>
        </Grid>
    );
};

export default BottomButtonSet;
