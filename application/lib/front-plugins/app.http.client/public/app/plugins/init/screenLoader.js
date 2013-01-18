var structr = require("structr"),
EventEmitter = require("events").EventEmitter,
windowStyles = require("./windowStyles"),
step = require("step"),
Url = require("url"),
outcome = require("outcome"),
taptunnel = require("taptunnel"),
_s = require("underscore.string");

module.exports = structr(EventEmitter, {

	/**
	 */

	"__construct": function(puppeteer, commands, states) {
		this.commands = commands;
		this.puppeteer = puppeteer;
		this.states = states;
		this.connect();

		// var q = Url.prase()

		//default icon
		this.options = { app: "internet explorer", version: 9, open: "http://google.com" };

		var self = this;
		commands.on("focus", function() {
			self._focus();
		});

		//why the fuck is this here? not even a needed feature. Fuckit, oh well...
		/*setInterval(function() {
			self._syncTitle();
		}, 1000 * 10);*/
	},

	/**
	 */

	"step connect": function(next) {
		var puppeteer = this.puppeteer, self = this;
		puppeteer.connect(function() {
			self._onConnection(puppeteer.connection);
			next();
		})
	},

	/**
	 */

	/*"_syncTitle": function() {
		if(!this.window) return;
		var self = this;
		this.window.getInfo(function(err, info) {
			document.title = "Browsertap - " + _s.titleize(self.options.app) + " " + self.options.version + " - " + info.title;
		});
	},*/


	/**
	 */

	/*"_syncFavIcon": function() {
		if(!this._currentLocation) return;
		var a = document.createElement("a");
		a.href = this._currentLocation;
		$("[type='image/x-icon']").remove();
		var link = document.createElement("link");
		link.type = "image/x-icon";
		link.rel = "shortcut icon";
		link.href = "http://" + a.host + "/favicon.ico";
		document.getElementsByTagName("head")[0].appendChild(link);
	},*/

	/**
	 */

	/*"syncTitle": function() {
		this._syncTitle();
		this._syncFavIcon();
	},*/

	/**
	 */

	"_onConnection": function(connection) {
		this._connection = connection;
		var self = this;

		this._ignoreClose = true;



		var filter;



		/*connection.clientWindows.addClientWindow({
			filter: filter,
			setNativeWindow: function(window) {
				self._setWindow(window);
			},
			popupWindow: function(winProps) {
				self._popupWindow(winProps);
			},
			close: function() {

				if(self._ignoreClose) return;

				//only want to close popups
				// if(!window.opener) return;
				//this actually works
				// window.open("","_self","");
				// window.close();
			},
			setClipboard: function(data) {
				console.log("set clipboard: %s", data);
				self.emit("setClipboard", data);
			}
		});*/
		this.emit("connection", connection);
		// this.emit("loading");
	},

	/**
	 */

	"load": function(options, next) {
		if(this._lockLoading) return;
		this._trackStopBrowser();
		_.extend(this.options, options);
		this._trackBrowser("Browser Starting");
		this._load(next);
	},

	/**
	 */

	"step _load": function(next) {

		if(this.options.screen) {
			this._lockLoading = true;
			this._connectWindow();
		} else {
			this._connectApp();
		}
		next();
	},


	/**
	 */

	"step reload": function(next) {
		this._appName = null;
		this._appVersion = null;
		this.load(this.options, next);
	},


	/**
	 */

	"_connectApp": function() {

		console.log("loading app %s %s", this.options.app, this.options.version);
		var con = this._connection, self = this;


		if(this._appName != this.options.app || this._appVersion != this.options.version) {
			this.emit("loading");
			this._ignoreClose = true;
			if(this.window) this.window.close();

			this.options.open = this.options.open.replace(/:\/+/,"://");

			//we track the host as well - only the host so we can get an idea of what people are doing with the app. Are they testing an app?
			//is it local? is it https?

			var urlInfo = Url.parse(this.options.open);

			this._ignoreForceClose = true;


			//run the file through taptunnel incase it's a file, or localhost
			var isTunnel = taptunnel.proxy(this.options.open, function(err, open) {

				//taptunnel not setup
				if(err) {
					console.error(err);
				}

				self._currentLocation = open;

				con.open({ name: self._appName = self.options.app, version: self._appVersion = self.options.version, arg: open, window: self._getClient(null, false) }, outcome.s(function(client) { 
					console.log("loaded app");
					self._trackBrowser("Browser Has Opened");
					// client.setWindow(self._getClient(null, false));
					self._ignoreForceClose = false;
				}));	

				// self._syncFavIcon();
			});


			if(isTunnel) {
				this.emit("tunneling", this.options.open);
			}
		} else 
		if(this._proxy) {
			console.log("set proxy location")
			// this._proxy.location.set(this.options.open);
			this._setProxyLocation(this.options.open);
		}
		this.states.set("opening_app", "Opening " + this.options.app + " " + this.options.version);
	},

	/**
	 */

	"_focus": function() {
		if(this.window) this.window.focus();
	},

	/**
	 */

	"_getClient": function(search, closeable) {
		var self = this,
		startTime = Date.now();

		return {
			test: startTime,
			search: search,
			app: this.options.app,
			version: this.options.version,
			setNativeWindow: function(window) {
				console.log("set native window");
				self._setWindow(window);
			},
			popupWindow: function(winProps) {

				//is popup? don't popup.
				if(!self._screenId) 
				self._popupWindow(winProps);
			},
			close: function() {

				if(self._ignoreClose || closeable === false) return;

				self._trackStopBrowser();

				//this actually works
				window.open("","_self","");
				window.close();
			},
			setClipboard: function(data) {
				console.log("set clipboard: %s", data);
				self.emit("setClipboard", data);
			},
			focus: function() {
				console.log("focus window");
				self.emit("focus", true);
				self.focused = true;
				self._trackBrowser("Focus Window");
			},
			unfocus: function() {
				console.log("unfocus window");
				self.emit("focus", false);
				self.focused = false;
				self._trackBrowser("Unfocus Window");
			},
			forceClosed: function() {
				console.log("IGNORE FORCE", self._ignoreForceClose)
				if(self._ignoreForceClose) return;

				self._trackStopBrowser("Browser Force Stop");
				self.emit("forceClose");
			}
		};
	},


	/**
	 */
	"_trackStopBrowser": function(name) {
		if(!this._appName) return;
		this._trackBrowser(name || "Browser Stop");
	},


	/**
	 */

	"_trackBrowser": function(name, options) {
		analytics.track(name, _.extend({
			browser_name: this.options.app,
			browser_version: this.options.version
		}, options));
	},

	/**
	 */

	"_connectWindow": function() {
		if(this._screenId == this.options.screen) return;
		this.emit("loading");
		console.log("loading window");
		var self = this;
		this._ignoreClose = false;
		this._connection.windows.set(this._getClient({ id: this._screenId = this.options.screen }));

		/*this._connection.client.windows.getWindow(this._screenId = this.options.screen, function(err, window) {
			self._onWindow(null, window);
		});*/
	},

	/**
	 */

	"bindWindow": function(cb) {
		if(this.window) cb(this.window);
		this.on("window", cb);
	},

	/**
	 */

	"_onWindow": function(err, w) {
		this._setWindow(w);
	},

	/**
	 */

	/*"_onOpenWindow": function(w) {

		var isMain = 
		!w.parent &&
		!this.window &&
		(w.style & windowStyles.WS_MAXIMIZEBOX) && //maximizable
		(w.style & windowStyles.WS_SIZEBOX); //resizable

		if(isMain) {
			this._setWindow(w);
		} else

		//top most? must be a popup
		if(!(w.extStyle & windowStyles.WS_EX_TOPMOST) && !(w.style & windowStyles.WS_POPUP)) {
			//POPUP WINDOW
		} else {
			// console.log("UNABLE TO POPUP");
		}
	},*/

	/**
	 * make that if the user spams the back button, they have to wait.
	 */

	"step _setProxyLocation": function(open, callback) {
		if(this._refreshing) return this.on("refreshProxy", callback);
		this._proxy = null;
		this._ignoreLocation = true;

		var self = this;
		step(

			/**
			 * get the current window
			 */

			function() {
				self.getWindow(this);
			},

			/**
			 * get the CURRENT proxy
			 */

			function(win) {
				this.win = win;
				win.getProxy(this);
			},

			/**
			 * since we're physically setting the new location, we need to wait for the new proxy
			 */

			function(proxy) {
				if(!proxy) return callback(new Error("Unable to set proxy"));
				console.log("set proxy location to %s", open);
				proxy.location.set(open);
				// this.win.refreshProxy(this);
				this();
			},

			/**
			 * continue.
			 */

			callback
		);
	},

	/**
	 */

	"getProxy": function(callback) {
		if(this._proxy) callback(null, this._proxy);
		this.once("proxy", callback);
	},

	/**
	 */

	"getWindow": function(callback) {
		if(this.window) return callback(this.window);
		this.once("window", callback);
	},

	/**
	 */

	"_popupWindow": function(w) {

		var padding = {
			top: 26,
			left: 4,
			right: 4,
			bottom: 4
		};

		if(this.window) {
			padding = this.window.app.popup.padding;
		}

		this._trackBrowser("Popping Up Window");

		this.commands.emit("popup", { url: window.location.protocol + "//" + window.location.host + "/live?host=" + this.puppeteer.host + "&screen=" + w.id+"&app="+this.options.app+"&version="+this.options.version, width: w.width - padding.left - padding.right, height: w.height - padding.top - padding.bottom });
	},

	/**
	 */

	"_setWindow": function(window) {

		this._trackBrowser("Browser Window Found, Attaching");

		if(window) this._ignoreClose = false;
		console.log("set main window");
		this.emit("window", this.window = window); 
		if(window) {
			if(!window.app.popup) window.app.popup = {
				padding: {
					top: 22,
					left: 4,
					right: 4,
					bottom: 4
				}
			};
			window.bindProxy(_.bind(this._onProxy, this));
		}
	},

	/**
	 */

	"_onProxy": function(proxy) {

		console.log("on proxy");


		//dispose
		if(this._proxy) {
			this._proxy._events = {};
		}


		this._proxy = proxy;

		var self = this;

		function onLocationChange(location) {

			console.log("location change: %s", location.href);


			//TODO - compare path, and query data
			if(self._ignoreLocation) {
				self._ignoreLocation = false;
				console.log("ingore location")
				return;
			}
			self._currentLocation = location.href;
			self.emit("locationChange", location);
			// self._syncTitle();
			// self._syncFavIcon();
		}


		proxy.on("locationChange", onLocationChange);
		proxy.location.get(onLocationChange);

		this.emit("proxy", proxy);
	}
});