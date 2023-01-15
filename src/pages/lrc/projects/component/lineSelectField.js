import React, { useEffect, useState } from 'react';
import { Grid, Stack, FormControl, InputLabel, MenuItem, ListSubheader, Select } from '@mui/material';
import cx from 'classnames';
import './styles.scss';
import StackLabel from 'components/Common/StackLabel';
import GroupSelect from 'components/Selects/GroupSelect';
import Tag from 'components/Tag';

export const LineSelectField = ({
    title,
    lineMapObj,
    businessLineList,
    selectItems,
    selectedBusinessItemHandler,
    deleteLineItemHandler,
    isAllChecked
}) => {
    const [selectValue, setSelectValue] = useState('');

    const handleChange = (e) => {
        setSelectValue(e.target.value);
        selectedBusinessItemHandler(e.target.value);
    };

    const subOnClick = (value) => {
        setSelectValue(value);
        selectedBusinessItemHandler(value);
    };

    const titleValue = (id) => {
        const targetLineObj = lineMapObj.get(id);
        if (targetLineObj.parent_id) {
            return `${lineMapObj.get(targetLineObj.parent_id).name} > ${targetLineObj.name}`;
        } else {
            return `${targetLineObj.name}`;
        }
    };

    return (
        <>
            <Grid container spacing={0} sx={{ mt: 1, alignItems: 'center' }}>
                <StackLabel title={title} titleWidth={112} />

                <Grid item sm={2}>
                    <GroupSelect
                        items={businessLineList}
                        title={title}
                        value={selectValue}
                        onChange={handleChange}
                        subOnClick={subOnClick}
                    />
                </Grid>
                <Grid item sm={3}>
                    <div className={'tags--wrap'}>
                        {selectItems.map((line) => (
                            <Tag
                                key={line}
                                title={titleValue(line)}
                                isDelete={true}
                                onClick={() => {
                                    console.log('tag클릭');
                                }}
                                onDeleteClick={() => {
                                    deleteLineItemHandler(line);
                                }}
                            />
                        ))}
                    </div>
                </Grid>
            </Grid>
        </>
    );
};
