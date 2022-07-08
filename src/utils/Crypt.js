import CryptoJS from 'crypto-js';

const CRYPT_KEY = process.env.REACT_APP_DEFAULT_CRYPT_KEY;

export const doEncrypt = (val) => {
    const ciphertext = CryptoJS.AES.encrypt(val, CryptoJS.enc.Utf8.parse(CRYPT_KEY), {
        iv: CryptoJS.enc.Utf8.parse(CRYPT_KEY.substring(0, 16)),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC // [cbc 모드 선택]
    });
    const cypherString = ciphertext.toString();
    return cypherString;
};

export const doDecrypt = (encText) => {
    const decrypted = CryptoJS.AES.decrypt(encText, CryptoJS.enc.Utf8.parse(CRYPT_KEY), {
        iv: CryptoJS.enc.Utf8.parse(CRYPT_KEY.substring(0, 16)),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC // [cbc 모드 선택]
    });
    const decString = decrypted.toString(CryptoJS.enc.Utf8);
    return decString;
};