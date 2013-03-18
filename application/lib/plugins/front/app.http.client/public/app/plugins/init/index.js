var ScreenLoader = require("./screenLoader"),
qs = require("querystring"),
Url = require("url"),
sift = require("sift"),
EventEmitter = require("events").EventEmitter,
_ = require("underscore");




exports.require = ["router", "keys", "bark", "states", "app.part.main", "puppeteer", "commands"];
exports.plugin = function(router, keys, bark, states, mainPlugin, puppeteer, commands, loader) {

	// var query = qs.parse(String(window.location).split("")
		var browsers, em = new EventEmitter(), defaults = { app: "chrome", version: "19", open: "http://google.com" }

	router.on({
		"pull -http live": function(req, res) {

			var q = _.extend({}, defaults, req.query);

			getBrowsers(function(err, browsers) {

				var browser = sift({$or: [{ _id: q.browser }, { name: q.app, version: q.version }]}, browsers).shift();

				var info = {
					app: browser.name,
					version: browser.version,
					open: q.open
				}

				_.defaults(info, q);


				puppeteer.connectDesktop(browser, function(err, desktop) {
					loader.load(info);
					updateLoaderOps();
				});

				res.end();
			});

		}
	});

	function getBrowsers(callback) {
		if(browsers) return callback(null, browsers);
		em.once("browsers", callback);
	}

	commands.on("browsers", function(b) {
		browsers = b;
		em.emit("browsers", null, b);
	})


	function updateLoaderOps() {
		loadingView.update({ app: loader.options.app, version: loader.options.version });
	}


	var loader = new ScreenLoader(puppeteer, commands, states), screen, appSwitcher,
	loadingView = new mainPlugin.views.Loader({ el: ".loader", states: states });
	var expc = new mainPlugin.views.ExpandContract({ el: ".expand-contract" }),
	usePadding = true;

	insertTextInput(function(text) {
		if(screen) {
			screen.setClipboard(text);
			screen._window.keybdEvent({
				ctrlKey: true,
				keyCode: 86
			});
		}
	});

	loadingView.showNotification();


	loader.on("browsers", function(browsers) {
		router.redirect("/live", { browser: sift({ name: "internet explorer", version: "9" }, browsers)[0] || browsers[0] });
	});


	loader.on("tunneling", function(file) {
		// bark.alert("Please grant tunnel access via the taptunnel terminal application.");
	});


	keys.on("shift+right", function(e) {
		appSwitcher.shift("right");
	});

	keys.on("shift+left", function(e) {
		appSwitcher.shift("left");
	});

	keys.on("shift+up", function(e) {
		appSwitcher.shift("down");
	});

	keys.on("shift+down", function(e) {
		appSwitcher.shift("up");
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
		loadingView.showNotification();
		updateLoaderOps();
	});


	commands.on("browsers", function(browsers) {
		appSwitcher = new mainPlugin.views.AppSwitcher({ el: ".app-switcher", router: router, loader: loader, apps: browsers });
	})

	loader.on("window", function(win) {
		if(screen) screen.dispose();

		var q = Url.parse(String(window.location), true).query,

		//low GOP initially so there's no delay when interacting with the page
		defaults = { qmin: 1, qmax: 5, gop_size: 30, frame_rate: 30 };


		for(var key in defaults) {
			if(q[key]) {
				q[key] = Number(q[key]);
			} else  {
				q[key] = defaults[key];
			}
		}

		states.set("broadcasting_window");

		analytics.track("Recording Attached Window");

		win.startRecording(q, function(err, info) {

			analytics.track("RTMP Stream received, Resizing Window");

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

				analytics.track("Window Resized, Showing Desktop Session");

				loadingView.hideNotification();
				states.set("complete", loader.options.app + " " + loader.options.version);
			}
		});
	});

	//ignore
	keys.on("ctrl+v", function(e){
		// e.stopImmediatePropagation();
	});

	keys.key(function(e, cmd) {
		if(screen) screen.onKey(e, cmd);
	})


	$.getJSON("/account.json", function(data) {
		if(!data.result) return;

		analytics.identify(data.result._id, {
			"email": data.result.email,
			"created": data.result.createdAt,
			"lastSeen": new Date()
		});
	});


	loader.on("locationChange", function(location) {
		router.redirect("/live", { open: location.href, app: loader.options.app, version: loader.options.version }, false);
	});

}


function insertTextInput(fn) {

	var text = $("body").prepend("<input id=\"cpaste\" type=\"text\"></input>").find("#cpaste").css({"position":"absolute", "top":0,"left":-1000});

	var pasteText;

	text.keydown(function() {
		text.val("");
	});

	function onPaste() {
		if(pasteText) {
			fn(text.val());
			pasteText = false;
		}
		text.val("");
	}


	text.keyup(function() {
		onPaste();
		text.val("");
	});
	
	text.bind("paste", function(e) {
		// console.log("PASTE")
		pasteText = true;
		// onPaste();
		setTimeout(onPaste, 1);
	});

	setInterval(function() {
		text.focus();
	}, 1000);
}