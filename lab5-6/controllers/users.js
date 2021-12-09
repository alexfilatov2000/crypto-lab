const argon2 = require('argon2');
const shortid = require('shortid');
const fs = require('fs').promises;
const {User} = require('../models/user');
const {registerSchema, loginSchema, remindPswSchema} = require('../model');
const nodemailer = require('nodemailer')
const {myInfo} = require('../config');
const {resetPasswordTemplate} = require('../mailer');
const {getCryptoPassword, verifyPassword, encryptWithAES} = require("../use-cases/crypto");

module.exports = class UserController {

    static redirectLogin = async (ctx, next) => {
        if (!ctx.session.userId){
            ctx.redirect('/login')
        } else {
            await next();
        }
    }

    static redirectHome = async (ctx, next) => {
        if (ctx.session.userId){
            ctx.redirect('/')
        } else {
            await next();
        }
    }
    static async registerPost(ctx) {
        const data = {...ctx.request.body};
        const user = new User();
        const { error } = registerSchema.validate(data);

        if (error) {
            ctx.session.error = error.message;
            return ctx.redirect('/register');
        }

        if (await user.findByEmail(data.email)){
            // Checking if the user is already in the database
            ctx.session.error = 'Email is already exist';
            return ctx.redirect('/register');
        }

        if (await user.findByLogin(data.login)) {
            ctx.session.error = 'Login is already exist';
            return ctx.redirect('/register');
        }

        const commonPasswords = (await fs.readFile('etc/commonPasswords.txt', 'utf8'))
            .split('\n')

        if (commonPasswords.includes(data.password)) {
            ctx.session.error = 'Your password is too weak';
            return ctx.redirect('/register');
        }

        const cryptoPassword = await getCryptoPassword(data.password);
        data.phone = await encryptWithAES(data.phone)

        await user.save({...data, password: cryptoPassword});
        ctx.session.error = '';
        ctx.session.loginErr = '';
        ctx.redirect('/login');
    }

    static async loginPost(ctx) {
        const data = {...ctx.request.body};
        const user = new User();
        const { error } = loginSchema.validate(data);
        if (error) {
            ctx.session.loginErr = error.message;
            return ctx.redirect('/login');
        }
        // Checking if the email exists
        const userByLogin = await user.findByLogin(data.login);
        if (!userByLogin){
            ctx.session.loginErr = 'Login is not found';
            return ctx.redirect('/login');
        }
        // Password is correct
        const isValidPassword = await verifyPassword({
            hash: userByLogin.password,
            password: data.password
        })

        if (!isValidPassword){
            ctx.session.loginErr = 'Invalid password';
            return ctx.redirect('/login');
        }

        await user.setActiveStatusByLogin(data.login);
        ctx.session.loginErr = '';
        ctx.session.userId = data.login;
        ctx.redirect('/');
    }

    static async logoutPost(ctx) {
        const user = new User();
        await user.setInactiveStatusByLogin(ctx.session.userId)
        ctx.session.userId = null;
        ctx.redirect('/login');
    }

    static async remindPswPost(ctx){
        const user = new User();
        const { error } = remindPswSchema.validate(ctx.request.body);
        if (error) {
            ctx.session.remindErr = error.message;
            return ctx.redirect('/remindPsw');
        }
        const userByEmail = await user.findByEmail(ctx.request.body.email);
        if (!userByEmail){
            ctx.session.remindErr = 'Email is not found';
            return ctx.redirect('/remindPsw');
        }
        const newPsw = shortid.generate();
        const hash = await argon2.hash(newPsw);
        await user.updatePswByEmail(ctx.request.body.email, hash);

        let userToReset = await user.findByEmail(ctx.request.body.email);
        let emailTemplate = resetPasswordTemplate(userToReset, newPsw);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: myInfo.email,
                pass: myInfo.password,
            },
        });
        const info = await transporter.sendMail(emailTemplate);

        ctx.redirect('/login');
    }

    static async registerGet(ctx) {
        if (typeof ctx.session.error === 'undefined') {
            ctx.session.error = '';
        }
        await ctx.render('main',{
            error: ctx.session.error
        });
    }

    static async loginGet(ctx) {
        if (typeof ctx.session.loginErr === 'undefined') {
            ctx.session.loginErr = '';
        }
        await ctx.render('login',{
            error: ctx.session.loginErr
        });
    }

    static async homeGet(ctx) {
        ctx.body = `
            <h1>Home Page</h1>
            <div style="color: red">Welcome ${ctx.session.userId}</div>
            <br>
            <form action="/logout" method="post">
                <input type="submit" value="Log Out">
            </form>
        `;
    }


    static async remindPswGet(ctx) {
        if (typeof ctx.session.remindErr === 'undefined') {
            ctx.session.remindErr = '';
        }
        await ctx.render('remindPsw',{
            error: ctx.session.remindErr
        });
    }
}