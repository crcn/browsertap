var ScreenLoader = require("./screenLoader"),
qs = require("querystring"),
Url = require("url");


exports.require = ["router", "bark", "app.part.main", "puppeteer", "commands"];
exports.plugin = function(router, bark, mainPlugin, puppeteer, commands, loader) {

	// var query = qs.parse(String(window.location).split("")

	router.on({
		"pull -http live": function(req, res) {
			loader.load(req.query);
			res.end();
		}
	});


	var loader = new ScreenLoader(puppeteer, commands), screen, appSwitcher,
	loadingView = new mainPlugin.views.Loader({ el: ".loader" });
	var expc = new mainPlugin.views.ExpandContract({ el: ".expand-contract" }),
	usePadding = true;


	loader.on("tunneling", function(file) {
		// bark.alert("Please grant tunnel access via the taptunnel terminal application.");
	});


	key("shift+right", function(e) {
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

	loader.on("forceClose", function() {
		bark.clickToClose("Click anywhere to resume", function() {
			window.location.reload();
		});
	});


	expc.onExpandContract = function(exp) {
		usePadding = exp;
		if(screen) screen.usePadding(exp);
	}

	loader.on("loading", function() {
		if(screen) {
			screen.dispose();
			$(".screen").html(""); //remove html so it's a bit cleaner
			screen = null;
		}
		$(".pre-launch-notification").remove();
		loadingView.update({ app: loader.options.app, version: loader.options.version });
		loadingView.showNotification();
	});


	loader.on("connection", function(con) {
		con.getAvailableApps(function(err, apps) {
			appSwitcher = new mainPlugin.views.AppSwitcher({ el: ".app-switcher", router: router, loader: loader, apps: apps });
		});
	});


	loader.on("window", function(win) {
		if(screen) screen.dispose();

		var q = Url.parse(String(window.location), true).query,

		//low GOP initially so there's no delay when interacting with the page
		defaults = { qmin: 1, qmax: 5, gop_size: 70, frame_rate: 12 };


		for(var key in defaults) {
			if(q[key]) {
				q[key] = Number(q[key]);
			} else  {
				q[key] = defaults[key];
			}
		}


		win.startRecording(q, function(err, info) {

			screen = new mainPlugin.views.Screen({ el: ".screen", 
				window: win, 
				loader: loader, 
				rtmpUrl: info.url, 
				qmin: q.qmin,
				qmax: q.qmax,
				gop_size: q.gop_size,
				frame_rate: q.frame_rate });

			screen.usePadding(usePadding);

			screen.onReady = function() {
				loadingView.hideNotification();
			}
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