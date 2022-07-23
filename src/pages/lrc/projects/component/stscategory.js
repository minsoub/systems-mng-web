import { Grid, Typography } from '@mui/material';

const StsCategory = (props) => {
    const { id, content, count, filterClick } = props;

    return (
        <Grid item xs={8} sm={1}>
            <Typography variant="h6" color="inherit" onClick={() => filterClick(id)}>
                {content}({count})
            </Typography>
        </Grid>
    );
};

export default StsCategory;
