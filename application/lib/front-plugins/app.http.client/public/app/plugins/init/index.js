var ScreenLoader = require("./screenLoader"),
qs = require("querystring");

exports.require = ["router", "app.part.main", "puppeteer", "commands"];
exports.plugin = function(router, mainPlugin, puppeteer, commands) {

	// var query = qs.parse(String(window.location).split("")

	router.on({
		"pull -http live": function(req, res) {
			loader.load(req.query);
			res.end();
		}
	});

	var loader = new ScreenLoader(puppeteer, commands),
	screen = new mainPlugin.views.Screen({ el: ".screen", loader: loader }),
	appSwitcher = new mainPlugin.views.AppSwitcher({ el: ".app-switcher", router: router, loader: loader });

	key("shift+right, shift+tab", function(e) {
		appSwitcher.shift("right");
	});

	key("shift+left", function(e) {
		appSwitcher.shift("left");
	});

	key("shift+up", function(e) {
		appSwitcher.shift("up");
	});

	key("shift+down", function(e) {
		appSwitcher.shift("down");
	});





	loader.on("locationChange", function(location) {
		router.redirect("/live", { open: location.href, app: loader._appName, version: loader._appVersion }, false);
	});

}