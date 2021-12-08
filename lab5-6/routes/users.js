const Router = require('koa-router');
const controller = require('../controllers/users');
const restRouter = new Router();
module.exports.restRouter = restRouter;

restRouter.post('/register', controller.redirectHome, controller.registerPost);
restRouter.post('/login', controller.redirectHome, controller.loginPost);
restRouter.post('/logout', controller.logoutPost);
restRouter.post('/remindPsw', controller.redirectHome, controller.remindPswPost);
restRouter.get('/register', controller.redirectHome, controller.registerGet);
restRouter.get('/login', controller.redirectHome, controller.loginGet);
restRouter.get('/remindPsw', controller.redirectHome, controller.remindPswGet);
restRouter.get('/', controller.redirectLogin, controller.homeGet);


