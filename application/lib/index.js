var plugin = require("plugin"),
maestro = require("maestro"),
_ = require("underscore");


var maestroConfig = require("/usr/local/etc/maestro/config.json");




exports.start = function(type) {


	var loader = maestro(_.extend({
		emailer: {
			postmark: {
				apiKey: "a8442610-e06b-45a3-af06-a605aca343e8",
				from: "support@browsertap.com"
			}
		},
		http: {
			port: 8080,
			loginRedirect: "/live",
			lostPasswordEmailTpl: __dirname + "/front-plugins/app.http.client/views/email/lost_password.dust"
		}
	}, maestroConfig)).
	paths(__dirname + "/../node_modules").
	require("plugin-express.middleware.dust").
	require("emailer").
	require("auth").
	require(__dirname + "/front-plugins");

	if(type == "slave") loader.require(__dirname + "/maestro-plugins");


	loader.load(function(err) {
		if(err) console.log(arguments[0].stack)
	});
}

