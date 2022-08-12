const CRYPT_KEY = process.env.REACT_APP_DEFAULT_CRYPT_KEY || '';
const IV_LENGTH_BYTE = 12;
const SALT_LENGTH_BYTE = 16;
const enc = new TextEncoder();
const dec = new TextDecoder();

const getPasswordKey = async () => {
    const key = await window.crypto.subtle.importKey(
        'raw',
        enc.encode(CRYPT_KEY),
        'PBKDF2',
        false, // whether the key is extractable (i.e. can be used in exportKey)
        ['deriveBits', 'deriveKey'] // can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
    );
    return key;
};

const deriveKey = async (password, salt, keyUsage) => {
    const key = await window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt,
            iterations: 65536,
            hash: 'SHA-256'
        },
        password,
        { name: 'AES-GCM', length: 128 },
        true,
        keyUsage
    );
    return key;
};

const bufferToBase64 = (arrayBuffer) => {
    return window.btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
};

// base64 to arrayBuffer
const base64ToBuffer = (base64) => {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[`${i}`] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
};

export const doEncrypt = async (plainText) => {
    try {
        const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH_BYTE));
        const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH_BYTE));
        const passwordKey = await getPasswordKey();
        const aesKey = await deriveKey(passwordKey, salt, ['encrypt']);
        const encryptedContent = await window.crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv
            },
            aesKey,
            enc.encode(plainText)
        );

        const encryptedContentArr = new Uint8Array(encryptedContent);
        const buff = new Uint8Array(iv.byteLength + salt.byteLength + encryptedContentArr.byteLength);
        buff.set(iv, 0);
        buff.set(salt, iv.byteLength);
        buff.set(encryptedContentArr, iv.byteLength + salt.byteLength);
        return bufferToBase64(buff);
        // return Buffer.concat([buff]).toString('base64');
    } catch (e) {
        console.log(`Error - ${e}`);
        return '';
    }
};

export const doDecrypt = async (cipherText) => {
    try {
        // const encryptedDataBuff = Buffer.from(cipherText, 'base64');
        const encryptedDataBuff = base64ToBuffer(cipherText);
        const iv = encryptedDataBuff.slice(0, IV_LENGTH_BYTE);
        const salt = encryptedDataBuff.slice(IV_LENGTH_BYTE, IV_LENGTH_BYTE + SALT_LENGTH_BYTE);
        const data = encryptedDataBuff.slice(IV_LENGTH_BYTE + SALT_LENGTH_BYTE);
        const passwordKey = await getPasswordKey();
        const aesKey = await deriveKey(passwordKey, salt, ['decrypt']);
        const decryptedContent = await window.crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv
            },
            aesKey,
            data
        );

        return dec.decode(decryptedContent);
    } catch (e) {
        console.log(`Error - ${e}`);
        return '';
    }
};
