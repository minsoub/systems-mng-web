import { Button, Grid, MenuItem, Select, TextField, RadioGroup, Radio, FormControlLabel, Typography } from '@mui/material';
import MainCard from 'components/Common/MainCard';
import ButtonLayout from 'components/Common/ButtonLayout';

const InputField = ({ title, children }) => {
    return (
        <div className={'input--field'} style={{ display: 'flex', gap: '1rem', marginBottom: 8 }}>
            <div
                className={'input--field__label'}
                style={{ flex: 1, display: 'flex', textAlign: 'center', alignItems: 'center', justifyContent: 'flex-end' }}
            >
                <Typography style={{ fontWeight: 700 }}>{title}</Typography>
            </div>
            <div
                className={'input--field__content'}
                style={{ flex: 4, display: 'flex', textAlign: 'center', alignItems: 'center', justifyContent: 'flex-end' }}
            >
                {children}
            </div>
        </div>
    );
};

const LineDetail = ({ inputs, handleBlur, handleChange, saveClick, deleteClick, isUpdate }) => {
    const { id, name, type, use_yn } = inputs;

    return (
        <Grid item xs={8} className="blank--layout">
            <Typography>계열등록</Typography>

            <MainCard sx={{ mt: 2.5 }}>
                <InputField title={'계열명'}>
                    <TextField
                        id="filled-hidden-label-small"
                        type="medium"
                        size="medium"
                        value={name}
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        fullWidth
                    />
                </InputField>
                <InputField title="분류 위치">
                    <TextField
                        id="filled-hidden-label-small"
                        type="medium"
                        size="medium"
                        value={name}
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        fullWidth
                    />
                </InputField>
                <InputField title="정렬 순서">
                    <TextField
                        id="filled-hidden-label-small"
                        type="medium"
                        size="medium"
                        value={name}
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        fullWidth
                    />
                </InputField>
                <InputField title="사용 여부">
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="use_yn"
                        value={use_yn}
                        onChange={handleChange}
                    >
                        <FormControlLabel value="true" control={<Radio />} label="사용함" />
                        <FormControlLabel value="false" control={<Radio />} label="사용안함" />
                    </RadioGroup>
                </InputField>
            </MainCard>
            <ButtonLayout>
                <Button disableElevation size="medium" type="submit" variant="contained" onClick={saveClick}>
                    저장
                </Button>
                <Button
                    disableElevation
                    disabled={!isUpdate}
                    size="medium"
                    type="submit"
                    variant="outlined_d"
                    color="secondary"
                    onClick={deleteClick}
                >
                    삭제
                </Button>
            </ButtonLayout>
        </Grid>
    );
};

export default LineDetail;
