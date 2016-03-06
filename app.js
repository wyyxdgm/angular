// Load required packages
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var compression = require('compression');
var ejs = require('ejs');
var winston = require('winston');
var chalk = require('chalk');

var favicon = require('serve-favicon');
//self lib
var libDate = require('./lib/date');
var libDb = require('./lib/db');
var libFile = require('./lib/file');
var sendRes = require('./lib/response').sendRes;
var Logger = require('./lib/log');
/*init config*/
var config = require('./config');
config.init();

var app = express();
app.set('port', config.port);
/*use*/
app.use(bodyParser.urlencoded({
    extended: true
}));
/*transport engine*/
app.use(bodyParser.json());
app.use(compression()); //use compression
app.set('views', path.join(__dirname, 'static/build/html'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

/*static server*/
app.use(express.static(config.static_path));
app.use(favicon(path.join(__dirname, 'static/favicon.ico')));

/*log*/
app.use(function(req, res, next) {
    req._startTime = (new Date);
    var _origin_end = res.end;
    res.end = function(chunk, encoding) {
        var log = "";
        res.responseTime = (new Date) - req._startTime;
        res.end = _origin_end;
        res.end(chunk, encoding);
        log += req.method + " " + chalk.blue(req.originalUrl) + '\n';
        if (req.method != "GET" && req.method != "DELETE") {
            var bodystr = JSON.stringify(req.body, undefined, 2);
            if (bodystr != "{}")
                log += bodystr + '\n';
        }
        log += req.headers['user-agent'] + '\n';
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        log += '[' + ip + '] ' + res.responseTime + 'ms';
        Logger.debug(log);
    }
    next();
});

/*render config*/
app.use(function(req, res, next) {
    var _origin_render = res.render;
    res.render = function(view, options, fn) {
        if (!options) options = {};
        if (!options.config) options.config = config;
        _origin_render.apply(res, arguments);
    }
    next();
});

/*Create our Express router*/
/*---------------------------------------------*/
app.use(require('./routers/index'));
app.use('/test', require('./routers/test'));





/*---------------------------------------------*/

/*404 && 500 resolve*/
app.get('/404', function(req, res, next) {
    res.status(404).send('您访问的页面不存在');
});
app.get('/500', function(req, res, next) {
    res.status(500);
    res.send('服务器内部错误');
});
app.use(function(req, res, next) {
    res.redirect('/404');
});
app.use(function(err, req, res, next) {
    Logger.error(err);
    res.redirect('/500');
});
module.exports = app;