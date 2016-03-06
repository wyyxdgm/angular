var log4js = require('log4js');
var config = require('../config');


var json = {
    getMailer: function(name) {
        if (!json.configed) {
            log4js.configure(config.log4js);
            json.configed = true;
        }
        return log4js.getMailer("mailer")
    }
};



module.exports = json;