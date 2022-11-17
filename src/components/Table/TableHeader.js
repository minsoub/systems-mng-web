import {Button,Grid} from '@mui/material';
import styles from './styles.module.scss';
// 
const TableHeader = () => {
    return (
        <Grid className={styles.table_info}>
            <div className={styles.hits}>
                <span>전체 : 50건</span>
            </div>
            <div>
                <Button disableElevation size="medium" type="submit" variant="contained" className={styles.banner}>
                    배너 해제
                </Button>
                <Button disableElevation size="medium" type="submit" variant="contained" className={styles.banner}>
                    배너 설정
                </Button>
                <Button disableElevation size="medium" type="submit" variant="contained">
                    신규
                </Button>
            </div>
        </Grid>
    );
};

export default TableHeader;

TableHeader.propTypes = {
    
};
