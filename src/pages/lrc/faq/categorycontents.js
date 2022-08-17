import { Typography } from '@mui/material';
import './styles.scss';

const CategoryContents = (props) => {
    const { id, content, count, filterClick } = props;

    return (
        <Typography variant="h6" color="inherit" onClick={() => filterClick(id)} className="content__mng--row">
            <a href="#">
                {content}({count})
            </a>
        </Typography>
    );
};

export default CategoryContents;
