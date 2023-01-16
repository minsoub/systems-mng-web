import React, { useMemo } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import cx from 'classnames';

import './styles.scss';
// ==============================|| GroupSelect  ||============================== //

export default function GroupSelect({ items, title, value, onChange, subOnClick }) {
    const tourList = useMemo(() => {
        const result = [];
        if (Array.isArray(items)) {
            for (const item of items) {
                result.push(item);
                if (item.children.length) {
                    for (const subItem of item.children) {
                        result.push(subItem);
                    }
                }
            }
        }
        return result;
    }, [items]);

    return (
        <FormControl sx={{ m: 1, minWidth: '250px' }}>
            <InputLabel htmlFor="grouped-select">{title}</InputLabel>
            <Select id="grouped-select" labelId="grouped-select" name="grouped-select" value={value} onChange={onChange}>
                {tourList.map((item) => {
                    const { id, name, children, parent_id } = item;

                    // if (Array.isArray(children)) {
                    //     return (
                    //         <div key={id}>
                    //             <MenuItem sx={{ color: '#8C8C8C' }} value={id} onClick={() => subOnClick(id)}>
                    //                 {name}
                    //             </MenuItem>
                    //             {children.map((subItem) => (
                    //                 <MenuItem
                    //                     sx={{ paddingLeft: 5 }}
                    //                     key={subItem.id}
                    //                     value={subItem.id}
                    //                     onClick={() => subOnClick(subItem.id)}
                    //                 >
                    //                     {subItem.name}
                    //                 </MenuItem>
                    //             ))}
                    //         </div>
                    //     );
                    // } else {
                    return (
                        <MenuItem
                            key={id}
                            className={cx('menu--item', { menuParent: children !== null && children.length && true, subMenu: parent_id })}
                            value={id}
                        >
                            {name}
                        </MenuItem>
                    );
                    // }
                })}
            </Select>
        </FormControl>
    );
}
