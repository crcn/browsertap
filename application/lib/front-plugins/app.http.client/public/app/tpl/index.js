if(!global.bTemplates) global.bTemplates = { };

exports.registerViews = function() {
	bTemplates["flash-player"] = require("./flash-player.ejs");
	bTemplates["main"] = require("./main.ejs");
	bTemplates["home"] = require("./home.ejs");
	bTemplates["app-loader"] = require("./app-loader.ejs");
	bTemplates["screen"] = require("./screen.ejs");
}