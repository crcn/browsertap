var vine = require("vine"),
step = require("step"),
outcome = require("outcome"),
dust = require("dustjs-linkedin"),
fs = require("fs"),
vm = require("vm"),
emailify = require("emailify"),
_ = require("underscore");


// console.log(eval(dust.compile(fs.readFileSync(__dirname + "/views/email/lost_password.dust", "utf8"))).toString());

exports.require = ["plugin-express", "auth"];
exports.plugin = function(server, auth) {
	
	server.get("/live", auth.middleware.authCheckpoint, function(req, res) {
		res.render("screen");
	});
	
	server.get("/payment", auth.middleware.authCheckpoint, function(req, res) {
		res.render("payment");
	});

	server.get("/tools", function(req, res) {
		res.render("tools");
	})
}