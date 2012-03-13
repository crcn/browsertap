//#include ./plugins


var beanie = require("beanie"),
config     = require("./config"),
_          = require("underscore");


beanie.
params({
	daisy: _.extend({
		name: "eyebrowse"
	}, config)
}).
factory(function(module, options, params) {
	console.log('loading plugin ' + params.__name);
	return module.plugin.call(this, options, params);
}).
require("fig"). //views
require("malt"). //models
require("daisy"). //backend hooks
require("mesh-http"). //history
require("mesh-spiceio"). //authentication
require("beanpoll-store"). //storage
require(__dirname + "/plugins"). //plugins specific to this app
load();
