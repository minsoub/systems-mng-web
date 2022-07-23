import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import TreeItem, { treeItemClasses, useTreeItem } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: 'var(--tree-view-color)'
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: 'inherit'
        }
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 20,
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(1)
        }
    }
}));

function CheckTreeItem(props) {
    const {
        classes,
        className,
        dataClick,
        icon: iconProp,
        expansionIcon,
        displayIcon,
        dataMsg,
        bgColor,
        color,
        visible,
        labelText,
        visibleChange,
        ...other
    } = props;

    const [visibleItem, setVisibleItem] = useState(false);

    useEffect(() => {
        setVisibleItem(visible);
    }, [visible]);

    const handleChange = (e) => {
        visibleChange(dataMsg, e.target.checked);
        setVisibleItem(e.target.checked);
    };
    const icon = iconProp || expansionIcon || displayIcon;

    const { disabled, expanded, selected, focused, handleExpansion, handleSelection, preventSelection } = useTreeItem(dataMsg);

    const handleMouseDown = (event) => {
        console.log('handleMouseDown called...');
        preventSelection(event);
    };
    const handleExpansionClick = (event) => {
        console.log('handleExpansionClick....');
        handleExpansion(event);
    };

    const handleSelectionClick = (event) => {
        console.log('handleSelectionClick....');
        handleSelection(event);
    };

    return (
        <StyledTreeItemRoot
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }} onMouseDown={handleMouseDown}>
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                    <div onClick={handleExpansionClick}>{icon}</div>
                    <Typography
                        variant="body2"
                        sx={{ fontWeight: 'inherit', flexGrow: 1 }}
                        onMouseDown={handleMouseDown}
                        onDoubleClick={() => dataClick(dataMsg)}
                    >
                        {labelText}
                    </Typography>
                    <Typography variant="caption" color="inherit">
                        {/* <Box
                            id={dataMsg}
                            display={labelPlus}
                            component={PlusSquare}
                            data-msg={dataMsg}
                            color="inherit"
                            sx={{ mr: 1 }}
                            onClick={() => plusSelect(dataMsg)}
                        /> */}
                        <FormControlLabel
                            control={<Checkbox name="is_use" checked={visibleItem} value={visibleItem} onChange={handleChange} />}
                        />
                    </Typography>
                </Box>
            }
            style={{
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor
            }}
            {...other}
        />
    );
}

export default CheckTreeItem;

CheckTreeItem.propTypes = {
    dataMsg: PropTypes.string,
    bgColor: PropTypes.string,
    color: PropTypes.string,
    visible: PropTypes.bool,
    labelText: PropTypes.string.isRequired
};
