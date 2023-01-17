/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { activeUpdateDate, activeTopNoti } from 'store/reducers/cms/DetailData';
import { Typography, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { clipboardShare } from 'utils/CommonUtils';
import cx from 'classnames';

const PostSetting = ({ type, editMode, postingData }) => {
    const dispatch = useDispatch();
    const [copyUrl, setCopyUrl] = useState('');
    const [isDateUpdate, setIsDateUpdate] = useState(0);
    const [isBoardTopState, setIsBoardTopState] = useState(0);
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
    useEffect(() => {
        console.log(type);
        switch (type) {
            case 'notices':
                setCopyUrl('https://www.bithumb.com/react/board/notice/');
                break;
            case 'press-releases':
                setCopyUrl('https://www.bithumb.com/react/board/press/');
                break;
            case 'events':
                setCopyUrl('https://www.bithumb.com/react/board/event/');
                break;
            case 'review-reports':
                setCopyUrl('https://www.bithumb.com/react/board/report/');
                break;
            case 'investment-warnings':
                setCopyUrl('');
                break;
            case 'economic-researches':
                setCopyUrl('https://www.bithumb.com/react/board/lab/');
                break;
        }
    }, [type]);
    useEffect(() => {
        dispatch(activeUpdateDate({ reduceUpdateDate: isDateUpdate }));
    },[isDateUpdate]);
    useEffect(() => {
        dispatch(activeTopNoti({ reduceTopNoti: isBoardTopState }));
    },[isBoardTopState]);
    const shareURLCopy = () => {
        clipboardShare(`${copyUrl}${postingData.id}`);
    };
    useEffect(() => {
        if (!postingData) return;
        if (postingData.is_use_update_date) {
            setIsDateUpdate(1);
        } else {
            setIsDateUpdate(0);
        }
        if (postingData.is_align_top) {
            setIsBoardTopState(1);
        } else {
            setIsBoardTopState(0);
        }
    }, [postingData]);
    useEffect(() => {
        return () => {
            dispatch(activeUpdateDate({ reduceUpdateDate: 0 }));
            dispatch(activeTopNoti({ reduceTopNoti: 0 }));
        };
    },[]);
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
                                        <FormControlLabel value="0" control={<Radio />} label="N" />
                                    </RadioGroup>
                                ) : (
                                    <>{isDateUpdate ? 'Y' : 'N'}</>
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
                                        <FormControlLabel value="0" control={<Radio />} label="N" />
                                    </RadioGroup>
                                ) : (
                                    <>{isBoardTopState ? 'Y' : 'N'}</>
                                )}
                            </td>
                        </tr>
                        <tr>
                            {postingData && postingData.id && (
                                <>
                                    <th className={'tb--title'}>게시글 URL</th>
                                    <td className={'width15'} colSpan="3">
                                        <span className="copyText">{`${copyUrl}${postingData.id}`}</span>
                                        <Button
                                            disableElevation
                                            size="medium"
                                            type="button"
                                            variant="outlined_d"
                                            color="secondary"
                                            onClick={shareURLCopy}
                                        >
                                            복사하기
                                        </Button>
                                    </td>
                                </>
                            )}
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
};

PostSetting.propTypes = {};

export default PostSetting;
