import React, { useRef } from 'react';
import { doEncrypt, doDecrypt } from 'utils/Crypt';
import { Button, Grid, Typography, OutlinedInput, InputLabel, Stack } from '@mui/material';
import MainCard from 'components/MainCard';
import DefaultButton from 'components/button/DefaultButton';

const CryptoSample = () => {
    const refPayload = useRef(null);
    const refEncrypted = useRef(null);
    const handleEncButton = () => {
        const val = refPayload.current.value;
        refEncrypted.current.value = doEncrypt(val);
    };
    const handleDecButton = () => {
        const encText = refEncrypted.current.value;
        refPayload.current.value = doDecrypt(encText);
    };

    return (
        <Grid container rowSpacing={2} columnSpacing={0.75}>
            <Grid item xs={12} md={12} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Crypto sample</Typography>
                    </Grid>
                </Grid>
                <Stack spacing={1}>
                    <InputLabel htmlFor="lastname-signup">Peirod*</InputLabel>
                    <OutlinedInput fullWidth id="lastname-signup" inputRef={refPayload} />
                </Stack>
                <Stack spacing={1}>
                    <InputLabel htmlFor="lastname-signup">Encrypted</InputLabel>
                    <OutlinedInput fullWidth id="lastname-signup" inputRef={refEncrypted} />
                </Stack>
            </Grid>
            <Grid item xs={8} md={10} lg={10}></Grid>
            <Grid item xs={2} md={1} lg={1}>
                <DefaultButton buttonType="primary" onButtonClick={handleEncButton}>
                    Encrypt
                </DefaultButton>
            </Grid>
            <Grid item xs={2} md={1} lg={1}>
                <DefaultButton buttonType="primary" onButtonClick={handleDecButton}>
                    Decrypt
                </DefaultButton>
            </Grid>
        </Grid>
    );
};

export default CryptoSample;
