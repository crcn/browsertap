var structr   = require('structr'),
EventEmitter  = require('events').EventEmitter,
child_process = require('child_process'),
step          = require('stepc'),
spawn         = child_process.spawn,
exec          = child_process.exec,
outcome       = require("outcome"),
rmdirr        = require('rmdirr');


module.exports = structr(EventEmitter, {

	/**
	 */

	'override __construct': function(info, cache, proxy) {


		var browserName = info.name.split(' ').shift().toLowerCase();

		this.cache    = cache;
		this.name     = info.name //the name of the browser
		this.filename = info.filename; //the physical EXE
		this.cwd  	  = info.cwd; //where does the EXE live?
		this.browserName = browserName;
		this._super();


		var self = this;

		process.on('exit', function() {
			self.kill();
		});


		proxy.on('browserProxy', function(browserProxy) {
			if(browserProxy.browser[browserName]) {
				console.log("browser " + browserName + " proxy detected");
				self.emit('browserProxy', browserProxy);
			}
		})

	},

	/**
	 * kills the last process
	 */

	'kill': function(onExit) {

		if(this._proc) {

			if(onExit) this.once('exit', onExit);

			this._proc.stdin.write("kill\n");
			this._proc = undefined;
		}

	},

	/**
	 */

	'screenshot': function(path) {

		if(this._proc) {
			this._proc.stdin.write("screenshot\n" + path + "\n");
		}
	},

	/**
	 */

	'start': function(url, next) {


		var self = this, on = outcome.error(next);

		step(

			function() {
 				
 				if(!self.cache.directories[self.browserName]) return this();

				var cacheDir = self.cache.prefix.replace('~', process.env.HOME) + "/" + self.cache.directories[self.browserName];

				var next = this;

				setTimeout(function() {
					rmdirr(cacheDir, next);
				}, 500);
			},


			/**
			 */

			function() {
				var nx = this;

				console.log("starting browser %s", self.name);

				var proc = self.cwd + "\\" + self.filename;

				self._proc = spawn('winproc.exe', [proc, url], { cwd: __dirname + "/winproc/Debug"});
				self.running = true;

				self._proc.on("exit", function() {
					console.log("browser %s has exited", self.name);
					self.emit("exit");
					self.running = false;
				});


				self._proc.stdout.on("data", function(data) {
					process.stdout.write(data);

					if(String(data).toLowerCase().indexOf('main window found') > -1) {
						//nx();
					}
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

			next
		)
	}

});