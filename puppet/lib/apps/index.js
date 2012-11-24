var structr = require("structr"),
loadApps = require("./loadApps"),
outcome = require("outcome"),
sift = require("sift"),
step = require("step"),
async = require("async"),
logger = require("winston").loggers.get("apps"),
sprintf = require("sprintf").sprintf,
killProcesses = require("./app/killProcesses"),
_ = require("underscore");

module.exports = structr({

	/**
	 */

	"publicKeys": ["open", "getApps"],

	/**
	 */

	"__construct": function(directory) {
		this._appsDir = directory;
		this.load();
		this.closeAllApps();
	},

	/**
	 */

	"apps": function() {
		return this._apps;
	},

	/**
	 */

	"step load": function(next) {
		var self = this;
		this._allProcessNames = {};
		loadApps(this._appsDir, outcome.error(next).success(function(apps) {
			self._apps = apps;
			self._processNames = apps.forEach(function(app) {
				self._allProcessNames[app.process.names[0]] = app;
			});
			next();
		}));
	},

	/**
	 */

	"findApp": function(search, callback) {
		var app = sift(search, this._apps).pop(); 
		if(!app) return callback(new Error("app does not exist"));
		callback(null, app);
	},


	/**
	 * public info
	 */

	"step getAvailableApps": function(callback) {
		callback(null, this._apps.map(function(app) {
			return {
				name: app.name,
				version: app.version,
				window: app.window
			};
		}))
	},

	/**
	 */

	"step open": function(options, next) {
		if(!options || !options.name || !options.version) return next(new Error("onot enough options"));

		var arg      = options.arg,
		on = outcome.error(next),
		self = this;

		step(
			function() {
				logger.info(sprintf("finding app: %s %s", options.name, options.version));
				self.findApp({ name: options.name, version: options.version }, this);
			},
			on.success(function(app) {
				logger.info("closing other app versions app");
				this.app = app;
				self._closeOtherVersions(app, this);
			}),
			on.success(function() {
				logger.info(sprintf("opening app with arg: %s", arg));
				try {

				this.app.open(arg, this);
			}catch(e) {
				console.error(e)
			}
			}),
			next
		);
	},

	/**
	 */

	"addWindow": function(win, callback) {
		var app = _.find(this._apps, function(app) {

			if(!app.window.getAppName) return null;

			try {
				var name = app.window.getAppName(win).toLowerCase(),
				nameParts = name.split(" ");
			}catch(e) {
				return false;
			}

			return app.name == nameParts[0] && app.version == nameParts[1];
		});


		if(!app) return callback(new Error("app not found"));
		win.app = app;
		app.addWindow(win);

		callback(null, app);
	},

	/**
	 */

	"_closeOtherVersions": function(app, next) {
		this.close({ name: app.name, version: { $ne: app.version }}, next);
	},

	/**
	 */

	"step closeAllApps": function(next) {
		logger.info("closing all registered apps");

		async.forEach(_.values(this._allProcessNames), function(app, next) {
			app.close(true, next);
		}, next);
	},

	/**
	 */

	"close": function(search, next) {
		async.forEach(search ? sift(search, this._apps) : this._apps, function(app, next) {
			app.close(next);
		}, next);
	}
});
