if(!global.bTemplates) global.bTemplates = { };

exports.registerViews = function() {
	bTemplates["flash-player"] = require("./flash-player.ejs");
	bTemplates["app-switcher"] = require("./app-switcher.ejs");
	bTemplates["main"] = require("./main.ejs");
	bTemplates["home"] = require("./home.ejs");
	bTemplates["app-progress"] = require("./app-progress.ejs");
	bTemplates["app-loader"] = require("./app-loader.ejs");
	bTemplates["screen"] = require("./screen.ejs");
	bTemplates["alert-notification"] = require("./notifications/alert.ejs");
	bTemplates["click-to-close-notification"] = require("./notifications/click-to-close.ejs");
}