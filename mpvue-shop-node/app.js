const koa = require('koa');
const config = require('./config');
const router = require('./routes');

const app = new koa()

app.use(router.routes())

app.listen(config.port, () => {
    console.log('server is started at port 3000')
})


