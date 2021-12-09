const crypto = require('crypto')
const argon2 = require('argon2');
const {decrypt_kms, encrypt_kms} = require('./aws')

async function encryptWithAES(field) {
    const {CiphertextBlob} = await encrypt_kms(field)
    return CiphertextBlob.toString('base64');
}

async function decryptAES(field) {
    const bytes = await decrypt_kms(field);
    return bytes.Plaintext.toString('ascii');
}

async function getCryptoPassword(password){
    const sha512 = crypto.createHash('sha512').update(password).digest('hex');
    const hash = await argon2.hash(sha512);
    const {CiphertextBlob} = await encrypt_kms(hash)
    return CiphertextBlob.toString('base64');
}

async function verifyPassword({hash, password}){
    const sha512 = crypto.createHash('sha512').update(password).digest('hex');

    const bytes = await decrypt_kms(hash);
    const originalPassword = bytes.Plaintext.toString('ascii');

    return argon2.verify(originalPassword, sha512);
}

module.exports = {
    getCryptoPassword,
    verifyPassword,
    encryptWithAES,
    decryptAES
}