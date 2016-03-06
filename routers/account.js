var router = require("express").Router();
var sendJson = require("../lib/response").sendJson;
var sendErr = require("../lib/response").sendErr;
var AccountController = require("../controller/account");

function signin(req, res) {
	AccountController.signin(req, function(err, json) {
		if (err) return sendErr(res, err);
		sendJson(res, json);
	});
}

function signup(req, res) {
	AccountController.signup(req, function(err, json) {
		if (err) return sendErr(res, err);
		sendJson(res, json);
	});
}

function checkDuplicateUser(req, res) {
	AccountController.checkDuplicateUser(req, function(err, json) {
		if (err) return sendErr(res, err);
		return sendJson(res, json);
	})
}

router.route('/signup').post(signup);
router.route('/signin').post(signin);
router.route('/checkDuplicateUser').post(checkDuplicateUser);

module.exports = router;