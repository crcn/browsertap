//#include routes.js

var beanie = require('beanie').loader();


beanie.
params({
	publicDir: __dirname + "/../web",
	http: {
		port: 8080
	}
}).
paths(__dirname + "/node_modules").
require(__dirname + '/routes.js').
require('mesh-http').
load(function() {
	setTimeout(function() {
		beanie.router.push('init');
	}, 500);
});