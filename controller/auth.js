var L = require("../lib/log");
// Load required packages
var passport = require('passport');
var random = require("../lib/random");
var db = require("../lib/db");
var libEncrypt = require("../lib/encrypt");
var User = db.getModel("account");
var BearerStrategy = require('passport-http-bearer').Strategy;
var midware = {
	token: {},
	right: {}
};
//login auth
passport.use("token", new BearerStrategy(
	function(token, done) {
		User.select({
			token: token
		}, function(err, user) {
			L.info("passport: " + token);
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false);
			}
			return done(null, user, {
				scope: "all"
			});
		});
	}
));

midware.token = passport.authenticate("all", {
	session: false
});
//right auth
function passportRight(right) {
	passport.use(right, new BearerStrategy(
		function(token, done) {
			User.select({
				token: token
			}, function(err, user) {
				if (err) {
					return done(err);
				}
				if (!user || !user[right]) {
					return done(null, false);
				}
				return done(null, user, {
					scope: 'all'
				});
			});
		}
	));
	midware.right[right] = passport.authenticate(right, {
		session: false
	});
}

passportRight("admin");
passportRight("pay");
passportRight("censor");
passportRight("stat");
passportRight("op");
passportRight("censor");


module.exports.midware = midware;