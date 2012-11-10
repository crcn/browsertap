var _ = require("underscore");

exports.require = ["router", "app.controller"];
exports.name = "init";
exports.plugin = function(router, controller, loader) {

	console.log(router.root)
	window.App = Ember.Application.create({
		ApplicationController: Ember.Controller.extend({}),
		ApplicationView: Ember.View.extend({
			"templateName": "app"
		}),
		Router: router.initialize()
	});

	loader.modules(".*?.part.*").forEach(function(module) {
		_.extend(window.App, module.views || {});
	});

	$(document).ready(function() {
		window.App.initialize();
	});
}