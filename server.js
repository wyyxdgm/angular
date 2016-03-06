var fs = require("fs");
if (!fs.existsSync("log")) fs.mkdirSync("log");
var http = require('http');
var db = require("./lib/db");

process.on('uncaughtException', function(err) {
    console.error(err.stack);
});
fs.writeFileSync("process.pid", process.pid);

db.connect(function(err, client) {
    var app = require("./app");
    var server = http.createServer(app);
    if (err) return console.log(err);
    server.listen(app.get("port"), function() {
        console.log('Express server listening on port: ' + app.get("port"));
    });
});