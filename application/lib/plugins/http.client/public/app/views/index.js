exports.registerViews = function() {
	Ember.TEMPLATES["flash-player"] = require("./flash-player.hb");
	Ember.TEMPLATES["main"] = require("./main.hb");
	Ember.TEMPLATES["home"] = require("./home.hb");
	Ember.TEMPLATES["app"] = require("./app.hb");
	Ember.TEMPLATES["app-loader"] = require("./app-loader.hb");
	Ember.TEMPLATES["screen"] = require("./screen.hb");
}