/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Grid, MenuItem, InputLabel, Select } from '@mui/material';
import MainCard from 'components/Common/MainCard';
import SearchBar from 'components/ContentManage/SearchBar';
import InputLayout from 'components/Common/InputLayout';
import DropInput from 'components/Common/DropInput';
import ButtonLayout from 'components/Common/ButtonLayout';
import styles from './styles.module.scss';

const CategorySearchForm = ({ listLoad, listRelooad }) => {
    const [keyword, setKeyword] = useState(''); //검색 키워드
    const [categoryState, setCategoryState] = useState(0); // 카테고리 사용상태
    const handleChange = (e /*, name */) => {
        switch (e.target.name) {
            case 'keyword': //키워드 변경시
                setKeyword(e.target.value);
                break;
            case 'category_state': // 상태 변경시
                setCategoryState(e.target.value);
                break;
            default:
                break;
        }
    };
    // 검색
    const searchClick = () => {
        const request = {
            keyword,
            is_use: categoryState
        };
        listLoad(request);
    };
    // 초기화
    const clearClick = () => {
        setKeyword('');
        setCategoryState(0);
        const request = {
            keyword: '',
            is_use: 0
        };
        listLoad(request);
    };
    // reload
    useEffect(() => {
        if (listRelooad) searchClick();
    }, [listRelooad]);
    //초기 호출
    useEffect(() => {
        searchClick();
    }, []);
    return (
        <>
            <MainCard>
                <Grid>
                    <InputLayout>
                        <SearchBar handleChange={handleChange} keyword={keyword}/>
                        <DropInput title="상태" titleWidth={40} className={styles.dropdownWrap}>
                            <InputLabel id="category_state">상태</InputLabel>
                            <Select
                                labelId="category_state"
                                id="category_state"
                                name="category_state"
                                value={categoryState}
                                onChange={handleChange}
                            >
                                <MenuItem value="0">전체</MenuItem>
                                <MenuItem value="1">사용</MenuItem>
                                <MenuItem value="2">미사용</MenuItem>
                            </Select>
                        </DropInput>
                    </InputLayout>
                </Grid>
            </MainCard>
            <ButtonLayout style={{ marginBottom: '0.5rem' }}>
                <Button disableElevation size="medium" type="submit" variant="outlined_d" color="secondary" onClick={clearClick}>
                    초기화
                </Button>
                <Button disableElevation size="medium" type="submit" variant="contained" onClick={searchClick}>
                    검색
                </Button>
            </ButtonLayout>
        </>
    );
};

export default CategorySearchForm;
