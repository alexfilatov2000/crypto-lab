const Joi = require('joi');
const passwordComplexity = require("joi-password-complexity");


function validatePassword(password) {
    const complexityOptions = {
        min: 8,
        max: 64,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
    };

    return passwordComplexity(complexityOptions).validate(password);
}

module.exports.validatePassword = validatePassword

module.exports.registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    login: Joi.string().min(3).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    password2: Joi.ref('password'),
    phone: Joi.string().min(8).pattern(/^[0-9]+$/).required(),
});

module.exports.loginSchema = Joi.object({
    login: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
});

module.exports.remindPswSchema = Joi.object({
    email: Joi.string().min(6).required().email()
});