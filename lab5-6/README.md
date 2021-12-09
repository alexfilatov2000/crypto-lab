## lab 5 report

#### Input validation

- Username and email must be unique
- Password has to be between 8 and 64 symbols length
- Password has to contain at least one uppercase character
- Password has to contain at least one digit
- Password has to contain at least one special character
- Password cannot equal one of 100000 common passwords


#### Data storing 

- Username, Email, Name is stored in database
- Phone Number is stored in database as cipher text
- Password hash is stored in database

#### Password hashing

- Password hashed using sha512 algorithm + argon2 + aws KMS(AES-256)
- Password salted by argon2 under the hood

## lab 6 report

#### Input validation

- Any characters are allowed as user sensitive data

#### Data storing

- User sensitive data is encrypted, encoded and stored in database

#### Data encryption

- For user sensitive data used few steps encryption
- Firstly, data encryption key is encrypted using [AWS Encryption SDK](https://docs.aws.amazon.com/encryption-sdk/latest/developer-guide/introduction.html), using AES in GCM mode with 256 bits key size
- Secondly The key which was used for data encryption key encryption is stored in [AWS KMS](https://aws.amazon.com/en/kms)
- Finally, encrypted key and data are encoded into base64 and stored in database

#### Prevented attack vectors

- Data breach and data leaks prevented because when attacker compromise data of some user, it is not possible to get access to other users' data using compromised one, encryption key stored in AWS KMS and data encryption key protect data
- SQL injections prevented because sensitive data stored in encrypted and encoded form

### Not prevented attack vectors

- Stealing AWS KMS credentials and key id which allows to decrypt any data encryption key
- OS penetration and stealing database credentials