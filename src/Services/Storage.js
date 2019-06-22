import SecureStorage from 'secure-web-storage';
var CryptoJS = require("crypto-js");

const LSSK = 'f5g6d31g5sdf6asd5';

export default new SecureStorage(localStorage, {
    hash: function hash(key) {
        key = CryptoJS.SHA256(key, LSSK);
        return key.toString();
    },
    encrypt: function encrypt(data) {
        data = CryptoJS.AES.encrypt(data, LSSK);
        return data.toString();
    },
    decrypt: function decrypt(data) {
        data = CryptoJS.AES.decrypt(data, LSSK);
        return data.toString(CryptoJS.enc.Utf8);
    }
});