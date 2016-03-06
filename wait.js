// Load required packages
var express = require('express');
var bodyParser = require('body-parser');
var passport = require("passport");
var path = require("path");
var multipart = require('connect-multiparty');
var fs = require("fs");

//self lib
var libDate = require("./lib/date");
var libDb = require('./lib/db');
var config = require('./config');
var auth = require('./lib/auth');
var libFile = require("./lib/file");
var sendRes = require("./response").sendRes;


//config
var uploadPath = config.upload_path;
var publicPath = config.public_path;

// Create our Express application
var app = express();

app.set('port', config.port);
//use
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(express.static(config.public_path));
app.use(function(req, res, next) {
	var log = "\x1b[1;36m";
	log += req.method + " " + req.originalUrl + "\n";
	if (req.method != "GET" && req.method != "DELETE") {
		var bodystr = JSON.stringify(req.body, undefined, 2);
		if (bodystr != "{}")
			log += JSON.stringify(req.body, undefined, 2) + "\n";
	}
	log += req.headers['user-agent'] + "\n";
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	log += ip + "\n" + new Date();
	log += "\x1b[0m";
	console.log(log);
	next();
});
// Use the passport package in our application
app.use(passport.initialize());


app.get("/", sendIndex);
app.get("/index.html", sendIndex);

function sendIndex(req, res) {
	console.log(req.query);
	var src = req.query.src || "raw";
	var websitestat = libDb.getModel("websitestats");
	websitestat.upsert2({
		src: src,
		date: libDate.getDate(new Date())
	}, {
		$inc: {
			count: 1
		}
	});
	fs.createReadStream(config.public_path + "index.html").pipe(res);
}



// Create our Express router
var router = express.Router();


libFile.mkdirpSync(path.resolve(uploadPath, "account/idcard_photo"));
router.route('/account/idcard_photo')
	.post(auth.midware, multipart({
		uploadDir: path.resolve(uploadPath, 'account/idcard_photo/')
	}), sendRes(account.uploadIdcard));

router.route('/account/idcard_photo/:filename')
	.get(account.downloadUploadAccountIdcard_photo);
var Location = require("../controllers/location");
router.route('/sendLocation')
	.post(auth.midware, sendRes(Location.send));

var Apk = require("../controllers/apk");
router.route('/checkUpdateApk')
	.post(sendRes(Apk.checkUpdate));
router.route('/downloadApk/:filename')
	.get(sendRes(Apk.download));
router.route('/download/:code')
	.get(Apk.downloadPage);

var Email = require("../controllers/email");
router.route('/sendEmail')
	.post(auth.midware, sendRes(Email.sendEmail));
router.route('/verifyEmail/:email/:code')
	.get(sendRes(Email.verifyEmail));

router.route('/getip')
	.get(function(req, res) {
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		res.send(ip);
	});


router.route('/getkey/:key').get(function(req, res) {
	DB.redisClient.get(req.params.key, function(err, reply) {
		res.send(reply);
	});
})
router.route('/setkey/:key').post(auth.midware, function(req, res) {
	DB.redisClient.set(req.params.key, decodeURIComponent(req.body.text), function(err) {
		res.send({
			success: true
		});
	});
})

app.use('/api', router);

module.exports = app;