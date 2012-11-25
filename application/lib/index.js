var plugin = require("plugin"),
maestro = require("maestro"),
_ = require("underscore");


var maestroConfig = require("/usr/local/etc/maestro/config.json");




exports.start = function(type) {


	var loader = maestro(_.extend({
		mixpanel: {
			token: "cc862e943db5ae621b531df52e1bfa86"
		},
		postmark: {
			apiKey: "a8442610-e06b-45a3-af06-a605aca343e8",
			from: "support@browsertap.com"
		},
		http: {
			port: 8080
		},
		puppeteers: [
			"http://10.0.1.27:8000"
		]
	}, maestroConfig)).
	require(__dirname + "/common-plugins").
	require(__dirname + "/front-plugins");

	if(type == "slave") loader.require(__dirname + "/maestro-plugins");


	loader.load(function(err) {
		if(err) console.log(arguments[0].stack)
	});
}

