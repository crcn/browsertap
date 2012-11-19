var structr = require("structr"),
EventEmitter = require("events").EventEmitter,
windowStyles = require("./windowStyles"),
step = require("step");

module.exports = structr(EventEmitter, {

	/**
	 */

	"__construct": function(puppeteer, commands) {
		this.commands = commands;
		this.puppeteer = puppeteer;
		this.connect();
		this.options = { app: "chrome 19", open: "http://google.com" };
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


		var filter;


		if(this.options.screen) {
			filter = { query: { id: this.options.screen } };
		} else {
			// filter = { query: getAppFilter(this.options.app) }
		}

		connection.clientWindows.addClientWindow({
			filter: filter,
			setNativeWindow: function(window) {
				self._setWindow(window);
			},
			popupWindow: function(winProps) {
				self._popupWindow(winProps);
			},
			close: function() {
				//PARENT CLOSE
				window.close();
			}
		});
		this.emit("loading");
	},

	/**
	 */

	"step load": function(options, next) {
		_.extend(this.options, options);

		if(this.options.screen) {
			this._connectWindow();
		} else {
			this._connectApp();
		}
		next();
	},

	/**
	 */

	"_connectApp": function() {
		console.log("loading app %s", this.options.app);
		var con = this._connection;
		// con.events.on("closeWindow", _.bind(this._onCloseWindow, this));

		if(this._app != this.options.app) {
			this.emit("loading");
			con.browsers.open(this.options.open, this._app = this.options.app, function(){ });
			return;
		} else 
		if(this._proxy) {
			// this._proxy.location.set(this.options.open);
			this._setProxyLocation(this.options.open);
		}


	},

	/**
	 */

	"_connectWindow": function() {
		if(this._screenId == this.options.screen) return;
		console.log("loading window")
		var self = this;
		this._connection.client.windows.getWindow(this._screenId = this.options.screen, function(err, window) {
			self._onWindow(null, window);
		});
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

	"_onOpenWindow": function(w) {
		/*for(var style in windowStyles) {
			console.log("%s: %d", style, w.style & windowStyles[style] || w.extStyle & windowStyles[style]);
		}*/

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
	},

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
		try {
		this.commands.emit("popup", { url: window.location.protocol + "//" + window.location.host + "/live?host=" + this.puppeteer.host + "&token=" + this.puppeteer.token + "&screen=" + w.id, width: w.width, height: w.height });
		}catch(e) {
			console.log(e.stack)
		}
	},

	/**
	 */

	"_setWindow": function(window) {
		console.log("set main window");
		this.emit("window", this.window = window); 
		window.bindProxy(_.bind(this._onProxy, this));
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