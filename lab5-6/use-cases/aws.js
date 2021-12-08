const aws = require('aws-sdk');
const {AWS} = require('../config_aws.json')

aws.config.update({
    credentials: {
        accessKeyId: AWS.ACCESS_KEY_ID,
        secretAccessKey: AWS.ACCESS_SECRET_KEY,
    },
    region: AWS.REGION,
})

const kms = new aws.KMS();

function encrypt_kms(text) {
    return kms.encrypt({
        KeyId: AWS.KMS_KEY_ID,
        Plaintext: text
    }).promise();
}

function decrypt_kms(base64EncryptedString) {
    return kms.decrypt({
        CiphertextBlob: Buffer(base64EncryptedString, 'base64')
    }).promise();
}

module.exports = {
    encrypt_kms,
    decrypt_kms
}