var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
// var bodyParser = require('body-parser');
var proxy = require('http-proxy-middleware');
var history = require('connect-history-api-fallback');
// var multer = require('multer'); // 这个最好不要作为全局中间件，应该是某一个特定的路由下的中间件
// var cookieParser = require('cookie-parser'); // 全局cookie设置

var app = express();

// 全局cookie中间件
// app.use(cookieParser(config.cookieSign));
app.use(history());

// 设置静态文件路径
app.use(serveStatic(path.resolve('./dist'), { 'index': ['index.html', 'index.htm'] }));

app.use('/api', proxy({
    target: 'http://www.pigcome.com:8082',
    pathRewrite: {
        '^/api': ''
    },
    changeOrigin: true
}));
app.use('/test', proxy({
    target: 'http://www.pigcome.com:8081',
    pathRewrite: {
        '^/test': ''
    },
    changeOrigin: true
}));

app.listen(8086, '0.0.0.0', function() {
    console.log('启动成功！');
});