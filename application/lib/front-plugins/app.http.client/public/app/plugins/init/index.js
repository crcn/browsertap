var ScreenLoader = require("./screenLoader"),
qs = require("querystring"),
Url = require("url");

exports.require = ["router", "app.part.main", "puppeteer", "commands"];
exports.plugin = function(router, mainPlugin, puppeteer, commands) {

	// var query = qs.parse(String(window.location).split("")

	router.on({
		"pull -http live": function(req, res) {
			loader.load(req.query);
			res.end();
		}
	});

	var loader = new ScreenLoader(puppeteer, commands), screen, appSwitcher,
	loadingView = new mainPlugin.views.Loader({ el: ".loader" });


	key("shift+left", function(e) {
		appSwitcher.shift("left");
	});

	key("shift+up", function(e) {
		appSwitcher.shift("up");
	});

	key("shift+down", function(e) {
		appSwitcher.shift("down");
	});

	loader.on("loading", function() {
		if(screen) {
			screen.dispose();
			$(".screen").html(""); //remove html so it's a bit cleaner
			screen = null;
		}
		loadingView.update({ app: loader.options.app, version: loader.options.version });
		loadingView.showNotification();
	});

	loader.on("connection", function(con) {
		con.getAvailableApps(function(err, apps) {
			appSwitcher = new mainPlugin.views.AppSwitcher({ el: ".app-switcher", router: router, loader: loader, apps: apps });
		})
	})

	loader.on("window", function(window) {
		if(screen) screen.dispose();

		var q = Url.parse(String(window.location), true).query,
		defaults = { qmin: 1, qmax: 5, gop_size: 70, frame_rate: 40 };

		for(var key in defaults) {
			if(q[key]) q[key] = Number(q[key]);
			else q[key] = defaults[key];
		}

		window.startRecording(q, function(err, info) {

			screen = new mainPlugin.views.Screen({ el: ".screen", window: window, loader: loader, rtmpUrl: info.url });

			setTimeout(function() {
				loadingView.hideNotification();
			}, 1000);
		});
	});


	$.getJSON("/account.json", function(data) {
		if(!data.result) return;

		mixpanel.people.identify(data.result._id);
		mixpanel.people.set({
			"$email": data.result.email,
			"$created": data.result.createdAt,
			"$last_login": new Date()
		});
	})



	loader.on("locationChange", function(location) {
		router.redirect("/live", { open: location.href, app: loader._appName, version: loader._appVersion }, false);
	});

}