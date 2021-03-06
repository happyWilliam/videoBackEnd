const fs = require('fs')
const path = require('path')
const express = require('express')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const resolve = file =>path.resolve(__dirname, file)
// var config = require('../build/webpack.base.config')
const app = express()
const api = require('./api')
const feapi = require('./fe')
const session = require('express-session')
const redisStore = require('connect-redis')(session)

app.use(cookieParser());  
app.use(session({  
  store: new redisStore({
    host: "localhost",
    port: 6379,
    db: "0"
  }),
  resave:false,
  saveUninitialized:true,
  secret: 'excited',
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
}));  

//主机允许跨域
app.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("X-Powered-By",' 3.2.1')  
    res.header("Content-Type", "application/json;charset=utf-8");  
    next();  
});  

// const createBundleRenderer = require('vue-server-renderer').createBundleRenderer

app.set('port', (process.env.port || 8080))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use('/dist', express.static(resolve('../dist')))
app.use('/upload',express.static(resolve('../upload')));
app.use(api)
app.use(feapi)

app.get('*', function (req, res) {
  const html = fs.readFileSync(resolve('../index.html'), 'utf-8')
  res.send(html)
})

app.listen(app.get('port'), function () {
  console.log('Visit http://localhost:' + app.get('port'))
})
