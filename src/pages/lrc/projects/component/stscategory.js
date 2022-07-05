import {
    OutlinedInput,
    Box,
    Button,
    Grid,
    Stack,
    TextField,
    Collapse,
    Alert,
    AlertTitle,
    Typography,
    FormControl,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Radio,
    RadioGroup,
    Tab,
    Tabs
} from '@mui/material';

const StsCategory = (props) => {
    const { id, content, count, filterClick } = props;

    return (
        <Grid item xs={8} sm={1}>
            <Typography variant="caption" color="inherit" onClick={() => filterClick(id)}>
                {content}({count})
            </Typography>
        </Grid>
    );
};

export default StsCategory;
