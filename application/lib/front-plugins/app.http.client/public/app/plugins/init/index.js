var ScreenLoader = require("./screenLoader"),
qs = require("querystring");

exports.require = ["router", "app.part.main", "puppeteer"];
exports.plugin = function(router, mainPlugin, puppeteer) {

	// var query = qs.parse(String(window.location).split("")

	router.on({
		"pull -http live": function(req, res) {
			loader.load(req.query);
			res.end();
		}
	});

	var loader = new ScreenLoader(puppeteer),
	screen = new mainPlugin.views.Screen({ el: ".screen", loader: loader }),
	appSwitcher = new mainPlugin.views.AppSwitcher({ el: ".app-switcher", router: router, loader: loader });

	key("shift+tab", function(e) {
		appSwitcher.toggleShow();
	});



	loader.on("locationChange", function(location) {
		router.redirect("/live", { open: location.href, app: loader._app }, false);
	});

}