import Koa from 'koa';
import koaStatic from 'koa-static';
import koaBody from 'koa-body';


const app = new Koa();
app.use(koaStatic('./dist'));
app.use(koaBody({
    multipart: true,
}));

app.use(async (ctx: Koa.Context, next: Koa.Next) => {
    console.log("middleware 1")
    next();
})

app.use(async (ctx: Koa.Context) => {
    console.log("middleware 2000")
})

app.on('error', (err) => {
    console.error('Server error: ', err);
});

app.on('connection', (...args) => {
    console.log('New connection on port 3000!');
});

app.listen(3000);

