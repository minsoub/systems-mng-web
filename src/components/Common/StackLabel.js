import { Stack } from '@mui/material';

const StackLabel = ({ title, titleWidth }) => {
    const titleWidthVal = titleWidth + 'px';
    return <Stack sx={{ minWidth: titleWidthVal, mr: '10px' }}>{title}</Stack>;
};

export default StackLabel;
