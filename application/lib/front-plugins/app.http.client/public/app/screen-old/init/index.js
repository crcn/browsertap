var _ = require("underscore");

exports.require = ["app.controller"];
exports.name = "init";
exports.plugin = function(controller, loader) {

	window.App = Ember.Application.create({
		ApplicationController: Ember.Controller.extend({}),
		ApplicationView: Ember.View.extend({
			"templateName": "app"
		}),
		Router: Ember.Router
	});


	loader.modules(".*?.part.*").forEach(function(module) {
		_.extend(window.App, module.views || {});
	});

	$(document).ready(function() {
		window.App.initialize();
	console.log(window.App.applicationController)
	});
}