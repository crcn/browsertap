module.exports = function() {
	var args = Array.apply([], arguments);


	//#include ./plugins

	head.ready(function() {


		var beanie = require("beanie"),
		config     = require("./config"),
		_          = require("underscore");


		var loader = beanie.
		loader().
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
		require("beanpoll-store"); //storage
			
		for(var i = args.length; i--;) {
			loader.require(args[i]);
		}

		loader.load();

	});

}