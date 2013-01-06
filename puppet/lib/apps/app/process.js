var structr  = require("structr"),
EventEmitter = require("events").EventEmitter,
step         = require("step"),
async        = require("async"),
child_process = require("child_process"),
spawn         = child_process.spawn,
exec          = child_process.exec,
outcome       = require("outcome"),
killProcesses = require("./killProcesses"),
path = require("path"),
logger = require("winston").loggers.get("process"),
sprintf = require("sprintf").sprintf,
dirmr = require("dirmr"),
fs = require("fs");

module.exports = structr(EventEmitter, {

	/**
	 */

	"__construct": function(app) {
		this.app = app;
	},

	/**
	 */

	"close": function(next) {
		this._shutdown(next);
	},

	/**
	 */

	"step open": function(url, next) {
		var app = this.app, self = this, on = outcome.error(next);
		step(


			/**
			 * copy over the default settings so we don't get shit like "want to set as default browser?" - bleh - fuck that.
			 */

			function() {
				self._copySettings(this);
			},

			/**
			 */

			on.s(function() {

				var nx = this;



				console.log("starting app %s", app.name);

				self._proc = exec('start /WAIT "" "' + app.path + '" ' + url);

				console.log(app.path);

				self.running = true;

				self._proc.on("exit", function() {
					console.log("app %s has exited, cleaning up...", app.name);
					self.running = false;
				});


				self._proc.stdout.on("data", function(data) {
					process.stdout.write(data);
				});

				self._proc.stderr.on("data", function(data) {
					process.stderr.write(data);
				});

				self._proc.on("error", function(err) {
					console.error(err)
				});


				this(null, self);
			}),

			/**
			 */

			next
		);
	},

	/**
	 */

	"_shutdown": function(next) {
		var self = this;
		step(

			/**
			 */

			function() {
				self._kill(this);
			},

			/**
			 * remove the cache & settings set by the user
			 */

			function() {
				self._cleanupCache(this);
			},
 
			/**
			 */

			next

		);
	},

	/**
	 */

	"_kill": function(next) {
		killProcesses(this.app.process.names, next);
	},

	/**
	 */

	"_cleanupCache": function(next) {

		if(!this.app.cache || !this.app.cache.directory) return next();

		var dirs = this.app.cache.directory instanceof Array ? this.app.cache.directory : [this.app.cache.directory],
		self = this;
		logger.info(sprintf('cleaning up %s cache directory', this.app.name));

		async.forEach(dirs, function(dir, next) {
			exec('DEL /S /Q "' + path.normalize(dir) + '"', function() {
				console.log("done clearing cache");
				next();
			});	
		}, next);
		
	},

	/**
	 */

	"_copySettings": function(next) {
		if(!this.app.settingsDir) return next();

		var settingsDir = this.app.settingsDir, self = this;

		async.forEach(["Local", "Roaming"], function(type, next) {
			self._copySettings2(type, function() {
				next();
			})
		}, next);
	},


	/**
	 */

	"_copySettings2": function(type, next) {
		var to = "C:/Users/Administrator/AppData/" + type,
		from = this.app.settingsDir + "/" + type;
		console.log("copy %s to %s", from, to);
		console.log(new RegExp("(^|\\s)(common|" + this.app.version+")($|\\s)"));
		dirmr().readdir(from, new RegExp("(^|\\s)(common|" + this.app.version+")($|\\s)")).join(to).complete(next);

	}
});