var structr = require("structr"),
EventEmitter = require("events").EventEmitter,
windowStyles = require("./windowStyles"),
step = require("step"),
Url = require("url");

module.exports = structr(EventEmitter, {

	/**
	 */

	"__construct": function(puppeteer, commands) {
		this.commands = commands;
		this.puppeteer = puppeteer;
		this.connect();

		//default icon
		this.options = { app: "chrome", version: 19, open: "http://google.com" };
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
		this.emit("loading");
	},

	/**
	 */

	"step load": function(options, next) {
		if(this._lockLoading) return;
		this._trackStopBrowser();
		_.extend(this.options, options);

		this.emit("loading");
		this.startDate = Date.now();
		this._trackBrowser("Browser Start");

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
		console.log("loading app %s", this.options.app);
		var con = this._connection, self = this;

		if(this._appName != this.options.app || this._appVersion != this.options.version) {
			this._ignoreClose = true;
			if(this.window) this.window.close();


			//we track the host as well - only the host so we can get an idea of what people are doing with the app. Are they testing an app?
			//is it local? is it https?

			var urlInfo = Url.parse(this.options.open);

			this._ignoreForceClose = true;


			con.open({ name: this._appName = this.options.app, version: this._appVersion = this.options.version, arg: this.options.open }, function(err, client) { 
				self._trackBrowser("Browser Open");
				client.setWindow(self._getClient(null, false));
				self._ignoreForceClose = false;
			});
			return;
		} else 
		if(this._proxy) {
			// this._proxy.location.set(this.options.open);
			this._setProxyLocation(this.options.open);
		}
	},

	/**
	 */

	"_getClient": function(search, closeable) {
		var self = this,
		startTime = Date.now();


		return {
			search: search,
			app: this.options.app,
			version: this.options.version,
			setNativeWindow: function(window) {
				console.log("set native window");
				self._setWindow(window);
			},
			popupWindow: function(winProps) {
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
		mixpanel.track(name, _.extend({
			browser_name: this.options.app,
			browser_version: this.options.version,
			from_date: this.startDate,
			duration: Date.now() - this.startDate
		}, options));
	},

	/**
	 */

	"_connectWindow": function() {
		if(this._screenId == this.options.screen) return;
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

			function(window) {
				window.getProxy(this);
			},

			/**
			 * since we're physically setting the new location, we need to wait for the new proxy
			 */

			function(proxy) {
				if(!proxy) return callback(new Error("Unable to set proxy"));
				proxy.location.set(open);
				window.refreshProxy(this);
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
		this.commands.emit("popup", { url: window.location.protocol + "//" + window.location.host + "/live?host=" + this.puppeteer.host + "&token=" + this.puppeteer.token + "&screen=" + w.id+"&app="+this.options.app+"&version="+this.options.version, width: w.width, height: w.height });
	},

	/**
	 */

	"_setWindow": function(window) {

		this._trackBrowser("Browser Window Open");

		if(window) this._ignoreClose = false;
		console.log("set main window");
		this.emit("window", this.window = window); 
		if(window) window.bindProxy(_.bind(this._onProxy, this));
	},

	/**
	 */

	"_onProxy": function(proxy) {
		this._proxy = proxy;
		console.log(proxy);

		var self = this;

		function onLocationChange(location) {
			self.emit("locationChange", location);
		}


		proxy.on("locationChange", onLocationChange);
		proxy.location.get(onLocationChange);

		this.emit("proxy", proxy);
	}
});