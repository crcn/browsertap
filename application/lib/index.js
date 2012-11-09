var plugin = require("plugin");

plugin().
params({
	http: {
		port: 8080
	},
	puppeteers: [
		"http://10.0.1.27:8000"
	]
}).
require(__dirname + "/plugins").
load(function(err) {
	if(err) console.log(arguments[0].stack)
});