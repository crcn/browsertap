var structr = require("structr"),
step = require("step"),
outcome = require("outcome"),
ClientWindows = require("./clientWindows"),
EventEmitter = require("events").EventEmitter;


module.exports = structr(EventEmitter, {


	/**
	 */

	"publicKeys": ["windows", "getAvailableApps", "hasOtherAppVersionsOpen", "open"],

	/**
	 */

	"__construct": function(controller, connection) {
		this._apps = controller.puppet.apps;
		this.controller = controller;
		this._con = connection;
		this.windows = new ClientWindows(this, connection);

		var self = this;
		connection.on("end", function() {
			self.emit("close");
		});
	},

	/**
	 */

	"getAvailableApps": function(callback) {
		this._apps.getAvailableApps(callback);
	},

	/**
	 */

	"hasOtherAppVersionsOpen": function(options, callback) {
		//TODO	
	},

	/**
	 * opens a new window for an application
	 */

	"open": function(options, callback) {
		var self = this, on = outcome.error(callback);



		step(
			function() {
				self._open(options, this);
			},
			function() {
				callback();
			}
		);
	},


	/**
	 */

	"step _open": function(options, callback) {
		var apps = this._apps, self = this, window = options.window, on = outcome.error(callback);
		if(!options.arg) options.arg = "";
		
		if(!/^http/.test(options.arg)) options.arg = "http://" + options.arg.replace(/^.*?:\//g,"");
		
		//fix protocol
		options.arg = options.arg.replace(/:\/+/,"://");
		step(
			function() {
				console.log("closing apps other than %s %s", options.name, options.version);
				//close other versions
				apps.close({ name: options.name, version: { $ne: options.version }}, this);
			},
			function() {
				console.log("finding app %s %s", options.name, options.version);
				apps.findApp({ name: options.name, version: options.version }, this);
			},
			on.success(function(app) {

				console.log(window)
				if(window) {
					window.search = { "app.name": app.name, "app.version": app.version, "style.sizeBox": true };
					self.windows.set(window);
				}

				if(app.windows().length) {
					console.log("app is open, opening new window instead");
					app.windows()[0].openNewWindow(options.arg);
					callback(null, app);
				} else {

					this();
				}
			}),
			on.success(function() {
				console.log("opening %s %s", options.name, options.version);
				apps.open(options, this);
			}),
			on.success(function(app) {
				callback(null, app);
			})
		);
	}
});