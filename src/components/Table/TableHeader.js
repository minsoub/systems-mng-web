import {Button,Grid} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './styles.module.scss';
//
const TableHeader = ({type, newAdd}) => {
    const navigate = useNavigate();
    const newListAdd = () => {
        if (type === 'category') {
            newAdd();
        } else {
            navigate(`/cms/${type}/reg`);
        }
    };
    return (
        <Grid className={styles.table_info}>
            <div className={styles.hits}>
                <span>전체 : 50건</span>
            </div>
            <div>
                {type === 'notice' ? (
                    <>
                        <Button disableElevation size="medium" type="submit" variant="contained" className={styles.banner}>
                            배너 해제
                        </Button>
                        <Button disableElevation size="medium" type="submit" variant="contained" className={styles.banner}>
                            배너 설정
                        </Button>
                    </>
                ) : (
                    <></>
                )}
                <Button disableElevation size="medium" type="submit" variant="contained" onClick={newListAdd}>
                    신규
                </Button>
            </div>
        </Grid>
    );
};

export default TableHeader;
