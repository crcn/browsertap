var plugin = require("plugin"),
maestro = require("maestro"),
_ = require("underscore");


var maestroConfig = require("/usr/local/etc/maestro/config.json");




exports.front = function() {
	plugin().
	params(_.extend({
		http: {
			port: 8080
		},
		puppeteers: [
			"http://10.0.1.27:8000"
		]
	}, maestroConfig)).
	require(__dirname + "/common-plugins").
	require(__dirname + "/front-plugins").
	load(function(err) {
		if(err) console.log(arguments[0].stack)
	});
}

exports.maestro = function() {
	maestro(maestroConfig).
	require(__dirname + "/common-plugins").
	require(__dirname + "/maestro-plugins").
	load();
}