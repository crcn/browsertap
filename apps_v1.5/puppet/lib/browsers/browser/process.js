var structr  = require("structr"),
EventEmitter = require("events").EventEmitter,
step         = require("step"),
async        = require("async"),
child_process = require("child_process"),
spawn         = child_process.spawn,
exec          = child_process.exec,
outcome       = require("outcome"),
killProcesses = require("./killProcesses"),
Client        = require("./client");

module.exports = structr(EventEmitter, {

	/**
	 */

	"__construct": function(browser) {
		this.browser = browser;
		this.puppet  = browser.collection.puppet;
		this.server  = browser.collection.puppet.server;
		this.client  = new Client();
		this._listen();
	},

	/**
	 */

	"close": function(next) {
		this._shutdown(next);
	},

	/**
	 */

	"step open": function(url, next) {
		var browser = this.browser, self = this;//, on = outcome.error(callback);
		step(

			/**
			 */

			function() {
				self._shutdown(this);
			},

			/**
			 */

			function() {
				if(err) console.error(err);

				var nx = this;

				console.log("starting browser %s", browser.name);

				/*self._proc = spawn('winproc.exe', [proc, url], { cwd: __dirname + "/winproc/Debug"});*/

				self._proc = exec('start /MAX /WAIT ' + browser.path + " " + url);

				self.running = true;

				self._proc.on("exit", function() {
					console.log("browser %s has exited, cleaning up...", browser.name);
					self.running = false;

 					self._shutdown(function() {
 						self.emit('exit');
 					});
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



				this(null);
			},

			/**
			 */

			function() {
				self.puppet.desktop.padding(self.browser.padding);
				this(null, self);
			},

			/**
			 */

			next
		);
	},

	/**
	 */

	"getClient": function(callback) {
		callback(null, this.client);
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

	"_listen": function() {
		var self = this,
		proxy = this.server.browserProxy(this.browser);

		proxy.on("connection", function() {
			self._onConnection(proxy.client);
		});

		proxy.on("disconnected", function() {
			self._client = null;
		});
	},

	/**
	 */

	"_kill": function(next) {
		killProcesses(this.browser.processNames, next);
	},

	/**
	 */

	"_cleanupCache": function(next) {
		console.log('cleaning up cache directory');
		exec('DEL /S /Q "' + this.browser.cache.directory.replace(/\/+/g,'\\') + '"', next);
	},

	/**
	 */

	"_onConnection": function(client) {
		this._client = client;
		this.client.target(client)
		console.log("client connected to %s %s", this.browser.name, this.browser.version);
		this.emit("client", client);
	}
});