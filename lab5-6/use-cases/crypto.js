const crypto = require('crypto')
const argon2 = require('argon2');
const CryptoJS = require("crypto-js");

async function encryptWithAES(field) {
    return CryptoJS.AES.encrypt(field, 'one').toString();
}

async function decryptAES(field) {
    const bytes  = CryptoJS.AES.decrypt(field, 'one');
    return bytes.toString(CryptoJS.enc.Utf8);
}

async function getCryptoPassword(password){
    const sha512 = crypto.createHash('sha512').update(password).digest('hex');
    const hash = await argon2.hash(sha512);
    return CryptoJS.AES.encrypt(hash, 'one').toString();
}

async function verifyPassword({hash, password}){
    const sha512 = crypto.createHash('sha512').update(password).digest('hex');

    const bytes  = CryptoJS.AES.decrypt(hash, 'one');
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    return argon2.verify(originalPassword, sha512);
}

module.exports.getCryptoPassword = getCryptoPassword;
module.exports.verifyPassword = verifyPassword;

module.exports.encryptWithAES = encryptWithAES;
module.exports.decryptAES = decryptAES;