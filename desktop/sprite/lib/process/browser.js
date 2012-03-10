var structr   = require('structr'),
EventEmitter  = require('events').EventEmitter,
child_process = require('child_process'),
step          = require('stepc'),
spawn         = child_process.spawn,
exec          = child_process.exec,
outcome       = require("outcome");


module.exports = structr(EventEmitter, {

	/**
	 */

	'override __construct': function(info) {

		this.name     = info.name //the name of the browser
		this.filename = info.filename; //the physical EXE
		this.cwd  	  = info.cwd; //where does the EXE live?
		this._super();


		var self = this;

		process.on('exit', function() {
			self.kill();
		});

	},

	/**
	 * kills the last process
	 */

	'kill': function() {

		if(this._proc) {

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


			/**
			 */

			function() {

				console.log("starting browser %s", self.name);


				var proc = self.cwd + "\\" + self.filename;

				self._proc = spawn('winproc.exe', [proc, url], { cwd: __dirname});

				self._proc.on("exit", function() {
					console.log("browser %s has exited", self.name);
					self.emit("exit");
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
		)
	}

});