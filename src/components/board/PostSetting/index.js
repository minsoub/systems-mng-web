/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Typography, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import cx from 'classnames';

const PostSetting = ({ type, editMode }) => {
    const [isDateUpdate, setIsDateUpdate] = useState(1);
    const [isBoardTopState, setIsBoardTopState] = useState(1);
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'date_check':
                setIsDateUpdate(e.target.value);
                break;
            case 'board_top':
                setIsBoardTopState(e.target.value);
                break;
            default:
                return;
        }
    };
    return (
        <>
            <div className="board--layout__title">
                <Typography variant="h4" className="title">
                    ■ 게시 설정
                </Typography>
            </div>
            <div className={cx('common-board--layout')}>
                <table>
                    <tbody>
                        <tr>
                            <th className={'tb--title'}>날자 업데이트 여부</th>
                            <td className={'width15'}>
                                {editMode ? (
                                    <RadioGroup
                                        className={cx('date-checked')}
                                        row
                                        aria-labelledby="board-date-radio-buttons-group-label"
                                        name="date_check"
                                        value={isDateUpdate}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel value="1" control={<Radio />} label="Y" />
                                        <FormControlLabel value="2" control={<Radio />} label="N" />
                                    </RadioGroup>
                                ) : (
                                    <>N</>
                                )}
                            </td>
                            <th className={'tb--title'}>게시물 상단 노출</th>
                            <td className={'width15'}>
                                {editMode ? (
                                    <RadioGroup
                                        className={cx('date-checked')}
                                        row
                                        aria-labelledby="board-date-radio-buttons-group-label"
                                        name="board_top"
                                        value={isBoardTopState}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel value="1" control={<Radio />} label="Y" />
                                        <FormControlLabel value="2" control={<Radio />} label="N" />
                                    </RadioGroup>
                                ) : (
                                    <>N</>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th className={'tb--title'}>게시글 URL</th>
                            <td className={'width15'} colSpan="3">
                                <span className="copyText">https://www.bithumb.com/events/123122</span>
                                <Button disableElevation size="medium" type="button" variant="outlined_d" color="secondary">
                                    복사하기
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
};

PostSetting.propTypes = {};

export default PostSetting;
