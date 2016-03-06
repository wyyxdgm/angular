var path = require("path");
var fs = require("fs");
var libDate = require("./lib/date");
var config = {
    env: 'dev',
    root_path: __dirname,
    static_path: "static/",
    upload_path: "static/upload/",
    public_path: "static/public/",
    port: 3009,
    log4js: {
        "appenders": [{
            "type": "smtp",
            "recipients": "wyyxdgm@163.com",
            "sender": "wyyxdgm@163.com",
            "subject": 'MAIL FROM CHAT',
            "sendInterval": 5,
            "transport": "SMTP",
            "SMTP": {
                "host": "smtp.163.com",
                "secureConnection": true,
                "port": 25,
                "auth": {
                    "user": "wyyxdgm@163.com",
                    "pass": "228209"
                }
            },
            "category": "mailer"
        }]
    },
    winston: {
        exitOnError: false,
        console: {
            colorize: true,
            level: 'debug',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            timestamp: function() {
                return libDate.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S');
            },
            formatter: function(options) {
                return options.timestamp() + ' ' + options.level.toUpperCase() + ' ' + (undefined !== options.message ? options.message : '') +
                    (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
            }
        },
        dailyRotateFile: {
            filename: 'log/winston',
            datePattern: '.yyyy-MM-dd.log',
            level: 'debug',
            json: false,
            handleExceptions: true,
            humanReadableUnhandledException: true,
            timestamp: function() {
                return libDate.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S');
            }
        }
    },
    module_path: "./routers",
    init: init
}

function init() {
    initPath();
}

function initPath() {
    config.static_path = path.join(config.root_path, config.static_path);
    config.upload_path = path.join(config.root_path, config.upload_path);
    config.public_path = path.join(config.root_path, config.public_path);
}

module.exports = config;