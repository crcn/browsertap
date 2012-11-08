var structr = require("structr"),
spawn       = require("child_process").spawn,
EventEmitter = require("events").EventEmitter;

module.exports = structr({

	/**
	 */


	"__construct": function(options) {
		this._options = options;
		this._ed = new EventEmitter();
		this.open();
	},

	/**
	 */

	"open": function() {
		this._proc = spawn(__dirname + "/../../../wkm_v1.5/bin/cli.exe");

		this._proc.stdout.on('data', function(data) {
			var cmd;
			try {
				cmd = JSON.parse(String(data));
			} catch(e) { 
				process.stderr.write(String(data));
			}
		});

		this._proc.stderr.on('data', function(data) {
			process.stderr.write(String(data));
		});

		this._proc.on("exit", function() {
			this._proc = null;
		});
	},

	/**
	 */

	"getAllWindows": function() {

	},

	/**
	 */

	"_command": function(cmd, callback) {

		if(!callback) return;

		this._ed.one("response-" + cmdId )
	}
});