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
sprintf = require("sprintf").sprintf;

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
		var app = this.app, self = this;
		step(

			/**
			 */

			function() {
				if(err) console.error(err);

				var nx = this;

				console.log("starting app %s", app.name);

				self._proc = exec('start /WAIT ' + app.path + " " + url);

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
			},

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
		logger.info(sprintf('cleaning up %s cache directory', this.app.name));
		exec('DEL /S /Q "' + path.normalize(this.app.cache.directory) + '"', next);
	}
});