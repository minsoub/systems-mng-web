import { Typography } from '@mui/material';
import './styles.scss';

const CategoryContents = (props) => {
    const { id, content, count, filterClick } = props;

    return (
        <Typography variant="h6" color="inherit" onClick={() => filterClick(id)} className="content__mng--row">
            {content}({count})
        </Typography>
    );
};

export default CategoryContents;
