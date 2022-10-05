import { Stack } from '@mui/material';

const StackLabel = ({title}) => {
    return (
        <Stack sx={{ minWidth:'120px', width: '120px', mr: '10px'}}>
            {title}
        </Stack>
    );
};

export default StackLabel;
