var beanie = require('beanie');


beanie.
loader().
params({
	http: {
		port: 8083
	}
}).
paths(__dirname + "/../node_modules").
require('beanpoll-http').
require(__dirname + '/plugins').
load();