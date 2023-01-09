import Tree from 'components/Tree/Tree';
import { Grid } from '@mui/material';

const LineTree = ({ dataGridRows, onSelect }) => {
    return (
        <Grid xs={4}>
            <div style={{ width: '100%', padding: 30, background: '#ffffff' }}>
                <Tree onSelect={onSelect} treeData={dataGridRows} />
            </div>
        </Grid>
    );
};

export default LineTree;
