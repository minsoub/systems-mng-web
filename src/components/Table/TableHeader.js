/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import {Button, Grid} from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
//
const TableHeader = ({ type, newAdd, dataTotal }) => {
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
                <span>전체 : {dataTotal}건</span>
            </div>
            <div>
                {type === 'notice' && (
                    <>
                        <Button disableElevation size="medium" type="submit" variant="contained" className={styles.banner}>
                            배너 해제
                        </Button>
                        <Button disableElevation size="medium" type="submit" variant="contained" className={styles.banner}>
                            배너 설정
                        </Button>
                    </>
                )}
                <Button disableElevation size="medium" type="submit" variant="contained" onClick={newListAdd}>
                    신규
                </Button>
            </div>
        </Grid>
    );
};

export default TableHeader;

TableHeader.propTypes = {
    type: PropTypes.string,
    newAdd: PropTypes.func,
    dataTotal: PropTypes.number
};
TableHeader.defaultProps = {
    dataTotal: 0
};