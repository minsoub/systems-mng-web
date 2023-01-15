import React, { useEffect, useState } from 'react';
import { Grid, Stack, FormControl, InputLabel, MenuItem, ListSubheader, Select } from '@mui/material';
import LineApis from 'apis/lrc/line/lineapi';
import { StsCheckbox } from './StsCheckbox';
import cx from 'classnames';
import './styles.scss';
import StackLabel from 'components/Common/StackLabel';
import GroupSelect from 'components/Selects/GroupSelect';
import Tag from 'components/Tag';

export const BusinessCheckboxList = ({ businessLineList, checkedItemHandler, selectedBusinessItemHandler, isAllChecked }) => {
    const [selectValue, setSelectValue] = useState('');
    // checkbox
    const [bChecked, setChecked] = useState(false);

    const checkHandler = (e) => {
        setChecked(!bChecked);
        //handleChange(e);
        checkedItemHandler(e.target.id, e.target.checked);
    };
    const handleChange = (e) => {
        setSelectValue(e.target.value);
        selectedBusinessItemHandler(e.target.value);
    };

    useEffect(() => {
        console.log('isAllChecked called...');
        if (isAllChecked === true) {
            // clear 수행
            setChecked(false);
        }
    }, [isAllChecked]);

    return (
        <>
            <Grid container spacing={0} sx={{ mt: 1, alignItems: 'center' }}>
                <StackLabel title="사업 계열" titleWidth={112} />

                <Grid item sm={2}>
                    <GroupSelect items={businessLineList} title={'사업계열'} value={selectValue} onChange={handleChange} />
                </Grid>
                <Grid item sm={3}>
                    <div className={'tags--wrap'}>
                        <Tag
                            title={'안녕'}
                            isDelete={true}
                            onClick={() => {
                                console.log('tag클릭');
                            }}
                            onDeleteClick={() => {
                                console.log('x클릭');
                            }}
                        />
                    </div>
                </Grid>
            </Grid>
        </>
    );
};
