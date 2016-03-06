var libRandom = require("../lib/random");
var libDb = require("../lib/db");
var libEncrypt = require("../lib/encrypt");

function auth(username, password, done) {
	var User = libDb.getModel("account");
	User.select({
		'username': username
	}, function(err, user) {
		if (err) {
			return done(err);
		}
		if (!user) {
			return done("username doesn't exist", null, 1);
		}
		libEncrypt.bcryptcompare(password, user.password, function(err, isMatch) {
			if (err) return done(err);
			else if (isMatch) {
				var token = libRandom.hat();
				User.update({
					'_id': user._id
				}, {
					'token': token
				}, function(err, result) {
					if (err) return done(err);
					else {
						return done(null, {
							id: user._id,
							username: user.username,
							token: token
						});
					}
				});
			} else return done("incorrect password", null, 2);
		});
	});
}

function signin(body, fn) {
	if (body.body) body = body.body;
	if (!body.username || !body.password) {
		fn("no username or password");
		return;
	}
	auth(body.username, body.password, fn);
}

function signup(body, fn) {
	if (body.body) body = body.body;
	if (!body.username || !body.password) {
		fn("no username or password");
		return;
	}
	var json = {};
	var user = json.username = body.username;
	var pass = json.password = body.password;
	var User = libDb.getModel("account");
	User.insert(json, function(err, doc) {
		if (err) {
			if (err.code == 11000) fn(err, null, 1);
			else fn(err);
		} else {
			auth(user, pass, function(err, user, message) {
				if (err) fn("signin after signup err");
				else fn(null, user);
			});
		}
	});
}

function checkDuplicateUser(username, fn) {
	var User = libDb.getModel("account");
	User.select({
		"username": username
	}, null, function(err, result) {
		if (err) fn(err);
		else
			fn(null, !result);
	});
}

module.exports.auth = auth;
module.exports.signup = signup;
module.exports.signin = signin;
module.exports.checkDuplicateUser = checkDuplicateUser;