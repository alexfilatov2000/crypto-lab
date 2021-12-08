const Koa = require('koa');
const serve =  require ('koa-static');
const bodyParser = require('koa-bodyparser');
const cors = require ('@koa/cors')
const session = require('koa-session');
const render = require('koa-ejs');
const path = require('path');
const { restRouter } = require('./routes/users');

const app = new Koa();
const PORT = 3000;

render(app, {
    root: path.join(__dirname, 'views'),
    layout: false,
    viewExt: 'html',
    cache: false,
});

app.keys = ['Shh, its a secret!'];
app.use(bodyParser());
app.use(serve(path.join(__dirname, 'public')));
app.use(session(app));
app.use(cors());
app.use(restRouter.routes());

app.use(async(ctx, next) => {
    try {
        await next()
        const status = ctx.status || 404
        if (status === 404) {
            ctx.throw(404)
        }
    } catch (err) {
        ctx.status = err.status || 500
        if (ctx.status === 404) {
            //Your 404.jade
            await ctx.render('404')
        } else {
            //other_error jade
            await ctx.render('other_error')
        }
    }
})


app.listen(PORT, () => {
    console.log(`Koa started on PORT ${PORT}`);
});
