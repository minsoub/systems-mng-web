import { Grid, Stack, FormControl, InputLabel, MenuItem, ListSubheader, Select } from '@mui/material';
import TreeView from '@mui/lab/TreeView';

import cx from 'classnames';

import './GroupSelect.module.scss';
// ==============================|| GroupSelect  ||============================== //

export default function GroupSelect({ items, title, value, onChange, subOnClick }) {
    return (
        <FormControl sx={{ m: 1, minWidth: '250px' }}>
            <InputLabel htmlFor="grouped-select">{title}</InputLabel>
            <Select id="grouped-select" labelId="grouped-select" name="grouped-select" value={value} onChange={onChange}>
                {items.map((item) => {
                    const { id, name, children } = item;

                    if (children.length) {
                        return (
                            <div key={id}>
                                <MenuItem sx={{ color: '#8C8C8C' }} value={id} onClick={() => subOnClick(id)}>
                                    {name}
                                </MenuItem>
                                {children.map((subItem) => (
                                    <MenuItem
                                        sx={{ paddingLeft: 5 }}
                                        key={subItem.id}
                                        value={subItem.id}
                                        onClick={() => subOnClick(subItem.id)}
                                    >
                                        {subItem.name}
                                    </MenuItem>
                                ))}
                            </div>
                        );
                    } else {
                        return (
                            <MenuItem key={id} className={cx('menu--item')} value={id}>
                                {name}
                            </MenuItem>
                        );
                    }
                })}
            </Select>
        </FormControl>
    );
}
