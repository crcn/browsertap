var structr   = require('structr'),
EventEmitter  = require('events').EventEmitter,
child_process = require('child_process'),
step          = require('stepc'),
spawn         = child_process.spawn,
exec          = child_process.exec,
outcome       = require("outcome"),
rmdirr        = require('rmdirr'),
async         = require('async');


module.exports = structr(EventEmitter, {

	/**
	 */

	'override __construct': function(info, params, proxy) {


		var browserName = info.name.split(' ').shift().toLowerCase();

		this.cache    = params.cache;
		this.params   = params;
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
		});

	},

	/**
	 * kills the last process
	 */

	'kill': function(onExit) {

		if(this._proc) {

			if(onExit) this.once('exit', onExit);
			this._kill();

			// this._proc.stdin.write("kill\n");
			this._proc = undefined;

		}

	},

	/**
	 */

	'screenshot': function(path) {

		if(this._proc) {
			//nircmd.exe cmdwait 2000 savescreenshot "f:\temp\shot.png"
			// this._proc.stdin.write("screenshot\n" + path + "\n");
			exec(__dirname + "/nircmdc.exe savescreenshot " + path.replace(/\\+/g,'/'));
		}
	},

	/**
	 */

	'start': function(url, next) {


		var self = this, on = outcome.error(next);

		step(

			function() {
				self._shutdown(this);
			},

			/**
			 */

			function(err) {

				if(err) console.error(err);

				var nx = this;

				console.log("starting browser %s", self.name);

				var proc = self.cwd + "\\" + self.filename;

				/*self._proc = spawn('winproc.exe', [proc, url], { cwd: __dirname + "/winproc/Debug"});*/

				self._proc = exec('start /MAX /WAIT ' + proc + " " + url);

				self.running = true;

				self._proc.on("exit", function() {
					console.log("browser %s has exited, cleaning up...", self.name);
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

			next
		);

	},

	/**
	 */

	'_kill': function(next) {

		console.log('killing process...');


		async.forEach(this.params.processNames[this.browserName], function(pn, next) {

			console.log('killing %s', pn);
			exec('taskkill /F /IM ' + pn, function() {
				next();
			});

		}, next);

	},


	/**
	 */


	'_shutdown': function(next) {

		console.log('shutting down...');

		var settingsDir = this.cache.directories[this.browserName],
		cacheDir = this.cache.prefix.replace('~', process.env.HOME) + "/" + settingsDir;

		var self = this;

		step(

			/**
			 * kill the processes
			 */

			function() {

				self._kill(this);

			},

			/**
			 * remove the settings
			 */

			function() {

				if(!settingsDir) return this();

				console.log('cleaning up directory');

				exec('DEL /S /Q "' + cacheDir.replace(/\/+/g,'\\') + '"', this);
			},


			next
		);
	}

});