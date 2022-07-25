import React, { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TreeItem, { useTreeItem } from '@mui/lab/TreeItem';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { Checkbox, FormControlLabel } from '@mui/material';

const CustomContent = forwardRef((props, ref) => {
    const { classes, className, label, nodeId, icon: iconProp, expansionIcon, displayIcon, visible, visibleChange, dataClick } = props;
    const { disabled, expanded, selected, focused, handleExpansion, handleSelection, preventSelection } = useTreeItem(nodeId);
    const icon = iconProp || expansionIcon || displayIcon;

    const [visibleItem, setVisibleItem] = useState(visible);

    const handleMouseDown = (event) => {
        preventSelection(event);
    };

    const handleExpansionClick = (event) => {
        handleExpansion(event);
    };

    const handleSelectionClick = (event) => {
        handleSelection(event);
        dataClick();
    };

    useEffect(() => {
        //console.log('visible value => {}', visible);
    }, []);

    useEffect(() => {
        //console.log(visible);
        setVisibleItem(visible);
    }, [visible]);

    const handleChange = (e) => {
        //console.log(others);
        visibleChange(nodeId, e.target.checked);
        setVisibleItem(e.target.checked);
    };

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            className={clsx(className, classes.root, {
                [classes.expanded]: expanded,
                [classes.selected]: selected,
                [classes.focused]: focused,
                [classes.disabled]: disabled
            })}
            onMouseDown={handleMouseDown}
            ref={ref}
        >
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <div onClick={handleExpansionClick} className={classes.iconContainer}>
                {icon}
            </div>
            <Typography onClick={handleSelectionClick} component="div" className={classes.label}>
                {label}
            </Typography>
            <Typography variant="caption" color="inherit">
                <FormControlLabel
                    size="small"
                    control={<Checkbox name="is_use" size="small" checked={visibleItem} value={visibleItem} onChange={handleChange} />}
                />
            </Typography>
        </div>
    );
});

CustomContent.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    displayIcon: PropTypes.node,
    expansionIcon: PropTypes.node,
    icon: PropTypes.node,
    label: PropTypes.node,
    nodeId: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    visibleChange: PropTypes.func
};

const CheckBoxTreeItem = (props) => {
    const { visible, visibleChange, dataClick } = props;
    return (
        <TreeItem
            ContentComponent={CustomContent}
            ContentProps={{
                visible: visible,
                visibleChange: visibleChange,
                dataClick: dataClick
            }}
            {...props}
        />
    );
};

export default CheckBoxTreeItem;
